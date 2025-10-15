import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function KPISummary() {
  const { data: stats, isLoading } = useDashboardStats();

  const kpis = [
    {
      title: 'הכנסות החודש',
      value: `₪${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: '💰',
      trend: { value: 12, isPositive: true },
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'לקוחות פעילים',
      value: stats?.activeClients || 0,
      icon: '👥',
      trend: { value: 8, isPositive: true },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'משימות שהושלמו',
      value: `${stats?.completedTasks || 0}/${stats?.totalTasks || 0}`,
      icon: '✅',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'אירועים החודש',
      value: stats?.upcomingEvents || 0,
      icon: '📅',
      color: 'from-orange-500 to-red-500'
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white shadow-lg border-2 border-gray-100">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <Card key={idx} className="group bg-white shadow-lg border-2 border-gray-100 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
              {kpi.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">
                {kpi.value}
              </div>
              {kpi.trend && (
                <div className={`flex items-center gap-1 text-sm ${kpi.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">{kpi.trend.value}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
