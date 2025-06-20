
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { PaymentStatusChart } from "@/components/Dashboard/PaymentStatusChart";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { OverduePayments } from "@/components/Dashboard/OverduePayments";
import { useState } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";
import { AddDealForm } from "@/components/Forms/AddDealForm";

export function Dashboard() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);

  const handleAddDeal = (dealData: any) => {
    console.log('Adding deal:', dealData);
    // TODO: Here we'll integrate with Supabase to save the deal
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-cream mb-4 text-shadow-lg">🏆 לוח בקרה ראשי 🏆</h1>
          <p className="text-cream/90 text-xl font-bold text-shadow">סקירה כללית של פעילות העסק - ניהול חכם ויעיל</p>
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
          <div className="flyer-card">
            <h3 className="text-2xl font-black text-cream mb-6 text-center">⚡ פעולות מהירות ⚡</h3>
            <div className="space-y-4">
              <button 
                className="w-full btn-flyer py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-4"
                onClick={() => setIsClientFormOpen(true)}
              >
                <span>👤</span>
                לקוח חדש
              </button>
              <button 
                className="w-full btn-flyer py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-4"
                onClick={() => setIsDealFormOpen(true)}
              >
                <span>💼</span>
                עסקה חדשה
              </button>
              <button className="w-full btn-flyer py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-4">
                <span>💳</span>
                רישום תשלום
              </button>
              <button className="w-full btn-flyer py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-4">
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

      <AddDealForm 
        isOpen={isDealFormOpen}
        onClose={() => setIsDealFormOpen(false)}
        onSubmit={handleAddDeal}
      />
    </>
  );
}
