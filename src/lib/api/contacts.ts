
import { supabase } from "@/integrations/supabase/client";
import { Contact } from "@/types/database";

export const contactsApi = {
  async getAll(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      throw new Error(`שגיאה בטעינת הלקוחות: ${error.message}`);
    }
    
    return data || [];
  },

  async getById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching contact:', error);
      throw new Error(`שגיאה בטעינת הלקוח: ${error.message}`);
    }
    
    return data;
  },

  async create(contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact:', error);
      throw new Error(`שגיאה ביצירת הלקוח: ${error.message}`);
    }
    
    return data;
  },

  async update(id: string, contactData: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update({ ...contactData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating contact:', error);
      throw new Error(`שגיאה בעדכון הלקוח: ${error.message}`);
    }
    
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting contact:', error);
      throw new Error(`שגיאה במחיקת הלקוח: ${error.message}`);
    }
  }
};
