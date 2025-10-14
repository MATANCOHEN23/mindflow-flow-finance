import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateTask } from '@/hooks/useTasks';
import { useContacts } from '@/hooks/useContacts';
import { Loader2 } from "lucide-react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskForm({ isOpen, onClose }: TaskFormProps) {
  const { data: contacts } = useContacts();
  const createTask = useCreateTask();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'general',
    contact_id: '',
    due_date: '',
    priority: 'medium',
    status: 'pending',
    assigned_to: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      contact_id: formData.contact_id || null,
      auto_generated: false
    };

    await createTask.mutateAsync(taskData as any);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      task_type: 'general',
      contact_id: '',
      due_date: '',
      priority: 'medium',
      status: 'pending',
      assigned_to: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="premium-card max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text text-center">
            ✅ משימה חדשה
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">כותרת המשימה *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="למשל: שלח הצעת מחיר ללקוח"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="פרטים נוספים על המשימה..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>סוג משימה</Label>
              <Select value={formData.task_type} onValueChange={(value) => setFormData({ ...formData, task_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">כללי</SelectItem>
                  <SelectItem value="quote">הצעת מחיר</SelectItem>
                  <SelectItem value="payment_reminder">תזכורת תשלום</SelectItem>
                  <SelectItem value="preparation">הכנת ציוד</SelectItem>
                  <SelectItem value="followup">מעקב</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>עדיפות</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">נמוכה</SelectItem>
                  <SelectItem value="medium">בינונית</SelectItem>
                  <SelectItem value="high">גבוהה</SelectItem>
                  <SelectItem value="urgent">דחוף</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>לקוח קשור</Label>
            <Select value={formData.contact_id} onValueChange={(value) => setFormData({ ...formData, contact_id: value })}>
              <SelectTrigger>
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
            <Label htmlFor="due_date">תאריך יעד</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="btn-accent flex-1"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  שומר...
                </>
              ) : (
                '✅ הוסף משימה'
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
