
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
    <Sidebar className="border-l-4 border-goldBorder bg-gradient-to-b from-white via-skyBlue/10 to-primary/5">
      <SidebarHeader className="p-8">
        <div className="premium-card shine-effect">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-goldBorder/50">
              M
            </div>
            <div>
              <h2 className="text-2xl font-black gradient-text">MindFlow</h2>
              <p className="text-primary/70 font-bold">CRM System</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-black gradient-text mb-6 text-center">
            ניהול העסק
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`text-lg py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${
                      location.pathname === item.url 
                        ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg border-2 border-goldBorder/50' 
                        : 'hover:bg-gradient-to-r hover:from-accent/20 hover:to-primary/20 hover:text-primary'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-4">
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-6">
        <div className="premium-card bg-gradient-to-r from-primary/10 via-accent/10 to-teal/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg">
              A
            </div>
            <div>
              <p className="font-black text-primary">מנהל המערכת</p>
              <p className="text-primary/70 font-semibold">admin@mindflow.co.il</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
