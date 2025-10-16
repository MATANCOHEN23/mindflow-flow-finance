
import { supabase } from "@/integrations/supabase/client";

class SupabaseWithFallback {
  async getContacts() {
    const result = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    return result;
  }

  async getDeals() {
    const result = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
    
    return result;
  }

  async getPayments() {
    const result = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    
    return result;
  }

  async createContact(contactData: any) {
    return await supabase.from('contacts').insert([contactData]).select().single();
  }

  async createDeal(dealData: any) {
    return await supabase.from('deals').insert([dealData]).select().single();
  }

  async updateContact(id: string, contactData: any) {
    return await supabase
      .from('contacts')
      .update({ ...contactData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  }

  async deleteContact(id: string) {
    return await supabase.from('contacts').delete().eq('id', id);
  }

  async getContactById(id: string) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  async checkEmailExists(email: string): Promise<boolean> {
    if (!email || !email.trim()) return false;
    
    const { data, error } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .limit(1);
    
    return !error && data && data.length > 0;
  }
}

export const supabaseWithFallback = new SupabaseWithFallback();
