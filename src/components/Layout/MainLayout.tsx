
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="page-header p-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300 hover:scale-110" />
              <div className="flex-1">
                <h1 className="text-3xl font-black mb-2">מערכת ניהול MindFlow</h1>
                <p className="text-white/90 text-lg font-semibold">ביצועים נפשיים וספורט - ניהול מקצועי ומתקדם</p>
              </div>
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
                <p className="text-white/80 text-sm font-semibold">היום</p>
                <p className="font-black text-lg">{new Date().toLocaleDateString('he-IL')}</p>
              </div>
            </div>
          </header>
          <div className="flex-1 p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
