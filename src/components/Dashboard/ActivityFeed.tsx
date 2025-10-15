import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContacts } from '@/hooks/useContacts';
import { useDeals } from '@/hooks/useDeals';
import { usePayments } from '@/hooks/usePayments';
import { useEvents } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

export function ActivityFeed() {
  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const { data: payments } = usePayments();
  const { data: events } = useEvents();

  // Create activity timeline
  const activities = [
    ...(contacts?.slice(0, 3).map(c => ({
      id: `contact-${c.id}`,
      type: 'contact',
      icon: '👤',
      title: 'לקוח חדש נוסף',
      description: `${c.first_name} ${c.last_name || ''}`,
      timestamp: new Date(c.created_at),
      color: 'bg-blue-50 border-blue-200'
    })) || []),
    ...(payments?.slice(0, 3).map(p => ({
      id: `payment-${p.id}`,
      type: 'payment',
      icon: '💰',
      title: 'תשלום התקבל',
      description: `₪${p.amount.toLocaleString()}`,
      timestamp: new Date(p.created_at),
      color: 'bg-green-50 border-green-200'
    })) || []),
    ...(events?.slice(0, 2).map(e => ({
      id: `event-${e.id}`,
      type: 'event',
      icon: '📅',
      title: 'אירוע מתוכנן',
      description: e.title,
      timestamp: new Date(e.created_at),
      color: 'bg-purple-50 border-purple-200'
    })) || []),
    ...(deals?.slice(0, 2).map(d => ({
      id: `deal-${d.id}`,
      type: 'deal',
      icon: '💼',
      title: 'עסקה חדשה',
      description: d.title,
      timestamp: new Date(d.created_at),
      color: 'bg-orange-50 border-orange-200'
    })) || []),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  if (!contacts && !deals && !payments && !events) {
    return (
      <Card className="bg-white shadow-lg border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 פעילות אחרונה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border-2 border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📊 פעילות אחרונה
          </CardTitle>
          <Badge variant="secondary">{activities.length} פעולות</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border-2 ${activity.color} hover:shadow-md transition-shadow duration-200`}
              >
                <span className="text-2xl flex-shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-700 truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(activity.timestamp, 'dd/MM/yyyy HH:mm', { locale: he })}
                  </p>
                </div>
                <Badge variant="outline" className="flex-shrink-0">
                  {activity.type === 'contact' ? 'לקוח' : 
                   activity.type === 'payment' ? 'תשלום' :
                   activity.type === 'event' ? 'אירוע' : 'עסקה'}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              אין פעילות להצגה
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
