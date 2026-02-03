import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RevenueByDomainChart } from '@/components/Reports/RevenueByDomainChart';
import { ClientGrowthChart } from '@/components/Reports/ClientGrowthChart';
import { OverduePaymentsChart } from '@/components/Reports/OverduePaymentsChart';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Download, FileSpreadsheet, Table } from 'lucide-react';
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

export default function Reports() {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [exportEntity, setExportEntity] = useState('contacts');
  
  const { data: contacts = [] } = useContacts();
  const { data: deals = [] } = useDeals();
  const { data: payments = [] } = usePayments();
  const { data: events = [] } = useEvents();

  const handleExportExcel = () => {
    let data: any[] = [];
    let columns;
    let filename = '';
    let sheetName = '';

    switch (exportEntity) {
      case 'contacts':
        data = contacts;
        columns = CONTACT_COLUMNS;
        filename = 'לקוחות';
        sheetName = 'לקוחות';
        break;
      case 'deals':
        // Add contact name to deals
        data = deals.map((deal: any) => ({
          ...deal,
          contact_name: deal.contacts 
            ? `${deal.contacts.first_name || ''} ${deal.contacts.last_name || ''}`.trim()
            : 'לא משויך'
        }));
        columns = DEAL_COLUMNS;
        filename = 'עסקאות';
        sheetName = 'עסקאות';
        break;
      case 'payments':
        // Add contact and deal info to payments
        data = payments.map((payment: any) => ({
          ...payment,
          contact_name: payment.contact 
            ? `${payment.contact.first_name || ''} ${payment.contact.last_name || ''}`.trim()
            : 'לא משויך',
          deal_title: payment.deals?.title || 'לא משויך'
        }));
        columns = PAYMENT_COLUMNS;
        filename = 'תשלומים';
        sheetName = 'תשלומים';
        break;
      case 'events':
        data = events;
        columns = EVENT_COLUMNS;
        filename = 'אירועים';
        sheetName = 'אירועים';
        break;
      default:
        toast.error('בחר סוג נתונים לייצוא');
        return;
    }

    if (data.length === 0) {
      toast.error('אין נתונים לייצוא');
      return;
    }

    exportToExcel(data, { filename, sheetName, columns });
    toast.success(`📊 הקובץ ${filename} הורד בהצלחה!`);
  };

  const handleExportCSV = () => {
    let data: any[] = [];
    let columns;
    let filename = '';

    switch (exportEntity) {
      case 'contacts':
        data = contacts;
        columns = CONTACT_COLUMNS;
        filename = 'לקוחות';
        break;
      case 'deals':
        data = deals.map((deal: any) => ({
          ...deal,
          contact_name: deal.contacts 
            ? `${deal.contacts.first_name || ''} ${deal.contacts.last_name || ''}`.trim()
            : 'לא משויך'
        }));
        columns = DEAL_COLUMNS;
        filename = 'עסקאות';
        break;
      case 'payments':
        data = payments.map((payment: any) => ({
          ...payment,
          contact_name: payment.contact 
            ? `${payment.contact.first_name || ''} ${payment.contact.last_name || ''}`.trim()
            : 'לא משויך',
          deal_title: payment.deals?.title || 'לא משויך'
        }));
        columns = PAYMENT_COLUMNS;
        filename = 'תשלומים';
        break;
      case 'events':
        data = events;
        columns = EVENT_COLUMNS;
        filename = 'אירועים';
        break;
      default:
        toast.error('בחר סוג נתונים לייצוא');
        return;
    }

    if (data.length === 0) {
      toast.error('אין נתונים לייצוא');
      return;
    }

    exportToCSV(data, { filename, columns });
    toast.success(`📄 הקובץ ${filename} הורד בהצלחה!`);
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
              <Select value={exportEntity} onValueChange={setExportEntity}>
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
              <Button onClick={handleExportExcel} className="btn-premium gap-2 flex-1">
                <Download className="w-4 h-4" />
                ייצא Excel
              </Button>
              <Button onClick={handleExportCSV} variant="outline" className="gap-2 flex-1">
                <Table className="w-4 h-4" />
                ייצא CSV
              </Button>
            </div>
            <div className="flex items-end">
              <p className="text-sm text-muted-foreground">
                סה"כ: <span className="font-bold text-foreground">
                  {exportEntity === 'contacts' ? contacts.length :
                   exportEntity === 'deals' ? deals.length :
                   exportEntity === 'payments' ? payments.length :
                   events.length} רשומות
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
      </div>
    </MainLayout>
  );
}
