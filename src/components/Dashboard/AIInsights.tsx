
import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDeals } from '@/hooks/useDeals';
import { usePayments } from '@/hooks/usePayments';
import { useContacts } from '@/hooks/useContacts';
import { useUpcomingEvents } from '@/hooks/useEvents';

export function AIInsights() {
  const { data: deals } = useDeals();
  const { data: payments } = usePayments();
  const { data: contacts } = useContacts();
  const { data: events } = useUpcomingEvents(5);

  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deals || !payments || !contacts) {
      setLoading(true);
      return;
    }

    const newInsights = [];

    // תשלומים באיחור
    const overduePayments = payments.filter(p => {
      const payment = p as any;
      return payment.status === 'pending' && 
        payment.due_date &&
        new Date(payment.due_date) < new Date();
    });

    if (overduePayments.length > 0) {
      const totalOverdue = overduePayments.reduce((sum, p) => sum + Number(p.amount), 0);
      newInsights.push({
        type: 'alert',
        icon: <AlertCircle />,
        title: 'תשלומים באיחור',
        description: `${overduePayments.length} תשלומים באיחור (סה"כ ₪${totalOverdue.toLocaleString()})`,
        action: 'שלח תזכורות',
        priority: 'urgent'
      });
    }

    // לקוחות לא פעילים
    const inactiveContacts = contacts.filter(c => {
      const contactDeals = deals.filter(d => d.contact_id === c.id);
      if (contactDeals.length === 0) return true;
      
      const lastDeal = contactDeals.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      
      const daysSinceLastDeal = Math.floor(
        (Date.now() - new Date(lastDeal.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return daysSinceLastDeal > 90;
    });

    if (inactiveContacts.length > 0) {
      newInsights.push({
        type: 'opportunity',
        icon: <TrendingUp />,
        title: 'הזדמנות להגדלת הכנסות',
        description: `זיהינו ${inactiveContacts.length} לקוחות שלא רכשו ב-3 החודשים האחרונים`,
        action: 'שלח קמפיין ממוקד',
        priority: 'high'
      });
    }

    // אירועים קרובים
    if (events && events.length > 0) {
      newInsights.push({
        type: 'info',
        icon: <Calendar />,
        title: 'אירועים קרובים',
        description: `${events.length} אירועים מתוכננים בימים הקרובים`,
        action: 'צפה באירועים',
        priority: 'medium'
      });
    }

    // יעד חודשי
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = payments
      .filter(p => {
        const pDate = new Date(p.payment_date);
        const payment = p as any;
        return pDate.getMonth() === currentMonth && 
               pDate.getFullYear() === currentYear &&
               payment.status === 'completed';
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const monthlyGoal = 50000;
    const percentage = Math.round((monthlyRevenue / monthlyGoal) * 100);

    newInsights.push({
      type: 'goal',
      icon: <Target />,
      title: 'יעד חודשי',
      description: `אתה ב-${percentage}% מהיעד החודשי (₪${monthlyRevenue.toLocaleString()} מתוך ₪${monthlyGoal.toLocaleString()})`,
      action: 'צפה בפירוט',
      priority: percentage >= 75 ? 'low' : 'medium'
    });

    setInsights(newInsights);
    setLoading(false);
  }, [deals, payments, contacts, events]);

  if (loading) {
    return (
      <div className="premium-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-orange-600" size={24} />
          <h3 className="text-xl font-bold glow-text">תובנות AI חכמות</h3>
        </div>
        <div className="flex justify-center py-8">
          <div className="premium-loader" />
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="text-orange-600" size={24} />
        </motion.div>
        <h3 className="text-xl font-bold glow-text">תובנות AI חכמות</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-2 ${
              insight.priority === 'urgent' ? 'border-red-300 bg-red-50' :
              insight.priority === 'high' ? 'border-orange-300 bg-orange-50' :
              'border-blue-300 bg-blue-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                insight.priority === 'urgent' ? 'bg-red-200' :
                insight.priority === 'high' ? 'bg-orange-200' :
                'bg-blue-200'
              }`}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <button className="text-sm font-bold text-orange-600 hover:text-orange-700">
                  {insight.action} →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
