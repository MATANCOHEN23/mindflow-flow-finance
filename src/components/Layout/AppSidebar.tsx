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
    <Sidebar className="sidebar-fixed bg-primary border-l border-borderGold">
      <SidebarHeader className="p-6 bg-primary">
        <div className="premium-card bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black text-xl shadow-lg">
              M
            </div>
            <div>
              <h2 className="text-xl font-black text-white">MindFlow</h2>
              <p className="text-white/80 font-semibold text-sm">CRM System</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      {/* Quick Action Buttons */}
      <div className="px-4 py-4 space-y-2">
        <button 
          className="w-full btn-accent text-sm py-2 px-4 flex items-center gap-2"
          aria-label="הוסף לקוח חדש"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.click()}
        >
          <UserPlus size={16} />
          לקוח חדש
        </button>
        <button 
          className="w-full bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-102 flex items-center gap-2"
          aria-label="הוסף עסקה חדשה"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.click()}
        >
          <Briefcase size={16} />
          עסקה חדשה
        </button>
      </div>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-black text-white/90 mb-4 text-center">
            ניהול העסק
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`text-base py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                      location.pathname === item.url 
                        ? 'bg-white text-primary shadow-lg' 
                        : 'hover:bg-white/20 text-white/90 hover:text-white'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3" tabIndex={0}>
                      <span className="text-xl" aria-hidden="true">{item.icon}</span>
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
        <div className="premium-card bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg">
              A
            </div>
            <div>
              <p className="font-black text-white text-sm">מנהל המערכת</p>
              <p className="text-white/70 font-semibold text-xs">admin@mindflow.co.il</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
