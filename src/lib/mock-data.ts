
import { Contact, Deal, Payment } from "@/types/database";

export const mockContacts: Contact[] = [
  {
    id: '1',
    first_name: 'דני',
    last_name: 'כהן',
    email: 'danny@example.com',
    phone: '050-1234567',
    phone_parent: '050-1234567',
    child_name: 'רון',
    role_tags: ['VIP', 'יום הולדת'],
    notes: 'לקוח מעולה, תמיד משלם בזמן',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    first_name: 'מירי',
    last_name: 'לוי',
    email: 'miri@example.com',
    phone: '052-7654321',
    phone_parent: '052-7654321',
    child_name: 'נועה',
    role_tags: ['טיפול', 'חדש'],
    notes: 'מעוניינת בטיפולים קבועים',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    first_name: 'אבי',
    last_name: 'אברהם',
    email: 'avi@example.com',
    phone: '053-9876543',
    phone_parent: '053-9876543',
    child_name: 'תומר',
    role_tags: ['כדורסל', 'קבוצתי'],
    notes: 'רוצה להקים קבוצת כדורסל',
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    first_name: 'שרה',
    last_name: 'דוד',
    email: 'sarah@example.com',
    phone: '054-5555555',
    phone_parent: '054-5555555',
    child_name: 'מיכל',
    role_tags: ['סדנה', 'בית ספר'],
    notes: 'מנהלת בבית ספר, מעוניינת בסדנאות',
    created_at: '2024-02-10T16:45:00Z',
    updated_at: '2024-02-10T16:45:00Z'
  },
  {
    id: '5',
    first_name: 'יוסי',
    last_name: 'אליה',
    email: 'yossi@example.com',
    phone: '055-1111111',
    phone_parent: '055-1111111',
    child_name: 'דן',
    role_tags: ['יום הולדת', 'פרימיום'],
    notes: 'מחפש חוויה מיוחדת ליום הולדת',
    created_at: '2024-02-15T11:20:00Z',
    updated_at: '2024-02-15T11:20:00Z'
  }
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    contact_id: '1',
    title: 'יום הולדת 8 - רון כהן',
    category: 'יום הולדת',
    package_type: 'פרימיום',
    amount_total: 2500,
    amount_paid: 1000,
    payment_status: 'partial',
    workflow_stage: 'contract',
    next_action_date: '2024-03-15',
    notes: 'יום הולדת מיוחד עם פעילויות נוספות',
    custom_fields: {
      participants: 15,
      venue: 'הבית',
      special_requests: 'עוגה מיוחדת'
    },
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-10T15:30:00Z'
  },
  {
    id: '2',
    contact_id: '2',
    title: 'טיפול קבוע - נועה לוי',
    category: 'טיפול',
    package_type: 'חודשי',
    amount_total: 1200,
    amount_paid: 1200,
    payment_status: 'paid',
    workflow_stage: 'completed',
    notes: 'טיפול התפתחותי שבועי',
    custom_fields: {
      sessions_per_month: 4,
      duration: '45 דקות',
      focus_area: 'תקשורת'
    },
    created_at: '2024-01-15T14:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },
  {
    id: '3',
    contact_id: '3',
    title: 'אימוני כדורסל קבוצתיים',
    category: 'כדורסל',
    package_type: 'שנתי',
    amount_total: 5000,
    amount_paid: 0,
    payment_status: 'pending',
    workflow_stage: 'lead',
    next_action_date: '2024-03-01',
    notes: 'קבוצה של 10 ילדים, גילאי 8-10',
    custom_fields: {
      team_size: 10,
      training_days: 'רביעי + ראשון',
      season_duration: '8 חודשים'
    },
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-02-20T09:00:00Z'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    deal_id: '1',
    amount: 500,
    payment_date: '2024-02-01',
    payment_method: 'credit_card',
    is_deposit: true,
    notes: 'מקדמה ליום הולדת',
    created_at: '2024-02-01T10:30:00Z'
  },
  {
    id: '2',
    deal_id: '1',
    amount: 500,
    payment_date: '2024-02-10',
    payment_method: 'bank_transfer',
    is_deposit: false,
    notes: 'תשלום חלקי נוסף',
    created_at: '2024-02-10T15:45:00Z'
  },
  {
    id: '3',
    deal_id: '2',
    amount: 1200,
    payment_date: '2024-01-15',
    payment_method: 'cash',
    is_deposit: false,
    notes: 'תשלום מלא טיפולים',
    created_at: '2024-01-15T14:15:00Z'
  }
];

export const getDashboardStats = () => {
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const activeClients = mockContacts.length;
  const openDeals = mockDeals.filter(deal => deal.payment_status !== 'paid').length;
  const pendingPayments = mockDeals
    .filter(deal => deal.payment_status === 'pending')
    .reduce((sum, deal) => sum + deal.amount_total, 0);

  return {
    monthlyRevenue: totalRevenue,
    activeClients,
    openDeals,
    pendingPayments,
    trends: {
      revenue: { value: 12, isPositive: true },
      clients: { value: 8, isPositive: true },
      deals: { value: 3, isPositive: false },
      payments: { value: 15, isPositive: false }
    }
  };
};
