
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '@/types/database';
import { Calendar, DollarSign, User } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'partial':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-300';
    }
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg border shadow-sm p-4 cursor-grab transition-all duration-200
        ${isDragging || isSortableDragging ? 'dragging opacity-70 shadow-xl' : 'hover:shadow-md hover:scale-105'}
        ${isDragging ? 'rotate-2 scale-105' : ''}
        drag-item
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
          {deal.title}
        </h4>
        <div className="flex-shrink-0 mr-2">
          <span className={`inline-block w-3 h-3 rounded-full ${
            deal.payment_status === 'paid' ? 'bg-green-500' :
            deal.payment_status === 'partial' ? 'bg-blue-500' : 'bg-orange-500'
          }`} />
        </div>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        {deal.category && (
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{deal.category}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span>{formatAmount(deal.amount_total)}</span>
        </div>

        {deal.next_action_date && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(deal.next_action_date).toLocaleDateString('he-IL')}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(deal.payment_status)}`}>
          {getPaymentStatusText(deal.payment_status)}
        </div>
        
        {deal.amount_paid > 0 && deal.payment_status !== 'paid' && (
          <div className="text-xs text-gray-500 mt-1">
            שולם: {formatAmount(deal.amount_paid)} מתוך {formatAmount(deal.amount_total)}
          </div>
        )}
      </div>

      {deal.notes && (
        <div className="mt-2 text-xs text-gray-500 line-clamp-2">
          {deal.notes}
        </div>
      )}
    </div>
  );
};
