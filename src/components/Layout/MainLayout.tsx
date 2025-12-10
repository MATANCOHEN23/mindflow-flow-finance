import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { GlobalSearch } from "@/components/Search/GlobalSearch";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-row-reverse">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="page-header-flyer p-4 md:p-6 shadow-xl">
            <div className="content-boxed">
              <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                <SidebarTrigger 
                  className="text-cream hover:bg-white/20 p-3 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-3 focus:ring-gold/50 border-2 border-gold/50" 
                  aria-label="פתח/סגור תפריט צד"
                  tabIndex={0}
                />
                <div className="logo-container">
                  <div className="logo-brain">🧠</div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black mb-1 text-cream">MindFlow CRM</h1>
                    <p className="text-cream/90 text-sm md:text-lg font-bold hidden sm:block">ביצועים נפשיים וספורט - ניהול מקצועי ומתקדם</p>
                  </div>
                </div>
                
                {/* Global Search */}
                <div className="flex-1 max-w-xs lg:max-w-md hidden md:block">
                  <GlobalSearch />
                </div>
                
                <div className="mr-auto orange-box">
                  <p className="text-xs md:text-sm font-bold">📅 היום</p>
                  <p className="font-black text-base md:text-lg">{new Date().toLocaleDateString('he-IL')}</p>
                </div>
              </div>
              
              {/* Mobile search - below header content */}
              <div className="mt-4 md:hidden">
                <GlobalSearch />
              </div>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-6" style={{
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
