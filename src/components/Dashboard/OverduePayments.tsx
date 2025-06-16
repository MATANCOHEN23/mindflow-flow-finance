
interface OverduePayment {
  id: string;
  clientName: string;
  category: string;
  amountTotal: number;
  amountPaid: number;
  daysOverdue: number;
  paymentStatus: '✅' | '🟧' | '❌';
}

const overduePayments: OverduePayment[] = [
  {
    id: '1',
    clientName: 'משה כהן',
    category: '🏀 אימון כדורסל',
    amountTotal: 1200,
    amountPaid: 0,
    daysOverdue: 5,
    paymentStatus: '❌'
  },
  {
    id: '2',
    clientName: 'שרה לוי',
    category: '🧠 טיפול',
    amountTotal: 800,
    amountPaid: 400,
    daysOverdue: 12,
    paymentStatus: '🟧'
  },
  {
    id: '3',
    clientName: 'דוד אברהם',
    category: '🎂 יום הולדת',
    amountTotal: 2500,
    amountPaid: 0,
    daysOverdue: 3,
    paymentStatus: '❌'
  },
  {
    id: '4',
    clientName: 'בית ספר השלום',
    category: '🎓 סדנה',
    amountTotal: 1800,
    amountPaid: 900,
    daysOverdue: 8,
    paymentStatus: '🟧'
  },
];

export function OverduePayments() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case '✅': return 'trend-positive';
      case '🟧': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-cream border-2 border-gold';
      case '❌': return 'trend-negative';
      default: return 'trend-negative';
    }
  };

  return (
    <div className="flyer-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-cream text-shadow">⚠️ תשלומים באיחור</h3>
        <span className="orange-box text-lg font-black">
          {overduePayments.length} פריטים
        </span>
      </div>
      
      <div className="space-y-4">
        {overduePayments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600/50 to-blue-700/50 rounded-xl hover:from-blue-500/60 hover:to-blue-600/60 transition-all duration-300 border-2 border-gold/30 hover:border-gold hover:scale-102">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h4 className="font-black text-cream text-lg text-shadow">{payment.clientName}</h4>
                <span className={`px-4 py-2 rounded-full text-sm font-black ${getStatusClass(payment.paymentStatus)}`}>
                  {payment.paymentStatus} {payment.paymentStatus === '✅' ? 'שולם' : 
                   payment.paymentStatus === '🟧' ? 'תשלום חלקי' : 'ממתין תשלום'}
                </span>
              </div>
              <p className="text-cream/90 font-bold text-base">{payment.category}</p>
            </div>
            
            <div className="text-left orange-box">
              <p className="font-black text-xl">
                ₪{payment.amountPaid.toLocaleString()} / ₪{payment.amountTotal.toLocaleString()}
              </p>
              <p className="text-base font-bold">
                ⏰ {payment.daysOverdue} ימים באיחור
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t-2 border-gold/50">
        <button 
          className="w-full btn-flyer py-4 px-6 rounded-xl font-black text-lg transition-all duration-300"
          aria-label="שלח תזכורות WhatsApp"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.click()}
        >
          📱 שלח תזכורות WhatsApp
        </button>
      </div>
    </div>
  );
}
