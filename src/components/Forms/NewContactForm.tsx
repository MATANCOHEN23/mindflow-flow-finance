
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useSmartInsert } from "@/hooks/useSmartInsert";
import { X } from "lucide-react";
import { toast } from "sonner";

interface NewContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  first_name: string;
  last_name: string;
  phone_parent: string;
  email: string;
  role_tags: string[];
}

export const NewContactForm: React.FC<NewContactFormProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ContactFormData>();
  const { smartInsert } = useSmartInsert();
  const [isLoading, setIsLoading] = React.useState(false);

  const roleOptions = [
    { value: 'לקוח', label: '👤 לקוח' },
    { value: 'הורה', label: '👨‍👩‍👧‍👦 הורה' },
    { value: 'מטופל', label: '🏥 מטופל' },
    { value: 'שחקן כדורסל', label: '🏀 שחקן כדורסל' },
    { value: 'תלמיד', label: '🎓 תלמיד' }
  ];

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await smartInsert({
        table: 'contacts',
        values: {
          ...data,
          role_tags: data.role_tags || []
        },
        onSuccess: () => {
          toast.success('לקוח חדש נוסף בהצלחה! 🎉');
          reset();
          onClose();
        }
      });
    } catch (error) {
      toast.error('שגיאה בהוספת הלקוח');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 text-center">
            👤 לקוח חדש
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
            <Label htmlFor="first_name">שם פרטי *</Label>
            <Input
              id="first_name"
              {...register('first_name', { required: 'שם פרטי נדרש' })}
              className="mt-1"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="last_name">שם משפחה</Label>
            <Input
              id="last_name"
              {...register('last_name')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role_tags">תפקיד</Label>
            <Controller
              name="role_tags"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0]}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="בחר תפקיד" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="phone_parent">טלפון הורה</Label>
            <Input
              id="phone_parent"
              type="tel"
              {...register('phone_parent')}
              className="mt-1"
              placeholder="050-1234567"
            />
          </div>

          <div>
            <Label htmlFor="email">אימייל</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1"
              placeholder="example@email.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="cta flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'שומר...' : '💾 שמור לקוח'}
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
