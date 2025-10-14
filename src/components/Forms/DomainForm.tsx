import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { useCreateDomain, useUpdateDomain, useDomains } from "@/hooks/useDomains";
import { Domain } from "@/types/database";
import { X } from "lucide-react";
import { toast } from "sonner";

interface DomainFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingDomain?: Domain | null;
}

interface DomainFormData {
  name: string;
  icon: string;
  level: number;
  parent_id: string | null;
  pricing_type: 'percentage' | 'fixed' | 'full' | null;
  pricing_value: number | null;
  pricing_notes: string;
  order_index: number;
  is_active: boolean;
}

export const DomainForm: React.FC<DomainFormProps> = ({ isOpen, onClose, editingDomain }) => {
  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<DomainFormData>({
    defaultValues: {
      is_active: true,
      level: 1,
      order_index: 0,
      pricing_type: null,
      pricing_value: null,
      parent_id: null,
    }
  });
  
  const { data: allDomains } = useDomains();
  const createDomain = useCreateDomain();
  const updateDomain = useUpdateDomain();
  const [isLoading, setIsLoading] = React.useState(false);

  const selectedLevel = watch('level');
  const selectedParentId = watch('parent_id');
  const pricingType = watch('pricing_type');

  useEffect(() => {
    if (editingDomain) {
      reset({
        name: editingDomain.name,
        icon: editingDomain.icon || '',
        level: editingDomain.level,
        parent_id: editingDomain.parent_id || null,
        pricing_type: editingDomain.pricing_type || null,
        pricing_value: editingDomain.pricing_value || null,
        pricing_notes: editingDomain.pricing_notes || '',
        order_index: editingDomain.order_index,
        is_active: editingDomain.is_active,
      });
    } else {
      reset({
        is_active: true,
        level: 1,
        order_index: 0,
        pricing_type: null,
        pricing_value: null,
        parent_id: null,
        name: '',
        icon: '',
        pricing_notes: '',
      });
    }
  }, [editingDomain, reset, isOpen]);

  // Auto-update level when parent is selected
  useEffect(() => {
    if (selectedParentId && allDomains) {
      const parent = allDomains.find(d => d.id === selectedParentId);
      if (parent) {
        setValue('level', parent.level + 1);
      }
    } else if (!selectedParentId) {
      setValue('level', 1);
    }
  }, [selectedParentId, allDomains, setValue]);

  const getAvailableParents = () => {
    if (!allDomains) return [];
    
    // If editing, exclude self and descendants
    if (editingDomain) {
      return allDomains.filter(d => 
        d.id !== editingDomain.id && 
        !isDescendant(d.id, editingDomain.id)
      );
    }
    
    return allDomains;
  };

  const isDescendant = (potentialDescendantId: string, ancestorId: string): boolean => {
    if (!allDomains) return false;
    
    const domain = allDomains.find(d => d.id === potentialDescendantId);
    if (!domain || !domain.parent_id) return false;
    if (domain.parent_id === ancestorId) return true;
    
    return isDescendant(domain.parent_id, ancestorId);
  };

  const onSubmit = async (data: DomainFormData) => {
    setIsLoading(true);
    try {
      const domainData = {
        ...data,
        parent_id: data.parent_id || null,
        pricing_type: data.pricing_type || null,
        pricing_value: data.pricing_value || null,
      };

      if (editingDomain) {
        await updateDomain.mutateAsync({
          id: editingDomain.id,
          data: domainData
        });
        toast.success('התחום עודכן בהצלחה! 🎉');
      } else {
        await createDomain.mutateAsync(domainData);
        toast.success('תחום חדש נוסף בהצלחה! 🎉');
      }
      
      reset();
      onClose();
    } catch (error) {
      toast.error(editingDomain ? 'שגיאה בעדכון התחום' : 'שגיאה בהוספת התחום');
    } finally {
      setIsLoading(false);
    }
  };

  const availableParents = getAvailableParents();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center">
            {editingDomain ? '✏️ עריכת תחום' : '➕ תחום חדש'}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">שם התחום *</Label>
              <Input
                id="name"
                {...register('name', { required: 'שם התחום נדרש' })}
                className="mt-1"
                placeholder="נווה עוז - א'-ב'"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="icon">אייקון</Label>
              <Input
                id="icon"
                {...register('icon')}
                className="mt-1"
                placeholder="⚽"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="parent_id">תחום הורה (אופציונלי)</Label>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
                  value={field.value || 'none'}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="בחר תחום הורה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">ללא הורה (רמה ראשית)</SelectItem>
                    {availableParents.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.icon} {domain.name} (רמה {domain.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="level">רמה (מתעדכנת אוטומטית)</Label>
            <Input
              id="level"
              type="number"
              {...register('level', { valueAsNumber: true })}
              className="mt-1 bg-muted"
              disabled
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">הגדרות מחיר</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricing_type">סוג מחיר</Label>
                <Controller
                  name="pricing_type"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
                      value={field.value || 'none'}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="בחר סוג מחיר" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">ללא מחיר</SelectItem>
                        <SelectItem value="percentage">אחוז (%)</SelectItem>
                        <SelectItem value="fixed">קבוע (₪)</SelectItem>
                        <SelectItem value="full">מחיר מלא (₪)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {pricingType && (
                <div>
                  <Label htmlFor="pricing_value">
                    {pricingType === 'percentage' ? 'אחוז' : 'סכום (₪)'}
                  </Label>
                  <Input
                    id="pricing_value"
                    type="number"
                    step={pricingType === 'percentage' ? '0.1' : '1'}
                    {...register('pricing_value', { valueAsNumber: true })}
                    className="mt-1"
                    placeholder={pricingType === 'percentage' ? '30' : '1000'}
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="pricing_notes">הערות מחיר</Label>
              <Input
                id="pricing_notes"
                {...register('pricing_notes')}
                className="mt-1"
                placeholder="לדוגמה: כולל ארוחת צהריים"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <Label htmlFor="order_index">מיקום בסדר</Label>
              <Input
                id="order_index"
                type="number"
                {...register('order_index', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is_active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="is_active">תחום פעיל</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="cta flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'שומר...' : editingDomain ? '💾 עדכן תחום' : '💾 הוסף תחום'}
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
