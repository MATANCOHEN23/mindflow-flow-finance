
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";

const Contacts = () => {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  const handleAddClient = (clientData: any) => {
    console.log('Adding client:', clientData);
    // TODO: Here we'll integrate with Supabase to save the client
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="premium-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black gradient-text mb-2">👥 ניהול לקוחות</h1>
              <p className="text-primary/70 text-lg font-semibold">רשימת כל הלקוחות במערכת</p>
            </div>
            <Button 
              className="btn-accent text-base px-6 py-3" 
              aria-label="הוסף לקוח חדש" 
              tabIndex={0}
              onClick={() => setIsClientFormOpen(true)}
            >
              ➕ הוסף לקוח חדש
            </Button>
          </div>
        </div>

        <Card className="premium-card">
          <CardHeader className="bg-secondary/30 rounded-t-xl">
            <CardTitle className="text-xl font-black gradient-text text-center">
              רשימת לקוחות
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-base">שם פרטי</TableHead>
                    <TableHead className="text-right font-black text-base">שם משפחה</TableHead>
                    <TableHead className="text-right font-black text-base">תפקיד</TableHead>
                    <TableHead className="text-right font-black text-base">שם ילד</TableHead>
                    <TableHead className="text-right font-black text-base">טלפון הורה</TableHead>
                    <TableHead className="text-right font-black text-base">אימייל</TableHead>
                    <TableHead className="text-right font-black text-base">הערות</TableHead>
                    <TableHead className="text-right font-black text-base">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell colSpan={8} className="py-16">
                      <div className="empty-state">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-2xl font-black gradient-text mb-3">אין לקוחות במערכת</h3>
                        <p className="text-lg text-primary/70 font-semibold mb-6">
                          לחץ על "הוסף לקוח חדש" כדי להתחיל
                        </p>
                        <Button 
                          className="btn-primary text-lg px-8 py-3" 
                          aria-label="הוסף לקוח ראשון" 
                          tabIndex={0}
                          onClick={() => setIsClientFormOpen(true)}
                        >
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

        <AddClientForm 
          isOpen={isClientFormOpen}
          onClose={() => setIsClientFormOpen(false)}
          onSubmit={handleAddClient}
        />
      </div>
    </MainLayout>
  );
};

export default Contacts;
