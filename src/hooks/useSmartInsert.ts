
import { supabase } from "@/integrations/supabase/client";
import { Contact, Deal } from "@/types/database";
import { toast } from "sonner";

export interface SmartInsertOptions {
  table: string;
  values: any;
  onSuccess?: (data: any) => void;
}

export const useSmartInsert = () => {
  const smartInsert = async ({ table, values, onSuccess }: SmartInsertOptions) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(values)
        .select()
        .single();
      
      if (error) throw error;

      // Smart routing logic
      if (table === 'contacts' && values.role_tags?.includes('מטופל')) {
        toast.success(`מטופל חדש נוסף: ${values.first_name} 🏥`);
        // Trigger patients view refresh
        window.dispatchEvent(new CustomEvent('refreshPatients', { detail: data }));
      }

      if (table === 'contacts' && values.role_tags?.includes('שחקן כדורסל')) {
        toast.success(`שחקן כדורסל חדש נוסף: ${values.first_name} 🏀`);
        // Trigger basketball view refresh
        window.dispatchEvent(new CustomEvent('refreshBasketball', { detail: data }));
      }

      if (table === 'deals') {
        toast.success(`עסקה חדשה נוספה: ${values.title} 💼`);
        // Trigger deals view refresh
        window.dispatchEvent(new CustomEvent('refreshDeals', { detail: data }));
      }

      onSuccess?.(data);
      return data;
    } catch (error) {
      console.error('Smart insert error:', error);
      toast.error(`שגיאה בהוספת ${table}: ${error.message}`);
      throw error;
    }
  };

  const bulkInsert = async (table: string, rows: any[]) => {
    try {
      const results = [];
      for (const row of rows) {
        const result = await smartInsert({ table, values: row });
        results.push(result);
      }
      toast.success(`${results.length} רשומות נוספו בהצלחה! ✨`);
      return results;
    } catch (error) {
      console.error('Bulk insert error:', error);
      throw error;
    }
  };

  return { smartInsert, bulkInsert };
};
