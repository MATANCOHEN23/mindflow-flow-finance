
import { Button } from "@/components/ui/button";

interface ImportActionsProps {
  onImport: () => void;
  onClose: () => void;
  isProcessing: boolean;
  dataCount: number;
}

export function ImportActions({ onImport, onClose, isProcessing, dataCount }: ImportActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        onClick={onImport}
        className="cta flex-1"
        disabled={isProcessing || dataCount === 0}
      >
        {isProcessing ? 'מייבא...' : `💾 ייבא ${dataCount} רשומות`}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="flex-1"
        disabled={isProcessing}
      >
        ביטול
      </Button>
    </div>
  );
}
