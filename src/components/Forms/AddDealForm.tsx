
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Deal } from "@/types/database";
import { Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useContacts } from '@/hooks/useContacts';
import { useDomains } from '@/hooks/useDomains';
import { useLastAction } from '@/hooks/useLastAction';
import { dealTemplates } from '@/data/dealTemplates';

interface AddDealFormProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal | null;
}

export function AddDealForm({ isOpen, onClose, deal }: AddDealFormProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { data: contacts } = useContacts();
  const { data: domains } = useDomains();
  const { setLastAction } = useLastAction();
  
  const [formData, setFormData] = useState({
    base_price: '',
    commission_rate: '',
    calculated_total: 0,
    contact_id: '',
    domain_id: '',
    title: '',
    category: '',
    package_type: '',
    amount_total: '',
    amount_paid: '0',
    payment_status: 'pending' as 'pending' | 'partial' | 'paid',
    workflow_stage: 'lead',
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
        domain_id: (deal as any).domain_id || '',
        title: deal.title || '',
        category: deal.category || '',
        package_type: deal.package_type || '',
        amount_total: deal.amount_total?.toString() || '',
        amount_paid: deal.amount_paid?.toString() || '0',
        payment_status: deal.payment_status || 'pending',
        workflow_stage: deal.workflow_stage || 'lead',
        next_action_date: deal.next_action_date || '',
        notes: deal.notes || ''
      });
    } else {
      setFormData({
        base_price: '',
        commission_rate: '',
        calculated_total: 0,
        contact_id: '',
        domain_id: '',
        title: '',
        category: '',
        package_type: '',
        amount_total: '',
        amount_paid: '0',
        payment_status: 'pending',
        workflow_stage: 'lead',
        next_action_date: '',
        notes: ''
      });
    }
  }, [deal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_id) {
      toast.error("יש לבחור לקוח");
      return;
    }

    setIsLoading(true);

    const dealData = {
      contact_id: formData.contact_id || null,
      domain_id: formData.domain_id || null,
      title: formData.title,
      category: formData.category || null,
      package_type: formData.package_type || null,
      amount_total: parseFloat(formData.amount_total),
      amount_paid: parseFloat(formData.amount_paid),
      payment_status: formData.payment_status,
      workflow_stage: formData.workflow_stage,
      next_action_date: formData.next_action_date || null,
      notes: formData.notes || null,
      custom_fields: {}
    };

    try {
      if (deal) {
        // Update existing deal
        const { data, error } = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', deal.id)
          .select()
          .single();

        if (error) throw error;
        toast.success("✅ העסקה עודכנה בהצלחה!");
      } else {
        // Create new deal
        const { data, error } = await supabase
          .from('deals')
          .insert([dealData])
          .select()
          .single();

        if (error) throw error;
        toast.success("✅ העסקה נוספה בהצלחה!");
        
        setLastAction({ type: 'deal', id: data.id, timestamp: Date.now() });
      }
      
      onClose();
      
      // Refresh the deals list
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
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

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label className="text-right font-bold text-primary">
                תחום
              </Label>
              <Select value={formData.domain_id} onValueChange={(value) => handleChange('domain_id', value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="בחר תחום" />
                </SelectTrigger>
                <SelectContent>
                  {domains?.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.icon} {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="amount_paid" className="text-right font-bold text-primary">
                סכום ששולם
              </Label>
              <Input
                id="amount_paid"
                type="number"
                value={formData.amount_paid}
                onChange={(e) => handleChange('amount_paid', e.target.value)}
                className="text-right"
                placeholder="0"
              />
            </div>
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
