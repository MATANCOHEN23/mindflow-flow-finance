
import { FileText } from "lucide-react";

interface DataPreviewProps {
  data: any[];
  onClearData: () => void;
}

export function DataPreview({ data, onClearData }: DataPreviewProps) {
  if (data.length === 0) return null;

  return (
    <div className="card p-4 bg-green-50 border-green-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-800">
            {data.length} רשומות מוכנות לייבוא
          </span>
        </div>
        <button
          onClick={onClearData}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          נקה
        </button>
      </div>
      <div className="text-sm text-green-600">
        דוגמה: {JSON.stringify(data[0], null, 2).substring(0, 100)}...
      </div>
    </div>
  );
}
