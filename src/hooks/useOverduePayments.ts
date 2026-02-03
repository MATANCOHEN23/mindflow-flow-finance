import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays } from 'date-fns';

export interface OverduePayment {
  id: string;
  clientName: string;
  clientPhone: string | null;
  dealTitle: string;
  category: string;
  amountTotal: number;
  amountPaid: number;
  amountPending: number;
  daysOverdue: number;
  dueDate: string;
  paymentStatus: '✅' | '🟧' | '❌';
}

async function fetchOverduePayments(): Promise<OverduePayment[]> {
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch payments that are overdue (due_date < today AND status != 'paid')
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      status,
      due_date,
      deal_id,
      contact_id,
      deals:deal_id (
        title,
        category,
        amount_total,
        amount_paid,
        contacts:contact_id (
          first_name,
          last_name,
          phone,
          phone_parent
        )
      ),
      contact:contact_id (
        first_name,
        last_name,
        phone,
        phone_parent
      )
    `)
    .lt('due_date', today)
    .neq('status', 'paid')
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching overdue payments:', error);
    throw error;
  }

  if (!payments || payments.length === 0) {
    return [];
  }

  return payments.map((payment) => {
    const deal = payment.deals as any;
    const contact = payment.contact as any || deal?.contacts;
    
    const clientName = contact 
      ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() 
      : 'לקוח לא ידוע';
    
    const clientPhone = contact?.phone || contact?.phone_parent || null;
    const dealTitle = deal?.title || 'עסקה לא מזוהה';
    const category = deal?.category || 'כללי';
    
    const amountTotal = deal?.amount_total || payment.amount;
    const amountPaid = deal?.amount_paid || 0;
    const amountPending = payment.amount;
    
    const dueDate = payment.due_date || today;
    const daysOverdue = differenceInDays(new Date(), new Date(dueDate));
    
    // Determine payment status
    let paymentStatus: '✅' | '🟧' | '❌';
    if (payment.status === 'paid') {
      paymentStatus = '✅';
    } else if (amountPaid > 0) {
      paymentStatus = '🟧';
    } else {
      paymentStatus = '❌';
    }

    return {
      id: payment.id,
      clientName,
      clientPhone,
      dealTitle,
      category,
      amountTotal,
      amountPaid,
      amountPending,
      daysOverdue: Math.max(0, daysOverdue),
      dueDate,
      paymentStatus,
    };
  });
}

export function useOverduePayments() {
  return useQuery({
    queryKey: ['overdue-payments'],
    queryFn: fetchOverduePayments,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
