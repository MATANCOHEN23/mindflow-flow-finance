import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  name_he: string;
  icon: string | null;
  color: string | null;
  is_active: boolean | null;
  order_index: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(`שגיאה בטעינת הקטגוריות: ${error.message}`);
      }

      return data || [];
    }
  });

  const createCategory = useMutation({
    mutationFn: async (newCategory: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        throw new Error(`שגיאה ביצירת קטגוריה: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`הקטגוריה "${data.name_he}" נוצרה בהצלחה ✅`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Category> & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`שגיאה בעדכון קטגוריה: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`הקטגוריה "${data.name_he}" עודכנה בהצלחה ✅`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      // Soft delete - set is_active to false
      const { error } = await supabase
        .from('categories')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(`שגיאה במחיקת קטגוריה: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('הקטגוריה נמחקה בהצלחה ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };

  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find(cat => cat.name === name);
  };

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryByName
  };
};
