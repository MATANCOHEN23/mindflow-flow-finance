import { openWhatsApp, getPaymentReminderMessage, sendBulkReminders } from '@/lib/whatsapp';
import { toast } from 'sonner';
import { useOverduePayments } from '@/hooks/useOverduePayments';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function OverduePayments() {
  const { data: overduePayments = [], isLoading, error } = useOverduePayments();

  const getStatusClass = (status: string) => {
    switch (status) {
      case '✅': return 'trend-positive';
      case '🟧': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-cream border-2 border-gold';
      case '❌': return 'trend-negative';
      default: return 'trend-negative';
    }
  };

  const handleSendReminder = (payment: typeof overduePayments[0]) => {
    if (!payment.clientPhone) {
      toast.error('אין מספר טלפון ללקוח זה');
      return;
    }
    
    const message = getPaymentReminderMessage(payment.clientName, payment.amountPending, payment.category);
    openWhatsApp(payment.clientPhone, message);
    toast.success(`נפתח WhatsApp עבור ${payment.clientName} 📱`);
  };

  const handleSendAllReminders = () => {
    const paymentsWithPhone = overduePayments
      .filter(p => p.clientPhone && p.paymentStatus !== '✅')
      .map(p => ({
        clientName: p.clientName,
        phone: p.clientPhone!,
        amount: p.amountPending,
        category: p.category
      }));
    
    if (paymentsWithPhone.length === 0) {
      toast.error('אין תשלומים לשליחה');
      return;
    }
    
    sendBulkReminders(paymentsWithPhone);
    toast.success(`נשלחות ${paymentsWithPhone.length} תזכורות WhatsApp 🚀`);
  };

  if (isLoading) {
    return (
      <div className="flyer-card">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flyer-card">
        <div className="text-center py-8 text-red-400">
          <p>שגיאה בטעינת תשלומים באיחור</p>
          <p className="text-sm mt-2">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (overduePayments.length === 0) {
    return (
      <div className="flyer-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-cream text-shadow">⚠️ תשלומים באיחור</h3>
          <span className="bg-emerald-600 text-cream px-4 py-2 rounded-full text-lg font-black">
            ✅ אין תשלומים באיחור
          </span>
        </div>
        <div className="text-center py-8 text-cream/70">
          <p className="text-lg">🎉 מצוין! כל התשלומים מעודכנים</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flyer-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-cream text-shadow">⚠️ תשלומים באיחור</h3>
        <span className="orange-box text-lg font-black">
          {overduePayments.length} פריטים
        </span>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {overduePayments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600/50 to-blue-700/50 rounded-xl hover:from-blue-500/60 hover:to-blue-600/60 transition-all duration-300 border-2 border-gold/30 hover:border-gold hover:scale-102">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h4 className="font-black text-cream text-lg text-shadow">{payment.clientName}</h4>
                <span className={`px-4 py-2 rounded-full text-sm font-black ${getStatusClass(payment.paymentStatus)}`}>
                  {payment.paymentStatus} {payment.paymentStatus === '✅' ? 'שולם' : 
                   payment.paymentStatus === '🟧' ? 'תשלום חלקי' : 'ממתין תשלום'}
                </span>
                {payment.clientPhone && (
                  <button
                    onClick={() => handleSendReminder(payment)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-bold transition-colors"
                    title="שלח תזכורת WhatsApp"
                  >
                    📱
                  </button>
                )}
              </div>
              <p className="text-cream/90 font-bold text-base">{payment.dealTitle}</p>
              <p className="text-cream/70 text-sm">{payment.category}</p>
            </div>
            
            <div className="text-left orange-box">
              <p className="font-black text-xl">
                ₪{payment.amountPending.toLocaleString()}
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
