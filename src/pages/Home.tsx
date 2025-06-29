
import React, { useState } from 'react';
import { MainLayout } from "@/components/Layout/MainLayout";
import { CoachModal } from "@/components/Home/CoachModal";
import { toast } from "sonner";

const Home = () => {
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);

  const quickAccessCards = [
    {
      id: 'coach',
      title: 'מאמן כדורסל',
      icon: '🏀',
      onClick: () => setIsCoachModalOpen(true)
    },
    {
      id: 'therapy',
      title: 'טיפולים',
      icon: '🧠',
      onClick: () => toast.info('טיפולים - בפיתוח')
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in" dir="rtl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-600 mb-4 glow-text">🏆 דף הבית - MindFlow CRM 🏆</h1>
          <p className="text-gray-600 text-xl font-semibold">גישה מהירה לכל הפעילויות שלך</p>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quickAccessCards.map((card) => (
            <div
              key={card.id}
              className="quick-card text-center"
              onClick={card.onClick}
            >
              <div className="text-6xl mb-4">{card.icon}</div>
              <h3 className="text-2xl font-bold text-blue-600">{card.title}</h3>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">🔄 פעילות אחרונה</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-green-600">✅</span>
              <span>לקוח חדש נוסף: יוסי כהן</span>
              <span className="text-sm text-gray-500 mr-auto">לפני 5 דקות</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-600">💰</span>
              <span>תשלום התקבל: ₪1,200</span>
              <span className="text-sm text-gray-500 mr-auto">לפני 15 דקות</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-600">📅</span>
              <span>אימון מתוכנן: קבוצת א'</span>
              <span className="text-sm text-gray-500 mr-auto">היום 17:00</span>
            </div>
          </div>
        </div>

        <CoachModal 
          isOpen={isCoachModalOpen}
          onClose={() => setIsCoachModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default Home;
