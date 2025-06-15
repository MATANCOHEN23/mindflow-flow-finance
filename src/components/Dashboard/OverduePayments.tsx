
interface OverduePayment {
  id: string;
  clientName: string;
  category: string;
  amountTotal: number;
  amountPaid: number;
  daysOverdue: number;
  paymentStatus: '✅' | '⚠️' | '❌';
}

const overduePayments: OverduePayment[] = [
  {
    id: '1',
    clientName: 'משה כהן',
    category: 'אימון כדורסל',
    amountTotal: 1200,
    amountPaid: 0,
    daysOverdue: 5,
    paymentStatus: '❌'
  },
  {
    id: '2',
    clientName: 'שרה לוי',
    category: 'טיפול',
    amountTotal: 800,
    amountPaid: 400,
    daysOverdue: 12,
    paymentStatus: '⚠️'
  },
  {
    id: '3',
    clientName: 'דוד אברהם',
    category: 'יום הולדת',
    amountTotal: 2500,
    amountPaid: 0,
    daysOverdue: 3,
    paymentStatus: '❌'
  },
  {
    id: '4',
    clientName: 'בית ספר השלום',
    category: 'סדנה',
    amountTotal: 1800,
    amountPaid: 900,
    daysOverdue: 8,
    paymentStatus: '⚠️'
  },
];

export function OverduePayments() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case '✅': return 'status-paid';
      case '⚠️': return 'status-partial';
      case '❌': return 'status-pending';
      default: return 'status-pending';
    }
  };

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
          <div key={payment.id} className="flex items-center justify-between p-4 bg-neutralBG/50 rounded-lg hover:bg-skyBlue/10 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold text-gray-900">{payment.clientName}</h4>
                <span className={`status-badge ${getStatusClass(payment.paymentStatus)}`}>
                  {payment.paymentStatus} {payment.paymentStatus === '✅' ? 'שולם' : 
                   payment.paymentStatus === '⚠️' ? 'תשלום חלקי' : 'ממתין תשלום'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{payment.category}</p>
            </div>
            
            <div className="text-left">
              <p className="font-bold text-lg text-primary">
                ₪{payment.amountPaid.toLocaleString()} / ₪{payment.amountTotal.toLocaleString()}
              </p>
              <p className="text-sm text-danger font-semibold">
                {payment.daysOverdue} ימים באיחור
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-borderGold/30">
        <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg font-medium transition-colors">
          שלח תזכורות WhatsApp
        </button>
      </div>
    </div>
  );
}
