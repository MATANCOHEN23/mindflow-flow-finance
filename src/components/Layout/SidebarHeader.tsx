
import { useEffect, useState } from "react";
import { UserPlus, Briefcase, Upload, TestTube, Navigation } from "lucide-react";
import { SystemTester } from "@/tests/SystemTester";
import { NavigationTester } from "@/components/NavigationTester";

interface SidebarHeaderProps {
  onOpenSmartWizard: () => void;
  onOpenDealForm: () => void;
  onOpenImport: () => void;
}

export function SidebarHeader({ onOpenSmartWizard, onOpenDealForm, onOpenImport }: SidebarHeaderProps) {
  const [isSystemTesterOpen, setIsSystemTesterOpen] = useState(false);
  const [isNavigationTesterOpen, setIsNavigationTesterOpen] = useState(false);
  
  useEffect(() => {
    const handleOpenDealForm = () => onOpenDealForm();
    window.addEventListener('openDealForm', handleOpenDealForm);
    return () => window.removeEventListener('openDealForm', handleOpenDealForm);
  }, [onOpenDealForm]);

  return (
    <>
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="logo-placeholder">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white glow-text">MindFlow</h2>
            <p className="text-white/80 text-sm font-medium">CRM System</p>
          </div>
        </div>
      </div>
      
      {/* Quick Action Buttons */}
      <div className="p-4 space-y-3 border-b border-gray-700">
        <button 
          className="w-full sidebar-btn text-sm py-3 px-4 flex items-center gap-3 justify-center rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 sidebar-button"
          aria-label="אשף לקוח חכם"
          tabIndex={0}
          onClick={onOpenSmartWizard}
          onKeyPress={(e) => e.key === 'Enter' && onOpenSmartWizard()}
        >
          <UserPlus size={18} />
          🎯 אשף לקוח חכם
        </button>
        <button 
          className="w-full text-sm py-3 px-4 flex items-center gap-3 justify-center rounded-lg font-semibold transition-all duration-300 hover:bg-orange-600 sidebar-button"
          style={{ 
            background: 'var(--cta)',
            color: 'white',
            boxShadow: '0 0 6px rgba(255, 141, 58, 0.6)'
          }}
          aria-label="הוסף עסקה חדשה"
          tabIndex={0}
          onClick={onOpenDealForm}
          onKeyPress={(e) => e.key === 'Enter' && onOpenDealForm()}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 141, 58, 0.8)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 6px rgba(255, 141, 58, 0.6)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Briefcase size={18} />
          עסקה חדשה
        </button>
        <button 
          className="w-full sidebar-btn text-sm py-3 px-4 flex items-center gap-3 justify-center rounded-lg font-semibold hover:bg-orange-600 sidebar-button"
          aria-label="ייבוא קובץ"
          tabIndex={0}
          onClick={onOpenImport}
          onKeyPress={(e) => e.key === 'Enter' && onOpenImport()}
        >
          <Upload size={18} />
          ייבוא קובץ
        </button>
        
        <button 
          className="w-full sidebar-btn text-sm py-3 px-4 flex items-center gap-3 justify-center rounded-lg font-semibold hover:bg-orange-600 sidebar-button"
          aria-label="בדיקות מערכת"
          tabIndex={0}
          onClick={() => setIsSystemTesterOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && setIsSystemTesterOpen(true)}
        >
          <TestTube size={18} />
          🧪 בדיקות מערכת
        </button>
        
        <button 
          className="w-full sidebar-btn text-sm py-3 px-4 flex items-center gap-3 justify-center rounded-lg font-semibold hover:bg-orange-600 sidebar-button"
          aria-label="בדיקת ניווט"
          tabIndex={0}
          onClick={() => setIsNavigationTesterOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && setIsNavigationTesterOpen(true)}
        >
          <Navigation size={18} />
          🧭 בדיקת ניווט
        </button>
      </div>

      <SystemTester 
        isOpen={isSystemTesterOpen} 
        onClose={() => setIsSystemTesterOpen(false)} 
      />
      
      {isNavigationTesterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative">
            <button 
              onClick={() => setIsNavigationTesterOpen(false)}
              className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
            >
              ✕
            </button>
            <NavigationTester />
          </div>
        </div>
      )}
    </>
  );
}
