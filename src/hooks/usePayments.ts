import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi, PaymentWithDetails } from "@/lib/api/payments";
import { Payment } from "@/types/database";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

export const usePaymentsByContact = (contactId: string) => {
  return useQuery({
    queryKey: ['payments', 'contact', contactId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('contact_id', contactId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!contactId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      const amount = data?.amount ? `₪${data.amount.toLocaleString('he-IL')}` : '';
      toast.success(`✅ תשלום של ${amount} נוסף בהצלחה! 💰🎉`);
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה ביצירת תשלום: ${error.message || 'אנא נסה שוב'}`);
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) => 
      paymentsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      const amount = data?.amount ? `₪${data.amount.toLocaleString('he-IL')}` : '';
      toast.success(`✅ תשלום של ${amount} עודכן בהצלחה! 🔄`);
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה בעדכון תשלום: ${error.message || 'אנא נסה שוב'}`);
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
      toast.success('🗑️ התשלום נמחק בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה במחיקת תשלום: ${error.message || 'לא ניתן למחוק תשלום זה כרגע'}`);
    },
  });
};
