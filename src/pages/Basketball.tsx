import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useDeals } from "@/hooks/useDeals";
import { PremiumLoader } from "@/components/PremiumLoader";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SmartClientWizard } from "@/components/Forms/SmartClientWizard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Basketball = () => {
  const [isWizardOpen, setWizardOpen] = useState(false);
  
  // Fetch basketball domain and sub-domains
  const { data: basketballDomains } = useQuery({
    queryKey: ['basketball-domains'],
    queryFn: async () => {
      // Get basketball parent domain
      const { data: parentDomain } = await supabase
        .from('domains')
        .select('id, name, icon')
        .eq('name', 'מאמן כדורסל')
        .single();
      
      if (!parentDomain) return { parent: null, children: [] };
      
      // Get all child domains
      const { data: childDomains } = await supabase
        .from('domains')
        .select('id, name, icon, pricing_type, pricing_value')
        .eq('parent_id', parentDomain.id)
        .eq('is_active', true);
      
      return {
        parent: parentDomain,
        children: childDomains || []
      };
    }
  });

  // Fetch contacts assigned to basketball domains
  const { data: basketballContacts, isLoading } = useQuery({
    queryKey: ['basketball-contacts', basketballDomains?.parent?.id],
    queryFn: async () => {
      if (!basketballDomains?.parent?.id) return [];
      
      // Get all domain IDs (parent + children)
      const domainIds = [
        basketballDomains.parent.id,
        ...(basketballDomains.children?.map(c => c.id) || [])
      ];
      
      // Get contacts assigned to these domains
      const { data: contactDomains } = await supabase
        .from('contact_domains')
        .select(`
          *,
          contact:contact_id (
            id,
            first_name,
            last_name,
            phone,
            phone_parent,
            child_name,
            notes
          ),
          domain:domain_id (
            id,
            name,
            icon,
            pricing_type,
            pricing_value
          )
        `)
        .in('domain_id', domainIds);
      
      return contactDomains || [];
    },
    enabled: !!basketballDomains?.parent?.id
  });

  // Get deals for basketball contacts
  const { data: allDeals } = useDeals();
  
  // Filter deals that belong to basketball contacts
  const basketballContactIds = basketballContacts?.map(bc => bc.contact?.id).filter(Boolean) || [];
  const basketballDeals = allDeals?.filter(deal => 
    basketballContactIds.includes(deal.contact_id)
  ) || [];

  // Group by status
  const getContactsByStatus = () => {
    const groups = {
      notRegistered: [] as any[],
      pendingPayment: [] as any[],
      active: [] as any[]
    };
    
    basketballContacts?.forEach((bc: any) => {
      const contactDeals = basketballDeals.filter(d => d.contact_id === bc.contact?.id);
      
      if (contactDeals.length === 0) {
        groups.notRegistered.push(bc);
      } else if (contactDeals.some(d => d.payment_status === 'pending')) {
        groups.pendingPayment.push(bc);
      } else {
        groups.active.push(bc);
      }
    });
    
    return groups;
  };
  
  const statusGroups = getContactsByStatus();

  // Calculate stats by location/domain
  const locationStats = basketballDomains?.children?.map(child => {
    const count = basketballContacts?.filter(bc => bc.domain?.id === child.id).length || 0;
    return { ...child, count };
  }) || [];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <PremiumLoader size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="premium-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black gradient-text mb-2">🏀 אימוני כדורסל</h1>
              <p className="text-primary/70 text-lg font-semibold">ניהול עונת הכדורסל וחבילות אימונים</p>
            </div>
            <Button 
              className="btn-accent text-base px-6 py-3" 
              onClick={() => setWizardOpen(true)}
            >
              ➕ הוסף שחקן חדש
            </Button>
          </div>
        </div>

        {/* Stats by Location */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {locationStats.map(loc => (
            <Card key={loc.id} className="premium-card text-center">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-primary mb-1">{loc.icon} {loc.name}</h3>
                {loc.pricing_type === 'percentage' && (
                  <div className="text-xs text-muted-foreground mb-1">{loc.pricing_value}%</div>
                )}
                {loc.pricing_type === 'fixed' && (
                  <div className="text-xs text-muted-foreground mb-1">₪{loc.pricing_value}</div>
                )}
                <div className="text-2xl font-black gradient-text">{loc.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="premium-card">
            <CardHeader className="bg-secondary/30 rounded-t-xl">
              <CardTitle className="text-lg font-black text-primary text-center">
                לא רשום ({statusGroups.notRegistered.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] p-4 space-y-2">
              {statusGroups.notRegistered.length > 0 ? (
                statusGroups.notRegistered.map((bc: any) => (
                  <Link key={bc.id} to={`/customer/${bc.contact?.id}`}>
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <p className="font-semibold">{bc.contact?.first_name} {bc.contact?.last_name}</p>
                      <Badge variant="outline" className="text-xs">
                        {bc.domain?.icon} {bc.domain?.name}
                      </Badge>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-3">🏀</div>
                  <p className="font-semibold">אין שחקנים ברשימה</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="bg-accent/10 rounded-t-xl">
              <CardTitle className="text-lg font-black text-primary text-center">
                רשום - ממתין תשלום ({statusGroups.pendingPayment.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] p-4 space-y-2">
              {statusGroups.pendingPayment.length > 0 ? (
                statusGroups.pendingPayment.map((bc: any) => (
                  <Link key={bc.id} to={`/customer/${bc.contact?.id}`}>
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer border-orange-200">
                      <p className="font-semibold">{bc.contact?.first_name} {bc.contact?.last_name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {bc.domain?.icon} {bc.domain?.name}
                      </Badge>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-3">⏳</div>
                  <p className="font-semibold">אין שחקנים ממתינים</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="bg-success/10 rounded-t-xl">
              <CardTitle className="text-lg font-black text-primary text-center">
                פעיל ({statusGroups.active.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] p-4 space-y-2">
              {statusGroups.active.length > 0 ? (
                statusGroups.active.map((bc: any) => (
                  <Link key={bc.id} to={`/customer/${bc.contact?.id}`}>
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer border-green-200">
                      <p className="font-semibold">{bc.contact?.first_name} {bc.contact?.last_name}</p>
                      <Badge className="text-xs bg-green-100 text-green-800">
                        {bc.domain?.icon} {bc.domain?.name}
                      </Badge>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-semibold">אין שחקנים פעילים</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="section-divider"></div>

        {/* Full Table View */}
        <Card className="premium-card">
          <CardHeader className="bg-secondary/30 rounded-t-xl">
            <CardTitle className="text-xl font-black gradient-text text-center">
              רשימת שחקני כדורסל ({basketballContacts?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-base">שם שחקן</TableHead>
                    <TableHead className="text-right font-black text-base">מיקום/קבוצה</TableHead>
                    <TableHead className="text-right font-black text-base">טלפון הורה</TableHead>
                    <TableHead className="text-right font-black text-base">סטטוס</TableHead>
                    <TableHead className="text-right font-black text-base">הערות</TableHead>
                    <TableHead className="text-right font-black text-base">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {basketballContacts && basketballContacts.length > 0 ? (
                    basketballContacts.map((bc: any) => (
                      <TableRow key={bc.id} className="table-row">
                        <TableCell className="font-semibold">
                          <Link 
                            to={`/customer/${bc.contact?.id}`}
                            className="text-primary hover:underline"
                          >
                            {bc.contact?.child_name || `${bc.contact?.first_name} ${bc.contact?.last_name || ''}`}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {bc.domain?.icon} {bc.domain?.name}
                          </Badge>
                          {bc.domain?.pricing_type === 'percentage' && (
                            <span className="text-xs text-muted-foreground mr-2">
                              ({bc.domain?.pricing_value}%)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{bc.contact?.phone_parent || bc.contact?.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={bc.status === 'active' ? 'default' : 'secondary'}
                          >
                            {bc.status === 'active' && '✅ פעיל'}
                            {bc.status === 'paused' && '⏸️ מושהה'}
                            {bc.status === 'completed' && '✔️ הושלם'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {bc.contact?.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <Link to={`/customer/${bc.contact?.id}`}>
                            <Button size="sm" variant="outline">
                              צפייה
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="table-row">
                      <TableCell colSpan={6} className="py-16">
                        <div className="empty-state">
                          <div className="text-6xl mb-4">🏀</div>
                          <h3 className="text-2xl font-black gradient-text mb-3">אין שחקנים במערכת</h3>
                          <p className="text-lg text-primary/70 font-semibold mb-6">
                            לחץ על "הוסף שחקן חדש" כדי להתחיל
                          </p>
                          <Button 
                            className="btn-primary text-lg px-8 py-3"
                            onClick={() => setWizardOpen(true)}
                          >
                            ➕ הוסף שחקן ראשון
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <SmartClientWizard 
        isOpen={isWizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </MainLayout>
  );
};

export default Basketball;
