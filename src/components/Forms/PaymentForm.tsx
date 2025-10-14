import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";
import { useCreatePayment, useUpdatePayment } from "@/hooks/usePayments";
import { Payment } from "@/types/database";
import { format } from "date-fns";
import { toast } from "sonner";
import { PremiumLoader } from "@/components/PremiumLoader";

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
}

export function PaymentForm({ isOpen, onClose, payment }: PaymentFormProps) {
  const { data: deals, isLoading: dealsLoading } = useDeals();
  const { data: contacts, isLoading: contactsLoading } = useContacts();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();

  const [paymentType, setPaymentType] = useState<"deal" | "direct">("deal");
  const [formData, setFormData] = useState({
    deal_id: "",
    contact_id: "",
    amount: "",
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    payment_method: "",
    is_deposit: false,
    notes: "",
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        deal_id: payment.deal_id || "",
        contact_id: payment.contact_id || "",
        amount: payment.amount.toString(),
        payment_date: payment.payment_date || format(new Date(), 'yyyy-MM-dd'),
        payment_method: payment.payment_method || "",
        is_deposit: payment.is_deposit,
        notes: payment.notes || "",
      });
      setPaymentType(payment.deal_id ? "deal" : "direct");
    } else {
      setFormData({
        deal_id: "",
        contact_id: "",
        amount: "",
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        payment_method: "",
        is_deposit: false,
        notes: "",
      });
      setPaymentType("deal");
    }
  }, [payment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const paymentData = {
        deal_id: paymentType === "deal" && formData.deal_id !== "none" ? formData.deal_id : null,
        contact_id: paymentType === "direct" ? formData.contact_id : null,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        payment_method: formData.payment_method || null,
        is_deposit: formData.is_deposit,
        notes: formData.notes || null,
      };

      if (payment) {
        await updatePayment.mutateAsync({ id: payment.id, data: paymentData });
      } else {
        await createPayment.mutateAsync(paymentData);
      }

      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("⚠️ שגיאה בשמירת התשלום. נסה שוב.");
    }
  };

  if (dealsLoading || contactsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <PremiumLoader size="md" />
            <p className="text-muted-foreground">טוען נתונים...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">
              ➕ תשלום חדש
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 text-center">
            <div className="text-6xl">👥</div>
            <h3 className="text-xl font-bold">אין לקוחות במערכת</h3>
            <p className="text-muted-foreground">כדי להוסיף תשלום, צריך קודם להוסיף לקוח</p>
            <Button onClick={onClose} className="btn-premium">
              סגור
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            {payment ? "✏️ עריכת תשלום" : "➕ תשלום חדש"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!payment && (
            <div>
              <Label>סוג התשלום</Label>
              <RadioGroup
                value={paymentType}
                onValueChange={(value: "deal" | "direct") => {
                  setPaymentType(value);
                  setFormData({ 
                    ...formData, 
                    deal_id: value === "deal" ? formData.deal_id : "",
                    contact_id: value === "direct" ? formData.contact_id : ""
                  });
                }}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="deal" id="type-deal" />
                  <Label htmlFor="type-deal" className="cursor-pointer">תשלום עבור עסקה</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="direct" id="type-direct" />
                  <Label htmlFor="type-direct" className="cursor-pointer">תשלום ישיר מלקוח</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {paymentType === "deal" ? (
            <div>
              <Label htmlFor="deal_id">עסקה *</Label>
              <Select
                value={formData.deal_id}
                onValueChange={(value) => setFormData({ ...formData, deal_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר עסקה" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="none">ללא עסקה</SelectItem>
                  {deals?.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.title} - ₪{deal.amount_total.toLocaleString('he-IL')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label htmlFor="contact_id">לקוח *</Label>
              <Select
                value={formData.contact_id}
                onValueChange={(value) => setFormData({ ...formData, contact_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר לקוח" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {contacts?.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="amount">סכום *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="payment_date">תאריך תשלום *</Label>
            <Input
              id="payment_date"
              type="date"
              required
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="payment_method">אמצעי תשלום</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר אמצעי תשלום" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="cash">מזומן</SelectItem>
                <SelectItem value="credit">כרטיס אשראי</SelectItem>
                <SelectItem value="bank_transfer">העברה בנקאית</SelectItem>
                <SelectItem value="check">צ'ק</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bit">Bit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_deposit"
              checked={formData.is_deposit}
              onChange={(e) => setFormData({ ...formData, is_deposit: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="is_deposit">מקדמה</Label>
          </div>

          <div>
            <Label htmlFor="notes">הערות</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="הוסף הערות..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit" className="btn-premium">
              {payment ? "💾 שמור שינויים" : "➕ הוסף תשלום"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}