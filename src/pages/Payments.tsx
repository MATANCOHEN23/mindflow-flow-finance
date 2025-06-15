
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";

const Payments = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="premium-card shine-effect">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">💳 ניהול תשלומים</h1>
              <p className="text-primary/70 text-xl font-semibold">מעקב אחר כל התשלומים והחשבוניות</p>
            </div>
            <Button className="btn-accent text-lg px-8 py-4">
              ➕ רשום תשלום חדש
            </Button>
          </div>
        </div>

        <Card className="premium-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-black gradient-text text-center">
              רשימת תשלומים
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-lg">עסקה</TableHead>
                    <TableHead className="text-right font-black text-lg">לקוח</TableHead>
                    <TableHead className="text-right font-black text-lg">סכום</TableHead>
                    <TableHead className="text-right font-black text-lg">תאריך תשלום</TableHead>
                    <TableHead className="text-right font-black text-lg">אמצעי תשלום</TableHead>
                    <TableHead className="text-right font-black text-lg">מקדמה?</TableHead>
                    <TableHead className="text-right font-black text-lg">הערות</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell colSpan={8} className="py-16">
                      <div className="empty-state">
                        <div className="text-8xl mb-6">💳</div>
                        <h3 className="text-3xl font-black gradient-text mb-4">אין תשלומים במערכת</h3>
                        <p className="text-xl text-primary/70 font-semibold mb-8">
                          לחץ על "רשום תשלום חדש" כדי להתחיל
                        </p>
                        <Button className="btn-primary text-xl px-12 py-4">
                          ➕ רשום תשלום ראשון
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Payments;
