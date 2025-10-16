
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsApi } from "@/lib/api/deals";
import { Deal } from "@/types/database";
import { toast } from "sonner";

export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: dealsApi.getAll,
  });
};

export const useDeal = (id: string) => {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dealsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success(`✅ העסקה "${data?.title || 'חדשה'}" נוספה בהצלחה! 💼🎉`);
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה ביצירת עסקה: ${error.message || 'אנא נסה שוב'}`);
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Deal> }) => 
      dealsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success(`✅ העסקה "${data?.title || ''}" עודכנה בהצלחה! 🔄`);
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה בעדכון עסקה: ${error.message || 'אנא נסה שוב'}`);
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dealsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('🗑️ העסקה נמחקה בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה במחיקת עסקה: ${error.message || 'לא ניתן למחוק עסקה זו כרגע'}`);
    },
  });
};
