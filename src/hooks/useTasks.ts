import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api/tasks';
import { toast } from 'sonner';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll
  });
}

export function useTasksByContact(contactId: string) {
  return useQuery({
    queryKey: ['tasks', 'contact', contactId],
    queryFn: () => tasksApi.getByContact(contactId),
    enabled: !!contactId
  });
}

export function useTasksByStatus(status: string) {
  return useQuery({
    queryKey: ['tasks', 'status', status],
    queryFn: () => tasksApi.getByStatus(status),
    enabled: !!status
  });
}

export function useTodayTasks() {
  return useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: tasksApi.getTodayTasks
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('✅ המשימה נוספה בהצלחה!');
    },
    onError: (error: any) => {
      toast.error('❌ שגיאה ביצירת משימה: ' + error.message);
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('✅ המשימה עודכנה בהצלחה!');
    },
    onError: (error: any) => {
      toast.error('❌ שגיאה בעדכון משימה: ' + error.message);
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('✅ המשימה נמחקה בהצלחה!');
    },
    onError: (error: any) => {
      toast.error('❌ שגיאה במחיקת משימה: ' + error.message);
    }
  });
}
