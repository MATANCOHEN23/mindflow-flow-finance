
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [importProgress, setImportProgress] = useState(0);
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

  const handleMappingChange = async (mapping: Record<string, string>) => {
    setColumnMapping(mapping);
    
    // Fetch all domains for resolution
    const { data: allDomains } = await supabase.from('domains').select('*');
    
    // Build domain lookup map
    const domainMap = new Map<string, string>();
    allDomains?.forEach(d => {
      const key = `${d.name.toLowerCase()}_${d.level}_${d.parent_id || 'root'}`;
      domainMap.set(key, d.id);
      // Also add simple name lookup for level 1 (root domains)
      if (d.level === 1) {
        domainMap.set(d.name.toLowerCase(), d.id);
      }
    });
    
    // Transform data according to mapping with domain resolution
    const transformed = rawData.map(row => {
      const newRow: any = {};
      let unresolved = false;
      
      Object.entries(mapping).forEach(([csvCol, systemField]) => {
        if (systemField !== 'ignore' && row[csvCol] !== undefined) {
          // Handle domain fields - resolve to IDs
          if (systemField === 'domain') {
            const domainName = row[csvCol]?.toString().toLowerCase().trim();
            const domainId = domainMap.get(domainName);
            if (domainId) {
              newRow.domain_id = domainId;
            } else {
              newRow.domain = row[csvCol]; // Keep original for manual fixing
              unresolved = true;
            }
          } else if (systemField === 'sub_domain' || systemField === 'sub_sub_domain') {
            // Store for later processing after domain is resolved
            newRow[systemField] = row[csvCol];
          } else {
            newRow[systemField] = row[csvCol];
          }
        }
      });
      
      // Mark unresolved rows
      if (unresolved) {
        newRow._unresolved = true;
      }
      
      return newRow;
    });
    
    setParsedData(transformed);
  };

  const upsertContact = async (contact: any, index: number, total: number) => {
    try {
      // בדיקה אם לקוח קיים לפי אימייל או טלפון
      let existingContact = null;
      
      if (contact.email && contact.email.trim()) {
        const { data } = await supabase
          .from('contacts')
          .select('id')
          .eq('email', contact.email.trim().toLowerCase())
          .limit(1)
          .maybeSingle();
        existingContact = data;
      }
      
      if (!existingContact && contact.phone && contact.phone.trim()) {
        const { data } = await supabase
          .from('contacts')
          .select('id')
          .eq('phone', contact.phone.trim())
          .limit(1)
          .maybeSingle();
        existingContact = data;
      }

      if (existingContact) {
        // עדכון לקוח קיים
        await supabase
          .from('contacts')
          .update(contact)
          .eq('id', existingContact.id);
        return { action: 'updated', id: existingContact.id };
      } else {
        // יצירת לקוח חדש
        const { data } = await supabase
          .from('contacts')
          .insert([contact])
          .select()
          .single();
        return { action: 'created', id: data?.id };
      }
    } catch (error) {
      console.error('Error upserting contact:', error);
      throw error;
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('אין נתונים לייבוא');
      return;
    }

    setIsProcessing(true);
    setImportProgress(0);
    
    let created = 0;
    let updated = 0;
    let failed = 0;

    try {
      const batchSize = 10;
      const totalBatches = Math.ceil(parsedData.length / batchSize);
      
      for (let i = 0; i < totalBatches; i++) {
        const batch = parsedData.slice(i * batchSize, (i + 1) * batchSize);
        
        const results = await Promise.allSettled(
          batch.map((item, idx) => upsertContact(item, i * batchSize + idx, parsedData.length))
        );
        
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            if (result.value.action === 'created') created++;
            else updated++;
          } else {
            failed++;
          }
        });
        
        setImportProgress(((i + 1) / totalBatches) * 100);
      }
      
      toast.success(`✅ ייבוא הושלם! ${created} נוצרו, ${updated} עודכנו${failed > 0 ? `, ${failed} נכשלו` : ''}`);
      setParsedData([]);
      setRawData([]);
      setCsvColumns([]);
      setColumnMapping({});
      setImportProgress(0);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('שגיאה בייבוא הנתונים');
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

          {isProcessing && importProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>מייבא נתונים...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

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
