
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { PaymentStatusChart } from "@/components/Dashboard/PaymentStatusChart";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { OverduePayments } from "@/components/Dashboard/OverduePayments";

export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">לוח בקרה ראשי</h1>
        <p className="text-muted-foreground">סקירה כללית של פעילות העסק</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="סה״כ הכנסות החודש"
          value="₪45,200"
          icon="💰"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="לקוחות פעילים"
          value="127"
          icon="👥"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="עסקאות פתוחות"
          value="23"
          icon="💼"
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard
          title="תשלומים ממתינים"
          value="₪8,900"
          icon="⏳"
          trend={{ value: 15, isPositive: false }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <PaymentStatusChart />
      </div>

      {/* Overdue Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverduePayments />
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white gold-border rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-primary mb-4">פעולות מהירות</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-3">
              <span>➕</span>
              לקוח חדש
            </button>
            <button className="w-full bg-accent hover:bg-accent/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-3">
              <span>💼</span>
              עסקה חדשה
            </button>
            <button className="w-full bg-success hover:bg-success/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-3">
              <span>💳</span>
              רישום תשלום
            </button>
            <button className="w-full bg-warning hover:bg-warning/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-3">
              <span>📱</span>
              שלח תזכורת
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
