
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { OverduePayments } from "@/components/Dashboard/OverduePayments";
import { AIInsights } from "@/components/Dashboard/AIInsights";
import { WidgetGrid } from "@/components/Dashboard/WidgetGrid";
import { RealTimeRevenueChart } from "@/components/Dashboard/RealTimeRevenueChart";
import { DealsByStageChart } from "@/components/Dashboard/DealsByStageChart";
import { TodayEventsWidget } from "@/components/Dashboard/TodayEventsWidget";
import { TodayTasksWidget } from "@/components/Dashboard/TodayTasksWidget";
import { useState, useEffect } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";
import { PremiumLoader } from "@/components/PremiumLoader";
import { EmptyState } from "@/components/EmptyState";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useEventReminders } from "@/hooks/useEventReminders";
import { Link } from "react-router-dom";

export function Dashboard() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const { data: stats, isLoading, error } = useDashboardStats();
  
  // Initialize event and payment reminders
  useEventReminders();

  // Event listener for opening deal form from sidebar
  useEffect(() => {
    const handleOpenDealForm = () => {
      window.dispatchEvent(new CustomEvent('openDealForm'));
    };
    window.addEventListener('openDealForm', handleOpenDealForm);
    return () => window.removeEventListener('openDealForm', handleOpenDealForm);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <PremiumLoader size="lg" className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">טוען את לוח הבקרה...</h2>
          <p className="text-muted-foreground">מכין עבורך את הנתונים העדכניים</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EmptyState
          icon="⚠️"
          title="שגיאה בטעינת הנתונים"
          description="לא הצלחנו לטעון את נתוני לוח הבקרה. אנא נסה שוב."
        />
      </div>
    );
  }

  if (!stats || (stats.activeClients === 0 && stats.openDeals === 0 && stats.totalRevenue === 0)) {
    return (
      <div className="space-y-8 animate-fade-in" dir="rtl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-600 mb-4 glow-text">🏆 לוח בקרה ראשי 🏆</h1>
          <p className="text-gray-600 text-xl font-semibold">התחל לנהל את העסק שלך</p>
        </div>
        
        <EmptyState
          icon="📊"
          title="אין נתונים עדיין"
          description="התחל להוסיף לקוחות ועסקאות כדי לראות סטטיסטיקות ותובנות"
          action={{
            label: "הוסף לקוח ראשון",
            onClick: () => setIsClientFormOpen(true)
          }}
        />

        <AddClientForm 
          isOpen={isClientFormOpen}
          onClose={() => setIsClientFormOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-fade-in" dir="rtl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-600 mb-4 glow-text">🏆 לוח בקרה ראשי 🏆</h1>
          <p className="text-gray-600 text-xl font-semibold">סקירה כללית של פעילות העסק - ניהול חכם ויעיל</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/contacts" className="block hover-scale transition-smooth">
            <StatsCard
              title="👥 לקוחות פעילים"
              value={stats.activeClients}
              icon="⭐"
            />
          </Link>
          <Link to="/deals" className="block hover-scale transition-smooth">
            <StatsCard
              title="💼 עסקאות פתוחות"
              value={stats.openDeals}
              icon="🚀"
            />
          </Link>
          <StatsCard
            title="💰 סה״כ הכנסות"
            value={`₪${stats.totalRevenue.toLocaleString('he-IL')}`}
            icon="💎"
          />
          <Link to="/payments" className="block hover-scale transition-smooth">
            <StatsCard
              title="⏳ תשלומים ממתינים"
              value={stats.pendingPayments}
              icon="⚡"
            />
          </Link>
        </div>

        {/* AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIInsights />
          </div>
          <div className="premium-card p-6">
            <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center glow-text">⚡ פעולות מהירות ⚡</h3>
            <div className="space-y-4">
              <button 
                className="w-full btn-premium py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4 justify-center"
                onClick={() => setIsClientFormOpen(true)}
              >
                <span>👤</span>
                לקוח חדש
              </button>
              <button 
                className="w-full btn-golden py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4 justify-center"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openDealForm'));
                }}
              >
                <span>💼</span>
                עסקה חדשה
              </button>
              <button className="w-full btn-outline py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4 hover:bg-orange-50 hover:border-orange-300 justify-center">
                <span>💳</span>
                רישום תשלום
              </button>
              <button className="w-full btn-outline py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4 hover:bg-orange-50 hover:border-orange-300 justify-center">
                <span>📱</span>
                שלח תזכורת
              </button>
            </div>
          </div>
        </div>

        {/* Draggable Widgets */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 glow-text">📊 ווידג׳טים מותאמים אישית</h2>
          <WidgetGrid />
        </div>

        {/* Today's Events and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TodayEventsWidget />
          <TodayTasksWidget />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RealTimeRevenueChart />
          <DealsByStageChart />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-8">
          <OverduePayments />
        </div>
      </div>

      <AddClientForm 
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
      />
    </>
  );
}
