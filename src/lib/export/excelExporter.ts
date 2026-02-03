import * as XLSX from 'xlsx';

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
}

export interface ExportOptions {
  filename: string;
  sheetName?: string;
  columns?: ExportColumn[];
}

// Hebrew column mappings for different entities
export const CONTACT_COLUMNS: ExportColumn[] = [
  { key: 'first_name', header: 'שם פרטי', width: 15 },
  { key: 'last_name', header: 'שם משפחה', width: 15 },
  { key: 'phone', header: 'טלפון', width: 15 },
  { key: 'phone_parent', header: 'טלפון הורה', width: 15 },
  { key: 'email', header: 'אימייל', width: 25 },
  { key: 'child_name', header: 'שם ילד', width: 15 },
  { key: 'category', header: 'קטגוריה', width: 15 },
  { key: 'notes', header: 'הערות', width: 30 },
  { key: 'created_at', header: 'תאריך יצירה', width: 15 },
];

export const DEAL_COLUMNS: ExportColumn[] = [
  { key: 'title', header: 'כותרת', width: 25 },
  { key: 'contact_name', header: 'לקוח', width: 20 },
  { key: 'category', header: 'קטגוריה', width: 15 },
  { key: 'amount_total', header: 'סכום כולל', width: 12 },
  { key: 'amount_paid', header: 'שולם', width: 12 },
  { key: 'payment_status', header: 'סטטוס תשלום', width: 15 },
  { key: 'workflow_stage', header: 'שלב', width: 15 },
  { key: 'notes', header: 'הערות', width: 30 },
  { key: 'created_at', header: 'תאריך יצירה', width: 15 },
];

export const PAYMENT_COLUMNS: ExportColumn[] = [
  { key: 'contact_name', header: 'לקוח', width: 20 },
  { key: 'deal_title', header: 'עסקה', width: 25 },
  { key: 'amount', header: 'סכום', width: 12 },
  { key: 'status', header: 'סטטוס', width: 12 },
  { key: 'payment_method', header: 'אמצעי תשלום', width: 15 },
  { key: 'due_date', header: 'תאריך לתשלום', width: 15 },
  { key: 'payment_date', header: 'תאריך תשלום', width: 15 },
  { key: 'notes', header: 'הערות', width: 30 },
];

export const EVENT_COLUMNS: ExportColumn[] = [
  { key: 'title', header: 'כותרת', width: 25 },
  { key: 'event_date', header: 'תאריך', width: 15 },
  { key: 'event_time', header: 'שעה', width: 10 },
  { key: 'location', header: 'מיקום', width: 20 },
  { key: 'status', header: 'סטטוס', width: 12 },
  { key: 'participants_count', header: 'מספר משתתפים', width: 15 },
  { key: 'notes', header: 'הערות', width: 30 },
];

// Status translations
const STATUS_TRANSLATIONS: Record<string, string> = {
  'pending': 'ממתין',
  'paid': 'שולם',
  'overdue': 'באיחור',
  'partial': 'חלקי',
  'cancelled': 'בוטל',
  'scheduled': 'מתוכנן',
  'completed': 'הושלם',
  'lead': 'ליד',
  'contacted': 'בקשר',
  'negotiation': 'משא ומתן',
  'proposal': 'הצעה',
  'won': 'נסגר',
  'lost': 'אבוד',
};

const PAYMENT_METHOD_TRANSLATIONS: Record<string, string> = {
  'cash': 'מזומן',
  'credit': 'אשראי',
  'transfer': 'העברה',
  'check': 'צ\'ק',
  'bit': 'ביט',
  'paybox': 'פייבוקס',
};

function translateValue(value: any, key: string): any {
  if (value === null || value === undefined) return '';
  
  // Translate status fields
  if (key === 'status' || key === 'payment_status' || key === 'workflow_stage') {
    return STATUS_TRANSLATIONS[value] || value;
  }
  
  // Translate payment method
  if (key === 'payment_method') {
    return PAYMENT_METHOD_TRANSLATIONS[value] || value;
  }
  
  // Format dates
  if (key.includes('date') || key === 'created_at' || key === 'updated_at') {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('he-IL');
      }
    }
    return value;
  }
  
  // Format currency
  if (key === 'amount' || key === 'amount_total' || key === 'amount_paid') {
    const num = Number(value);
    if (!isNaN(num)) {
      return `₪${num.toLocaleString('he-IL')}`;
    }
    return value;
  }
  
  return value;
}

function prepareDataForExport(data: any[], columns: ExportColumn[]): any[] {
  return data.map(row => {
    const exportRow: Record<string, any> = {};
    columns.forEach(col => {
      const rawValue = row[col.key];
      exportRow[col.header] = translateValue(rawValue, col.key);
    });
    return exportRow;
  });
}

export function exportToExcel(data: any[], options: ExportOptions): void {
  const { filename, sheetName = 'נתונים', columns } = options;
  
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  let exportData: any[];
  let headers: string[];
  let colWidths: number[];

  if (columns && columns.length > 0) {
    exportData = prepareDataForExport(data, columns);
    headers = columns.map(c => c.header);
    colWidths = columns.map(c => c.width || 15);
  } else {
    // Auto-generate from data keys
    headers = Object.keys(data[0]);
    exportData = data;
    colWidths = headers.map(() => 15);
  }

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData, { header: headers });

  // Set column widths
  ws['!cols'] = colWidths.map(w => ({ wch: w }));

  // Set RTL direction for the sheet
  ws['!dir'] = 'rtl';

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${date}.xlsx`;

  // Download file
  XLSX.writeFile(wb, fullFilename);
}

export function exportToCSV(data: any[], options: ExportOptions): void {
  const { filename, columns } = options;
  
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  let exportData: any[];

  if (columns && columns.length > 0) {
    exportData = prepareDataForExport(data, columns);
  } else {
    exportData = data;
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  const date = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${date}.csv`;

  XLSX.writeFile(wb, fullFilename, { bookType: 'csv' });
}
