import { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLocation, Link } from "react-router-dom";
import { useDomains } from '@/hooks/useDomains';

export function SidebarNavigation() {
  const location = useLocation();
  const { data: domains } = useDomains();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const coreMenuItems = [
    { title: "דף הבית", url: "/", icon: "🏠" },
    { title: "לוח בקרה", url: "/dashboard", icon: "📊" },
    { title: "לקוחות", url: "/contacts", icon: "👥" },
    { title: "תשלומים", url: "/payments", icon: "💳" },
    { title: "אירועים", url: "/events", icon: "📅" },
    { title: "משימות", url: "/tasks", icon: "✅" },
    { title: "דוחות", url: "/reports", icon: "📊" },
    { title: "ניהול תחומים", url: "/domains", icon: "⚙️" },
  ];

  const domainGroups = useMemo(() => {
    if (!domains) return [];
    
    const roots = domains.filter(d => !d.parent_id && d.is_active);
    return roots.map(root => ({
      title: root.name,
      icon: root.icon || "📁",
      url: `/domain/${root.id}`,
      id: root.id,
      children: domains
        .filter(d => d.parent_id === root.id && d.is_active)
        .map(child => ({
          title: child.name,
          icon: child.icon || "📄",
          url: `/domain/${child.id}`,
          id: child.id
        }))
    }));
  }, [domains]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <SidebarContent className="px-4">
      <SidebarGroup>
        <SidebarGroupLabel className="text-lg font-bold text-white/90 mb-4 text-center glow-text">
          ניהול העסק
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {coreMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.url}
                  className="p-0"
                >
                  <Link 
                    to={item.url} 
                    className={`sidebar-item ${location.pathname === item.url ? 'active' : ''}`}
                  >
                    <span className="text-xl icon">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {domainGroups.length > 0 && (
              <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-xs text-white/60 mb-2 px-2">התחומים שלי</p>
                {domainGroups.map((group) => (
                  <Collapsible 
                    key={group.id}
                    open={openGroups.has(group.id)}
                    onOpenChange={() => toggleGroup(group.id)}
                  >
                    <CollapsibleTrigger className="sidebar-item w-full justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl icon">{group.icon}</span>
                        <span className="font-medium">{group.title}</span>
                      </div>
                      {group.children && group.children.length > 0 && (
                        openGroups.has(group.id) ? 
                          <ChevronDown className="h-4 w-4 icon" /> : 
                          <ChevronLeft className="h-4 w-4 icon" />
                      )}
                    </CollapsibleTrigger>
                    {group.children && group.children.length > 0 && (
                      <CollapsibleContent className="mr-6 mt-1">
                        {group.children.map((child) => (
                          <Link 
                            key={child.id}
                            to={child.url} 
                            className={`sidebar-item text-sm ${location.pathname === child.url ? 'active' : ''}`}
                          >
                            <span className="text-lg icon">{child.icon}</span>
                            <span className="font-medium">{child.title}</span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                ))}
              </div>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
