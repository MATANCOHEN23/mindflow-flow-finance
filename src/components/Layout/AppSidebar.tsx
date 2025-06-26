
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { UserPlus, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";
import { AddDealForm } from "@/components/Forms/AddDealForm";

const logoUrl = "/placeholder-logo.png";

const menuItems = [
  {
    title: "לוח בקרה",
    url: "/",
    icon: "📊",
  },
  {
    title: "לקוחות",
    url: "/contacts",
    icon: "👥",
  },
  {
    title: "עסקאות",
    url: "/deals",
    icon: "💼",
  },
  {
    title: "תשלומים",
    url: "/payments",
    icon: "💳",
  },
  {
    title: "אירועי יום הולדת",
    url: "/birthday-events",
    icon: "🎂",
  },
  {
    title: "טיפולים",
    url: "/therapy",
    icon: "🧠",
  },
  {
    title: "אימוני כדורסל",
    url: "/basketball",
    icon: "🏀",
  },
  {
    title: "סדנאות בית ספר",
    url: "/school-workshops",
    icon: "🎓",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);

  // Listen for deal form open events from Dashboard
  useEffect(() => {
    const handleOpenDealForm = () => setIsDealFormOpen(true);
    window.addEventListener('openDealForm', handleOpenDealForm);
    return () => window.removeEventListener('openDealForm', handleOpenDealForm);
  }, []);

  return (
    <>
      <Sidebar className="border-r border-gray-700" style={{ background: 'var(--sidebar-bg)' }}>
        <SidebarHeader className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="logo-placeholder">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white glow-text">MindFlow</h2>
              <p className="text-white/80 text-sm font-medium">CRM System</p>
            </div>
          </div>
        </SidebarHeader>
        
        {/* Quick Action Buttons */}
        <div className="p-4 space-y-3 border-b border-gray-700">
          <button 
            className="w-full sidebar-btn text-sm py-3 px-4 flex items-center gap-3 justify-center rounded-lg font-semibold hover:bg-orange-600"
            aria-label="הוסף לקוח חדש"
            tabIndex={0}
            onClick={() => setIsClientFormOpen(true)}
            onKeyPress={(e) => e.key === 'Enter' && setIsClientFormOpen(true)}
          >
            <UserPlus size={18} />
            לקוח חדש
          </button>
          <button 
            className="w-full text-sm py-3 px-4 flex items-center gap-3 justify-center rounded-lg font-semibold transition-all duration-300 hover:bg-orange-600"
            style={{ 
              background: 'var(--cta)',
              color: 'white',
              boxShadow: '0 0 6px rgba(255, 141, 58, 0.6)'
            }}
            aria-label="הוסף עסקה חדשה"
            tabIndex={0}
            onClick={() => setIsDealFormOpen(true)}
            onKeyPress={(e) => e.key === 'Enter' && setIsDealFormOpen(true)}
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
        </div>
        
        <SidebarContent className="px-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold text-white/90 mb-4 text-center glow-text">
              ניהול העסק
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      className="p-0"
                    >
                      <Link 
                        to={item.url} 
                        className={`sidebar-item ${
                          location.pathname === item.url ? 'active' : ''
                        }`}
                        tabIndex={0}
                      >
                        <span className="text-xl" aria-hidden="true">{item.icon}</span>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--cta)' }}
            >
              A
            </div>
            <div>
              <p className="font-semibold text-white text-sm">מנהל המערכת</p>
              <p className="text-white/70 text-xs">admin@mindflow.co.il</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <AddClientForm 
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
      />

      <AddDealForm 
        isOpen={isDealFormOpen}
        onClose={() => setIsDealFormOpen(false)}
      />
    </>
  );
}
