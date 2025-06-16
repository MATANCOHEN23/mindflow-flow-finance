
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { AddDealForm } from "@/components/Forms/AddDealForm";

const Deals = () => {
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);

  const handleAddDeal = (dealData: any) => {
    console.log('Adding deal:', dealData);
    // TODO: Here we'll integrate with Supabase to save the deal
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="premium-card shine-effect">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">💼 ניהול עסקאות</h1>
              <p className="text-primary/70 text-xl font-semibold">מעקב אחר כל העסקאות והפרויקטים</p>
            </div>
            <Button 
              className="btn-accent text-lg px-8 py-4"
              onClick={() => setIsDealFormOpen(true)}
            >
              ➕ הוסף עסקה חדשה
            </Button>
          </div>
        </div>

        <Card className="premium-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-black gradient-text text-center">
              רשימת עסקאות
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-lg">כותרת</TableHead>
                    <TableHead className="text-right font-black text-lg">לקוח</TableHead>
                    <TableHead className="text-right font-black text-lg">קטגוריה</TableHead>
                    <TableHead className="text-right font-black text-lg">סוג חבילה</TableHead>
                    <TableHead className="text-right font-black text-lg">סכום כולל</TableHead>
                    <TableHead className="text-right font-black text-lg">סכום ששולם</TableHead>
                    <TableHead className="text-right font-black text-lg">סטטוס תשלום</TableHead>
                    <TableHead className="text-right font-black text-lg">שלב בתהליך</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולה הבאה</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell colSpan={10} className="py-16">
                      <div className="empty-state">
                        <div className="text-8xl mb-6">💼</div>
                        <h3 className="text-3xl font-black gradient-text mb-4">אין עסקאות במערכת</h3>
                        <p className="text-xl text-primary/70 font-semibold mb-8">
                          לחץ על "הוסף עסקה חדשה" כדי להתחיל
                        </p>
                        <Button 
                          className="btn-primary text-xl px-12 py-4"
                          onClick={() => setIsDealFormOpen(true)}
                        >
                          ➕ הוסף עסקה ראשונה
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddDealForm 
          isOpen={isDealFormOpen}
          onClose={() => setIsDealFormOpen(false)}
          onSubmit={handleAddDeal}
        />
      </div>
    </MainLayout>
  );
};

export default Deals;
