import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEvents } from '@/hooks/useEvents';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { EventForm } from '@/components/Forms/EventForm';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { BulkActionsToolbar } from '@/components/common/BulkActionsToolbar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function Events() {
  const { data: events, isLoading, error } = useEvents();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const queryClient = useQueryClient();
  
  const safeEvents = Array.isArray(events) ? events : [];
  const { selectedIds, toggleItem, clearSelection, isSelected, count } = useBulkSelection(safeEvents);
  
  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await supabase.from('events').delete().in('id', selectedIds);
      toast.success(`${selectedIds.length} אירועים נמחקו`);
      clearSelection();
      queryClient.invalidateQueries({ queryKey: ['events'] });
    } catch (error) {
      toast.error('שגיאה במחיקה');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <EmptyState
            icon="⚠️"
            title="שגיאה בטעינת אירועים"
            description="אירעה שגיאה בטעינת הנתונים. אנא נסה שוב."
            action={{
              label: "רענן דף",
              onClick: () => window.location.reload()
            }}
          />
        </div>
      </MainLayout>
    );
  }

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const statusLabels = {
    scheduled: 'מתוכנן',
    completed: 'הושלם',
    cancelled: 'בוטל'
  };

  // Simple filtering
  const filteredEvents = safeEvents.filter((event: any) => {
    if (!event) return false;
    
    // Filter by status
    if (filterStatus !== 'all' && event.status !== filterStatus) {
      return false;
    }
    
    // Filter by date range
    if (filterDateFrom && event.event_date) {
      const eventDate = new Date(event.event_date);
      const fromDate = new Date(filterDateFrom);
      if (eventDate < fromDate) return false;
    }
    
    if (filterDateTo && event.event_date) {
      const eventDate = new Date(event.event_date);
      const toDate = new Date(filterDateTo);
      if (eventDate > toDate) return false;
    }
    
    return true;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא נקבע';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('he-IL');
    } catch (e) {
      return 'תאריך לא תקין';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in" dir="rtl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black gradient-text mb-2">📅 אירועים</h1>
            <p className="text-muted-foreground">
              ניהול כל האירועים, אימונים וטיפולים
            </p>
          </div>
          <Button onClick={() => setIsEventFormOpen(true)} className="btn-premium">
            ➕ אירוע חדש
          </Button>
        </div>

        {/* Filters Section */}
        <Card className="premium-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>סטטוס</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="כל הסטטוסים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הסטטוסים</SelectItem>
                    <SelectItem value="scheduled">מתוכנן</SelectItem>
                    <SelectItem value="completed">הושלם</SelectItem>
                    <SelectItem value="cancelled">בוטל</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>מתאריך</Label>
                <Input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label>עד תאריך</Label>
                <Input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {safeEvents.length === 0 ? (
          <EmptyState
            icon="📅"
            title="אין אירועים עדיין"
            description="התחל להוסיף אירועים כדי לעקוב אחר אימונים, טיפולים ומפגשים"
            action={{
              label: "הוסף אירוע ראשון",
              onClick: () => setIsEventFormOpen(true)
            }}
          />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="לא נמצאו אירועים"
            description="נסה לשנות את הסינון או להוסיף אירועים חדשים"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any) => (
              <Card key={event.id} className="premium-card hover-scale cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <Checkbox 
                      checked={isSelected(event.id)} 
                      onCheckedChange={() => toggleItem(event.id)} 
                      onClick={(e) => e.stopPropagation()} 
                    />
                    <CardTitle className="text-xl flex-1">{event.title}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[event.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[event.status as keyof typeof statusLabels] || event.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  {event.event_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{event.event_time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.participants_count > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{event.participants_count} משתתפים</span>
                    </div>
                  )}
                  {event.notes && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {event.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <EventForm
          isOpen={isEventFormOpen}
          onClose={() => {
            setIsEventFormOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
        <BulkActionsToolbar 
          count={count} 
          onDelete={handleBulkDelete} 
          onClear={clearSelection} 
          isDeleting={isBulkDeleting} 
        />
      </div>
    </MainLayout>
  );
}
