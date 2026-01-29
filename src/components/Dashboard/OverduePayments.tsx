import { openWhatsApp, getPaymentReminderMessage, sendBulkReminders } from '@/lib/whatsapp';
import { toast } from 'sonner';

interface OverduePayment {
  id: string;
  clientName: string;
  category: string;
  amountTotal: number;
  amountPaid: number;
  daysOverdue: number;
  paymentStatus: '✅' | '🟧' | '❌';
  phone?: string; // Added for WhatsApp functionality
}

const overduePayments: OverduePayment[] = [
  {
    id: '1',
    clientName: 'משה כהן',
    category: '🏀 אימון כדורסל',
    amountTotal: 1200,
    amountPaid: 0,
    daysOverdue: 5,
    paymentStatus: '❌',
    phone: '050-1234567'
  },
  {
    id: '2',
    clientName: 'שרה לוי',
    category: '🧠 טיפול',
    amountTotal: 800,
    amountPaid: 400,
    daysOverdue: 12,
    paymentStatus: '🟧',
    phone: '052-9876543'
  },
  {
    id: '3',
    clientName: 'דוד אברהם',
    category: '🎂 יום הולדת',
    amountTotal: 2500,
    amountPaid: 0,
    daysOverdue: 3,
    paymentStatus: '❌',
    phone: '054-5556677'
  },
  {
    id: '4',
    clientName: 'בית ספר השלום',
    category: '🎓 סדנה',
    amountTotal: 1800,
    amountPaid: 900,
    daysOverdue: 8,
    paymentStatus: '🟧',
    phone: '053-1112233'
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

  const handleSendReminder = (payment: OverduePayment) => {
    if (!payment.phone) {
      toast.error('אין מספר טלפון ללקוח זה');
      return;
    }
    
    const pendingAmount = payment.amountTotal - payment.amountPaid;
    const message = getPaymentReminderMessage(payment.clientName, pendingAmount, payment.category);
    openWhatsApp(payment.phone, message);
    toast.success(`נפתח WhatsApp עבור ${payment.clientName} 📱`);
  };

  const handleSendAllReminders = () => {
    const paymentsWithPhone = overduePayments
      .filter(p => p.phone && p.paymentStatus !== '✅')
      .map(p => ({
        clientName: p.clientName,
        phone: p.phone!,
        amount: p.amountTotal - p.amountPaid,
        category: p.category
      }));
    
    if (paymentsWithPhone.length === 0) {
      toast.error('אין תשלומים לשליחה');
      return;
    }
    
    sendBulkReminders(paymentsWithPhone);
    toast.success(`נשלחות ${paymentsWithPhone.length} תזכורות WhatsApp 🚀`);
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
                {payment.phone && (
                  <button
                    onClick={() => handleSendReminder(payment)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-bold transition-colors"
                    title="שלח תזכורת WhatsApp"
                  >
                    📱
                  </button>
                )}
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
          onClick={handleSendAllReminders}
          className="w-full btn-flyer py-4 px-6 rounded-xl font-black text-lg transition-all duration-300"
          aria-label="שלח תזכורות WhatsApp"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleSendAllReminders()}
        >
          📱 שלח תזכורות WhatsApp ({overduePayments.filter(p => p.paymentStatus !== '✅').length})
        </button>
      </div>
    </div>
  );
}
