import { useDashboardStats } from "@/hooks/useDashboardStats";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#f59e0b'];

export function DealsByStageChart() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>עסקאות לפי שלב</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = stats?.dealsByStage || [];

  if (data.length === 0) {
    return (
      <div className="premium-card p-6">
        <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center glow-text">
          📊 עסקאות לפי שלב
        </h3>
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500">אין עסקאות להצגה</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-6">
      <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center glow-text">
        📊 עסקאות לפי שלב
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="stage"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ stage, count }) => `${stage}: ${count}`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
