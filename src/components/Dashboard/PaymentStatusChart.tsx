
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: '✅ שולם', value: 65, color: '#32CD32' },
  { name: '🟧 תשלום חלקי', value: 25, color: '#FF8C00' },
  { name: '❌ ממתין תשלום', value: 10, color: '#DC143C' },
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
      fill="#FFF8DC" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="font-black text-lg"
      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function PaymentStatusChart() {
  return (
    <div className="chart-container">
      <h3 className="text-2xl font-black text-cream mb-6 text-center text-shadow">💳 סטטוס תשלומים</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              stroke="#FFD700"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'אחוז']}
              labelStyle={{ 
                direction: 'rtl',
                color: '#191970',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
              contentStyle={{
                backgroundColor: '#FFF8DC',
                border: '2px solid #FFD700',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.5)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                direction: 'rtl', 
                textAlign: 'center',
                color: '#FFF8DC',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
