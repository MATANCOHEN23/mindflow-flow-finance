
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Deal } from "@/types/database";
import { Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useContacts } from '@/hooks/useContacts';
import { useLastAction } from '@/hooks/useLastAction';
import { dealTemplates } from '@/data/dealTemplates';
import { DomainSelector } from './DomainSelector';

interface AddDealFormProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal | null;
}

export function AddDealForm({ isOpen, onClose, deal }: AddDealFormProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { data: contacts } = useContacts();
  const { setLastAction } = useLastAction();
  
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [paymentType, setPaymentType] = useState<'full' | 'partial' | 'none'>('none');
  const [partialAmount, setPartialAmount] = useState('');
  const [partialPercentage, setPartialPercentage] = useState('');
  const [partialType, setPartialType] = useState<'amount' | 'percentage'>('amount');
  
  const [formData, setFormData] = useState({
    base_price: '',
    commission_rate: '',
    calculated_total: 0,
    contact_id: '',
    title: '',
    category: '',
    package_type: '',
    amount_total: '',
    next_action_date: '',
    notes: ''
  });

  // מחשבון מחירים אוטומטי
  useEffect(() => {
    if (formData.base_price && formData.commission_rate) {
      const base = parseFloat(formData.base_price);
      const rate = parseFloat(formData.commission_rate);
      if (!isNaN(base) && !isNaN(rate)) {
        const calculated = base * (rate / 100);
        setFormData(prev => ({ ...prev, calculated_total: calculated }));
      }
    }
  }, [formData.base_price, formData.commission_rate]);

  const categories = [
    { value: 'birthday', label: '🎂 יום הולדת' },
    { value: 'therapy', label: '🧠 טיפול' },
    { value: 'basketball', label: '🏀 אימון כדורסל' },
    { value: 'workshop', label: '🎓 סדנה בית ספר' }
  ];

  const packageTypes = [
    { value: 'basic', label: 'חבילה בסיסית' },
    { value: 'extended', label: 'חבילה מורחבת' },
    { value: 'premium', label: 'חבילה פרימיום' },
    { value: 'custom', label: 'מותאם אישית' }
  ];

  // Load deal data when editing
  useEffect(() => {
    if (deal) {
      setFormData({
        base_price: '',
        commission_rate: '',
        calculated_total: 0,
        contact_id: deal.contact_id || '',
        title: deal.title || '',
        category: deal.category || '',
        package_type: deal.package_type || '',
        amount_total: deal.amount_total?.toString() || '',
        next_action_date: deal.next_action_date || '',
        notes: deal.notes || ''
      });
      if ((deal as any).domain_id) {
        setSelectedDomains([(deal as any).domain_id]);
      }
      // Load payment status
      if (deal.payment_status === 'paid') {
        setPaymentType('full');
      } else if (deal.payment_status === 'partial') {
        setPaymentType('partial');
        setPartialAmount(deal.amount_paid?.toString() || '');
      } else {
        setPaymentType('none');
      }
    } else {
      setFormData({
        base_price: '',
        commission_rate: '',
        calculated_total: 0,
        contact_id: '',
        title: '',
        category: '',
        package_type: '',
        amount_total: '',
        next_action_date: '',
        notes: ''
      });
      setSelectedDomains([]);
      setPaymentType('none');
      setPartialAmount('');
    }
  }, [deal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_id) {
      toast.error("יש לבחור לקוח");
      return;
    }
    
    if (!deal && selectedDomains.length === 0) {
      toast.error("יש לבחור לפחות תחום אחד");
      return;
    }

    setIsLoading(true);

    try {
      const amountTotal = parseFloat(formData.amount_total);
      let amountPaid = 0;
      let paymentStatus: 'pending' | 'partial' | 'paid' = 'pending';
      
      if (paymentType === 'full') {
        amountPaid = amountTotal;
        paymentStatus = 'paid';
      } else if (paymentType === 'partial') {
        amountPaid = parseFloat(partialAmount) || 0;
        paymentStatus = 'partial';
      }

      if (deal) {
        // Update existing deal (single domain mode)
        const dealData = {
          contact_id: formData.contact_id,
          domain_id: selectedDomains[0] || null,
          title: formData.title,
          category: formData.category || null,
          package_type: formData.package_type || null,
          amount_total: amountTotal,
          amount_paid: amountPaid,
          payment_status: paymentStatus,
          workflow_stage: 'lead',
          next_action_date: formData.next_action_date || null,
          notes: formData.notes || null,
        };

        const { error } = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', deal.id);

        if (error) throw error;
        
        // Update payment if needed
        if (paymentType !== 'none') {
          const { error: payError } = await supabase
            .from('payments')
            .upsert({
              deal_id: deal.id,
              contact_id: formData.contact_id,
              amount: amountPaid,
              payment_date: new Date().toISOString().split('T')[0],
              status: paymentStatus === 'paid' ? 'completed' : 'pending',
              is_deposit: paymentStatus === 'partial',
            });
          
          if (payError) console.error('Payment error:', payError);
        }
        
        toast.success("✅ העסקה עודכנה בהצלחה!");
      } else {
        // Create new deals (one per domain)
        for (const domainId of selectedDomains) {
          const dealData = {
            contact_id: formData.contact_id,
            domain_id: domainId,
            title: formData.title,
            category: formData.category || null,
            package_type: formData.package_type || null,
            amount_total: amountTotal,
            amount_paid: amountPaid,
            payment_status: paymentStatus,
            workflow_stage: 'lead',
            next_action_date: formData.next_action_date || null,
            notes: formData.notes || null,
          };

          const { data: newDeal, error } = await supabase
            .from('deals')
            .insert([dealData])
            .select()
            .single();

          if (error) throw error;
          
          // Create payment record if paid
          if (paymentType !== 'none' && newDeal) {
            await supabase
              .from('payments')
              .insert({
                deal_id: newDeal.id,
                contact_id: formData.contact_id,
                amount: amountPaid,
                payment_date: new Date().toISOString().split('T')[0],
                status: paymentStatus === 'paid' ? 'completed' : 'pending',
                is_deposit: paymentStatus === 'partial',
                notes: paymentStatus === 'partial' ? 'תשלום חלקי' : 'תשלום מלא',
              });
          }
          
          setLastAction({ type: 'deal', id: newDeal.id, timestamp: Date.now() });
        }
        
        toast.success(`✅ ${selectedDomains.length} עסקאות נוצרו בהצלחה!`);
      }
      
      onClose();
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
    } catch (error: any) {
      console.error('Error saving deal:', error);
      toast.error('❌ שגיאה בשמירת העסקה: ' + (error.message || 'שגיאה לא ידועה'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="premium-card max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text text-center">
            {deal ? '✏️ עריכת עסקה' : '💼 הוסף עסקה חדשה'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Templates */}
          <div>
            <Label htmlFor="template">תבניות מהירות</Label>
            <Select onValueChange={(templateId) => {
              const template = dealTemplates.find(t => t.id === templateId);
              if (template) {
                setFormData({
                  ...formData,
                  category: template.category,
                  package_type: template.package_type,
                  amount_total: template.amount_total.toString(),
                  notes: template.notes
                });
                toast.success('תבנית נטענה בהצלחה');
              }
            }}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="בחר תבנית מהירה (אופציונלי)" />
              </SelectTrigger>
              <SelectContent>
                {dealTemplates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-right font-bold text-primary">
              לקוח
            </Label>
            <Select value={formData.contact_id} onValueChange={(value) => handleChange('contact_id', value)}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="בחר לקוח" />
              </SelectTrigger>
              <SelectContent>
                {contacts?.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domain Selector */}
          {!deal && (
            <DomainSelector 
              selectedDomains={selectedDomains}
              onChange={setSelectedDomains}
            />
          )}

          <div>
            <Label htmlFor="title" className="text-right font-bold text-primary">
              כותרת העסקה
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-right"
              placeholder="למשל: יום הולדת של דני"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-right font-bold text-primary">
                קטגוריה
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-right font-bold text-primary">
                סוג חבילה
              </Label>
              <Select value={formData.package_type} onValueChange={(value) => handleChange('package_type', value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="בחר חבילה" />
                </SelectTrigger>
                <SelectContent>
                  {packageTypes.map((packageType) => (
                    <SelectItem key={packageType.value} value={packageType.value}>
                      {packageType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* מחשבון עמלה */}
          <div className="border-2 border-primary/20 rounded-lg p-4 bg-blue-50">
            <h4 className="font-bold mb-3">💰 מחשבון עמלה</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>מחיר בסיס (₪)</Label>
                <Input 
                  type="number" 
                  value={formData.base_price}
                  onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                  placeholder="10000"
                />
              </div>
              <div>
                <Label>אחוז עמלה (%)</Label>
                <Input 
                  type="number" 
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({...formData, commission_rate: e.target.value})}
                  placeholder="30"
                />
              </div>
            </div>
            {formData.calculated_total > 0 && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                <p className="text-sm text-gray-600">סכום מחושב:</p>
                <p className="text-2xl font-black text-green-700">₪{formData.calculated_total.toLocaleString()}</p>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange('amount_total', formData.calculated_total.toString())}
                  className="mt-2"
                >
                  ↓ העבר לסכום כולל
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="amount_total" className="text-right font-bold text-primary">
              סכום כולל
            </Label>
            <Input
              id="amount_total"
              type="number"
              value={formData.amount_total}
              onChange={(e) => handleChange('amount_total', e.target.value)}
              className="text-right"
              placeholder="1500"
            />
          </div>

          {/* Payment Status */}
          <div className="border-2 border-primary/20 rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50">
            <Label className="text-lg font-bold mb-3 block">💰 סטטוס תשלום</Label>
            <RadioGroup value={paymentType} onValueChange={(val) => setPaymentType(val as any)}>
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="cursor-pointer">🟢 שילם מלא</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial" className="cursor-pointer">🟠 שילם חלקית</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="cursor-pointer">🔴 לא שילם</Label>
              </div>
            </RadioGroup>

            {paymentType === 'partial' && (
              <div className="mt-4 space-y-3">
                <RadioGroup value={partialType} onValueChange={(val) => setPartialType(val as any)}>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="amount" id="amount_type" />
                    <Label htmlFor="amount_type">סכום קבוע</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="percentage" id="percentage_type" />
                    <Label htmlFor="percentage_type">אחוזים</Label>
                  </div>
                </RadioGroup>

                {partialType === 'amount' ? (
                  <div>
                    <Label htmlFor="partial_amount">סכום ששולם (₪)</Label>
                    <Input
                      id="partial_amount"
                      type="number"
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(e.target.value)}
                      placeholder="500"
                    />
                  </div>
                 ) : (
                  <div>
                    <Label htmlFor="partial_percentage">אחוז ששולם (%)</Label>
                    <Input
                      id="partial_percentage"
                      type="number"
                      value={partialPercentage}
                      onChange={(e) => {
                        const percentage = parseFloat(e.target.value) || 0;
                        setPartialPercentage(e.target.value);
                        const total = parseFloat(formData.amount_total) || 0;
                        setPartialAmount((total * percentage / 100).toString());
                      }}
                      placeholder="50"
                      max={100}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="next_action_date" className="text-right font-bold text-primary">
              תאריך פעולה הבאה
            </Label>
            <Input
              id="next_action_date"
              type="date"
              value={formData.next_action_date}
              onChange={(e) => handleChange('next_action_date', e.target.value)}
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-right font-bold text-primary">
              הערות
            </Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="text-right"
              placeholder="הערות נוספות..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="btn-accent flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {deal ? 'מעדכן...' : 'שומר...'}
                </>
              ) : (
                deal ? '✅ עדכן עסקה' : '✅ הוסף עסקה'
              )}
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              ❌ ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
