import { useState, useEffect } from "react";
import { useDomainsHierarchy } from "@/hooks/useDomains";
import { DomainWithChildren } from "@/types/database";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { PremiumLoader } from "@/components/PremiumLoader";

interface DomainSelectorProps {
  selectedDomains: string[];
  onChange: (domains: string[]) => void;
}

export function DomainSelector({ selectedDomains, onChange }: DomainSelectorProps) {
  const { data: hierarchy, isLoading } = useDomainsHierarchy();
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  const toggleExpand = (domainId: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId);
    } else {
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  };

  const toggleDomain = (domainId: string, hasChildren: boolean) => {
    const newSelected = [...selectedDomains];
    const index = newSelected.indexOf(domainId);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(domainId);
      // אם יש ילדים, הרחב אוטומטית
      if (hasChildren) {
        setExpandedDomains(prev => new Set([...prev, domainId]));
      }
    }
    
    onChange(newSelected);
  };

  const renderDomain = (domain: DomainWithChildren, level: number = 0) => {
    const hasChildren = domain.children && domain.children.length > 0;
    const isExpanded = expandedDomains.has(domain.id);
    const isSelected = selectedDomains.includes(domain.id);
    const indent = level * 24;

    return (
      <div key={domain.id} className="w-full">
        <div 
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer`}
          style={{ paddingRight: `${indent + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(domain.id);
              }}
              className="p-1 hover:bg-accent rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-6" />}

          <Checkbox
            id={`domain-${domain.id}`}
            checked={isSelected}
            onCheckedChange={() => toggleDomain(domain.id, hasChildren)}
          />

          <label
            htmlFor={`domain-${domain.id}`}
            className="flex items-center gap-2 flex-1 cursor-pointer"
          >
            {domain.icon && <span className="text-xl">{domain.icon}</span>}
            <span className={`${isSelected ? 'font-semibold' : ''}`}>
              {domain.name}
            </span>
            {domain.pricing_type && (
              <Badge variant="outline" className="text-xs">
                {domain.pricing_type === 'percentage' && `${domain.pricing_value}%`}
                {domain.pricing_type === 'fixed' && `₪${domain.pricing_value}`}
                {domain.pricing_type === 'full' && '100%'}
              </Badge>
            )}
          </label>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {domain.children!.map(child => renderDomain(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <PremiumLoader size="md" />
      </div>
    );
  }

  if (!hierarchy || hierarchy.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🏢</div>
        <p className="text-muted-foreground font-semibold">אין תחומים זמינים</p>
        <p className="text-sm mt-2 text-muted-foreground">יש ליצור תחומים במערכת תחילה</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-base font-semibold">בחר תחומים</Label>
      <div className="border rounded-lg p-3 max-h-96 overflow-y-auto bg-background/50">
        {hierarchy.map(domain => renderDomain(domain))}
      </div>
      
      {selectedDomains.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <Label className="w-full text-sm text-muted-foreground">תחומים נבחרים:</Label>
          {selectedDomains.map(domainId => {
            // מצא את התחום בהיררכיה
            const findDomain = (domains: DomainWithChildren[]): DomainWithChildren | null => {
              for (const d of domains) {
                if (d.id === domainId) return d;
                if (d.children) {
                  const found = findDomain(d.children);
                  if (found) return found;
                }
              }
              return null;
            };
            const domain = findDomain(hierarchy);
            
            return domain ? (
              <Badge key={domainId} variant="secondary" className="gap-1">
                {domain.icon} {domain.name}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
