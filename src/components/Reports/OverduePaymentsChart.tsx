import { usePayments } from '@/hooks/usePayments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

export function OverduePaymentsChart() {
  const { data: payments, isLoading } = usePayments();
  
  const overduePayments = payments?.filter(p => {
    const payment = p as any;
    return payment.status === 'pending' && 
      payment.due_date &&
      new Date(payment.due_date) < new Date();
  }) || [];

  const totalOverdue = overduePayments.reduce((sum, p) => sum + Number(p.amount), 0);

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>תשלומים באיחור</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="premium-loader" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            תשלומים באיחור
          </span>
          <Badge variant="destructive">{overduePayments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {overduePayments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">אין תשלומים באיחור 🎉</p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-muted-foreground mb-1">סה"כ חוב</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                ₪{totalOverdue.toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-3">
              {overduePayments.slice(0, 10).map(payment => {
                const p = payment as any;
                const daysPastDue = Math.floor(
                  (Date.now() - new Date(p.due_date).getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={payment.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-semibold">₪{Number(payment.amount).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          תאריך יעד: {format(new Date(p.due_date), 'dd/MM/yyyy', { locale: he })}
                        </p>
                      </div>
                      <Badge variant="destructive" className="whitespace-nowrap">
                        {daysPastDue} ימים
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {overduePayments.length > 10 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                ועוד {overduePayments.length - 10} תשלומים באיחור...
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
