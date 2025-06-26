
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
      id: deal.id,
      contact_id: deal.contact_id || undefined,
      title: deal.title,
      category: deal.category || undefined,
      package_type: deal.package_type || undefined,
      amount_total: deal.amount_total || 0,
      amount_paid: deal.amount_paid || 0,
      payment_status: (deal.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      workflow_stage: deal.workflow_stage || undefined,
      next_action_date: deal.next_action_date || undefined,
      notes: deal.notes || undefined,
      custom_fields: (deal.custom_fields as Record<string, any>) || {},
      created_at: deal.created_at || new Date().toISOString(),
      updated_at: deal.updated_at || new Date().toISOString()
    } as Deal));
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
    
    return data ? ({
      id: data.id,
      contact_id: data.contact_id || undefined,
      title: data.title,
      category: data.category || undefined,
      package_type: data.package_type || undefined,
      amount_total: data.amount_total || 0,
      amount_paid: data.amount_paid || 0,
      payment_status: (data.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      workflow_stage: data.workflow_stage || undefined,
      next_action_date: data.next_action_date || undefined,
      notes: data.notes || undefined,
      custom_fields: (data.custom_fields as Record<string, any>) || {},
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    } as Deal) : null;
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
      id: data.id,
      contact_id: data.contact_id || undefined,
      title: data.title,
      category: data.category || undefined,
      package_type: data.package_type || undefined,
      amount_total: data.amount_total || 0,
      amount_paid: data.amount_paid || 0,
      payment_status: (data.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      workflow_stage: data.workflow_stage || undefined,
      next_action_date: data.next_action_date || undefined,
      notes: data.notes || undefined,
      custom_fields: (data.custom_fields as Record<string, any>) || {},
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    } as Deal;
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
      id: data.id,
      contact_id: data.contact_id || undefined,
      title: data.title,
      category: data.category || undefined,
      package_type: data.package_type || undefined,
      amount_total: data.amount_total || 0,
      amount_paid: data.amount_paid || 0,
      payment_status: (data.payment_status as 'pending' | 'partial' | 'paid') || 'pending',
      workflow_stage: data.workflow_stage || undefined,
      next_action_date: data.next_action_date || undefined,
      notes: data.notes || undefined,
      custom_fields: (data.custom_fields as Record<string, any>) || {},
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    } as Deal;
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
