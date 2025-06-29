
import { NewContactForm } from "@/components/Forms/NewContactForm";
import { NewDealForm } from "@/components/Forms/NewDealForm";
import { BulkImportModal } from "@/components/BulkImport/BulkImportModal";
import { SmartClientWizard } from "@/components/Forms/SmartClientWizard";

interface SidebarModalsProps {
  isContactFormOpen: boolean;
  onCloseContactForm: () => void;
  isDealFormOpen: boolean;
  onCloseDealForm: () => void;
  isImportModalOpen: boolean;
  onCloseImportModal: () => void;
  isSmartWizardOpen: boolean;
  onCloseSmartWizard: () => void;
}

export function SidebarModals({
  isContactFormOpen,
  onCloseContactForm,
  isDealFormOpen,
  onCloseDealForm,
  isImportModalOpen,
  onCloseImportModal,
  isSmartWizardOpen,
  onCloseSmartWizard,
}: SidebarModalsProps) {
  return (
    <>
      <NewContactForm 
        isOpen={isContactFormOpen}
        onClose={onCloseContactForm}
      />

      <NewDealForm 
        isOpen={isDealFormOpen}
        onClose={onCloseDealForm}
      />

      <BulkImportModal 
        isOpen={isImportModalOpen}
        onClose={onCloseImportModal}
      />

      <SmartClientWizard 
        isOpen={isSmartWizardOpen}
        onClose={onCloseSmartWizard}
      />
    </>
  );
}
