import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDomains, useDeleteDomain } from "@/hooks/useDomains";
import { DomainForm } from "@/components/Forms/DomainForm";
import { Domain, DomainWithChildren } from "@/types/database";
import { Settings, Plus, Trash2, Edit, ChevronDown, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export default function Domains() {
  const { data: domains, isLoading } = useDomains();
  const deleteDomain = useDeleteDomain();
  const [isDomainFormOpen, setIsDomainFormOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  const buildHierarchy = (domains: Domain[]): DomainWithChildren[] => {
    const domainMap = new Map<string, DomainWithChildren>();
    const roots: DomainWithChildren[] = [];

    domains.forEach(domain => {
      domainMap.set(domain.id, { ...domain, children: [] });
    });

    domains.forEach(domain => {
      const domainNode = domainMap.get(domain.id)!;
      if (domain.parent_id) {
        const parent = domainMap.get(domain.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(domainNode);
        }
      } else {
        roots.push(domainNode);
      }
    });

    return roots;
  };

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
    setIsDomainFormOpen(true);
  };

  const handleDelete = async () => {
    if (!domainToDelete) return;
    
    try {
      await deleteDomain.mutateAsync(domainToDelete);
      toast.success("התחום נמחק בהצלחה");
      setDeleteConfirmOpen(false);
      setDomainToDelete(null);
    } catch (error) {
      toast.error("שגיאה במחיקת התחום");
    }
  };

  const toggleExpanded = (domainId: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId);
    } else {
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  };

  const getPricingLabel = (domain: Domain) => {
    if (!domain.pricing_type || !domain.pricing_value) return null;
    
    switch (domain.pricing_type) {
      case 'percentage':
        return `${domain.pricing_value}%`;
      case 'fixed':
        return `₪${domain.pricing_value}`;
      case 'full':
        return `₪${domain.pricing_value} (מלא)`;
      default:
        return null;
    }
  };

  const renderDomainTree = (domainTree: DomainWithChildren[], level = 0) => {
    return domainTree.map((domain) => {
      const hasChildren = domain.children && domain.children.length > 0;
      const isExpanded = expandedDomains.has(domain.id);
      const pricingLabel = getPricingLabel(domain);

      return (
        <div key={domain.id} style={{ marginRight: `${level * 24}px` }}>
          <Card className="mb-2 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(domain.id)}
                      className="p-1 h-6 w-6"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                  )}
                  
                  {!hasChildren && <div className="w-6" />}
                  
                  <span className="text-2xl">{domain.icon || "📁"}</span>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{domain.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">רמה {domain.level}</Badge>
                      {pricingLabel && (
                        <Badge variant="secondary">{pricingLabel}</Badge>
                      )}
                      {!domain.is_active && (
                        <Badge variant="destructive">לא פעיל</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(domain)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDomainToDelete(domain.id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {hasChildren && isExpanded && (
            <div className="mt-2">
              {renderDomainTree(domain.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  const domainHierarchy = domains ? buildHierarchy(domains) : [];

  return (
    <MainLayout>
      <div className="container mx-auto p-6" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">ניהול תחומים</h1>
          </div>
          <Button
            onClick={() => {
              setEditingDomain(null);
              setIsDomainFormOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            תחום חדש
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>מבנה תחומים היררכי</CardTitle>
          </CardHeader>
          <CardContent>
            {domainHierarchy.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">אין תחומים במערכת</p>
                <p className="text-sm">לחץ על "תחום חדש" כדי להתחיל</p>
              </div>
            ) : (
              renderDomainTree(domainHierarchy)
            )}
          </CardContent>
        </Card>

        <DomainForm
          isOpen={isDomainFormOpen}
          onClose={() => {
            setIsDomainFormOpen(false);
            setEditingDomain(null);
          }}
          editingDomain={editingDomain}
        />

        <DeleteConfirmModal
          isOpen={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setDomainToDelete(null);
          }}
          onConfirm={handleDelete}
          title="מחיקת תחום"
          itemName={domains?.find(d => d.id === domainToDelete)?.name}
        />
      </div>
    </MainLayout>
  );
}
