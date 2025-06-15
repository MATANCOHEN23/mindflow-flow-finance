
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";

const Therapy = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="premium-card shine-effect">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">🧠 טיפולים נפשיים</h1>
              <p className="text-primary/70 text-xl font-semibold">ניהול לקוחות טיפול וחבילות טיפול</p>
            </div>
            <Button className="btn-accent text-lg px-8 py-4">
              ➕ הוסף לקוח טיפול
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">התעניינות</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">4×1000₪</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">10×2750₪</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">12×3000₪</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">חבילה מותאמת</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-black gradient-text text-center">
              רשימת לקוחות טיפול
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-lg">שם הלקוח</TableHead>
                    <TableHead className="text-right font-black text-lg">חבילת טיפול</TableHead>
                    <TableHead className="text-right font-black text-lg">מספר טיפולים</TableHead>
                    <TableHead className="text-right font-black text-lg">טיפולים שנוצלו</TableHead>
                    <TableHead className="text-right font-black text-lg">מחיר חבילה</TableHead>
                    <TableHead className="text-right font-black text-lg">סטטוס תשלום</TableHead>
                    <TableHead className="text-right font-black text-lg">טיפול הבא</TableHead>
                    <TableHead className="text-right font-black text-lg">הערות</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell colSpan={9} className="py-16">
                      <div className="empty-state">
                        <div className="text-8xl mb-6">🧠</div>
                        <h3 className="text-3xl font-black gradient-text mb-4">אין לקוחות טיפול במערכת</h3>
                        <p className="text-xl text-primary/70 font-semibold mb-8">
                          לחץ על "הוסף לקוח טיפול" כדי להתחיל
                        </p>
                        <Button className="btn-primary text-xl px-12 py-4">
                          ➕ הוסף לקוח ראשון
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

export default Therapy;
