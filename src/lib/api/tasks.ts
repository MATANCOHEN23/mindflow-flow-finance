import { supabase } from '@/integrations/supabase/client';

export const tasksApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByContact(contactId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('contact_id', contactId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', status)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getTodayTasks() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('due_date', today)
      .in('status', ['pending', 'in_progress'])
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(task: any) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, task: any) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...task, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
