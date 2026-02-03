import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MainLayout } from "@/components/Layout/MainLayout";
import { usePayments, useDeletePayment } from "@/hooks/usePayments";
import { PaymentForm } from "@/components/Forms/PaymentForm";
import { PremiumLoader } from "@/components/PremiumLoader";
import { EmptyState } from "@/components/EmptyState";
import { Payment } from "@/types/database";
import { PaymentWithDetails } from "@/lib/api/payments";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Trash2, Edit, Filter } from "lucide-react";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { BulkActionsToolbar } from "@/components/common/BulkActionsToolbar";
import { FilterBuilder } from "@/components/common/FilterBuilder";
import { useDynamicFilter, FieldDefinition } from "@/hooks/useDynamicFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Field definitions for payments filter
const PAYMENT_FILTER_FIELDS: FieldDefinition[] = [
  { key: 'amount', label: 'סכום', type: 'number' },
  { key: 'status', label: 'סטטוס', type: 'select', options: [
    { value: 'pending', label: 'ממתין' },
    { value: 'paid', label: 'שולם' },
    { value: 'overdue', label: 'באיחור' },
  ]},
  { key: 'payment_method', label: 'אמצעי תשלום', type: 'select', options: [
    { value: 'cash', label: 'מזומן' },
    { value: 'credit', label: 'כרטיס אשראי' },
    { value: 'bank_transfer', label: 'העברה בנקאית' },
    { value: 'check', label: "צ'ק" },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bit', label: 'Bit' },
  ]},
  { key: 'is_deposit', label: 'מקדמה', type: 'select', options: [
    { value: 'true', label: 'כן' },
    { value: 'false', label: 'לא' },
  ]},
  { key: 'notes', label: 'הערות', type: 'text' },
];

