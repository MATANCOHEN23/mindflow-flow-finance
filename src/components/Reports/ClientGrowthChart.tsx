import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useContacts } from '@/hooks/useContacts';
import { format, startOfMonth, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';

export function ClientGrowthChart() {
  const { data: contacts } = useContacts();

  // חישוב צמיחת לקוחות לפי חודש
  const clientsByMonth = contacts?.reduce((acc: any, contact) => {
    const monthKey = format(startOfMonth(parseISO(contact.created_at)), 'yyyy-MM');
    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }
    acc[monthKey]++;
    return acc;
  }, {}) || {};

  const chartData = Object.entries(clientsByMonth)
    .sort()
    .map(([month, count], index, arr) => ({
      month: format(parseISO(month + '-01'), 'MM/yy', { locale: he }),
      newClients: count,
      cumulative: arr.slice(0, index + 1).reduce((sum, [, c]) => sum + (c as number), 0)
    }));

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="gradient-text">📈 צמיחת לקוחות</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            אין מספיק נתונים להצגת גרף
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="newClients" 
                stroke="#667eea" 
                name="לקוחות חדשים"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#f97316" 
                name="סה״כ מצטבר"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
