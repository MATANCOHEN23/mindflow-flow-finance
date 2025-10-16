import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents';
import { useDeals } from '@/hooks/useDeals';
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
}

export function EventForm({ isOpen, onClose, event }: EventFormProps) {
  const { data: deals } = useDeals();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  
  const [formData, setFormData] = useState({
    title: '',
    deal_id: '',
    contact_id: '',
    event_date: '',
    event_time: '',
    location: '',
    participants_count: '0',
    staff_assigned: [] as string[],
    status: 'scheduled',
    notes: '',
    extras: {}
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        deal_id: event.deal_id || '',
        contact_id: event.contact_id || '',
        event_date: event.event_date || '',
        event_time: event.event_time || '',
        location: event.location || '',
        participants_count: event.participants_count?.toString() || '0',
        staff_assigned: event.staff_assigned || [],
        status: event.status || 'scheduled',
        notes: event.notes || '',
        extras: event.extras || {}
      });
    } else {
      setFormData({
        title: '',
        deal_id: '',
        contact_id: '',
        event_date: '',
        event_time: '',
        location: '',
        participants_count: '0',
        staff_assigned: [],
        status: 'scheduled',
        notes: '',
        extras: {}
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('נא להזין כותרת לאירוע');
      return;
    }
    
    if (!formData.event_date) {
      toast.error('נא לבחור תאריך לאירוע');
      return;
    }
    
    const participantsCount = parseInt(formData.participants_count) || 0;
    if (participantsCount < 0) {
      toast.error('מספר המשתתפים חייב להיות חיובי');
      return;
    }
    
    const eventData = {
      ...formData,
      deal_id: formData.deal_id || null,
      contact_id: formData.contact_id || null,
      participants_count: participantsCount
    };

    if (event) {
      await updateEvent.mutateAsync({ id: event.id, data: eventData });
    } else {
      await createEvent.mutateAsync(eventData as any);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="premium-card max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text text-center">
            {event ? '✏️ עריכת אירוע' : '📅 אירוע חדש'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">כותרת האירוע *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="למשל: אימון כדורסל - נווה עוז"
              required
            />
          </div>

          <div>
            <Label>עסקה קשורה</Label>
            <Select value={formData.deal_id} onValueChange={(value) => setFormData({ ...formData, deal_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר עסקה" />
              </SelectTrigger>
              <SelectContent>
                {deals?.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date">תאריך *</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="event_time">שעה</Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">מיקום</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="למשל: נווה עוז - אולם ספורט"
            />
          </div>

          <div>
            <Label htmlFor="participants_count">מספר משתתפים</Label>
            <Input
              id="participants_count"
              type="number"
              value={formData.participants_count}
              onChange={(e) => setFormData({ ...formData, participants_count: e.target.value })}
              min="0"
            />
          </div>

          <div>
            <Label>סטטוס</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">מתוכנן</SelectItem>
                <SelectItem value="completed">הושלם</SelectItem>
                <SelectItem value="cancelled">בוטל</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">הערות</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="הערות נוספות..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="btn-accent flex-1"
              disabled={createEvent.isPending || updateEvent.isPending}
            >
              {(createEvent.isPending || updateEvent.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  שומר...
                </>
              ) : (
                event ? '✅ עדכן אירוע' : '✅ הוסף אירוע'
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
