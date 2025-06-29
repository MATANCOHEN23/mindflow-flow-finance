
import { useEffect, useState } from "react";
import { UserPlus, Briefcase, Upload } from "lucide-react";

interface SidebarHeaderProps {
  onOpenSmartWizard: () => void;
  onOpenDealForm: () => void;
  onOpenImport: () => void;
}

export function SidebarHeader({ onOpenSmartWizard, onOpenDealForm, onOpenImport }: SidebarHeaderProps) {
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
      </div>
    </>
  );
}
