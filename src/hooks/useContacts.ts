
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseWithFallback } from "@/lib/supabase-with-fallback";
import { Contact } from "@/types/database";
import { toast } from "sonner";

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabaseWithFallback.getContacts();
      if (error) throw error;
      return data || [];
    },
  });
};

export const useContact = (id: string) => {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
      const { data, error } = await supabaseWithFallback.getContactById(id);
      if (error) {
        console.error('Error fetching contact:', error);
        return null;
      }
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabaseWithFallback.createContact(contactData);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      const fullName = `${data?.first_name} ${data?.last_name || ''}`.trim();
      toast.success(`✅ הלקוח ${fullName} נוסף בהצלחה! 🎉`);
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה בהוספת לקוח: ${error.message || 'אנא נסה שוב'}`);
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Contact> }) => {
      const result = await supabaseWithFallback.updateContact(id, data);
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      const fullName = `${data?.first_name || ''} ${data?.last_name || ''}`.trim();
      toast.success(`✅ הלקוח ${fullName || 'עודכן'} עודכן בהצלחה! 🔄`);
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה בעדכון לקוח: ${error.message || 'אנא נסה שוב'}`);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseWithFallback.deleteContact(id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('🗑️ הלקוח נמחק בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`❌ שגיאה במחיקת לקוח: ${error.message || 'לא ניתן למחוק לקוח זה כרגע'}`);
    },
  });
};
