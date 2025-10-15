
import {
  Sidebar,
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarModals } from "./SidebarModals";

export function AppSidebar() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSmartWizardOpen, setIsSmartWizardOpen] = useState(false);

  return (
    <>
      <Sidebar 
        side="right"
        className="border-l border-gray-700"
        style={{ 
          background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <UISidebarHeader>
          <SidebarHeader
            onOpenSmartWizard={() => setIsSmartWizardOpen(true)}
            onOpenDealForm={() => setIsDealFormOpen(true)}
            onOpenImport={() => setIsImportModalOpen(true)}
          />
        </UISidebarHeader>
        
        <SidebarNavigation />
        
        <SidebarFooter />
      </Sidebar>

      <SidebarModals
        isContactFormOpen={isContactFormOpen}
        onCloseContactForm={() => setIsContactFormOpen(false)}
        isDealFormOpen={isDealFormOpen}
        onCloseDealForm={() => setIsDealFormOpen(false)}
        isImportModalOpen={isImportModalOpen}
        onCloseImportModal={() => setIsImportModalOpen(false)}
        isSmartWizardOpen={isSmartWizardOpen}
        onCloseSmartWizard={() => setIsSmartWizardOpen(false)}
      />
    </>
  );
}
