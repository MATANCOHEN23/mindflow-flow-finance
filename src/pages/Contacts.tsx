
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { AddClientForm } from "@/components/Forms/AddClientForm";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useContacts, useDeleteContact } from "@/hooks/useContacts";
import { Edit, Trash2, Phone, Mail } from "lucide-react";
import { Contact } from "@/types/database";

const Contacts = () => {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  
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

  const handleDeleteClick = (contact: Contact) => {
    setDeleteContact(contact);
  };

  const handleDeleteConfirm = async () => {
    if (deleteContact) {
      deleteContactMutation.mutate(deleteContact.id);
      setDeleteContact(null);
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
          <div className="text-center brand-card max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">שגיאה בטעינת הנתונים</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              נסה שוב
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <div className="brand-card header-gradient text-white">
          <div className="flex justify-between items-center mb-6 p-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 glow-text">👥 ניהול לקוחות</h1>
              <p className="text-white/90 text-lg">
                {contacts ? `${contacts.length} לקוחות במערכת` : 'טוען נתונים...'}
              </p>
            </div>
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3" 
              onClick={handleAddClient}
              disabled={isLoading}
            >
              ➕ הוסף לקוח חדש
            </Button>
          </div>
        </div>

        <Card className="brand-card p-0">
          <CardHeader className="brand-card-header">
            <CardTitle className="text-xl font-bold text-blue-600 text-center">
              רשימת לקוחות
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-bold text-base">שם פרטי</TableHead>
                    <TableHead className="text-right font-bold text-base">שם משפחה</TableHead>
                    <TableHead className="text-right font-bold text-base">תפקיד</TableHead>
                    <TableHead className="text-right font-bold text-base">שם ילד</TableHead>
                    <TableHead className="text-right font-bold text-base">טלפון הורה</TableHead>
                    <TableHead className="text-right font-bold text-base">אימייל</TableHead>
                    <TableHead className="text-right font-bold text-base">הערות</TableHead>
                    <TableHead className="text-right font-bold text-base">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16">
                        <LoadingSpinner size="lg" className="justify-center" />
                        <p className="text-center mt-4 text-lg">טוען נתונים...</p>
                      </TableCell>
                    </TableRow>
                  ) : !contacts || contacts.length === 0 ? (
                    <TableRow className="table-row">
                      <TableCell colSpan={8} className="py-16">
                        <div className="empty-state">
                          <div className="text-6xl mb-4">👥</div>
                          <h3 className="text-2xl font-bold text-blue-600 mb-3">אין לקוחות במערכת</h3>
                          <p className="text-lg text-gray-600 mb-6">
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
                      <TableRow key={contact.id} className="table-row">
                        <TableCell className="font-semibold">{contact.first_name}</TableCell>
                        <TableCell>{contact.last_name || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {contact.role_tags?.map((tag, index) => (
                              <span key={index} className="status-badge bg-blue-100 text-blue-800">
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
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClick(contact)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
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

        <DeleteConfirmModal
          isOpen={!!deleteContact}
          onClose={() => setDeleteContact(null)}
          onConfirm={handleDeleteConfirm}
          title="מחיקת לקוח"
          itemName={deleteContact ? `${deleteContact.first_name} ${deleteContact.last_name || ''}`.trim() : ''}
          isLoading={deleteContactMutation.isPending}
        />

        {/* Floating Action Button */}
        <button
          onClick={handleAddClient}
          className="floating-add-btn"
          aria-label="הוסף לקוח חדש"
        >
          ➕
        </button>
      </div>
    </MainLayout>
  );
};

export default Contacts;
