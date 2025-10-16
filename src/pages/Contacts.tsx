
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { NewContactForm } from "@/components/Forms/NewContactForm";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useContacts, useDeleteContact } from "@/hooks/useContacts";
import { useContactDomains } from "@/hooks/useDomains";
import { Edit, Trash2, Phone, Mail } from "lucide-react";
import { Contact } from "@/types/database";
import { Link } from "react-router-dom";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { BulkActionsToolbar } from "@/components/common/BulkActionsToolbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contacts = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  const { data: contacts, isLoading, error } = useContacts();
  const deleteContactMutation = useDeleteContact();
  
  const bulkSelection = useBulkSelection(contacts || []);

  const handleAddClient = () => {
    setIsContactFormOpen(true);
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
    setIsContactFormOpen(false);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .in('id', bulkSelection.selectedIds);
      
      if (error) throw error;
      
      toast.success(`✅ ${bulkSelection.count} לקוחות נמחקו בהצלחה! 🗑️`);
      bulkSelection.clearSelection();
      window.location.reload();
    } catch (error: any) {
      const errorMsg = error?.message || 'שגיאה לא ידועה';
      toast.error(`❌ שגיאה במחיקת לקוחות: ${errorMsg}. אנא נסה שוב.`);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center card max-w-md">
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
        <div className="card header-gradient text-white">
          <div className="flex justify-between items-center mb-6 p-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 glow-text">👥 ניהול לקוחות</h1>
              <p className="text-white/90 text-lg">
                {contacts ? `${contacts.length} לקוחות במערכת` : 'טוען נתונים...'}
              </p>
            </div>
            <Button 
              className="cta font-semibold px-6 py-3" 
              onClick={handleAddClient}
              disabled={isLoading}
            >
              ➕ הוסף לקוח חדש
            </Button>
          </div>
        </div>

        <Card className="card p-0">
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
                    <TableHead className="w-12">
                      <Checkbox
                        checked={bulkSelection.isAllSelected}
                        onCheckedChange={bulkSelection.toggleAll}
                      />
                    </TableHead>
                    <TableHead className="text-right font-bold text-base">שם פרטי</TableHead>
                    <TableHead className="text-right font-bold text-base">שם משפחה</TableHead>
                    <TableHead className="text-right font-bold text-base">תחומים</TableHead>
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
                      <TableCell colSpan={9} className="py-16">
                        <div className="empty-state">
                          <div className="text-6xl mb-4">👥</div>
                          <h3 className="text-2xl font-bold text-blue-600 mb-3">אין לקוחות במערכת</h3>
                          <p className="text-lg text-gray-600 mb-6">
                            לחץ על "הוסף לקוח חדש" כדי להתחיל
                          </p>
                          <Button 
                            className="cta text-lg px-8 py-3" 
                            onClick={handleAddClient}
                          >
                            ➕ הוסף לקוח ראשון
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <ContactRow 
                        key={contact.id} 
                        contact={contact} 
                        onDeleteClick={handleDeleteClick}
                        isSelected={bulkSelection.isSelected(contact.id)}
                        onToggleSelect={() => bulkSelection.toggleItem(contact.id)}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <NewContactForm 
          isOpen={isContactFormOpen}
          onClose={handleFormClose}
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
        <BulkActionsToolbar
          count={bulkSelection.count}
          onDelete={handleBulkDelete}
          onClear={bulkSelection.clearSelection}
          isDeleting={isBulkDeleting}
        />

        <button
          onClick={handleAddClient}
          className="floating-add-btn cta"
          aria-label="הוסף לקוח חדש"
        >
          ➕
        </button>
      </div>
    </MainLayout>
  );
};

// ContactRow Component with Domain Display
const ContactRow = ({ 
  contact, 
  onDeleteClick, 
  isSelected, 
  onToggleSelect 
}: { 
  contact: Contact; 
  onDeleteClick: (contact: Contact) => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}) => {
  const { data: contactDomains } = useContactDomains(contact.id);

  return (
    <TableRow className="table-row">
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      <TableCell className="font-semibold">{contact.first_name}</TableCell>
      <TableCell>{contact.last_name || '-'}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {contactDomains && contactDomains.length > 0 ? (
            contactDomains.slice(0, 3).map((cd) => {
              const domain = (cd as any).domain;
              return (
                <Link key={cd.id} to={`/domain/${domain?.id}`}>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-primary/20 transition-colors">
                    {domain?.icon} {domain?.name || 'תחום'}
                  </Badge>
                </Link>
              );
            })
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
          {contactDomains && contactDomains.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{contactDomains.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
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
        <div className="max-w-xs truncate" title={contact.notes || undefined}>
          {contact.notes || '-'}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
            onClick={() => onDeleteClick(contact)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default Contacts;
