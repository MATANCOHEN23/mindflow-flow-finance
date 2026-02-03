import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Plus, Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SmartComboboxItem {
  id: string;
  [key: string]: any;
}

interface SmartComboboxProps<T extends SmartComboboxItem> {
  items: T[];
  value: string;
  onChange: (value: string, item?: T) => void;
  displayField: keyof T;
  searchFields: (keyof T)[];
  secondaryField?: keyof T;
  renderItem?: (item: T) => React.ReactNode;
  onCreateNew?: () => void;
  createNewLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function SmartCombobox<T extends SmartComboboxItem>({
  items,
  value,
  onChange,
  displayField,
  searchFields,
  secondaryField,
  renderItem,
  onCreateNew,
  createNewLabel = '+ הוסף חדש',
  placeholder = 'הקלד לחיפוש...',
  disabled = false,
  className = '',
  emptyMessage = 'לא נמצאו תוצאות',
  isLoading = false,
}: SmartComboboxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Find selected item
  const selectedItem = useMemo(() => {
    return items.find(item => item.id === value);
  }, [items, value]);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    
    const query = debouncedQuery.toLowerCase().trim();
    return items.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [items, debouncedQuery, searchFields]);

  // Reset highlighted index when filtered items change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredItems]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          Math.min(prev + 1, filteredItems.length - 1 + (onCreateNew ? 1 : 0))
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex === filteredItems.length && onCreateNew) {
          onCreateNew();
          setIsOpen(false);
        } else if (filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  }, [isOpen, highlightedIndex, filteredItems, onCreateNew]);

  const handleSelect = (item: T) => {
    onChange(item.id, item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', undefined);
    setSearchQuery('');
  };

  const getDisplayValue = () => {
    if (selectedItem) {
      return String(selectedItem[displayField] || '');
    }
    return '';
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div 
        className={cn(
          'flex items-center gap-2 border rounded-md bg-background px-3 py-2 cursor-pointer',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'ring-2 ring-ring ring-offset-2'
        )}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        
        {isOpen ? (
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
            disabled={disabled}
          />
        ) : (
          <span className={cn(
            'flex-1 text-right truncate',
            !selectedItem && 'text-muted-foreground'
          )}>
            {getDisplayValue() || placeholder}
          </span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {selectedItem && !isOpen && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-destructive/20"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <ChevronDown className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )} />
        </div>
      </div>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto shadow-lg border bg-background">
          <div ref={listRef} className="p-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground text-sm">
                {emptyMessage}
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors',
                    highlightedIndex === index && 'bg-accent',
                    value === item.id && 'bg-primary/10'
                  )}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {String(item[displayField] || '')}
                      </div>
                      {secondaryField && item[secondaryField] && (
                        <div className="text-xs text-muted-foreground truncate">
                          {String(item[secondaryField])}
                        </div>
                      )}
                    </div>
                  )}
                  {value === item.id && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
              ))
            )}

            {onCreateNew && (
              <>
                {filteredItems.length > 0 && (
                  <div className="border-t my-1" />
                )}
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors text-primary',
                    highlightedIndex === filteredItems.length && 'bg-accent'
                  )}
                  onClick={() => {
                    onCreateNew();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(filteredItems.length)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">{createNewLabel}</span>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
