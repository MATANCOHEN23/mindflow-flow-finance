import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Save, 
  FolderOpen, 
  X, 
  Filter, 
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  FilterCondition, 
  FilterCombinator, 
  FilterTemplate, 
  FieldDefinition,
  OPERATOR_LABELS,
  getOperatorsForType
} from '@/hooks/useDynamicFilter';

interface FilterBuilderProps {
  conditions: FilterCondition[];
  combinator: FilterCombinator;
  fieldDefinitions: FieldDefinition[];
  savedTemplates: FilterTemplate[];
  onAddCondition: () => void;
  onUpdateCondition: (id: string, updates: Partial<FilterCondition>) => void;
  onRemoveCondition: (id: string) => void;
  onClearConditions: () => void;
  onSetCombinator: (combinator: FilterCombinator) => void;
  onSaveTemplate: (name: string) => FilterTemplate | null;
  onLoadTemplate: (template: FilterTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  resultCount?: number;
}

export const FilterBuilder = ({
  conditions,
  combinator,
  fieldDefinitions,
  savedTemplates,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  onClearConditions,
  onSetCombinator,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  resultCount
}: FilterBuilderProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveTemplate(templateName);
      setTemplateName('');
      setShowSaveDialog(false);
    }
  };

  const getFieldDefinition = (fieldKey: string) => {
    return fieldDefinitions.find(f => f.key === fieldKey);
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-primary" />
            בונה סינון מתקדם
            {conditions.length > 0 && (
              <Badge variant="secondary" className="mr-2">
                {conditions.length} תנאים
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {resultCount !== undefined && conditions.length > 0 && (
              <Badge variant="outline" className="bg-accent text-accent-foreground border-accent">
                {resultCount} תוצאות
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Combinator selector */}
          {conditions.length > 1 && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">חבר תנאים ב:</span>
              <Select value={combinator} onValueChange={(v) => onSetCombinator(v as FilterCombinator)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">וגם (AND)</SelectItem>
                  <SelectItem value="OR">או (OR)</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                {combinator === 'AND' ? 'כל התנאים חייבים להתקיים' : 'מספיק שתנאי אחד יתקיים'}
              </span>
            </div>
          )}

          {/* Conditions list */}
          <div className="space-y-2">
            {conditions.map((condition, index) => {
              const fieldDef = getFieldDefinition(condition.field);
              const operators = fieldDef ? getOperatorsForType(fieldDef.type) : [];
              const needsValue = !['is_empty', 'is_not_empty'].includes(condition.operator);

              return (
                <div key={condition.id} className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  {/* Row number */}
                  <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                    {index + 1}
                  </span>

                  {/* Field selector */}
                  <Select
                    value={condition.field}
                    onValueChange={(value) => onUpdateCondition(condition.id, { field: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="בחר שדה" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldDefinitions.map((field) => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator selector */}
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => onUpdateCondition(condition.id, { operator: value as any })}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op} value={op}>
                          {OPERATOR_LABELS[op]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value input */}
                  {needsValue && (
                    fieldDef?.type === 'select' && fieldDef.options ? (
                      <Select
                        value={String(condition.value)}
                        onValueChange={(value) => onUpdateCondition(condition.id, { value })}
                      >
                        <SelectTrigger className="flex-1 min-w-32">
                          <SelectValue placeholder="בחר ערך" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldDef.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={fieldDef?.type === 'number' ? 'number' : 'text'}
                        value={condition.value}
                        onChange={(e) => onUpdateCondition(condition.id, { 
                          value: fieldDef?.type === 'number' ? Number(e.target.value) : e.target.value 
                        })}
                        placeholder="הזן ערך..."
                        className="flex-1 min-w-32"
                      />
                    )
                  )}

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCondition(condition.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  {/* Combinator indicator */}
                  {index < conditions.length - 1 && (
                    <Badge variant="outline" className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs">
                      {combinator === 'AND' ? 'וגם' : 'או'}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {conditions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">לחץ "הוסף תנאי" כדי להתחיל לבנות סינון</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <Button onClick={onAddCondition} variant="outline" size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              הוסף תנאי
            </Button>

            {conditions.length > 0 && (
              <>
                <Button 
                  onClick={() => setShowSaveDialog(true)} 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                >
                  <Save className="w-4 h-4" />
                  שמור כתבנית
                </Button>

                <Button 
                  onClick={onClearConditions} 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-muted-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                  נקה הכל
                </Button>
              </>
            )}

            {savedTemplates.length > 0 && (
              <Button 
                onClick={() => setShowTemplatesDialog(true)} 
                variant="outline" 
                size="sm" 
                className="gap-1 mr-auto"
              >
                <FolderOpen className="w-4 h-4" />
                תבניות שמורות ({savedTemplates.length})
              </Button>
            )}
          </div>
        </CardContent>
      )}

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>שמור תבנית סינון</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="שם התבנית (לדוגמה: לקוחות כדורסל פעילים)"
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              ביטול
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
              <Save className="w-4 h-4 ml-2" />
              שמור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Templates Dialog */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>תבניות סינון שמורות</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2 max-h-80 overflow-y-auto">
            {savedTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {template.conditions.length} תנאים • {template.combinator}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onLoadTemplate(template);
                      setShowTemplatesDialog(false);
                    }}
                  >
                    <FolderOpen className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTemplate(template.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {savedTemplates.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                אין תבניות שמורות
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplatesDialog(false)}>
              סגור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
