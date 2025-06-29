
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSmartInsert } from "@/hooks/useSmartInsert";
import { FileDropZone } from "./FileDropZone";
import { DataPreview } from "./DataPreview";
import { ImportActions } from "./ImportActions";
import { FileProcessor } from "./FileProcessor";
import { TableSelector } from "./TableSelector";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const [selectedTable, setSelectedTable] = useState<string>('contacts');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { bulkInsert } = useSmartInsert();

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      const transformedRows = await FileProcessor.parseFile(file, selectedTable);
      setParsedData(transformedRows);
      toast.success(`${transformedRows.length} שורות נטענו בהצלחה! 📊`);
    } catch (error) {
      console.error('File parsing error:', error);
      toast.error('שגיאה בפענוח הקובץ');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTable]);

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('אין נתונים לייבוא');
      return;
    }

    setIsProcessing(true);
    try {
      await bulkInsert(selectedTable, parsedData);
      setParsedData([]);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearData = () => {
    setParsedData([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 text-center">
            📄 ייבוא קובץ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <TableSelector 
            selectedTable={selectedTable}
            onTableChange={setSelectedTable}
          />

          <FileDropZone 
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
          />

          <DataPreview 
            data={parsedData}
            onClearData={handleClearData}
          />

          <ImportActions
            onImport={handleImport}
            onClose={onClose}
            isProcessing={isProcessing}
            dataCount={parsedData.length}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
