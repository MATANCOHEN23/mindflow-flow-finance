
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/database";

export const dealsApi = {
  async getAll(): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching deals:', error);
      throw new Error(`שגיאה בטעינת העסקאות: ${error.message}`);
    }
    
    return (data || []).map(deal => ({
      ...deal,
      payment_status: (deal.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      custom_fields: (deal.custom_fields as Record<string, any>) || {},
      amount_total: deal.amount_total || 0,
      amount_paid: deal.amount_paid || 0,
      created_at: deal.created_at || new Date().toISOString(),
      updated_at: deal.updated_at || new Date().toISOString()
    }));
  },

  async getById(id: string): Promise<Deal | null> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching deal:', error);
      throw new Error(`שגיאה בטעינת העסקה: ${error.message}`);
    }
    
    return data ? {
      ...data,
      payment_status: (data.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      custom_fields: (data.custom_fields as Record<string, any>) || {},
      amount_total: data.amount_total || 0,
      amount_paid: data.amount_paid || 0,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    } : null;
  },

  async create(dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating deal:', error);
      throw new Error(`שגיאה ביצירת העסקה: ${error.message}`);
    }
    
    return {
      ...data,
      payment_status: (data.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      custom_fields: (data.custom_fields as Record<string, any>) || {},
      amount_total: data.amount_total || 0,
      amount_paid: data.amount_paid || 0,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  },

  async update(id: string, dealData: Partial<Deal>): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .update({ ...dealData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating deal:', error);
      throw new Error(`שגיאה בעדכון העסקה: ${error.message}`);
    }
    
    return {
      ...data,
      payment_status: (data.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      custom_fields: (data.custom_fields as Record<string, any>) || {},
      amount_total: data.amount_total || 0,
      amount_paid: data.amount_paid || 0,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting deal:', error);
      throw new Error(`שגיאה במחיקת העסקה: ${error.message}`);
    }
  }
};
