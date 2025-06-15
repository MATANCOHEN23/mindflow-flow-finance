
interface OverduePayment {
  id: string;
  clientName: string;
  category: string;
  amount: number;
  daysOverdue: number;
  status: 'pending' | 'partial';
}

const overduePayments: OverduePayment[] = [
  {
    id: '1',
    clientName: 'משה כהן',
    category: 'אימון כדורסל',
    amount: 1200,
    daysOverdue: 5,
    status: 'pending'
  },
  {
    id: '2',
    clientName: 'שרה לוי',
    category: 'טיפול',
    amount: 800,
    daysOverdue: 12,
    status: 'partial'
  },
  {
    id: '3',
    clientName: 'דוד אברהם',
    category: 'יום הולדת',
    amount: 2500,
    daysOverdue: 3,
    status: 'pending'
  },
  {
    id: '4',
    clientName: 'בית ספר השלום',
    category: 'סדנה',
    amount: 1800,
    daysOverdue: 8,
    status: 'partial'
  },
];

export function OverduePayments() {
  return (
    <div className="bg-white gold-border rounded-xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary">תשלומים באיחור</h3>
        <span className="status-badge bg-danger/10 text-danger border-danger/20">
          {overduePayments.length} פריטים
        </span>
      </div>
      
      <div className="space-y-3">
        {overduePayments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold text-gray-900">{payment.clientName}</h4>
                <span className={`status-badge ${
                  payment.status === 'pending' ? 'status-pending' : 'status-partial'
                }`}>
                  {payment.status === 'pending' ? 'ממתין תשלום' : 'תשלום חלקי'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{payment.category}</p>
            </div>
            
            <div className="text-left">
              <p className="font-bold text-lg text-danger">₪{payment.amount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {payment.daysOverdue} ימים באיחור
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg font-medium transition-colors">
          שלח תזכורות WhatsApp
        </button>
      </div>
    </div>
  );
}
