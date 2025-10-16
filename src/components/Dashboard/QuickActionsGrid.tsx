import { Plus, Users, Calendar, DollarSign, FileText, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function QuickActionsGrid() {
  const navigate = useNavigate();
  
  const actions = [
    { 
      icon: Plus, 
      label: 'לקוח חדש', 
      onClick: () => navigate('/contacts'), 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'הוסף לקוח'
    },
    { 
      icon: FileText, 
      label: 'עסקה חדשה', 
      onClick: () => navigate('/deals'), 
      gradient: 'from-purple-500 to-pink-500',
      description: 'צור עסקה'
    },
    { 
      icon: Calendar, 
      label: 'אירוע', 
      onClick: () => navigate('/events'), 
      gradient: 'from-green-500 to-emerald-500',
      description: 'תזמן אירוע'
    },
    { 
      icon: DollarSign, 
      label: 'תשלום', 
      onClick: () => navigate('/payments'), 
      gradient: 'from-orange-500 to-red-500',
      description: 'קלוט תשלום'
    },
    { 
      icon: Users, 
      label: 'לקוחות', 
      onClick: () => navigate('/contacts'), 
      gradient: 'from-indigo-500 to-purple-500',
      description: 'נהל לקוחות'
    },
    { 
      icon: BarChart, 
      label: 'דוחות', 
      onClick: () => navigate('/reports'), 
      gradient: 'from-yellow-500 to-orange-500',
      description: 'צפה בדוחות'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" dir="rtl">
      {actions.map((action, idx) => (
        <Card 
          key={idx}
          onClick={action.onClick}
          className="group p-6 cursor-pointer hover:scale-105 transition-all duration-300 bg-white shadow-lg border-2 border-gray-100 hover:border-primary/50 hover:shadow-xl"
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
            <action.icon className="w-8 h-8 text-white" />
          </div>
          <p className="text-center font-bold text-gray-900 mb-1">{action.label}</p>
          <p className="text-center text-xs text-muted-foreground">{action.description}</p>
        </Card>
      ))}
    </div>
  );
}
