
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";

const Basketball = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="premium-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black gradient-text mb-2">🏀 אימוני כדורסל</h1>
              <p className="text-primary/70 text-lg font-semibold">ניהול עונת הכדורסל וחבילות אימונים</p>
            </div>
            <Button className="btn-accent text-base px-6 py-3" aria-label="הוסף שחקן חדש" tabIndex={0}>
              ➕ הוסף שחקן חדש
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="premium-card">
            <CardHeader className="bg-secondary/30 rounded-t-xl">
              <CardTitle className="text-lg font-black text-primary text-center">
                לא רשום
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] p-4">
              <div className="text-center text-muted-foreground py-8">
                <div className="text-4xl mb-3">🏀</div>
                <p className="font-semibold">אין שחקנים ברשימה</p>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="bg-accent/10 rounded-t-xl">
              <CardTitle className="text-lg font-black text-primary text-center">
                רשום - ממתין תשלום
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] p-4">
              <div className="text-center text-muted-foreground py-8">
                <div className="text-4xl mb-3">⏳</div>
                <p className="font-semibold">אין שחקנים ממתינים</p>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="bg-success/10 rounded-t-xl">
              <CardTitle className="text-lg font-black text-primary text-center">
                פעיל
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] p-4">
              <div className="text-center text-muted-foreground py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold">אין שחקנים פעילים</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="section-divider"></div>

        {/* Full Table View */}
        <Card className="premium-card">
          <CardHeader className="bg-secondary/30 rounded-t-xl">
            <CardTitle className="text-xl font-black gradient-text text-center">
              רשימת שחקני כדורסל
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-base">שם שחקן</TableHead>
                    <TableHead className="text-right font-black text-base">גיל</TableHead>
                    <TableHead className="text-right font-black text-base">טלפון הורה</TableHead>
                    <TableHead className="text-right font-black text-base">סטטוס רישום</TableHead>
                    <TableHead className="text-right font-black text-base">חבילת אימונים</TableHead>
                    <TableHead className="text-right font-black text-base">סכום כולל</TableHead>
                    <TableHead className="text-right font-black text-base">שולם</TableHead>
                    <TableHead className="text-right font-black text-base">סטטוס תשלום</TableHead>
                    <TableHead className="text-right font-black text-base">תאריך אימון הבא</TableHead>
                    <TableHead className="text-right font-black text-base">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell colSpan={10} className="py-16">
                      <div className="empty-state">
                        <div className="text-6xl mb-4">🏀</div>
                        <h3 className="text-2xl font-black gradient-text mb-3">אין שחקנים במערכת</h3>
                        <p className="text-lg text-primary/70 font-semibold mb-6">
                          לחץ על "הוסף שחקן חדש" כדי להתחיל
                        </p>
                        <Button className="btn-primary text-lg px-8 py-3" aria-label="הוסף שחקן ראשון" tabIndex={0}>
                          ➕ הוסף שחקן ראשון
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

export default Basketball;
