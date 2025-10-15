
// Type declaration for SheetJS
declare global {
  interface Window {
    XLSX: any;
  }
}

export class FileProcessor {
  static async loadSheetJS(): Promise<any> {
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
  }

  static async parseFile(file: File, selectedTable: string): Promise<any[]> {
    const XLSX = await this.loadSheetJS();
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

    return this.transformData(parsedRows, selectedTable);
  }

  private static transformData(rows: any[], selectedTable: string): any[] {
    return rows.map(row => {
      if (selectedTable === 'contacts') {
        // זיהוי אוטומטי של תחום
        const detectDomains = (row: any): string[] => {
          const domains = [];
          const rowText = JSON.stringify(row).toLowerCase();
          
          if (rowText.includes('פסיכולוג') || rowText.includes('טיפול') || rowText.includes('therapy')) {
            domains.push('מטופל');
          }
          if (rowText.includes('כדורסל') || rowText.includes('מאמן') || rowText.includes('basketball')) {
            domains.push('שחקן כדורסל');
          }
          if (rowText.includes('יום הולדת') || rowText.includes('אירוע') || rowText.includes('birthday')) {
            domains.push('יזם');
          }
          if (rowText.includes('סדנה') || rowText.includes('בית ספר') || rowText.includes('workshop')) {
            domains.push('יזם');
          }
          
          return domains.length > 0 ? domains : ['לקוח'];
        };

        return {
          first_name: row.first_name || row['שם פרטי'] || row.name || 'לא צוין',
          last_name: row.last_name || row['שם משפחה'] || '',
          phone_parent: row.phone_parent || row['טלפון'] || row.phone || '',
          email: row.email || row['אימייל'] || '',
          role_tags: detectDomains(row),
          notes: row.notes || row['הערות'] || ''
        };
      }
      return row;
    });
  }
}
