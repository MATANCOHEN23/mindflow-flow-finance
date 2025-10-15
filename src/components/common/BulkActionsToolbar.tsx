import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface BulkActionsToolbarProps {
  count: number;
  onDelete: () => void;
  onClear: () => void;
  isDeleting?: boolean;
}

export function BulkActionsToolbar({ count, onDelete, onClear, isDeleting }: BulkActionsToolbarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="premium-card flex items-center gap-4 p-4 shadow-2xl border-2 border-primary">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg">{count}</span>
          <span>פריטים נבחרו</span>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          מחק
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          בטל
        </Button>
      </div>
    </div>
  );
}
