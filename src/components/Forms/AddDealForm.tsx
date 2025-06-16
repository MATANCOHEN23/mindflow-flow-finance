
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddDealFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealData: any) => void;
}

export function AddDealForm({ isOpen, onClose, onSubmit }: AddDealFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: '',
    packageType: '',
    totalAmount: '',
    amountPaid: '0',
    paymentStatus: '❌',
    processStage: 'בתהליך',
    nextAction: ''
  });

  const categories = [
    '🎂 יום הולדת',
    '🧠 טיפול',
    '🏀 אימון כדורסל',
    '🎓 סדנה בית ספר'
  ];

  const packageTypes = [
    'חבילה בסיסית',
    'חבילה מורחבת',
    'חבילה פרימיום',
    'מותאם אישית'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.client || !formData.totalAmount) {
      toast.error("כותרת, לקוח וסכום כולל הם שדות חובה");
      return;
    }

    const dealData = {
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      amountPaid: parseFloat(formData.amountPaid),
      createdAt: new Date().toISOString()
    };

    onSubmit(dealData);
    
    // Reset form
    setFormData({
      title: '',
      client: '',
      category: '',
      packageType: '',
      totalAmount: '',
      amountPaid: '0',
      paymentStatus: '❌',
      processStage: 'בתהליך',
      nextAction: ''
    });
    
    onClose();
    toast.success("העסקה נוספה בהצלחה!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="premium-card max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text text-center">
            💼 הוסף עסקה חדשה
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-right font-bold text-primary">
              כותרת העסקה *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-right"
              placeholder="למשל: יום הולדת של דני"
              required
            />
          </div>

          <div>
            <Label htmlFor="client" className="text-right font-bold text-primary">
              לקוח *
            </Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => handleChange('client', e.target.value)}
              className="text-right"
              placeholder="שם הלקוח"
              required
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
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-right font-bold text-primary">
                סוג חבילה
              </Label>
              <Select value={formData.packageType} onValueChange={(value) => handleChange('packageType', value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="בחר חבילה" />
                </SelectTrigger>
                <SelectContent>
                  {packageTypes.map((packageType) => (
                    <SelectItem key={packageType} value={packageType}>
                      {packageType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalAmount" className="text-right font-bold text-primary">
                סכום כולל *
              </Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => handleChange('totalAmount', e.target.value)}
                className="text-right"
                placeholder="1500"
                required
              />
            </div>

            <div>
              <Label htmlFor="amountPaid" className="text-right font-bold text-primary">
                סכום ששולם
              </Label>
              <Input
                id="amountPaid"
                type="number"
                value={formData.amountPaid}
                onChange={(e) => handleChange('amountPaid', e.target.value)}
                className="text-right"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nextAction" className="text-right font-bold text-primary">
              פעולה הבאה
            </Label>
            <Input
              id="nextAction"
              value={formData.nextAction}
              onChange={(e) => handleChange('nextAction', e.target.value)}
              className="text-right"
              placeholder="למשל: חתימה על חוזה"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="btn-accent flex-1">
              ✅ הוסף עסקה
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
