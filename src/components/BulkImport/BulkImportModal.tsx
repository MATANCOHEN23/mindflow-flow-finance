
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSmartInsert } from "@/hooks/useSmartInsert";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const [selectedTable, setSelectedTable] = useState<string>('contacts');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { bulkInsert } = useSmartInsert();

  const loadSheetJS = () => {
    return new Promise((resolve, reject) => {
      if (window.XLSX) {
        resolve(window.XLSX);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.onload = () => resolve(window.XLSX);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const parseFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      const XLSX = await loadSheetJS();
      const data = await file.arrayBuffer();
      
      let parsedRows = [];
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedRows = XLSX.utils.sheet_to_json(worksheet);
      } else if (file.name.endsWith('.txt') || file.name.endsWith('.docx')) {
        // For text/docx files, try to parse as simple text
        const text = new TextDecoder().decode(data);
        const lines = text.split('\n').filter(line => line.trim());
        parsedRows = lines.map((line, index) => ({
          first_name: line.trim(),
          id: index + 1
        }));
      }

      // Transform data based on selected table
      const transformedRows = parsedRows.map(row => {
        if (selectedTable === 'contacts') {
          return {
            first_name: row.first_name || row['שם פרטי'] || row.name || 'לא צוין',
            last_name: row.last_name || row['שם משפחה'] || '',
            phone_parent: row.phone_parent || row['טלפון'] || row.phone || '',
            email: row.email || row['אימייל'] || '',
            role_tags: row.role_tags || [row['תפקיד'] || 'לקוח'],
            notes: row.notes || row['הערות'] || ''
          };
        }
        return row;
      });

      setParsedData(transformedRows);
      toast.success(`${transformedRows.length} שורות נטענו בהצלחה! 📊`);
    } catch (error) {
      console.error('File parsing error:', error);
      toast.error('שגיאה בפענוח הקובץ');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTable]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        parseFile(acceptedFiles[0]);
      }
    }, [parseFile]),
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 text-center">
            📄 ייבוא קובץ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div>
            <Label htmlFor="table-select">בחר טבלה:</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="בחר טבלה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contacts">👥 לקוחות</SelectItem>
                <SelectItem value="deals">💼 עסקאות</SelectItem>
                <SelectItem value="payments">💳 תשלומים</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gold hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">
              {isDragActive ? 'שחרר את הקובץ כאן...' : 'גרור קובץ או לחץ לבחירה'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              תומך ב: Excel (.xlsx), CSV, Word (.docx), Text (.txt)
            </p>
          </div>

          {parsedData.length > 0 && (
            <div className="card p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {parsedData.length} רשומות מוכנות לייבוא
                </span>
              </div>
              <div className="text-sm text-green-600">
                דוגמה: {JSON.stringify(parsedData[0], null, 2).substring(0, 100)}...
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleImport}
              className="cta flex-1"
              disabled={isProcessing || parsedData.length === 0}
            >
              {isProcessing ? 'מייבא...' : `💾 ייבא ${parsedData.length} רשומות`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              ביטול
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
