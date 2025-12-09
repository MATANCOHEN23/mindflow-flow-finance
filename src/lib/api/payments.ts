import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types/database";

export interface PaymentWithDetails extends Omit<Payment, 'due_date' | 'status'> {
  contact_name?: string;
  deal_title?: string;
  due_date?: string | null;
  status?: 'pending' | 'paid' | 'overdue';
}

export const paymentsApi = {
  async getAll(): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        deals:deal_id (
          title,
          contacts:contact_id (
            first_name,
            last_name
          )
        ),
        contact:contact_id (
          first_name,
          last_name
        )
      `)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw new Error(`שגיאה בטעינת התשלומים: ${error.message}`);
    }

    // Map the data to include contact name and deal title
    return (data || []).map(payment => {
      const deal = payment.deals as any;
      const dealContact = deal?.contacts as any;
      const directContact = payment.contact as any;
      
      // Priority: direct contact_id > deal's contact
      const contactInfo = directContact || dealContact;
      
      return {
        ...payment,
        status: (payment.status || 'pending') as 'pending' | 'paid' | 'overdue',
        deal_title: deal?.title || 'ללא עסקה',
        contact_name: contactInfo 
          ? `${contactInfo.first_name} ${contactInfo.last_name || ''}`.trim()
          : 'ללא לקוח'
      } as PaymentWithDetails;
    });
  },

  async getById(id: string): Promise<PaymentWithDetails | null> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        deals:deal_id (
          title,
          contacts:contact_id (
            first_name,
            last_name
          )
        ),
        contact:contact_id (
          first_name,
          last_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching payment:', error);
      throw new Error(`שגיאה בטעינת התשלום: ${error.message}`);
    }

    const deal = data.deals as any;
    const dealContact = deal?.contacts as any;
    const directContact = data.contact as any;
    const contactInfo = directContact || dealContact;

    return {
      ...data,
      status: (data.status || 'pending') as 'pending' | 'paid' | 'overdue',
      deal_title: deal?.title || 'ללא עסקה',
      contact_name: contactInfo 
        ? `${contactInfo.first_name} ${contactInfo.last_name || ''}`.trim()
        : 'ללא לקוח'
    } as PaymentWithDetails;
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
