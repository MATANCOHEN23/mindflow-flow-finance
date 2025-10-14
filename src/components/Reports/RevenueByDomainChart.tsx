import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useDomains } from '@/hooks/useDomains';
import { usePayments } from '@/hooks/usePayments';
import { useDeals } from '@/hooks/useDeals';

const COLORS = ['#667eea', '#764ba2', '#f6d365', '#fda085', '#f97316', '#ea580c'];

export function RevenueByDomainChart() {
  const { data: domains } = useDomains();
  const { data: payments } = usePayments();
  const { data: deals } = useDeals();

  // חישוב הכנסות לפי תחום
  const revenueByDomain = domains?.map((domain) => {
    const domainDeals = deals?.filter(d => d.domain_id === domain.id) || [];
    const dealIds = domainDeals.map(d => d.id);
    const domainPayments = payments?.filter(p => p.deal_id && dealIds.includes(p.deal_id)) || [];
    const totalRevenue = domainPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      name: domain.icon ? `${domain.icon} ${domain.name}` : domain.name,
      value: totalRevenue,
      color: COLORS[domains.indexOf(domain) % COLORS.length]
    };
  }).filter(d => d.value > 0) || [];

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="gradient-text">💰 הכנסות לפי תחום</CardTitle>
      </CardHeader>
      <CardContent>
        {revenueByDomain.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            אין נתוני הכנסות עדיין
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByDomain}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `₪${entry.value.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByDomain.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `₪${value.toLocaleString()}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
