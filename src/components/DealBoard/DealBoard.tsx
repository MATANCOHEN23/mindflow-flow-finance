
import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Deal } from '@/types/database';
import { useDeals, useUpdateDeal } from '@/hooks/useDeals';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DealColumn } from './DealColumn';
import { DealCard } from './DealCard';

type DealStatus = 'lead' | 'booked' | 'done';

const COLUMNS: { id: DealStatus; title: string; color: string }[] = [
  { id: 'lead', title: 'לידים', color: 'bg-orange-100 border-orange-300' },
  { id: 'booked', title: 'מוזמנים', color: 'bg-blue-100 border-blue-300' },
  { id: 'done', title: 'הושלמו', color: 'bg-green-100 border-green-300' },
];

export const DealBoard: React.FC = () => {
  const { data: deals, isLoading } = useDeals();
  const updateDealMutation = useUpdateDeal();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const deal = deals?.find((d) => d.id === active.id);
    setDraggedDeal(deal || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !deals) return;

    const dealId = active.id as string;
    const newStatus = over.id as DealStatus;
    
    // Find the deal being moved
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    // Update the deal status if it changed
    if (deal.workflow_stage !== newStatus) {
      updateDealMutation.mutate({
        id: dealId,
        data: { workflow_stage: newStatus }
      });
    }

    setActiveId(null);
    setDraggedDeal(null);
  };

  const getDealsByStatus = (status: DealStatus): Deal[] => {
    if (!deals) return [];
    return deals.filter((deal) => deal.workflow_stage === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mr-4 text-lg">טוען עסקאות...</p>
      </div>
    );
  }

  return (
    <div className="card p-6" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
        🚀 לוח ניהול עסקאות 🚀
      </h2>
      
      <DndContext
        sensors={[]}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <DealColumn
              key={column.id}
              column={column}
              deals={getDealsByStatus(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId && draggedDeal ? (
            <DealCard deal={draggedDeal} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
