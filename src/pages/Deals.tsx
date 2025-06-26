
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { AddDealForm } from "@/components/Forms/AddDealForm";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useDeals, useDeleteDeal } from "@/hooks/useDeals";
import { Edit, Trash2, Calendar, DollarSign } from "lucide-react";
import { Deal } from "@/types/database";
import { DealBoard } from "@/components/DealBoard/DealBoard";

const Deals = () => {
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deleteDeal, setDeleteDeal] = useState<Deal | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  
  const { data: deals, isLoading, error } = useDeals();
  const deleteDealMutation = useDeleteDeal();

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsDealFormOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsDealFormOpen(true);
  };

  const handleDeleteClick = (deal: Deal) => {
    setDeleteDeal(deal);
  };

  const handleDeleteConfirm = async () => {
    if (deleteDeal) {
      deleteDealMutation.mutate(deleteDeal.id);
      setDeleteDeal(null);
    }
  };

  const handleFormClose = () => {
    setIsDealFormOpen(false);
    setEditingDeal(null);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount);
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'שולם';
      case 'partial':
        return 'שולם חלקית';
      default:
        return 'ממתין לתשלום';
    }
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
        {/* Header with gradient background */}
        <div className="brand-card header-gradient text-white">
          <div className="flex justify-between items-center mb-6 p-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 glow-text">💼 ניהול עסקאות</h1>
              <p className="text-white/90 text-lg">
                {deals ? `${deals.length} עסקאות במערכת` : 'טוען נתונים...'}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'board' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  📋 לוח
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'table' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  📊 טבלה
                </button>
              </div>
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3" 
                onClick={handleAddDeal}
                disabled={isLoading}
              >
                ➕ הוסף עסקה חדשה
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === 'board' ? (
          <DealBoard />
        ) : (
          <Card className="brand-card p-0">
            <CardHeader className="brand-card-header">
              <CardTitle className="text-xl font-bold text-blue-600 text-center">
                רשימת עסקאות
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead className="text-right font-bold text-base">כותרת</TableHead>
                      <TableHead className="text-right font-bold text-base">קטגוריה</TableHead>
                      <TableHead className="text-right font-bold text-base">סוג חבילה</TableHead>
                      <TableHead className="text-right font-bold text-base">סכום כולל</TableHead>
                      <TableHead className="text-right font-bold text-base">סכום ששולם</TableHead>
                      <TableHead className="text-right font-bold text-base">סטטוס תשלום</TableHead>
                      <TableHead className="text-right font-bold text-base">שלב בתהליך</TableHead>
                      <TableHead className="text-right font-bold text-base">פעולה הבאה</TableHead>
                      <TableHead className="text-right font-bold text-base">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="py-16">
                          <LoadingSpinner size="lg" className="justify-center" />
                          <p className="text-center mt-4 text-lg">טוען נתונים...</p>
                        </TableCell>
                      </TableRow>
                    ) : !deals || deals.length === 0 ? (
                      <TableRow className="table-row">
                        <TableCell colSpan={9} className="py-16">
                          <div className="empty-state">
                            <div className="text-6xl mb-4">💼</div>
                            <h3 className="text-2xl font-bold text-blue-600 mb-3">אין עסקאות במערכת</h3>
                            <p className="text-lg text-gray-600 mb-6">
                              לחץ על "הוסף עסקה חדשה" כדי להתחיל
                            </p>
                            <Button 
                              className="btn-primary text-lg px-8 py-3" 
                              onClick={handleAddDeal}
                            >
                              ➕ הוסף עסקה ראשונה
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      deals.map((deal) => (
                        <TableRow key={deal.id} className="table-row">
                          <TableCell className="font-semibold">{deal.title}</TableCell>
                          <TableCell>{deal.category || '-'}</TableCell>
                          <TableCell>{deal.package_type || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span>{formatAmount(deal.amount_total)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span>{formatAmount(deal.amount_paid)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`status-badge ${
                              deal.payment_status === 'paid' ? 'status-paid' :
                              deal.payment_status === 'partial' ? 'status-partial' : 'status-pending'
                            }`}>
                              {getPaymentStatusText(deal.payment_status)}
                            </span>
                          </TableCell>
                          <TableCell>{deal.workflow_stage || '-'}</TableCell>
                          <TableCell>
                            {deal.next_action_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>{new Date(deal.next_action_date).toLocaleDateString('he-IL')}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditDeal(deal)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(deal)}
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
        )}

        <AddDealForm 
          isOpen={isDealFormOpen}
          onClose={handleFormClose}
          deal={editingDeal}
        />

        <DeleteConfirmModal
          isOpen={!!deleteDeal}
          onClose={() => setDeleteDeal(null)}
          onConfirm={handleDeleteConfirm}
          title="מחיקת עסקה"
          itemName={deleteDeal?.title || ''}
          isLoading={deleteDealMutation.isPending}
        />

        {/* Floating Action Button */}
        <button
          onClick={handleAddDeal}
          className="floating-add-btn"
          aria-label="הוסף עסקה חדשה"
        >
          ➕
        </button>
      </div>
    </MainLayout>
  );
};

export default Deals;
