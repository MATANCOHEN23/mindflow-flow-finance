import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { SystemTester } from "@/tests/SystemTester";
import { PlayCircle } from "lucide-react";

const SystemTesterPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">בודק מערכת</h1>
            <p className="text-muted-foreground text-lg">
              הפעל בדיקות מקיפות למערכת MindFlow CRM
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 text-right max-w-md mx-auto">
              <li>✅ בדיקת חיבור למסד נתונים</li>
              <li>✅ בדיקת פעולות CRUD לכל הטבלאות</li>
              <li>✅ בדיקת ניווט ורכיבי UI</li>
              <li>✅ בדיקת אינטגרציות ו-PWA</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => setIsOpen(true)}
            size="lg"
            className="gap-2"
          >
            <PlayCircle className="h-5 w-5" />
            הפעל בדיקות מערכת
          </Button>
        </div>
      </div>
      
      <SystemTester isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </MainLayout>
  );
};

export default SystemTesterPage;
