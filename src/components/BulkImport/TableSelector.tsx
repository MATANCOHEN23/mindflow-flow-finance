
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TableSelectorProps {
  selectedTable: string;
  onTableChange: (table: string) => void;
}

export function TableSelector({ selectedTable, onTableChange }: TableSelectorProps) {
  return (
    <div>
      <Label htmlFor="table-select">בחר טבלה:</Label>
      <Select value={selectedTable} onValueChange={onTableChange}>
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
  );
}
