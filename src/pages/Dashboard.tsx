
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { PaymentStatusChart } from "@/components/Dashboard/PaymentStatusChart";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { OverduePayments } from "@/components/Dashboard/OverduePayments";
import { AIInsights } from "@/components/Dashboard/AIInsights";
import { WidgetGrid } from "@/components/Dashboard/WidgetGrid";
import { useState, useEffect } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";
import { getDashboardStats } from "@/lib/mock-data";
import { PremiumLoader } from "@/components/PremiumLoader";

export function Dashboard() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [stats, setStats] = useState(getDashboardStats());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setStats(getDashboardStats());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Event listener for opening deal form from sidebar
  useEffect(() => {
    const handleOpenDealForm = () => {
      window.dispatchEvent(new CustomEvent('openDealForm'));
    };
    window.addEventListener('openDealForm', handleOpenDealForm);
    return () => window.removeEventListener('openDealForm', handleOpenDealForm);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center">
          <PremiumLoader size="lg" className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">טוען את לוח הבקרה...</h2>
          <p className="text-gray-500">מכין עבורך את הנתונים העדכניים</p>
        </div>
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
          <StatsCard
            title="💰 סה״כ הכנסות החודש"
            value={`₪${stats.monthlyRevenue.toLocaleString('he-IL')}`}
            icon="💎"
            trend={stats.trends.revenue}
          />
          <StatsCard
            title="👥 לקוחות פעילים"
            value={stats.activeClients}
            icon="⭐"
            trend={stats.trends.clients}
          />
          <StatsCard
            title="💼 עסקאות פתוחות"
            value={stats.openDeals}
            icon="🚀"
            trend={stats.trends.deals}
          />
          <StatsCard
            title="⏳ תשלומים ממתינים"
            value={`₪${stats.pendingPayments.toLocaleString('he-IL')}`}
            icon="⚡"
            trend={stats.trends.payments}
          />
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart />
          <PaymentStatusChart />
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
