
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { useSmartInsert } from "@/hooks/useSmartInsert";
import { useContacts } from "@/hooks/useContacts";
import { X } from "lucide-react";
import { toast } from "sonner";

interface NewDealFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DealFormData {
  title: string;
  contact_id: string;
  category: string;
  package_type: string;
  amount_total: number;
  next_action_date: string;
  notes: string;
}

export const NewDealForm: React.FC<NewDealFormProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DealFormData>();
  const { smartInsert } = useSmartInsert();
  const { data: contacts } = useContacts();
  const [isLoading, setIsLoading] = React.useState(false);

  const categories = [
    { value: 'birthday', label: '🎂 יום הולדת' },
    { value: 'therapy', label: '🧠 טיפול' },
    { value: 'basketball', label: '🏀 אימון כדורסל' },
    { value: 'workshop', label: '🎓 סדנה בית ספר' }
  ];

  const packageTypes = [
    { value: 'basic', label: 'חבילה בסיסית' },
    { value: 'premium', label: 'חבילה פרימיום' },
    { value: 'vip', label: 'חבילת VIP' }
  ];

  const onSubmit = async (data: DealFormData) => {
    setIsLoading(true);
    try {
      await smartInsert({
        table: 'deals',
        values: {
          ...data,
          workflow_stage: 'lead',
          payment_status: 'pending' as const,
          amount_paid: 0,
          custom_fields: {}
        },
        onSuccess: () => {
          toast.success(`✅ העסקה "${data.title}" נוספה בהצלחה! 💼🎉`);
          reset();
          onClose();
        }
      });
    } catch (error: any) {
      const errorMsg = error?.message || 'שגיאה לא ידועה';
      toast.error(`❌ שגיאה בהוספת עסקה: ${errorMsg}. אנא בדוק את הפרטים ונסה שוב.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 text-center">
            💼 עסקה חדשה
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div>
            <Label htmlFor="title">כותרת העסקה *</Label>
            <Input
              id="title"
              {...register('title', { required: 'כותרת נדרשת' })}
              className="mt-1"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contact_id">לקוח</Label>
            <Controller
              name="contact_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1">
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
              )}
            />
          </div>

          <div>
            <Label htmlFor="category">קטגוריה</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1">
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
              )}
            />
          </div>

          <div>
            <Label htmlFor="package_type">סוג חבילה</Label>
            <Controller
              name="package_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="בחר חבילה" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((pkg) => (
                      <SelectItem key={pkg.value} value={pkg.value}>
                        {pkg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="amount_total">סכום כולל *</Label>
            <Input
              id="amount_total"
              type="number"
              {...register('amount_total', { 
                required: 'סכום נדרש',
                min: { value: 0, message: 'סכום חייב להיות חיובי' }
              })}
              className="mt-1"
            />
            {errors.amount_total && (
              <p className="text-red-500 text-sm mt-1">{errors.amount_total.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="next_action_date">תאריך פעולה הבאה</Label>
            <Input
              id="next_action_date"
              type="date"
              {...register('next_action_date')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes">הערות</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="cta flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'שומר...' : '💾 שמור עסקה'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
