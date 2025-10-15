import { MainLayout } from "@/components/Layout/MainLayout";
import { QuickActionsGrid } from "@/components/Dashboard/QuickActionsGrid";
import { KPISummary } from "@/components/Dashboard/KPISummary";
import { ActivityFeed } from "@/components/Dashboard/ActivityFeed";
import { TodayTasksWidget } from "@/components/Dashboard/TodayTasksWidget";
import { TodayEventsWidget } from "@/components/Dashboard/TodayEventsWidget";

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-8 p-6" dir="rtl">
        {/* כותרת */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🧠 ברוך הבא ל-MindFlow CRM 🏆
          </h1>
          <p className="text-xl text-muted-foreground">
            המערכת המקצועית לניהול ביצועים נפשיים וספורט
          </p>
        </div>

        {/* Quick Actions */}
        <QuickActionsGrid />

        {/* KPI Summary */}
        <KPISummary />

        {/* משימות ואירועים */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayTasksWidget />
          <TodayEventsWidget />
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </div>
    </MainLayout>
  );
}
