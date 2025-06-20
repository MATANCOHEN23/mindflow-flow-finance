
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types/database";

export const paymentsApi = {
  async getAll(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching payments:', error);
      throw new Error(`שגיאה בטעינת התשלומים: ${error.message}`);
    }
    
    return data || [];
  },

  async getByDealId(dealId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('deal_id', dealId)
      .order('payment_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching payments for deal:', error);
      throw new Error(`שגיאה בטעינת תשלומי העסקה: ${error.message}`);
    }
    
    return data || [];
  },

  async create(paymentData: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment:', error);
      throw new Error(`שגיאה ביצירת התשלום: ${error.message}`);
    }
    
    return data;
  },

  async update(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update(paymentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment:', error);
      throw new Error(`שגיאה בעדכון התשלום: ${error.message}`);
    }
    
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting payment:', error);
      throw new Error(`שגיאה במחיקת התשלום: ${error.message}`);
    }
  }
};
