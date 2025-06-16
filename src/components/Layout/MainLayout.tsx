
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
          <header className="page-header-flyer p-6 shadow-xl">
            <div className="content-boxed">
              <div className="flex items-center gap-6">
                <SidebarTrigger 
                  className="text-cream hover:bg-white/20 p-3 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-3 focus:ring-gold/50 border-2 border-gold/50" 
                  aria-label="פתח/סגור תפריט צד"
                  tabIndex={0}
                />
                <div className="logo-container">
                  <div className="logo-brain">🧠</div>
                  <div>
                    <h1 className="text-3xl font-black mb-1 text-cream">MindFlow CRM</h1>
                    <p className="text-cream/90 text-lg font-bold">ביצועים נפשיים וספורט - ניהול מקצועי ומתקדם</p>
                  </div>
                </div>
                <div className="mr-auto orange-box">
                  <p className="text-sm font-bold">📅 היום</p>
                  <p className="font-black text-lg">{new Date().toLocaleDateString('he-IL')}</p>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6" style={{
            background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 30%, #1E90FF 70%, #0000CD 100%)'
          }}>
            <div className="content-boxed">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
