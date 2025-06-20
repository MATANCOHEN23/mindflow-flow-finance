
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
import { useState } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";
import { AddDealForm } from "@/components/Forms/AddDealForm";

// TODO: Replace with actual logo image
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

  const handleAddDeal = (dealData: any) => {
    console.log('Adding deal:', dealData);
    // TODO: Here we'll integrate with Supabase to save the deal
  };

  return (
    <>
      <Sidebar className="bg-gray-800 border-r border-gray-700">
        <SidebarHeader className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {/* TODO: Replace with actual logo image */}
            <div className="logo-placeholder">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">MindFlow</h2>
              <p className="text-gray-300 text-sm font-medium">CRM System</p>
            </div>
          </div>
        </SidebarHeader>
        
        {/* Quick Action Buttons */}
        <div className="p-4 space-y-3 border-b border-gray-700">
          <button 
            className="w-full btn-primary text-sm py-3 px-4 flex items-center gap-3 justify-center"
            aria-label="הוסף לקוח חדש"
            tabIndex={0}
            onClick={() => setIsClientFormOpen(true)}
            onKeyPress={(e) => e.key === 'Enter' && setIsClientFormOpen(true)}
          >
            <UserPlus size={18} />
            לקוח חדש
          </button>
          <button 
            className="w-full btn-secondary text-sm py-3 px-4 flex items-center gap-3 justify-center"
            aria-label="הוסף עסקה חדשה"
            tabIndex={0}
            onClick={() => setIsDealFormOpen(true)}
            onKeyPress={(e) => e.key === 'Enter' && setIsDealFormOpen(true)}
          >
            <Briefcase size={18} />
            עסקה חדשה
          </button>
        </div>
        
        <SidebarContent className="px-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold text-gray-300 mb-4 text-center">
              ניהול העסק
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      className={`text-base py-3 px-4 rounded-lg font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        location.pathname === item.url 
                          ? 'bg-orange-500 text-white hover:bg-orange-600' 
                          : 'text-gray-300 hover:text-white'
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
        
        <SidebarFooter className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div>
              <p className="font-semibold text-white text-sm">מנהל המערכת</p>
              <p className="text-gray-300 text-xs">admin@mindflow.co.il</p>
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
        onSubmit={handleAddDeal}
      />
    </>
  );
}