const Payments = () => {
  const { data: payments, isLoading, error } = usePayments();
  const deletePayment = useDeletePayment();
  const queryClient = useQueryClient();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: "",
    name: ""
  });

  // Dynamic filter
  const filter = useDynamicFilter(payments || [], PAYMENT_FILTER_FIELDS);

  const {
    selectedIds,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    count
  } = useBulkSelection(filter.filteredData || []);

  // Calculate totals from filtered data
  const totals = useMemo(() => {
    const data = filter.filteredData;
    if (!data) return { total: 0, deposits: 0, count: 0 };

    return data.reduce((acc: any, payment: PaymentWithDetails) => ({
      total: acc.total + (payment.amount || 0),
      deposits: acc.deposits + (payment.is_deposit ? payment.amount : 0),
      count: acc.count + 1
    }), { total: 0, deposits: 0, count: 0 });
  }, [filter.filteredData]);

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    await deletePayment.mutateAsync(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: "", name: "" });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPayment(null);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .in('id', selectedIds);
      
      if (error) throw error;
      
      toast.success(`✅ ${selectedIds.length} תשלומים נמחקו בהצלחה! 🗑️`);
      clearSelection();
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    } catch (error: any) {
      const errorMsg = error?.message || 'שגיאה לא ידועה';
      toast.error(`❌ שגיאה במחיקת תשלומים: ${errorMsg}. אנא נסה שוב.`);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const getPaymentMethodLabel = (method: string | null) => {
    const methods: Record<string, string> = {
      cash: "מזומן",
      credit: "כרטיס אשראי",
      bank_transfer: "העברה בנקאית",
      check: "צ'ק",
      paypal: "PayPal",
      bit: "Bit"
    };
    return methods[method || ""] || method || "לא צוין";
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <PremiumLoader size="lg" className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">טוען תשלומים...</h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <EmptyState
          icon="⚠️"
          title="שגיאה בטעינת התשלומים"
          description="אנא נסה שוב מאוחר יותר"
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8" dir="rtl">
        <div className="premium-card shine-effect">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">💳 ניהול תשלומים</h1>
              <p className="text-primary/70 text-xl font-semibold">
                {filter.filteredData.length} מתוך {payments?.length || 0} תשלומים
                {filter.hasActiveFilters && <span className="mr-2">(מסונן)</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showFilter ? "secondary" : "outline"}
                onClick={() => setShowFilter(!showFilter)}
                className="font-semibold"
              >
                <Filter className="h-4 w-4 ml-2" />
                סינון מתקדם
              </Button>
              <Button 
                className="btn-accent text-lg px-8 py-4"
                onClick={() => setIsFormOpen(true)}
              >
                ➕ רשום תשלום חדש
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="premium-card p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-blue-600">
                ₪{totals.total.toLocaleString('he-IL')}
              </div>
              <div className="text-sm text-gray-600">סה"כ תשלומים</div>
            </div>
            <div className="premium-card p-4">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-orange-600">
                {totals.count}
              </div>
              <div className="text-sm text-gray-600">מספר תשלומים</div>
            </div>
            <div className="premium-card p-4">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-green-600">
                ₪{totals.deposits.toLocaleString('he-IL')}
              </div>
              <div className="text-sm text-gray-600">סה"כ מקדמות</div>
            </div>
          </div>
        </div>

        {/* Filter Builder */}
        {showFilter && (
          <FilterBuilder
            conditions={filter.conditions}
            combinator={filter.combinator}
            fieldDefinitions={PAYMENT_FILTER_FIELDS}
            savedTemplates={filter.savedTemplates}
            onAddCondition={filter.addCondition}
            onUpdateCondition={filter.updateCondition}
            onRemoveCondition={filter.removeCondition}
            onClearConditions={filter.clearConditions}
            onSetCombinator={filter.setCombinator}
            onSaveTemplate={filter.saveAsTemplate}
            onLoadTemplate={filter.loadTemplate}
            onDeleteTemplate={filter.deleteTemplate}
            resultCount={filter.filteredData.length}
          />
        )}

        <Card className="premium-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-black gradient-text text-center">
              רשימת תשלומים ({filter.filteredData.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead className="text-right font-black text-lg">לקוח</TableHead>
                    <TableHead className="text-right font-black text-lg">עסקה</TableHead>
                    <TableHead className="text-right font-black text-lg">סכום</TableHead>
                    <TableHead className="text-right font-black text-lg">תאריך</TableHead>
                    <TableHead className="text-right font-black text-lg">סטטוס</TableHead>
                    <TableHead className="text-right font-black text-lg">אמצעי תשלום</TableHead>
                    <TableHead className="text-right font-black text-lg">סוג</TableHead>
                    <TableHead className="text-right font-black text-lg">הערות</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filter.filteredData.length === 0 ? (
                    <TableRow className="table-row">
                      <TableCell colSpan={10} className="py-16">
                        <EmptyState
                          icon="💳"
                          title={filter.hasActiveFilters ? "אין תוצאות לסינון" : "אין תשלומים להצגה"}
                          description={filter.hasActiveFilters
                            ? "נסה לשנות את תנאי הסינון"
                            : "לחץ על 'רשום תשלום חדש' כדי להתחיל"}
                          action={filter.hasActiveFilters ? {
                            label: "🗑️ נקה סינון",
                            onClick: filter.clearConditions
                          } : {
                            label: "➕ רשום תשלום ראשון",
                            onClick: () => setIsFormOpen(true)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filter.filteredData.map((payment: PaymentWithDetails) => (
                      <TableRow key={payment.id} className="table-row hover:bg-primary/5">
                        <TableCell>
                          <Checkbox
                            checked={isSelected(payment.id)}
                            onCheckedChange={() => toggleItem(payment.id)}
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {payment.contact_name}
                        </TableCell>
                        <TableCell>{payment.deal_title}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          ₪{payment.amount.toLocaleString('he-IL')}
                        </TableCell>
                        <TableCell>
                          {payment.payment_date 
                            ? format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: he })
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {payment.status === 'paid' ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                              ✅ שולם
                            </span>
                          ) : payment.status === 'overdue' ? (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-bold">
                              ⚠️ באיחור
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold">
                              ⏳ ממתין
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getPaymentMethodLabel(payment.payment_method)}</TableCell>
                        <TableCell>
                          {payment.is_deposit ? (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold">
                              מקדמה
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
                              תשלום
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {payment.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(payment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteConfirm({
                                isOpen: true,
                                id: payment.id,
                                name: `תשלום של ₪${payment.amount.toLocaleString('he-IL')}`
                              })}
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
      </div>

      <PaymentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        payment={editingPayment}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })}
        onConfirm={handleDelete}
        title="מחיקת תשלום"
        itemName={deleteConfirm.name}
      />

      <BulkActionsToolbar
        count={count}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
        isDeleting={isBulkDeleting}
      />
    </MainLayout>
  );
};

export default Payments;
