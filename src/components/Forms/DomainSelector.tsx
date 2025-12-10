import { useDomainsHierarchy } from "@/hooks/useDomains";
import { DomainWithChildren } from "@/types/database";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PremiumLoader } from "@/components/PremiumLoader";

interface DomainSelectorProps {
  selectedDomains: string[];
  onChange: (domains: string[]) => void;
  showOnlyMainDomains?: boolean;
}

export function DomainSelector({ selectedDomains, onChange, showOnlyMainDomains = true }: DomainSelectorProps) {
  const { data: hierarchy, isLoading } = useDomainsHierarchy();

  const toggleDomain = (domainId: string) => {
    const newSelected = [...selectedDomains];
    const index = newSelected.indexOf(domainId);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(domainId);
    }
    
    onChange(newSelected);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <PremiumLoader size="md" />
        <p className="text-sm text-muted-foreground">טוען תחומים...</p>
      </div>
    );
  }

  // Filter to only main domains (level 1, no parent)
  const mainDomains = showOnlyMainDomains 
    ? hierarchy?.filter(d => d.level === 1 && !d.parent_id) || []
    : hierarchy || [];

  if (!mainDomains || mainDomains.length === 0) {
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
      <Label className="text-base font-semibold">בחר תחומים ראשיים</Label>
      <p className="text-sm text-muted-foreground mb-3">בחר את התחומים הרלוונטיים ללקוח</p>
      
      <div className="grid grid-cols-2 gap-3">
        {mainDomains.map((domain: DomainWithChildren) => {
          const isSelected = selectedDomains.includes(domain.id);
          
          return (
            <div 
              key={domain.id}
              onClick={() => toggleDomain(domain.id)}
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/30'
                }
              `}
            >
              <Checkbox
                id={`domain-${domain.id}`}
                checked={isSelected}
                onCheckedChange={() => toggleDomain(domain.id)}
                className="pointer-events-none"
              />
              
              <div className="flex items-center gap-2 flex-1">
                <span className="text-2xl">{domain.icon || '📌'}</span>
                <span className={`font-medium ${isSelected ? 'text-primary font-semibold' : ''}`}>
                  {domain.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedDomains.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
          <Label className="w-full text-sm text-muted-foreground">נבחרו {selectedDomains.length} תחומים:</Label>
          {selectedDomains.map(domainId => {
            const domain = mainDomains.find(d => d.id === domainId);
            return domain ? (
              <Badge key={domainId} variant="secondary" className="gap-1 text-sm py-1 px-3">
                {domain.icon} {domain.name}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
