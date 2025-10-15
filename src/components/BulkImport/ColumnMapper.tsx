import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ColumnMapperProps {
  csvColumns: string[];
  onMappingChange: (mapping: Record<string, string>) => void;
}

const SYSTEM_FIELDS = [
  { value: 'first_name', label: '👤 שם פרטי', keywords: ['שם', 'פרטי', 'first', 'name'] },
  { value: 'last_name', label: '📝 שם משפחה', keywords: ['משפחה', 'last', 'surname'] },
  { value: 'phone', label: '📱 טלפון', keywords: ['טלפון', 'נייד', 'phone', 'mobile', 'cell'] },
  { value: 'email', label: '📧 אימייל', keywords: ['מייל', 'אימייל', 'email', 'mail'] },
  { value: 'domain_name', label: '🏢 תחום', keywords: ['תחום', 'domain', 'category'] },
  { value: 'sub_domain', label: '📂 תת-תחום', keywords: ['תת', 'sub', 'תחום משני'] },
  { value: 'sub_sub_domain', label: '📁 תת-תת-תחום', keywords: ['רמה 3', 'level 3'] },
  { value: 'notes', label: '📄 הערות', keywords: ['הערות', 'notes', 'comments', 'description'] },
  { value: 'child_name', label: '👶 שם ילד', keywords: ['ילד', 'child', 'kid', 'בן', 'בת'] },
  { value: 'phone_parent', label: '📞 טלפון הורה', keywords: ['הורה', 'parent', 'אב', 'אם'] },
  { value: 'ignore', label: '🚫 התעלם', keywords: [] },
];

export function ColumnMapper({ csvColumns, onMappingChange }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [autoMatchCount, setAutoMatchCount] = useState(0);

  // Smart auto-match algorithm
  useEffect(() => {
    const autoMapping: Record<string, string> = {};
    let matchCount = 0;
    
    csvColumns.forEach(col => {
      const colLower = col.toLowerCase().trim();
      
      // Find best match
      for (const field of SYSTEM_FIELDS) {
        if (field.value === 'ignore') continue;
        
        const hasMatch = field.keywords.some(keyword => 
          colLower.includes(keyword.toLowerCase())
        );
        
        if (hasMatch) {
          autoMapping[col] = field.value;
          matchCount++;
          break;
        }
      }
      
      // Default to ignore if no match
      if (!autoMapping[col]) {
        autoMapping[col] = 'ignore';
      }
    });
    
    setMapping(autoMapping);
    setAutoMatchCount(matchCount);
    onMappingChange(autoMapping);
  }, [csvColumns, onMappingChange]);

  const handleMappingChange = (csvColumn: string, systemField: string) => {
    const newMapping = { ...mapping, [csvColumn]: systemField };
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  const getMappedCount = () => {
    return Object.values(mapping).filter(val => val !== 'ignore').length;
  };

  return (
    <Card className="bg-white shadow-lg border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🔗 התאמת עמודות
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {autoMatchCount} התאמות אוטומטיות
            </Badge>
            <Badge variant="default">
              {getMappedCount()} עמודות ממופות
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">עמודה ב-CSV</TableHead>
              <TableHead className="text-center w-20">↔️</TableHead>
              <TableHead className="text-right">שדה במערכת</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvColumns.map(col => (
              <TableRow key={col} className={mapping[col] === 'ignore' ? 'opacity-50' : ''}>
                <TableCell className="font-medium">{col}</TableCell>
                <TableCell className="text-center">→</TableCell>
                <TableCell>
                  <Select 
                    value={mapping[col] || 'ignore'} 
                    onValueChange={(value) => handleMappingChange(col, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SYSTEM_FIELDS.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
