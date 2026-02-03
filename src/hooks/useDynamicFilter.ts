import { useState, useCallback, useMemo } from 'react';

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_or_equal'
  | 'less_or_equal'
  | 'is_empty' 
  | 'is_not_empty';

export type FilterCombinator = 'AND' | 'OR';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number;
}

export interface FilterTemplate {
  id: string;
  name: string;
  conditions: FilterCondition[];
  combinator: FilterCombinator;
  createdAt: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { value: string; label: string }[];
}

const STORAGE_KEY = 'crm_filter_templates';

export const useDynamicFilter = <T extends Record<string, any>>(
  data: T[],
  fieldDefinitions: FieldDefinition[]
) => {
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [combinator, setCombinator] = useState<FilterCombinator>('AND');
  const [savedTemplates, setSavedTemplates] = useState<FilterTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add a new condition
  const addCondition = useCallback(() => {
    const firstField = fieldDefinitions[0];
    setConditions(prev => [
      ...prev,
      {
        id: generateId(),
        field: firstField?.key || '',
        operator: 'equals',
        value: ''
      }
    ]);
  }, [fieldDefinitions]);

  // Update a condition
  const updateCondition = useCallback((id: string, updates: Partial<FilterCondition>) => {
    setConditions(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  // Remove a condition
  const removeCondition = useCallback((id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  }, []);

  // Clear all conditions
  const clearConditions = useCallback(() => {
    setConditions([]);
  }, []);

  // Check if a single condition matches an item
  const matchesCondition = useCallback((item: T, condition: FilterCondition): boolean => {
    const itemValue = item[condition.field];
    const filterValue = condition.value;

    // Handle empty/null values
    if (condition.operator === 'is_empty') {
      return itemValue === null || itemValue === undefined || itemValue === '';
    }
    if (condition.operator === 'is_not_empty') {
      return itemValue !== null && itemValue !== undefined && itemValue !== '';
    }

    // Convert to comparable values
    const itemStr = String(itemValue ?? '').toLowerCase();
    const filterStr = String(filterValue).toLowerCase();
    const itemNum = Number(itemValue);
    const filterNum = Number(filterValue);

    switch (condition.operator) {
      case 'equals':
        return itemStr === filterStr;
      case 'not_equals':
        return itemStr !== filterStr;
      case 'contains':
        return itemStr.includes(filterStr);
      case 'greater_than':
        return !isNaN(itemNum) && !isNaN(filterNum) && itemNum > filterNum;
      case 'less_than':
        return !isNaN(itemNum) && !isNaN(filterNum) && itemNum < filterNum;
      case 'greater_or_equal':
        return !isNaN(itemNum) && !isNaN(filterNum) && itemNum >= filterNum;
      case 'less_or_equal':
        return !isNaN(itemNum) && !isNaN(filterNum) && itemNum <= filterNum;
      default:
        return true;
    }
  }, []);

  // Apply all filters to data
  const filteredData = useMemo(() => {
    if (conditions.length === 0) return data;

    return data.filter(item => {
      if (combinator === 'AND') {
        return conditions.every(c => matchesCondition(item, c));
      } else {
        return conditions.some(c => matchesCondition(item, c));
      }
    });
  }, [data, conditions, combinator, matchesCondition]);

  // Save current filter as template
  const saveAsTemplate = useCallback((name: string) => {
    if (!name.trim() || conditions.length === 0) return null;

    const newTemplate: FilterTemplate = {
      id: generateId(),
      name: name.trim(),
      conditions: [...conditions],
      combinator,
      createdAt: new Date().toISOString()
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    
    return newTemplate;
  }, [conditions, combinator, savedTemplates]);

  // Load a template
  const loadTemplate = useCallback((template: FilterTemplate) => {
    setConditions(template.conditions.map(c => ({ ...c, id: generateId() })));
    setCombinator(template.combinator);
  }, []);

  // Delete a template
  const deleteTemplate = useCallback((templateId: string) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
  }, [savedTemplates]);

  return {
    // State
    conditions,
    combinator,
    savedTemplates,
    filteredData,
    
    // Actions
    addCondition,
    updateCondition,
    removeCondition,
    clearConditions,
    setCombinator,
    
    // Templates
    saveAsTemplate,
    loadTemplate,
    deleteTemplate,
    
    // Utilities
    fieldDefinitions,
    hasActiveFilters: conditions.length > 0
  };
};

// Operator labels in Hebrew
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'שווה ל',
  not_equals: 'שונה מ',
  contains: 'מכיל',
  greater_than: 'גדול מ',
  less_than: 'קטן מ',
  greater_or_equal: 'גדול או שווה ל',
  less_or_equal: 'קטן או שווה ל',
  is_empty: 'ריק',
  is_not_empty: 'לא ריק'
};

// Get available operators for field type
export const getOperatorsForType = (type: FieldDefinition['type']): FilterOperator[] => {
  switch (type) {
    case 'number':
      return ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal', 'is_empty', 'is_not_empty'];
    case 'date':
      return ['equals', 'greater_than', 'less_than', 'is_empty', 'is_not_empty'];
    case 'select':
      return ['equals', 'not_equals', 'is_empty', 'is_not_empty'];
    default:
      return ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty'];
  }
};
