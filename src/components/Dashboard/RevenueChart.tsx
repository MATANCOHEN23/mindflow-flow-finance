
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
    <div className="chart-container">
      <h3 className="text-2xl font-black text-cream mb-6 text-center text-shadow">📊 הכנסות חודשיות לפי קטגוריה</h3>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#FFD700" strokeWidth={2} />
            <XAxis 
              dataKey="month" 
              stroke="#FFF8DC"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <YAxis 
              stroke="#FFF8DC"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
              tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `₪${value.toLocaleString()}`, 
                name === 'coaching' ? '🏀 אימון כדורסל' :
                name === 'therapy' ? '🧠 טיפולים' :
                name === 'birthday' ? '🎂 ימי הולדת' : '🎓 סדנאות'
              ]}
              labelStyle={{ direction: 'rtl', color: '#191970', fontWeight: 'bold' }}
              contentStyle={{ 
                direction: 'rtl',
                backgroundColor: '#FFF8DC',
                border: '2px solid #FFD700',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.5)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                direction: 'rtl',
                color: '#FFF8DC',
                fontWeight: 'bold'
              }}
              formatter={(value) => 
                value === 'coaching' ? '🏀 אימון כדורסל' :
                value === 'therapy' ? '🧠 טיפולים' :
                value === 'birthday' ? '🎂 ימי הולדת' : '🎓 סדנאות'
              }
            />
            <Bar dataKey="coaching" fill="#FF8C00" radius={[8, 8, 0, 0]} stroke="#FFD700" strokeWidth={2} />
            <Bar dataKey="therapy" fill="#1E90FF" radius={[8, 8, 0, 0]} stroke="#FFD700" strokeWidth={2} />
            <Bar dataKey="birthday" fill="#FF6347" radius={[8, 8, 0, 0]} stroke="#FFD700" strokeWidth={2} />
            <Bar dataKey="school" fill="#32CD32" radius={[8, 8, 0, 0]} stroke="#FFD700" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
