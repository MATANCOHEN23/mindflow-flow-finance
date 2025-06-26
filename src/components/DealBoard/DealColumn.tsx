
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Deal } from '@/types/database';
import { DealCard } from './DealCard';

interface DealColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
  };
  deals: Deal[];
}

export const DealColumn: React.FC<DealColumnProps> = ({ column, deals }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[500px] rounded-lg border-2 p-4 transition-all duration-300
        ${column.color}
        ${isOver ? 'drop-zone drag-over' : 'drop-zone'}
      `}
    >
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-gray-800">{column.title}</h3>
        <div className="text-sm text-gray-600 mt-1">
          {deals.length} עסקאות
        </div>
      </div>

      <SortableContext items={deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          
          {deals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>אין עסקאות בשלב זה</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
