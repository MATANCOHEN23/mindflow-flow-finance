
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";
import { useContacts, useDeleteContact } from "@/hooks/useContacts";
import { Loader2, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Contact } from "@/types/database";

const Contacts = () => {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  const { data: contacts, isLoading, error } = useContacts();
  const deleteContactMutation = useDeleteContact();

  const handleAddClient = () => {
    setEditingContact(null);
    setIsClientFormOpen(true);
  };

  const handleEditClient = (contact: Contact) => {
    setEditingContact(contact);
    setIsClientFormOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הלקוח? פעולה זו לא ניתנת לביטול.')) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsClientFormOpen(false);
    setEditingContact(null);
  };

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">שגיאה בטעינת הנתונים</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="premium-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black gradient-text mb-2">👥 ניהול לקוחות</h1>
              <p className="text-primary/70 text-lg font-semibold">
                {contacts ? `${contacts.length} לקוחות במערכת` : 'טוען נתונים...'}
              </p>
            </div>
            <Button 
              className="btn-accent text-base px-6 py-3" 
              onClick={handleAddClient}
              disabled={isLoading}
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="mr-2 text-lg">טוען נתונים...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !contacts || contacts.length === 0 ? (
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
                            onClick={handleAddClient}
                          >
                            ➕ הוסף לקוח ראשון
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow key={contact.id} className="table-row hover:bg-gray-50">
                        <TableCell className="font-semibold">{contact.first_name}</TableCell>
                        <TableCell>{contact.last_name || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {contact.role_tags?.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{contact.child_name || '-'}</TableCell>
                        <TableCell>
                          {contact.phone_parent && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{contact.phone_parent}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={contact.notes}>
                            {contact.notes || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditClient(contact)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClient(contact.id)}
                              disabled={deleteContactMutation.isPending}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              {deleteContactMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddClientForm 
          isOpen={isClientFormOpen}
          onClose={handleFormClose}
          contact={editingContact}
        />
      </div>
    </MainLayout>
  );
};

export default Contacts;
