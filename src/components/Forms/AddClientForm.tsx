
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Contact } from "@/types/database";
import { Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useDomains } from '@/hooks/useDomains';

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
  'מורה',
  'מטופל',
  'שחקן כדורסל'
];

export const AddClientForm = ({ isOpen, onClose, contact }: AddClientFormProps) => {
  const queryClient = useQueryClient();
  const { data: allDomains } = useDomains();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    phone_parent: '',
    email: '',
    child_name: '',
    parent_name: '',
    age: '',
    group: '',
    role_tags: [] as string[],
    notes: ''
  });
  
  const [customProject, setCustomProject] = useState('');

  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!contact;

  useEffect(() => {
    const loadContactDomains = async () => {
      if (contact) {
        const subCat = (contact as any).sub_category || {};
        setFormData({
          first_name: contact.first_name || '',
          last_name: contact.last_name || '',
          phone: contact.phone || '',
          phone_parent: contact.phone_parent || '',
          email: contact.email || '',
          child_name: contact.child_name || '',
          parent_name: subCat.parent_name || '',
          age: subCat.age || '',
          group: subCat.group || '',
          role_tags: contact.role_tags || [],
          notes: contact.notes || ''
        });
        setCustomProject(subCat.custom_project || '');
        
        // טעינת התחומים המקושרים
        const { data: contactDomains } = await supabase
          .from('contact_domains')
          .select('domain_id')
          .eq('contact_id', contact.id);
        
        if (contactDomains) {
          setSelectedDomains(contactDomains.map(cd => cd.domain_id).filter(Boolean) as string[]);
        }
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          phone: '',
          phone_parent: '',
          email: '',
          child_name: '',
          parent_name: '',
          age: '',
          group: '',
          role_tags: [],
          notes: ''
        });
        setSelectedDomains([]);
        setCustomProject('');
      }
    };
    
    loadContactDomains();
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
      toast.error('שם פרטי הוא שדה חובה');
      return;
    }

    setIsLoading(true);
    
    try {
      // בדיקת כפילויות אימייל
      if (formData.email && formData.email.trim()) {
        const emailToCheck = formData.email.trim().toLowerCase();
        const { data: existingContact } = await supabase
          .from('contacts')
          .select('id, first_name, last_name')
          .eq('email', emailToCheck)
          .neq('id', contact?.id || '00000000-0000-0000-0000-000000000000')
          .limit(1);
        
        if (existingContact && existingContact.length > 0) {
          toast.error(`האימייל כבר קיים במערכת עבור ${existingContact[0].first_name} ${existingContact[0].last_name}`);
          setIsLoading(false);
          return;
        }
      }

      const contactData = {
        first_name: formData.first_name,
        last_name: formData.last_name || null,
        phone: formData.phone || null,
        phone_parent: formData.phone_parent || null,
        email: formData.email ? formData.email.trim().toLowerCase() : null,
        child_name: formData.child_name || null,
        role_tags: formData.role_tags,
        notes: formData.notes || null,
        sub_category: {
          parent_name: formData.parent_name || null,
          age: formData.age || null,
          group: formData.group || null,
          custom_project: customProject || null
        }
      };

      if (isEditing && contact) {
        const { data, error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', contact.id)
          .select()
          .single();

        if (error) throw error;
        
        // עדכון התחומים
        await supabase.from('contact_domains').delete().eq('contact_id', contact.id);
        
        if (selectedDomains.length > 0) {
          const domainAssignments = selectedDomains.map(domainId => ({
            contact_id: contact.id,
            domain_id: domainId,
            status: 'active'
          }));
          
          await supabase.from('contact_domains').insert(domainAssignments);
        }
        
        toast.success('✅ הלקוח עודכן בהצלחה!');
      } else {
        const { data, error } = await supabase
          .from('contacts')
          .insert([contactData])
          .select()
          .single();

        if (error) throw error;
        
        // שיוך התחומים
        if (selectedDomains.length > 0) {
          const domainAssignments = selectedDomains.map(domainId => ({
            contact_id: data.id,
            domain_id: domainId,
            status: 'active'
          }));
          
          await supabase.from('contact_domains').insert(domainAssignments);
        }
        
        toast.success('✅ הלקוח נוסף בהצלחה!');
      }
      
      onClose();
      
      // Refresh the contacts list
      await queryClient.invalidateQueries({ queryKey: ['contacts'] });
      await queryClient.invalidateQueries({ queryKey: ['contact-domains'] });
    } catch (error: any) {
      console.error('Error saving contact:', error);
      toast.error('❌ שגיאה בשמירת הלקוח: ' + (error.message || 'שגיאה לא ידועה'));
    } finally {
      setIsLoading(false);
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
              <Label htmlFor="child_name" className="text-right font-semibold">שם פרטי (ילד)</Label>
              <Input
                id="child_name"
                value={formData.child_name}
                onChange={(e) => handleInputChange('child_name', e.target.value)}
                placeholder="הכנס שם הילד"
                className="text-right"
              />
            </div>
          </div>

          {/* שדות נוספים */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_name" className="text-right font-semibold">שם מלא הורה</Label>
              <Input
                id="parent_name"
                value={formData.parent_name}
                onChange={(e) => handleInputChange('parent_name', e.target.value)}
                placeholder="שם הורה"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age" className="text-right font-semibold">גיל</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="גיל"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group" className="text-right font-semibold">קבוצה</Label>
              <Input
                id="group"
                value={formData.group}
                onChange={(e) => handleInputChange('group', e.target.value)}
                placeholder="שם קבוצה"
                className="text-right"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-right font-semibold">תפקיד/יחס</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roleOptions.map((role) => (
                <label key={role} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                  <Checkbox
                    checked={formData.role_tags.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                  />
                  <span className="text-sm">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-right font-semibold">פרויקט / תחום</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {allDomains?.filter(d => !d.parent_id).map((domain) => {
                const subDomains = allDomains?.filter(sd => sd.parent_id === domain.id) || [];
                return (
                  <div key={domain.id} className="col-span-full border-b pb-2 mb-2 last:border-b-0">
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer font-semibold">
                      <Checkbox
                        checked={selectedDomains.includes(domain.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDomains([...selectedDomains, domain.id]);
                          } else {
                            setSelectedDomains(selectedDomains.filter(id => id !== domain.id));
                          }
                        }}
                      />
                      <span className="text-sm flex items-center gap-1">
                        {domain.icon && <span>{domain.icon}</span>}
                        {domain.name}
                      </span>
                    </label>
                    {selectedDomains.includes(domain.id) && subDomains.length > 0 && (
                      <div className="mr-6 mt-2 space-y-1">
                        {subDomains.map(sub => (
                          <label key={sub.id} className="flex items-center space-x-2 space-x-reverse cursor-pointer text-muted-foreground">
                            <Checkbox
                              checked={selectedDomains.includes(sub.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedDomains([...selectedDomains, sub.id]);
                                } else {
                                  setSelectedDomains(selectedDomains.filter(id => id !== sub.id));
                                }
                              }}
                            />
                            <span className="text-xs">
                              {sub.icon && <span className="ml-1">{sub.icon}</span>}
                              {sub.name}
                              {sub.pricing_value && (
                                <span className="text-muted-foreground mr-1">
                                  ({sub.pricing_type === 'percentage' ? `${sub.pricing_value}%` : `₪${sub.pricing_value}`})
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* הזנה ידנית */}
            <div className="mt-3">
              <Label htmlFor="customProject" className="text-right font-semibold">או הזן ידנית (אחר)</Label>
              <Input
                id="customProject"
                value={customProject}
                onChange={(e) => setCustomProject(e.target.value)}
                placeholder="פרויקט/תחום אחר..."
                className="text-right mt-1"
              />
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
