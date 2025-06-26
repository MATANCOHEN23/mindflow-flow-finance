
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { PaymentStatusChart } from "@/components/Dashboard/PaymentStatusChart";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { OverduePayments } from "@/components/Dashboard/OverduePayments";
import { useState, useEffect } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";

export function Dashboard() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  // Event listener for opening deal form from sidebar
  useEffect(() => {
    const handleOpenDealForm = () => {
      window.dispatchEvent(new CustomEvent('openDealForm'));
    };
    window.addEventListener('openDealForm', handleOpenDealForm);
    return () => window.removeEventListener('openDealForm', handleOpenDealForm);
  }, []);

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
            value="₪45,200"
            icon="💎"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="👥 לקוחות פעילים"
            value="127"
            icon="⭐"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="💼 עסקאות פתוחות"
            value="23"
            icon="🚀"
            trend={{ value: 3, isPositive: false }}
          />
          <StatsCard
            title="⏳ תשלומים ממתינים"
            value="₪8,900"
            icon="⚡"
            trend={{ value: 15, isPositive: false }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart />
          <PaymentStatusChart />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <OverduePayments />
          </div>
          
          {/* Quick Actions */}
          <div className="premium-card">
            <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center glow-text">⚡ פעולות מהירות ⚡</h3>
            <div className="space-y-4">
              <button 
                className="w-full btn-primary py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4"
                onClick={() => setIsClientFormOpen(true)}
              >
                <span>👤</span>
                לקוח חדש
              </button>
              <button 
                className="w-full btn-secondary py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openDealForm'));
                }}
              >
                <span>💼</span>
                עסקה חדשה
              </button>
              <button className="w-full btn-outline py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4 hover:bg-orange-50 hover:border-orange-300">
                <span>💳</span>
                רישום תשלום
              </button>
              <button className="w-full btn-outline py-4 px-6 rounded-lg font-bold text-lg transition-smooth flex items-center gap-4 hover:bg-orange-50 hover:border-orange-300">
                <span>📱</span>
                שלח תזכורת
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddClientForm 
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
      />
    </>
  );
}
