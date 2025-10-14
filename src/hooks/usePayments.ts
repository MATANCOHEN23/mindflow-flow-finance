import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi, PaymentWithDetails } from "@/lib/api/payments";
import { Payment } from "@/types/database";
import { toast } from "sonner";

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentsApi.getAll,
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('התשלום נוסף בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) => 
      paymentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('התשלום עודכן בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('התשלום נמחק בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};
