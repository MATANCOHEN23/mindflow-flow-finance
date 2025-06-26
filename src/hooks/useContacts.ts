
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
      const { data } = await supabaseWithFallback.getContacts();
      return data?.find(contact => contact.id === id) || null;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('הלקוח נוסף בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('הלקוח עודכן בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseWithFallback.deleteContact(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('הלקוח נמחק בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
