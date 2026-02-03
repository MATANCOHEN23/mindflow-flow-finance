import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Table as TableIcon, Eye } from 'lucide-react';
import { ExportColumn } from '@/lib/export/excelExporter';

interface ColumnConfig {
  key: string;
  label: string;
  selected: boolean;
}

interface DataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  columns: ExportColumn[];
  entityName: string;
  onExportExcel: (selectedColumns: string[]) => void;
  onExportCSV: (selectedColumns: string[]) => void;
}

export function DataPreviewModal({
  isOpen,
  onClose,
  data,
  columns,
  entityName,
  onExportExcel,
  onExportCSV,
}: DataPreviewModalProps) {
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(() =>
    columns.map(col => ({ key: col.key, label: col.header, selected: true }))
  );

  // Update column config when columns prop changes
  React.useEffect(() => {
    setColumnConfig(columns.map(col => ({ key: col.key, label: col.header, selected: true })));
  }, [columns]);

  const selectedColumns = useMemo(() => 
    columnConfig.filter(col => col.selected),
    [columnConfig]
  );

  const previewData = useMemo(() => data.slice(0, 10), [data]);

  const toggleColumn = (key: string) => {
    setColumnConfig(prev =>
      prev.map(col =>
        col.key === key ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const toggleAllColumns = (checked: boolean) => {
    setColumnConfig(prev =>
      prev.map(col => ({ ...col, selected: checked }))
    );
  };

  const handleExportExcel = () => {
    onExportExcel(selectedColumns.map(col => col.key));
    onClose();
  };

  const handleExportCSV = () => {
    onExportCSV(selectedColumns.map(col => col.key));
    onClose();
  };

  const getCellValue = (row: any, key: string): string => {
    const value = row[key];
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'כן' : 'לא';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Eye className="h-6 w-6" />
            תצוגה מקדימה לייצוא - {entityName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Summary */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              סה"כ: {data.length} רשומות
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              עמודות נבחרות: {selectedColumns.length} מתוך {columns.length}
            </Badge>
          </div>

          {/* Column Selection */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">בחר עמודות לייצוא</h3>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedColumns.length === columns.length}
                  onCheckedChange={(checked) => toggleAllColumns(!!checked)}
                  id="select-all"
                />
                <label htmlFor="select-all" className="text-sm cursor-pointer">
                  בחר הכל
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {columnConfig.map(col => (
                <div
                  key={col.key}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                    col.selected 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => toggleColumn(col.key)}
                >
                  <Checkbox
                    checked={col.selected}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="pointer-events-none"
                  />
                  <span className="text-sm">{col.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Preview */}
          <div className="flex-1 overflow-hidden border rounded-lg">
            <div className="p-3 bg-muted/30 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                תצוגה מקדימה (עד 10 שורות ראשונות)
              </h3>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      {selectedColumns.map(col => (
                        <TableHead key={col.key} className="text-right min-w-[120px]">
                          {col.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={selectedColumns.length + 1} 
                          className="text-center py-8 text-muted-foreground"
                        >
                          אין נתונים להצגה
                        </TableCell>
                      </TableRow>
                    ) : (
                      previewData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          {selectedColumns.map(col => (
                            <TableCell key={col.key} className="max-w-[200px] truncate">
                              {getCellValue(row, col.key)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
            {data.length > 10 && (
              <div className="p-2 bg-muted/30 border-t text-center text-sm text-muted-foreground">
                ... ו-{data.length - 10} רשומות נוספות
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            disabled={selectedColumns.length === 0}
            className="gap-2"
          >
            <TableIcon className="h-4 w-4" />
            ייצא CSV
          </Button>
          <Button 
            onClick={handleExportExcel}
            disabled={selectedColumns.length === 0}
            className="gap-2 btn-premium"
          >
            <FileSpreadsheet className="h-4 w-4" />
            ייצא Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
