
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";

const SchoolWorkshops = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="premium-card shine-effect">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">🎓 סדנאות בית ספר</h1>
              <p className="text-primary/70 text-xl font-semibold">ניהול סדנאות ופרויקטים חינוכיים</p>
            </div>
            <Button className="btn-accent text-lg px-8 py-4">
              ➕ הוסף סדנה חדשה
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">הצעה</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">אושר</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">תואם תאריך</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">בוצע</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">חשבונית</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">שולם</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-black gradient-text text-center">
              רשימת סדנאות בית ספר
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-lg">שם הסדנה</TableHead>
                    <TableHead className="text-right font-black text-lg">בית ספר</TableHead>
                    <TableHead className="text-right font-black text-lg">איש קשר</TableHead>
                    <TableHead className="text-right font-black text-lg">תאריך מוצע</TableHead>
                    <TableHead className="text-right font-black text-lg">מספר תלמידים</TableHead>
                    <TableHead className="text-right font-black text-lg">מחיר</TableHead>
                    <TableHead className="text-right font-black text-lg">סטטוס</TableHead>
                    <TableHead className="text-right font-black text-lg">הערות</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell colSpan={9} className="py-16">
                      <div className="empty-state">
                        <div className="text-8xl mb-6">🎓</div>
                        <h3 className="text-3xl font-black gradient-text mb-4">אין סדנאות במערכת</h3>
                        <p className="text-xl text-primary/70 font-semibold mb-8">
                          לחץ על "הוסף סדנה חדשה" כדי להתחיל
                        </p>
                        <Button className="btn-primary text-xl px-12 py-4">
                          ➕ הוסף סדנה ראשונה
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

export default SchoolWorkshops;
