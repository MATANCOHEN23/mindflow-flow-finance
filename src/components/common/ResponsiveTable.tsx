import React, { ReactNode, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface Column<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
  mobileLabel?: string;
  editable?: boolean; // Enable inline editing for this column
  type?: 'text' | 'number' | 'date'; // Input type for editing
}

interface ResponsiveTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  mobileCardRender?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
  editable?: boolean; // Enable inline editing for the table
  onCellEdit?: (rowKey: string, columnKey: string, newValue: any) => Promise<void>;
}

// Inline Edit Cell Component
interface EditableCellProps {
  value: any;
  rowKey: string;
  columnKey: string;
  type?: 'text' | 'number' | 'date';
  onSave: (rowKey: string, columnKey: string, newValue: any) => Promise<void>;
  render?: (value: any, row: any) => ReactNode;
  row: any;
}

function EditableCell({ value, rowKey, columnKey, type = 'text', onSave, render, row }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(rowKey, columnKey, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <Input
          type={type}
          value={editValue ?? ''}
          onChange={(e) => setEditValue(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-8 text-sm"
          disabled={isSaving}
        />
        {isSaving && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
    );
  }

  const displayValue = render ? render(value, row) : value;

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="cursor-text hover:bg-muted/50 px-1 py-0.5 rounded transition-colors min-h-[24px]"
      title="לחץ פעמיים לעריכה"
    >
      {displayValue || '-'}
    </div>
  );
}

export function ResponsiveTable<T = any>({
  columns,
  data,
  getRowKey,
  mobileCardRender,
  onRowClick,
  emptyState,
  className = '',
  editable = false,
  onCellEdit,
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (!data || data.length === 0) {
    return <div className="py-8">{emptyState}</div>;
  }

  // Mobile Card View
  if (isMobile) {
    if (mobileCardRender) {
      return (
        <div className="space-y-3 px-2" dir="rtl">
          {data.map((row) => (
            <div
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {mobileCardRender(row)}
            </div>
          ))}
        </div>
      );
    }

    // Default mobile card layout
    return (
      <div className="space-y-3 px-2" dir="rtl">
        {data.map((row) => (
          <Card
            key={getRowKey(row)}
            className="p-4 shadow-sm hover:shadow-md transition-shadow touch-feedback"
            onClick={() => onRowClick?.(row)}
          >
            <div className="space-y-2">
              {columns.map((column) => {
                const value = (row as any)[column.key];
                const displayValue = column.render ? column.render(value, row) : value;
                
                return (
                  <div key={column.key} className="flex justify-between items-start gap-2">
                    <span className="text-sm font-semibold text-muted-foreground min-w-[100px]">
                      {column.mobileLabel || column.label}:
                    </span>
                    <span className="text-sm text-right flex-1">{displayValue || '-'}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop Table View with horizontal scroll
  return (
    <div className="relative">
      {/* Gradient indicators for scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      
      <div className="overflow-x-auto" dir="rtl">
        <Table className={className}>
          <TableHeader>
            <TableRow className="table-header">
              {columns.map((column) => (
                <TableHead key={column.key} className={`text-right font-bold ${column.className || ''}`}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={getRowKey(row)}
                className="table-row hover:bg-primary/5 cursor-pointer transition-colors touch-feedback"
                onClick={() => onRowClick?.(row)}
              >
              {columns.map((column) => {
                  const value = (row as any)[column.key];
                  const isColumnEditable = editable && column.editable !== false && onCellEdit;
                  
                  return (
                    <TableCell key={column.key} className={cn(column.className)}>
                      {isColumnEditable ? (
                        <EditableCell
                          value={value}
                          rowKey={getRowKey(row)}
                          columnKey={column.key}
                          type={column.type}
                          onSave={onCellEdit}
                          render={column.render}
                          row={row}
                        />
                      ) : (
                        column.render ? column.render(value, row) : (value || '-')
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
