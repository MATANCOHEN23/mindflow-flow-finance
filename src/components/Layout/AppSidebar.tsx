
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
    <Sidebar className="border-l border-gold/30">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">MindFlow</h2>
            <p className="text-sm text-muted-foreground">CRM System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-primary mb-4">
            ניהול העסק
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="text-base py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-6">
        <div className="gold-border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div>
              <p className="font-medium">מנהל המערכת</p>
              <p className="text-sm text-muted-foreground">admin@mindflow.co.il</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
