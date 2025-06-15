
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";

const BirthdayEvents = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="premium-card shine-effect">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">🎂 אירועי יום הולדת</h1>
              <p className="text-primary/70 text-xl font-semibold">ניהול וארגון אירועי יום הולדת</p>
            </div>
            <Button className="btn-accent text-lg px-8 py-4">
              ➕ הוסף אירוע חדש
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">פניות</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">הצעת מחיר</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">מקדמה</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">נקבע תאריך</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">בוצע</h3>
              <div className="text-3xl font-black gradient-text">0</div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-black gradient-text text-center">
              רשימת אירועי יום הולדת
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-lg">שם האירוע</TableHead>
                    <TableHead className="text-right font-black text-lg">לקוח</TableHead>
                    <TableHead className="text-right font-black text-lg">תאריך האירוע</TableHead>
                    <TableHead className="text-right font-black text-lg">מיקום</TableHead>
                    <TableHead className="text-right font-black text-lg">מספר משתתפים</TableHead>
                    <TableHead className="text-right font-black text-lg">צוות מוקצה</TableHead>
                    <TableHead className="text-right font-black text-lg">תוספות</TableHead>
                    <TableHead className="text-right font-black text-lg">סטטוס</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell colSpan={9} className="py-16">
                      <div className="empty-state">
                        <div className="text-8xl mb-6">🎂</div>
                        <h3 className="text-3xl font-black gradient-text mb-4">אין אירועים במערכת</h3>
                        <p className="text-xl text-primary/70 font-semibold mb-8">
                          לחץ על "הוסף אירוע חדש" כדי להתחיל
                        </p>
                        <Button className="btn-primary text-xl px-12 py-4">
                          ➕ הוסף אירוע ראשון
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

export default BirthdayEvents;
