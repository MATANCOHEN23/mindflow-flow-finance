import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

export interface Column<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
  mobileLabel?: string; // Label override for mobile view
}

interface ResponsiveTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  mobileCardRender?: (row: T) => ReactNode; // Custom mobile card render
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
}

export function ResponsiveTable<T = any>({
  columns,
  data,
  getRowKey,
  mobileCardRender,
  onRowClick,
  emptyState,
  className = ''
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
                  const displayValue = column.render ? column.render(value, row) : value;
                  
                  return (
                    <TableCell key={column.key} className={column.className}>
                      {displayValue || '-'}
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
