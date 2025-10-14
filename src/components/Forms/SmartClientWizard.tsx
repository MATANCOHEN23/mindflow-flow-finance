import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DomainSelector } from './DomainSelector';
import { useCreateContact } from '@/hooks/useContacts';
import { useAssignContactToDomain } from '@/hooks/useDomains';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface WizardData {
  selectedDomains: string[];
  contactInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    parentPhone?: string;
    childName?: string;
  };
  notes: string;
}

const STEPS = ['בחר תחומים', 'פרטי קשר', 'סיכום'];

interface SmartClientWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartClientWizard({ isOpen, onClose }: SmartClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedDomains: [],
    contactInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    notes: ''
  });

  const createContact = useCreateContact();
  const assignDomain = useAssignContactToDomain();

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
    try {
      // יצירת הלקוח
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert([{
          first_name: wizardData.contactInfo.firstName,
          last_name: wizardData.contactInfo.lastName,
          phone: wizardData.contactInfo.phone,
          phone_parent: wizardData.contactInfo.parentPhone,
          email: wizardData.contactInfo.email,
          child_name: wizardData.contactInfo.childName,
          role_tags: [],
          notes: wizardData.notes
        }])
        .select()
        .single();

      if (contactError) throw contactError;

      // שיוך התחומים
      for (const domainId of wizardData.selectedDomains) {
        await supabase
          .from('contact_domains' as any)
          .insert([{
            contact_id: newContact.id,
            domain_id: domainId,
            status: 'active'
          }]);
      }
      
      toast.success('✅ הלקוח נוסף בהצלחה!');
      onClose();
      
      // רענן את הדף
      window.location.reload();
    } catch (error: any) {
      console.error('Error creating contact:', error);
      toast.error('❌ שגיאה: ' + error.message);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setWizardData({
      selectedDomains: [],
      contactInfo: {
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
      },
      notes: ''
    });
    onClose();
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">שם פרטי *</Label>
                <Input
                  id="firstName"
                  value={wizardData.contactInfo.firstName}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, firstName: e.target.value }
                  })}
                  placeholder="שם פרטי"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">שם משפחה</Label>
                <Input
                  id="lastName"
                  value={wizardData.contactInfo.lastName}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, lastName: e.target.value }
                  })}
                  placeholder="שם משפחה"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="050-1234567"
                  required
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
                  placeholder="050-1234567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={wizardData.contactInfo.email}
                onChange={(e) => setWizardData({
                  ...wizardData,
                  contactInfo: { ...wizardData.contactInfo, email: e.target.value }
                })}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <Label htmlFor="childName">שם הילד/ה (אם רלוונטי)</Label>
              <Input
                id="childName"
                value={wizardData.contactInfo.childName || ''}
                onChange={(e) => setWizardData({
                  ...wizardData,
                  contactInfo: { ...wizardData.contactInfo, childName: e.target.value }
                })}
                placeholder="שם הילד/ה"
              />
            </div>

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

      case 2: // Summary
        return (
          <div className="space-y-6">
            <div className="bg-accent/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">סיכום הפרטים</h3>
              
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">שם:</span> {wizardData.contactInfo.firstName} {wizardData.contactInfo.lastName}
                </div>
                <div>
                  <span className="font-semibold">טלפון:</span> {wizardData.contactInfo.phone}
                </div>
                {wizardData.contactInfo.email && (
                  <div>
                    <span className="font-semibold">אימייל:</span> {wizardData.contactInfo.email}
                  </div>
                )}
                {wizardData.contactInfo.parentPhone && (
                  <div>
                    <span className="font-semibold">טלפון הורה:</span> {wizardData.contactInfo.parentPhone}
                  </div>
                )}
                {wizardData.contactInfo.childName && (
                  <div>
                    <span className="font-semibold">שם ילד/ה:</span> {wizardData.contactInfo.childName}
                  </div>
                )}
                <div>
                  <span className="font-semibold">מספר תחומים:</span> {wizardData.selectedDomains.length}
                </div>
                {wizardData.notes && (
                  <div>
                    <span className="font-semibold">הערות:</span> {wizardData.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                ✅ הלקוח ישויך אוטומטית לכל התחומים שבחרת
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">הוסף לקוח חדש</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
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
              <ChevronRight className="w-4 h-4" />
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
                className="btn-premium gap-2"
              >
                <Check className="w-4 h-4" />
                שמור לקוח
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
