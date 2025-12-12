import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { DomainSelector } from './DomainSelector';
import { PriceCalculatorStep } from './PriceCalculatorStep';
import { useCreateContact } from '@/hooks/useContacts';
import { useAssignContactToDomain } from '@/hooks/useDomains';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLastAction } from '@/hooks/useLastAction';
import { useContacts } from '@/hooks/useContacts';
import { normalizePhone, validatePhone } from '@/lib/phoneUtils';

interface WizardData {
  selectedDomains: string[];
  contactInfo: {
    firstName: string;
    lastName: string;
    idNumber?: string;
    phone: string;
    email: string;
    parentName?: string;
    parentPhone?: string;
    childName?: string;
    mainChallenge?: string;
  };
  pricing: {
    totalPrice: number;
    breakdown: Array<{
      domainName: string;
      domainIcon: string;
      price: number;
      explanation: string;
    }>;
    selectedOptions?: Record<string, string>;
  };
  notes: string;
}

const STEPS = ['בחר תחומים', 'פרטי קשר', 'חישוב מחיר', 'סיכום'];

interface SmartClientWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartClientWizard({ isOpen, onClose }: SmartClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedDomains: [],
    contactInfo: {
      firstName: '',
      lastName: '',
      idNumber: '',
      phone: '',
      email: '',
      parentName: '',
      parentPhone: '',
      childName: '',
      mainChallenge: ''
    },
    pricing: {
      totalPrice: 0,
      breakdown: [],
      selectedOptions: {}
    },
    notes: ''
  });

  const queryClient = useQueryClient();
  const createContact = useCreateContact();
  const assignDomain = useAssignContactToDomain();
  const { setLastAction } = useLastAction();
  const { data: existingContacts } = useContacts();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<string>('');

  // Smart auto-save - only on significant changes after 3 seconds
  useEffect(() => {
    if (!isOpen) return;

    const currentData = JSON.stringify(wizardData);
    
    // Save only if data changed AND user stopped typing for 3 seconds
    const timeoutId = setTimeout(() => {
      if (currentData !== lastSaved && currentData !== '{}' && wizardData.contactInfo.firstName) {
        localStorage.setItem('draft-client', currentData);
        setLastSaved(currentData);
        // Silent save - no toast to avoid interrupting the user
        console.log('💾 Draft auto-saved');
      }
    }, 3000); // 3 seconds instead of 30 seconds

    return () => clearTimeout(timeoutId);
  }, [isOpen, wizardData, lastSaved]);

  // Prefetch domains hierarchy on open
  useEffect(() => {
    if (isOpen) {
      queryClient.prefetchQuery({
        queryKey: ['domains-hierarchy'],
        queryFn: async () => {
          const { domainsApi } = await import('@/lib/api/domains');
          return domainsApi.getHierarchy();
        },
      });
    }
  }, [isOpen, queryClient]);

  // Load draft on open
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem('draft-client');
      if (draft) {
        const shouldRestore = confirm('נמצאה טיוטה שמורה. האם לשחזר?');
        if (shouldRestore) {
          setWizardData(JSON.parse(draft));
        } else {
          localStorage.removeItem('draft-client');
        }
      }
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep === 0 && wizardData.selectedDomains.length === 0) {
      toast.error('יש לבחור לפחות תחום אחד');
      return;
    }
    if (currentStep === 1) {
      if (!wizardData.contactInfo.firstName) {
        toast.error('יש למלא שם פרטי');
        return;
      }
      if (!wizardData.contactInfo.phone) {
        toast.error('יש למלא מספר טלפון');
        return;
      }
      // Validate phone number format
      if (!validatePhone(wizardData.contactInfo.phone)) {
        toast.error('מספר טלפון לא תקין - יש להזין מספר ישראלי (05X-XXXX-XXX)');
        return;
      }
      // Validate parent phone if provided
      if (wizardData.contactInfo.parentPhone && !validatePhone(wizardData.contactInfo.parentPhone)) {
        toast.error('מספר טלפון הורה לא תקין - יש להזין מספר ישראלי (05X-XXXX-XXX)');
        return;
      }
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    console.log('🚀 Starting customer save...', wizardData);
    setIsSubmitting(true);
    
    try {
      // בדיקת כפילויות אימייל
      if (wizardData.contactInfo.email && wizardData.contactInfo.email.trim()) {
        const { data: existingContact } = await supabase
          .from('contacts')
          .select('id, first_name, last_name')
          .eq('email', wizardData.contactInfo.email.trim().toLowerCase())
          .limit(1);
        
        if (existingContact && existingContact.length > 0) {
          toast.error(`האימייל כבר קיים במערכת עבור ${existingContact[0].first_name} ${existingContact[0].last_name}`);
          return;
        }
      }

      // Normalize and validate phone numbers before insertion
      const normalizedPhone = normalizePhone(wizardData.contactInfo.phone);
      const normalizedParentPhone = wizardData.contactInfo.parentPhone 
        ? normalizePhone(wizardData.contactInfo.parentPhone) 
        : null;

      // Final validation before database insert
      if (!validatePhone(normalizedPhone)) {
        throw new Error('מספר טלפון לא תקין');
      }
      if (normalizedParentPhone && !validatePhone(normalizedParentPhone)) {
        throw new Error('מספר טלפון הורה לא תקין');
      }

      // יצירת הלקוח
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert([{
          first_name: wizardData.contactInfo.firstName,
          last_name: wizardData.contactInfo.lastName,
          phone: normalizedPhone,
          phone_parent: normalizedParentPhone,
          email: wizardData.contactInfo.email ? wizardData.contactInfo.email.trim().toLowerCase() : null,
          child_name: wizardData.contactInfo.childName,
          role_tags: [],
          notes: wizardData.notes,
          sub_category: {
            id_number: wizardData.contactInfo.idNumber,
            parent_name: wizardData.contactInfo.parentName,
            main_challenge: wizardData.contactInfo.mainChallenge
          }
        }])
        .select()
        .single();

      if (contactError) throw contactError;

      // שיוך התחומים
      if (wizardData.selectedDomains.length > 0) {
        const domainAssignments = wizardData.selectedDomains.map(domainId => ({
          contact_id: newContact.id,
          domain_id: domainId,
          status: 'active'
        }));

        const { error: domainsError } = await supabase
          .from('contact_domains')
          .insert(domainAssignments);
        
        if (domainsError) throw domainsError;
      }
      
      console.log('✅ Customer saved successfully:', newContact);
      toast.success('✅ הלקוח נוסף בהצלחה!');
      
      setLastAction({ type: 'contact', id: newContact.id, timestamp: Date.now() });
      localStorage.removeItem('draft-client');
      
      // רענון חכם - רק נתוני הלקוחות
      await queryClient.invalidateQueries({ queryKey: ['contacts'] });
      await queryClient.invalidateQueries({ queryKey: ['contact-domains'] });
      await queryClient.invalidateQueries({ queryKey: ['therapy-contacts'] });
      await queryClient.invalidateQueries({ queryKey: ['basketball-contacts'] });
      
      setIsSubmitting(false);
      onClose();
    } catch (error: any) {
      console.error('❌ Error creating contact:', error);
      toast.error('❌ שגיאה: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (confirm('האם אתה בטוח שברצונך לסגור את האשף? כל השינויים לא ישמרו.')) {
      setCurrentStep(0);
      setWizardData({
        selectedDomains: [],
        contactInfo: {
          firstName: '',
          lastName: '',
          idNumber: '',
          phone: '',
          email: '',
          parentName: '',
          parentPhone: '',
          childName: '',
          mainChallenge: ''
        },
        pricing: {
          totalPrice: 0,
          breakdown: [],
          selectedOptions: {}
        },
        notes: ''
      });
      localStorage.removeItem('draft-client');
      onClose();
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // Domain Selection
        return (
          <div className="space-y-4">
            <DomainSelector 
              selectedDomains={wizardData.selectedDomains}
              onChange={(domains) => setWizardData({ ...wizardData, selectedDomains: domains })}
            />
          </div>
        );

      case 1: // Contact Info
        return (
          <div className="space-y-4">
            {/* Row 1: שם פרטי + שם משפחה */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Label htmlFor="firstName">שם פרטי *</Label>
                <Input
                  id="firstName"
                  value={wizardData.contactInfo.firstName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setWizardData({
                      ...wizardData,
                      contactInfo: { ...wizardData.contactInfo, firstName: value }
                    });
                    
                    if (value.length >= 2) {
                      const matches = existingContacts
                        ?.filter(c => c.first_name.startsWith(value))
                        .map(c => c.first_name)
                        .slice(0, 5) || [];
                      setSuggestions(matches);
                    } else {
                      setSuggestions([]);
                    }
                  }}
                  placeholder="הזן שם"
                  required
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 bg-background border rounded-lg shadow-lg mt-1 w-full">
                    {suggestions.map(name => (
                      <button
                        key={name}
                        onClick={() => {
                          setWizardData({
                            ...wizardData,
                            contactInfo: { ...wizardData.contactInfo, firstName: name }
                          });
                          setSuggestions([]);
                        }}
                        className="w-full text-right p-2 hover:bg-accent"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">שם משפחה *</Label>
                <Input
                  id="lastName"
                  value={wizardData.contactInfo.lastName}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, lastName: e.target.value }
                  })}
                  placeholder="הזן שם משפחה"
                  required
                />
              </div>
            </div>

            {/* Row 2: תעודת זהות + טלפון */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idNumber">תעודת זהות</Label>
                <Input
                  id="idNumber"
                  value={wizardData.contactInfo.idNumber || ''}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, idNumber: e.target.value }
                  })}
                  placeholder="הזן מספר ת.ז."
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="phone">טלפון *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={wizardData.contactInfo.phone}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, phone: e.target.value }
                  })}
                  placeholder="05X-XXXXXXX"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {/* Row 3: שם הורה + טלפון הורה */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentName">שם מלא (הורה)</Label>
                <Input
                  id="parentName"
                  value={wizardData.contactInfo.parentName || ''}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, parentName: e.target.value }
                  })}
                  placeholder="הזן שם הורה"
                />
              </div>
              <div>
                <Label htmlFor="parentPhone">טלפון הורה</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  value={wizardData.contactInfo.parentPhone || ''}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, parentPhone: e.target.value }
                  })}
                  placeholder="05X-XXXXXXX"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Row 4: אימייל */}
            <div>
              <Label htmlFor="email">אימייל הורה</Label>
              <Input
                id="email"
                type="email"
                value={wizardData.contactInfo.email}
                onChange={(e) => setWizardData({
                  ...wizardData,
                  contactInfo: { ...wizardData.contactInfo, email: e.target.value }
                })}
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            {/* Row 5: שם ילד (אם רלוונטי) */}
            <div>
              <Label htmlFor="childName">שם הילד/ה (אם רלוונטי)</Label>
              <Input
                id="childName"
                value={wizardData.contactInfo.childName || ''}
                onChange={(e) => setWizardData({
                  ...wizardData,
                  contactInfo: { ...wizardData.contactInfo, childName: e.target.value }
                })}
                placeholder="הזן שם"
              />
            </div>

            {/* Row 6: אתגר מרכזי */}
            <div>
              <Label htmlFor="mainChallenge">אתגר מרכזי</Label>
              <select
                id="mainChallenge"
                value={wizardData.contactInfo.mainChallenge || ''}
                onChange={(e) => setWizardData({
                  ...wizardData,
                  contactInfo: { ...wizardData.contactInfo, mainChallenge: e.target.value }
                })}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="">בחר אתגר...</option>
                <option value="anxiety">חרדה</option>
                <option value="depression">דיכאון</option>
                <option value="adhd">קשב וריכוז (ADHD)</option>
                <option value="social">קשיים חברתיים</option>
                <option value="behavior">בעיות התנהגות</option>
                <option value="trauma">טראומה</option>
                <option value="family">קשיים משפחתיים</option>
                <option value="learning">קשיי למידה</option>
                <option value="performance">ביצועים ומוטיבציה</option>
                <option value="other">אחר</option>
              </select>
            </div>

            {/* Row 7: הערות */}
            <div>
              <Label htmlFor="notes">הערות</Label>
              <Textarea
                id="notes"
                value={wizardData.notes}
                onChange={(e) => setWizardData({ ...wizardData, notes: e.target.value })}
                placeholder="הערות נוספות..."
                rows={3}
              />
            </div>
          </div>
        );

      case 2: // Price Calculator
        return <PriceCalculatorStep wizardData={wizardData} setWizardData={setWizardData} />;

      case 3: // Summary
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-5 border border-primary/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                📋 סיכום הפרטים
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">👤 שם:</span>
                    <span className="font-bold">{wizardData.contactInfo.firstName} {wizardData.contactInfo.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">📞 טלפון:</span>
                    <span className="font-semibold" dir="ltr">{wizardData.contactInfo.phone}</span>
                  </div>
                  {wizardData.contactInfo.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">✉️ אימייל:</span>
                      <span className="font-semibold">{wizardData.contactInfo.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {wizardData.contactInfo.parentName && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">👨‍👩‍👧 הורה:</span>
                      <span className="font-semibold">{wizardData.contactInfo.parentName}</span>
                    </div>
                  )}
                  {wizardData.contactInfo.parentPhone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">📱 טלפון הורה:</span>
                      <span className="font-semibold" dir="ltr">{wizardData.contactInfo.parentPhone}</span>
                    </div>
                  )}
                  {wizardData.contactInfo.childName && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">👶 שם ילד/ה:</span>
                      <span className="font-semibold">{wizardData.contactInfo.childName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected domains */}
            <div className="bg-accent/30 rounded-xl p-5">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                🎯 תחומים שנבחרו ({wizardData.selectedDomains.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {wizardData.pricing.breakdown?.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30"
                  >
                    <span className="text-lg">{item.domainIcon}</span>
                    <span className="font-medium">{item.domainName}</span>
                    {item.price > 0 && (
                      <span className="text-sm text-primary font-bold">₪{item.price.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total price */}
            {wizardData.pricing.totalPrice > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 border-2 border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">💰 סה"כ לתשלום:</span>
                  <span className="text-3xl font-black text-green-700">
                    ₪{wizardData.pricing.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {wizardData.notes && (
              <div className="bg-muted/50 rounded-lg p-4">
                <span className="font-bold">📝 הערות:</span>
                <p className="mt-1 text-muted-foreground">{wizardData.notes}</p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
                ✅ הלקוח ישויך אוטומטית לכל התחומים שבחרת ויופיע בדפי הניהול הרלוונטיים
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95" 
        dir="rtl"
        onEscapeKeyDown={handleClose}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">הוסף לקוח חדש</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-orange-500/20 rounded-full transition-colors border-2 border-orange-500"
              aria-label="סגור"
            >
              <X className="w-6 h-6 text-orange-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-6">
            {STEPS.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs text-center">{step}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-[300px]"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronRight className="w-4 w-4" />
              הקודם
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="btn-premium gap-2"
              >
                הבא
                <ChevronLeft className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-premium gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    שמור לקוח
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
