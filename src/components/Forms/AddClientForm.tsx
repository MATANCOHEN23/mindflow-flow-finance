
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateContact, useUpdateContact } from "@/hooks/useContacts";
import { Contact } from "@/types/database";
import { Loader2 } from "lucide-react";

interface AddClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null;
}

const roleOptions = [
  'הורה',
  'אפוטרופוס',
  'בן משפחה',
  'מטפל',
  'מאמן',
  'מורה'
];

export const AddClientForm = ({ isOpen, onClose, contact }: AddClientFormProps) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    phone_parent: '',
    email: '',
    child_name: '',
    role_tags: [] as string[],
    notes: ''
  });

  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  
  const isEditing = !!contact;
  const isLoading = createContactMutation.isPending || updateContactMutation.isPending;

  useEffect(() => {
    if (contact) {
      setFormData({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        phone: contact.phone || '',
        phone_parent: contact.phone_parent || '',
        email: contact.email || '',
        child_name: contact.child_name || '',
        role_tags: contact.role_tags || [],
        notes: contact.notes || ''
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        phone_parent: '',
        email: '',
        child_name: '',
        role_tags: [],
        notes: ''
      });
    }
  }, [contact]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role_tags: prev.role_tags.includes(role)
        ? prev.role_tags.filter(r => r !== role)
        : [...prev.role_tags, role]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim()) {
      alert('שם פרטי הוא שדה חובה');
      return;
    }

    try {
      if (isEditing && contact) {
        await updateContactMutation.mutateAsync({
          id: contact.id,
          data: formData
        });
      } else {
        await createContactMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text text-center">
            {isEditing ? '✏️ עריכת לקוח' : '➕ הוספת לקוח חדש'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-right font-semibold">
                שם פרטי <span className="text-red-500">*</span>
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="הכנס שם פרטי"
                className="text-right"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-right font-semibold">שם משפחה</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="הכנס שם משפחה"
                className="text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right font-semibold">טלפון</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="05X-XXX-XXXX"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone_parent" className="text-right font-semibold">טלפון הורה</Label>
              <Input
                id="phone_parent"
                value={formData.phone_parent}
                onChange={(e) => handleInputChange('phone_parent', e.target.value)}
                placeholder="05X-XXX-XXXX"
                className="text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right font-semibold">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="child_name" className="text-right font-semibold">שם הילד</Label>
              <Input
                id="child_name"
                value={formData.child_name}
                onChange={(e) => handleInputChange('child_name', e.target.value)}
                placeholder="הכנס שם הילד"
                className="text-right"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-right font-semibold">תפקיד/יחס</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roleOptions.map((role) => (
                <label key={role} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.role_tags.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-right font-semibold">הערות</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="הערות נוספות על הלקוח..."
              className="text-right min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'מעדכן...' : 'שומר...'}
                </>
              ) : (
                isEditing ? '💾 עדכן לקוח' : '➕ הוסף לקוח'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
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
