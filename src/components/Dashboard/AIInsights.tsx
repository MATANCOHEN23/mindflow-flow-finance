
import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function AIInsights() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      setInsights([
        {
          type: 'opportunity',
          icon: <TrendingUp />,
          title: 'הזדמנות להגדלת הכנסות',
          description: 'זיהינו 15 לקוחות שלא רכשו ב-3 החודשים האחרונים',
          action: 'שלח קמפיין ממוקד',
          priority: 'high'
        },
        {
          type: 'alert',
          icon: <AlertCircle />,
          title: 'תשלומים באיחור',
          description: '3 תשלומים באיחור של מעל 30 יום',
          action: 'שלח תזכורות',
          priority: 'urgent'
        },
        {
          type: 'goal',
          icon: <Target />,
          title: 'יעד חודשי',
          description: 'אתה ב-75% מהיעד החודשי שלך',
          action: 'צפה בפירוט',
          priority: 'medium'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
