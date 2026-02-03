import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RevenueByDomainChart } from '@/components/Reports/RevenueByDomainChart';
import { ClientGrowthChart } from '@/components/Reports/ClientGrowthChart';
import { OverduePaymentsChart } from '@/components/Reports/OverduePaymentsChart';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Eye, FileSpreadsheet, Table } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useDeals } from '@/hooks/useDeals';
import { usePayments } from '@/hooks/usePayments';
import { useEvents } from '@/hooks/useEvents';
import { 
  exportToExcel, 
  exportToCSV,
  CONTACT_COLUMNS, 
  DEAL_COLUMNS, 
  PAYMENT_COLUMNS,
  EVENT_COLUMNS
} from '@/lib/export/excelExporter';
import { toast } from 'sonner';
import { FilterBuilder } from '@/components/common/FilterBuilder';
import { useDynamicFilter, FieldDefinition } from '@/hooks/useDynamicFilter';
import { DataPreviewModal } from '@/components/Export/DataPreviewModal';

// Field definitions for each entity type
const CONTACT_FIELDS: FieldDefinition[] = [
  { key: 'first_name', label: 'שם פרטי', type: 'text' },
  { key: 'last_name', label: 'שם משפחה', type: 'text' },
  { key: 'email', label: 'אימייל', type: 'text' },
  { key: 'phone_parent', label: 'טלפון הורה', type: 'text' },
  { key: 'child_name', label: 'שם ילד', type: 'text' },
  { key: 'notes', label: 'הערות', type: 'text' },
];

const DEAL_FIELDS: FieldDefinition[] = [
  { key: 'title', label: 'כותרת', type: 'text' },
  { key: 'amount_total', label: 'סכום כולל', type: 'number' },
  { key: 'amount_paid', label: 'סכום ששולם', type: 'number' },
  { key: 'workflow_stage', label: 'שלב', type: 'select', options: [
    { value: 'lead', label: 'ליד' },
    { value: 'qualified', label: 'מתעניין' },
    { value: 'proposal', label: 'הצעה' },
    { value: 'negotiation', label: 'משא ומתן' },
    { value: 'closed_won', label: 'נסגר בהצלחה' },
    { value: 'closed_lost', label: 'נסגר ללא הצלחה' },
  ]},
  { key: 'payment_status', label: 'סטטוס תשלום', type: 'select', options: [
    { value: 'pending', label: 'ממתין' },
    { value: 'partial', label: 'חלקי' },
    { value: 'paid', label: 'שולם' },
  ]},
];

const PAYMENT_FIELDS: FieldDefinition[] = [
  { key: 'amount', label: 'סכום', type: 'number' },
  { key: 'status', label: 'סטטוס', type: 'select', options: [
    { value: 'pending', label: 'ממתין' },
    { value: 'paid', label: 'שולם' },
    { value: 'overdue', label: 'באיחור' },
  ]},
  { key: 'payment_method', label: 'אמצעי תשלום', type: 'select', options: [
    { value: 'cash', label: 'מזומן' },
    { value: 'credit', label: 'אשראי' },
    { value: 'transfer', label: 'העברה' },
    { value: 'check', label: 'המחאה' },
  ]},
  { key: 'notes', label: 'הערות', type: 'text' },
];

const EVENT_FIELDS: FieldDefinition[] = [
  { key: 'title', label: 'כותרת', type: 'text' },
  { key: 'location', label: 'מיקום', type: 'text' },
  { key: 'status', label: 'סטטוס', type: 'select', options: [
    { value: 'scheduled', label: 'מתוכנן' },
    { value: 'completed', label: 'הושלם' },
    { value: 'cancelled', label: 'בוטל' },
  ]},
  { key: 'participants_count', label: 'מספר משתתפים', type: 'number' },
];

