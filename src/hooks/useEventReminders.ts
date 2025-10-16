import { useEffect } from 'react';
import { useEvents } from './useEvents';
import { usePayments } from './usePayments';
import { toast } from 'sonner';
import { differenceInDays, isPast, parseISO, isToday } from 'date-fns';

export function useEventReminders() {
  const { data: events } = useEvents();
  const { data: payments } = usePayments();

  useEffect(() => {
    if (!events || events.length === 0) return;

    const checkUpcomingEvents = () => {
      const now = new Date();
      
      events.forEach((event: any) => {
        if (!event.event_date || event.status !== 'scheduled') return;
        
        const eventDate = parseISO(event.event_date);
        const daysUntil = differenceInDays(eventDate, now);
        
        // Show reminder for events in the next 7 days
        if (daysUntil >= 0 && daysUntil <= 7) {
          const eventKey = `event-reminder-${event.id}-${event.event_date}`;
          const alreadyShown = sessionStorage.getItem(eventKey);
          
          if (!alreadyShown) {
            let message = '';
            if (isToday(eventDate)) {
              message = `🔔 אירוע היום: ${event.title}`;
            } else if (daysUntil === 1) {
              message = `🔔 אירוע מחר: ${event.title}`;
            } else {
              message = `🔔 אירוע בעוד ${daysUntil} ימים: ${event.title}`;
            }
            
            toast.info(message, {
              duration: 6000,
              action: {
                label: 'הבנתי',
                onClick: () => {}
              }
            });
            
            sessionStorage.setItem(eventKey, 'true');
          }
        }
      });
    };

    checkUpcomingEvents();
    
    // Check every 30 minutes
    const interval = setInterval(checkUpcomingEvents, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [events]);

  useEffect(() => {
    if (!payments || payments.length === 0) return;

    const checkOverduePayments = () => {
      const now = new Date();
      
      payments.forEach((payment: any) => {
        if (payment.status !== 'pending' && payment.status !== 'overdue') return;
        if (!payment.due_date) return;
        
        const dueDate = parseISO(payment.due_date);
        
        if (isPast(dueDate) && !isToday(dueDate)) {
          const paymentKey = `payment-overdue-${payment.id}`;
          const alreadyShown = sessionStorage.getItem(paymentKey);
          
          if (!alreadyShown) {
            const daysOverdue = Math.abs(differenceInDays(now, dueDate));
            
            toast.error(
              `⚠️ תשלום באיחור של ${daysOverdue} ימים - ${payment.amount}₪`,
              {
                duration: 8000,
                action: {
                  label: 'צפה בתשלומים',
                  onClick: () => {
                    window.location.href = '/payments';
                  }
                }
              }
            );
            
            sessionStorage.setItem(paymentKey, 'true');
          }
        }
      });
    };

    checkOverduePayments();
    
    // Check every 30 minutes
    const interval = setInterval(checkOverduePayments, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [payments]);
}
