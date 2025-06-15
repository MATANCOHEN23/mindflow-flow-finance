import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode } from "react";
interface MainLayoutProps {
  children: ReactNode;
}
export function MainLayout({
  children
}: MainLayoutProps) {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="bg-white gold-border border-t-0 border-l-0 border-r-0 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-primary hover:bg-primary/10" />
              <div className="flex-1">
                <h1 className="text-[#145cb1] text-2xl font-extrabold text-center">מערכת ניהול MindFlow</h1>
                <p className="text-cyan-900 font-extrabold text-center text-xl">ניהול פיננסי</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">היום</p>
                <p className="font-semibold">{new Date().toLocaleDateString('he-IL')}</p>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>;
}