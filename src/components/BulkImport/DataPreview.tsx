
import { FileText, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataPreviewProps {
  data: any[];
  onClearData: () => void;
}

export function DataPreview({ data, onClearData }: DataPreviewProps) {
  if (data.length === 0) return null;

  // Get first 5 rows for preview
  const previewData = data.slice(0, 5);
  const allKeys = data.length > 0 ? Object.keys(data[0]).filter(k => !k.startsWith('_')) : [];

  return (
    <div className="card p-4 bg-blue-50 border-blue-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-blue-800">
            תצוגה מקדימה - {data.length} רשומות מוכנות לייבוא
          </span>
        </div>
        <Button
          onClick={onClearData}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="h-4 w-4 ml-1" />
          נקה
        </Button>
      </div>
      
      <div className="text-sm text-blue-600 mb-2">
        מציג {previewData.length} שורות ראשונות מתוך {data.length}
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {allKeys.map((key) => (
                <TableHead key={key} className="font-bold">
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, idx) => (
              <TableRow key={idx}>
                {allKeys.map((key) => (
                  <TableCell key={key} className="max-w-[200px] truncate">
                    {typeof row[key] === 'object' 
                      ? JSON.stringify(row[key])
                      : String(row[key] || '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
