
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSmartInsert } from "@/hooks/useSmartInsert";
import { FileDropZone } from "./FileDropZone";
import { DataPreview } from "./DataPreview";
import { ImportActions } from "./ImportActions";
import { FileProcessor } from "./FileProcessor";
import { TableSelector } from "./TableSelector";
import { ColumnMapper } from "./ColumnMapper";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const [selectedTable, setSelectedTable] = useState<string>('contacts');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { bulkInsert } = useSmartInsert();

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      const rows = await FileProcessor.parseFile(file, selectedTable);
      setRawData(rows);
      
      // Extract column names from first row
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        setCsvColumns(columns);
      }
      
      toast.success(`${rows.length} שורות נטענו בהצלחה! 📊`);
    } catch (error) {
      console.error('File parsing error:', error);
      toast.error('שגיאה בפענוח הקובץ');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTable]);

  const handleMappingChange = (mapping: Record<string, string>) => {
    setColumnMapping(mapping);
    
    // Transform data according to mapping
    const transformed = rawData.map(row => {
      const newRow: any = {};
      Object.entries(mapping).forEach(([csvCol, systemField]) => {
        if (systemField !== 'ignore' && row[csvCol] !== undefined) {
          newRow[systemField] = row[csvCol];
        }
      });
      return newRow;
    });
    
    setParsedData(transformed);
  };

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
    setRawData([]);
    setCsvColumns([]);
    setColumnMapping({});
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

          {csvColumns.length > 0 && (
            <ColumnMapper 
              csvColumns={csvColumns}
              onMappingChange={handleMappingChange}
            />
          )}

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
