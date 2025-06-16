
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-contentBG">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="page-header p-4 shadow-lg">
            <div className="content-boxed">
              <div className="flex items-center gap-4">
                <SidebarTrigger 
                  className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-white/30" 
                  aria-label="פתח/סגור תפריט צד"
                  tabIndex={0}
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-black mb-1 text-white">מערכת ניהול MindFlow</h1>
                  <p className="text-white/90 text-base font-semibold">ביצועים נפשיים וספורט - ניהול מקצועי ומתקדם</p>
                </div>
                <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-white/80 text-sm font-semibold">היום</p>
                  <p className="font-black text-base text-white">{new Date().toLocaleDateString('he-IL')}</p>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6">
            <div className="content-boxed">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
