
import { SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar";

export function SidebarFooter() {
  return (
    <UISidebarFooter className="p-4 border-t border-gray-700">
      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(212, 175, 55, 0.3)'
      }}>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{ background: 'var(--cta)' }}
        >
          א
        </div>
        <div>
          <p className="font-semibold text-white text-sm">משתמש אורח</p>
          <p className="text-white/70 text-xs">גישה פתוחה</p>
        </div>
      </div>
    </UISidebarFooter>
  );
}
