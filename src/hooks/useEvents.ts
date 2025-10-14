import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events';
import { toast } from 'sonner';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventsApi.getAll
  });
}

export function useEventsByContact(contactId: string) {
  return useQuery({
    queryKey: ['events', 'contact', contactId],
    queryFn: () => eventsApi.getByContact(contactId),
    enabled: !!contactId
  });
}

export function useUpcomingEvents(limit?: number) {
  return useQuery({
    queryKey: ['events', 'upcoming', limit],
    queryFn: () => eventsApi.getUpcoming(limit)
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('✅ האירוע נוסף בהצלחה!');
    },
    onError: (error: any) => {
      toast.error('❌ שגיאה ביצירת אירוע: ' + error.message);
    }
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => eventsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('✅ האירוע עודכן בהצלחה!');
    },
    onError: (error: any) => {
      toast.error('❌ שגיאה בעדכון אירוע: ' + error.message);
    }
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('✅ האירוע נמחק בהצלחה!');
    },
    onError: (error: any) => {
      toast.error('❌ שגיאה במחיקת אירוע: ' + error.message);
    }
  });
}
