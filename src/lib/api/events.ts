import { supabase } from '@/integrations/supabase/client';

export const eventsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByContact(contactId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('contact_id', contactId)
      .order('event_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getByDeal(dealId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('deal_id', dealId)
      .order('event_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getUpcoming(limit = 10) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .eq('status', 'scheduled')
      .order('event_date', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async create(event: any) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, event: any) {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
