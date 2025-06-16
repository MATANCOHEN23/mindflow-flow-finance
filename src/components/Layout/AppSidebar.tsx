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

  return (
    <Sidebar className="sidebar-fixed sidebar-flyer">
      <SidebarHeader className="p-6">
        <div className="flyer-card">
          <div className="logo-container">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-cream font-black text-2xl shadow-lg border-2 border-gold">
              🧠
            </div>
            <div>
              <h2 className="text-2xl font-black text-cream">MindFlow</h2>
              <p className="text-cream/90 font-bold text-base">CRM System</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      {/* Quick Action Buttons */}
      <div className="px-4 py-4 space-y-3">
        <button 
          className="w-full btn-flyer text-base py-3 px-4 flex items-center gap-3"
          aria-label="הוסף לקוח חדש"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.click()}
        >
          <UserPlus size={20} />
          לקוח חדש
        </button>
        <button 
          className="w-full btn-flyer text-base py-3 px-4 flex items-center gap-3"
          aria-label="הוסף עסקה חדשה"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.click()}
        >
          <Briefcase size={20} />
          עסקה חדשה
        </button>
      </div>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-black text-cream/90 mb-4 text-center text-shadow">
            ✨ ניהול העסק ✨
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`text-lg py-4 px-5 rounded-xl font-bold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold/50 border-2 ${
                      location.pathname === item.url 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-cream shadow-xl border-gold scale-105' 
                        : 'hover:bg-white/20 text-cream/90 hover:text-cream border-gold/30 hover:border-gold'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-4" tabIndex={0}>
                      <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flyer-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-cream text-lg font-black shadow-lg border-2 border-gold">
              A
            </div>
            <div>
              <p className="font-black text-cream text-base">מנהל המערכת</p>
              <p className="text-cream/80 font-bold text-sm">admin@mindflow.co.il</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
