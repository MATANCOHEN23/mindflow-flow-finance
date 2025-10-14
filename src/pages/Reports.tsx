import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RevenueByDomainChart } from '@/components/Reports/RevenueByDomainChart';
import { ClientGrowthChart } from '@/components/Reports/ClientGrowthChart';
import { Download } from 'lucide-react';

export default function Reports() {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');

  const handleExport = () => {
    // TODO: Implement Excel export
    alert('ייצוא לאקסל יתווסף בשלב הבא');
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">📊 דוחות ותובנות</h1>
          <p className="text-muted-foreground">
            ניתוח עסקי מתקדם והפקת דוחות
          </p>
        </div>
        <Button onClick={handleExport} className="btn-premium gap-2">
          <Download className="w-4 h-4" />
          ייצא לאקסל
        </Button>
      </div>

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
      </div>

      {(reportType === 'payments' || reportType === 'deals') && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>
              {reportType === 'payments' ? 'תשלומים באיחור' : 'עסקאות לפי שלב'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              הדוח יתווסף בשלב הבא
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
