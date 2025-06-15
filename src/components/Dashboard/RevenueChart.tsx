
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    month: 'ינואר',
    coaching: 12000,
    therapy: 8500,
    birthday: 4200,
    school: 2800,
  },
  {
    month: 'פברואר',
    coaching: 15000,
    therapy: 9200,
    birthday: 5100,
    school: 3200,
  },
  {
    month: 'מרץ',
    coaching: 18000,
    therapy: 10500,
    birthday: 6800,
    school: 4100,
  },
  {
    month: 'אפריל',
    coaching: 16500,
    therapy: 11200,
    birthday: 7200,
    school: 3800,
  },
  {
    month: 'מאי',
    coaching: 14200,
    therapy: 9800,
    birthday: 5900,
    school: 3500,
  },
  {
    month: 'יוני',
    coaching: 19500,
    therapy: 12800,
    birthday: 8100,
    school: 4600,
  },
];

export function RevenueChart() {
  return (
    <div className="bg-white gold-border rounded-xl p-6 card-shadow">
      <h3 className="text-xl font-bold text-primary mb-4">הכנסות חודשיות לפי קטגוריה</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `₪${value.toLocaleString()}`, 
                name === 'coaching' ? 'אימון כדורסל' :
                name === 'therapy' ? 'טיפולים' :
                name === 'birthday' ? 'ימי הולדת' : 'סדנאות'
              ]}
              labelStyle={{ direction: 'rtl' }}
              contentStyle={{ direction: 'rtl' }}
            />
            <Legend 
              wrapperStyle={{ direction: 'rtl' }}
              formatter={(value) => 
                value === 'coaching' ? 'אימון כדורסל' :
                value === 'therapy' ? 'טיפולים' :
                value === 'birthday' ? 'ימי הולדת' : 'סדנאות'
              }
            />
            <Bar dataKey="coaching" fill="#1C6DD0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="therapy" fill="#38AEEB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="birthday" fill="#FF8D3A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="school" fill="#D4AF37" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
