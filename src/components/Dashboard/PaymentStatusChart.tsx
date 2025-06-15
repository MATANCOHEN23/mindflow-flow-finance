
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'שולם', value: 65, color: '#4CAF50' },
  { name: 'תשלום חלקי', value: 25, color: '#FF8D3A' },
  { name: 'ממתין תשלום', value: 10, color: '#F44336' },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="font-semibold text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function PaymentStatusChart() {
  return (
    <div className="bg-white gold-border rounded-xl p-6 card-shadow">
      <h3 className="text-xl font-bold text-primary mb-4">סטטוס תשלומים</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'אחוז']}
              labelStyle={{ direction: 'rtl' }}
            />
            <Legend 
              wrapperStyle={{ direction: 'rtl', textAlign: 'center' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
