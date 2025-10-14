import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUpcomingEvents } from "@/hooks/useEvents";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export function TodayEventsWidget() {
  const { data: events, isLoading } = useUpcomingEvents(5);

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            📅 אירועים קרובים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">טוען...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          📅 אירועים קרובים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events && events.length > 0 ? (
          events.slice(0, 5).map((event) => (
            <div key={event.id} className="flex justify-between items-start pb-3 border-b last:border-0">
              <div className="flex-1">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {event.event_date && format(new Date(event.event_date), 'dd/MM/yyyy', { locale: he })}
                  {event.event_time && ` • ${event.event_time}`}
                </p>
                {event.location && (
                  <p className="text-xs text-muted-foreground">📍 {event.location}</p>
                )}
              </div>
              <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                {event.status === 'scheduled' ? 'מתוכנן' : 
                 event.status === 'completed' ? 'הושלם' : 
                 event.status === 'cancelled' ? 'בוטל' : event.status}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">אין אירועים קרובים</p>
        )}
      </CardContent>
    </Card>
  );
}
