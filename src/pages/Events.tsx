import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from '@/hooks/useEvents';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { PremiumLoader } from '@/components/PremiumLoader';
import { EmptyState } from '@/components/EmptyState';
import { EventForm } from '@/components/Forms/EventForm';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function Events() {
  const { data: events, isLoading } = useEvents();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PremiumLoader size="lg" />
      </div>
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

  return (
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

      {!events || events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="אין אירועים עדיין"
          description="התחל להוסיף אירועים כדי לעקוב אחר אימונים, טיפולים ומפגשים"
          action={{
            label: "הוסף אירוע ראשון",
            onClick: () => setIsEventFormOpen(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <Card key={event.id} className="premium-card hover-scale cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[event.status as keyof typeof statusColors]}`}>
                    {statusLabels[event.status as keyof typeof statusLabels]}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy', { locale: he }) : 'לא נקבע'}</span>
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
    </div>
  );
}
