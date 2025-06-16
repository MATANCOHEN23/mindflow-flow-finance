
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: any) => void;
}

export function AddClientForm({ isOpen, onClose, onSubmit }: AddClientFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    childName: '',
    parentPhone: '',
    email: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      toast.error("שם פרטי ושם משפחה הם שדות חובה");
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      role: '',
      childName: '',
      parentPhone: '',
      email: '',
      notes: ''
    });
    
    onClose();
    toast.success("הלקוח נוסף בהצלחה!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="premium-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text text-center">
            👤 הוסף לקוח חדש
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-right font-bold text-primary">
                שם פרטי *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="text-right"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-right font-bold text-primary">
                שם משפחה *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="text-right"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role" className="text-right font-bold text-primary">
              תפקיד
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="text-right"
              placeholder="למשל: הורה, מנהל בית ספר"
            />
          </div>

          <div>
            <Label htmlFor="childName" className="text-right font-bold text-primary">
              שם הילד
            </Label>
            <Input
              id="childName"
              value={formData.childName}
              onChange={(e) => handleChange('childName', e.target.value)}
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="parentPhone" className="text-right font-bold text-primary">
              טלפון הורה
            </Label>
            <Input
              id="parentPhone"
              value={formData.parentPhone}
              onChange={(e) => handleChange('parentPhone', e.target.value)}
              className="text-right"
              placeholder="050-1234567"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-right font-bold text-primary">
              אימייל
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="text-right"
              placeholder="example@email.com"
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
            <Button type="submit" className="btn-accent flex-1">
              ✅ הוסף לקוח
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
