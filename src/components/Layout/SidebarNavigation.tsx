
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

const menuItems = [
  {
    title: "דף הבית",
    url: "/",
    icon: "🏠",
  },
  {
    title: "לוח בקרה",
    url: "/dashboard",
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

export function SidebarNavigation() {
  const location = useLocation();

  return (
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
  );
}
