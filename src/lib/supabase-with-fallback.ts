
import { supabase } from "@/integrations/supabase/client";
import { mockContacts, mockDeals, mockPayments } from "./mock-data";

class SupabaseWithFallback {
  private useMockData = false;

  async testConnection() {
    try {
      const { data, error } = await supabase.from('contacts').select('id').limit(1);
      if (error) throw error;
      this.useMockData = false;
      return true;
    } catch (error) {
      console.warn('Supabase connection failed, using mock data:', error);
      this.useMockData = true;
      return false;
    }
  }

  async getContacts() {
    if (this.useMockData) {
      return { data: mockContacts, error: null };
    }

    try {
      const result = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) throw result.error;
      return result;
    } catch (error) {
      console.warn('Falling back to mock contacts data:', error);
      return { data: mockContacts, error: null };
    }
  }

  async getDeals() {
    if (this.useMockData) {
      return { data: mockDeals, error: null };
    }

    try {
      const result = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) throw result.error;
      return result;
    } catch (error) {
      console.warn('Falling back to mock deals data:', error);
      return { data: mockDeals, error: null };
    }
  }

  async getPayments() {
    if (this.useMockData) {
      return { data: mockPayments, error: null };
    }

    try {
      const result = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) throw result.error;
      return result;
    } catch (error) {
      console.warn('Falling back to mock payments data:', error);
      return { data: mockPayments, error: null };
    }
  }

  async createContact(contactData: any) {
    if (this.useMockData) {
      const newContact = {
        id: Date.now().toString(),
        ...contactData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockContacts.unshift(newContact);
      return { data: newContact, error: null };
    }

    return await supabase.from('contacts').insert([contactData]).select().single();
  }

  async createDeal(dealData: any) {
    if (this.useMockData) {
      const newDeal = {
        id: Date.now().toString(),
        ...dealData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockDeals.unshift(newDeal);
      return { data: newDeal, error: null };
    }

    return await supabase.from('deals').insert([dealData]).select().single();
  }

  async updateContact(id: string, contactData: any) {
    if (this.useMockData) {
      const index = mockContacts.findIndex(c => c.id === id);
      if (index !== -1) {
        mockContacts[index] = { ...mockContacts[index], ...contactData, updated_at: new Date().toISOString() };
        return { data: mockContacts[index], error: null };
      }
      return { data: null, error: new Error('Contact not found') };
    }

    return await supabase
      .from('contacts')
      .update({ ...contactData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  }

  async deleteContact(id: string) {
    if (this.useMockData) {
      const index = mockContacts.findIndex(c => c.id === id);
      if (index !== -1) {
        mockContacts.splice(index, 1);
        return { error: null };
      }
      return { error: new Error('Contact not found') };
    }

    return await supabase.from('contacts').delete().eq('id', id);
  }

  async getContactById(id: string) {
    if (this.useMockData) {
      const contact = mockContacts.find(c => c.id === id);
      return { data: contact || null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.warn('Error fetching contact by id:', error);
      return { data: null, error };
    }
  }
}

export const supabaseWithFallback = new SupabaseWithFallback();

// Initialize connection test
supabaseWithFallback.testConnection();
