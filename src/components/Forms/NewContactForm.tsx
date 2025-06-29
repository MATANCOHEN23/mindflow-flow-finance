
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useCreateContact } from "@/hooks/useContacts";
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
}

export const NewContactForm: React.FC<NewContactFormProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const createContactMutation = useCreateContact();

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createContactMutation.mutateAsync(data);
      toast.success('לקוח חדש נוסף בהצלחה! 🎉');
      reset();
      onClose();
    } catch (error) {
      toast.error('שגיאה בהוספת הלקוח');
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
              disabled={createContactMutation.isPending}
            >
              {createContactMutation.isPending ? 'שומר...' : '💾 שמור לקוח'}
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