export default function Reports() {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [exportEntity, setExportEntity] = useState<'contacts' | 'deals' | 'payments' | 'events'>('contacts');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const { data: contacts = [] } = useContacts();
  const { data: deals = [] } = useDeals();
  const { data: payments = [] } = usePayments();
  const { data: events = [] } = useEvents();

  // Get current field definitions based on selected entity
  const currentFieldDefinitions = useMemo(() => {
    switch (exportEntity) {
      case 'contacts': return CONTACT_FIELDS;
      case 'deals': return DEAL_FIELDS;
      case 'payments': return PAYMENT_FIELDS;
      case 'events': return EVENT_FIELDS;
      default: return CONTACT_FIELDS;
    }
  }, [exportEntity]);

  // Get current raw data based on selected entity
  const currentRawData = useMemo(() => {
    switch (exportEntity) {
      case 'contacts': return contacts;
      case 'deals': return deals.map((deal: any) => ({
        ...deal,
        contact_name: deal.contacts 
          ? `${deal.contacts.first_name || ''} ${deal.contacts.last_name || ''}`.trim()
          : 'לא משויך'
      }));
      case 'payments': return payments.map((payment: any) => ({
        ...payment,
        contact_name: payment.contact 
          ? `${payment.contact.first_name || ''} ${payment.contact.last_name || ''}`.trim()
          : 'לא משויך',
        deal_title: payment.deals?.title || 'לא משויך'
      }));
      case 'events': return events;
      default: return [];
    }
  }, [exportEntity, contacts, deals, payments, events]);

  // Use dynamic filter hook
  const filter = useDynamicFilter(currentRawData, currentFieldDefinitions);

  // Get current columns for export
  const currentColumns = useMemo(() => {
    switch (exportEntity) {
      case 'contacts': return CONTACT_COLUMNS;
      case 'deals': return DEAL_COLUMNS;
      case 'payments': return PAYMENT_COLUMNS;
      case 'events': return EVENT_COLUMNS;
      default: return CONTACT_COLUMNS;
    }
  }, [exportEntity]);

  const entityNames: Record<string, string> = {
    contacts: 'לקוחות',
    deals: 'עסקאות',
    payments: 'תשלומים',
    events: 'אירועים'
  };

  const handleOpenPreview = () => {
    if (filter.filteredData.length === 0) {
      toast.error('אין נתונים לייצוא');
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleExportExcel = (selectedColumnKeys: string[]) => {
    const data = filter.filteredData;
    const columns = currentColumns.filter(col => selectedColumnKeys.includes(col.key));
    let filename = entityNames[exportEntity] || 'נתונים';
    const sheetName = filename;

    if (filter.hasActiveFilters) {
      filename += '_מסונן';
    }

    exportToExcel(data, { filename, sheetName, columns });
    toast.success(`📊 הקובץ ${filename} הורד בהצלחה! (${data.length} רשומות)`);
  };

  const handleExportCSV = (selectedColumnKeys: string[]) => {
    const data = filter.filteredData;
    const columns = currentColumns.filter(col => selectedColumnKeys.includes(col.key));
    let filename = entityNames[exportEntity] || 'נתונים';

    if (filter.hasActiveFilters) {
      filename += '_מסונן';
    }

    exportToCSV(data, { filename, columns });
    toast.success(`📄 הקובץ ${filename} הורד בהצלחה! (${data.length} רשומות)`);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">📊 דוחות ותובנות</h1>
          <p className="text-muted-foreground">
            ניתוח עסקי מתקדם והפקת דוחות
          </p>
        </div>
      </div>

      {/* Export Section */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            ייצוא נתונים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block">בחר נתונים לייצוא</label>
              <Select value={exportEntity} onValueChange={(v) => setExportEntity(v as 'contacts' | 'deals' | 'payments' | 'events')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacts">👥 לקוחות ({contacts.length})</SelectItem>
                  <SelectItem value="deals">💼 עסקאות ({deals.length})</SelectItem>
                  <SelectItem value="payments">💰 תשלומים ({payments.length})</SelectItem>
                  <SelectItem value="events">📅 אירועים ({events.length})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleOpenPreview} className="btn-premium gap-2 flex-1">
                <Eye className="w-4 h-4" />
                תצוגה מקדימה וייצוא
              </Button>
            </div>
            <div className="flex items-end">
              <p className="text-sm text-muted-foreground">
                סה"כ: <span className="font-bold text-foreground">
                  {filter.filteredData.length} מתוך {currentRawData.length} רשומות
                </span>
                {filter.hasActiveFilters && (
                  <span className="text-primary mr-1">(מסונן)</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Builder */}
      <FilterBuilder
        conditions={filter.conditions}
        combinator={filter.combinator}
        fieldDefinitions={currentFieldDefinitions}
        savedTemplates={filter.savedTemplates}
        onAddCondition={filter.addCondition}
        onUpdateCondition={filter.updateCondition}
        onRemoveCondition={filter.removeCondition}
        onClearConditions={filter.clearConditions}
        onSetCombinator={filter.setCombinator}
        onSaveTemplate={filter.saveAsTemplate}
        onLoadTemplate={filter.loadTemplate}
        onDeleteTemplate={filter.deleteTemplate}
        resultCount={filter.filteredData.length}
      />

      {/* Reports Section */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>הגדרות דוח</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block">סוג דוח</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">הכנסות לפי תחום</SelectItem>
                  <SelectItem value="growth">צמיחת לקוחות</SelectItem>
                  <SelectItem value="payments">תשלומים באיחור</SelectItem>
                  <SelectItem value="deals">עסקאות לפי שלב</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block">טווח תאריכים</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">שבוע אחרון</SelectItem>
                  <SelectItem value="month">חודש אחרון</SelectItem>
                  <SelectItem value="quarter">רבעון אחרון</SelectItem>
                  <SelectItem value="year">שנה אחרונה</SelectItem>
                  <SelectItem value="all">כל הזמן</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {reportType === 'revenue' && <RevenueByDomainChart />}
        {reportType === 'growth' && <ClientGrowthChart />}
        {reportType === 'payments' && <OverduePaymentsChart />}
      </div>

      {reportType === 'deals' && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>עסקאות לפי שלב</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              הדוח יתווסף בשלב הבא
            </p>
          </CardContent>
        </Card>
      )}

      {/* Data Preview Modal */}
      <DataPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={filter.filteredData}
        columns={currentColumns}
        entityName={entityNames[exportEntity]}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
      />
      </div>
    </MainLayout>
  );
}
