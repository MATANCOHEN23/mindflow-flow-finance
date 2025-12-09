import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useContacts } from "@/hooks/useContacts";
import { useContactDomains } from "@/hooks/useDomains";
import { useDeals } from "@/hooks/useDeals";
import { PremiumLoader } from "@/components/PremiumLoader";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SmartClientWizard } from "@/components/Forms/SmartClientWizard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Therapy = () => {
  const [isWizardOpen, setWizardOpen] = useState(false);
  
  // Fetch psychology domain and sub-domains
  const { data: psychologyDomains } = useQuery({
    queryKey: ['psychology-domains'],
    queryFn: async () => {
      // Get psychology parent domain
      const { data: parentDomain } = await supabase
        .from('domains')
        .select('id, name, icon')
        .eq('name', 'פסיכולוג')
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

  // Fetch contacts assigned to psychology domains
  const { data: therapyContacts, isLoading } = useQuery({
    queryKey: ['therapy-contacts', psychologyDomains?.parent?.id],
    queryFn: async () => {
      if (!psychologyDomains?.parent?.id) return [];
      
      // Get all domain IDs (parent + children)
      const domainIds = [
        psychologyDomains.parent.id,
        ...(psychologyDomains.children?.map(c => c.id) || [])
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
            email,
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
        .in('domain_id', domainIds)
        .eq('status', 'active');
      
      return contactDomains || [];
    },
    enabled: !!psychologyDomains?.parent?.id
  });

  // Get deals for therapy contacts
  const { data: allDeals } = useDeals();
  
  // Filter deals that belong to therapy contacts
  const therapyContactIds = therapyContacts?.map(tc => tc.contact?.id).filter(Boolean) || [];
  const therapyDeals = allDeals?.filter(deal => 
    therapyContactIds.includes(deal.contact_id)
  ) || [];

  // Calculate stats by package type
  const getPackageStats = () => {
    const stats = {
      interest: 0,     // התעניינות
      single: 0,       // טיפול בודד
      pack5: 0,        // 5 מפגשים
      pack10: 0,       // 10 מפגשים
      custom: 0        // מותאם אישית
    };
    
    therapyDeals.forEach(deal => {
      switch(deal.package_type) {
        case 'interest': stats.interest++; break;
        case 'single': stats.single++; break;
        case 'pack5': stats.pack5++; break;
        case 'pack10': stats.pack10++; break;
        default: stats.custom++;
      }
    });
    
    return stats;
  };
  
  const stats = getPackageStats();

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
      <div className="space-y-8">
        <div className="premium-card shine-effect">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-black gradient-text mb-2">🧠 טיפולים נפשיים</h1>
              <p className="text-primary/70 text-xl font-semibold">ניהול לקוחות טיפול וחבילות טיפול</p>
            </div>
            <Button 
              className="btn-accent text-lg px-8 py-4"
              onClick={() => setWizardOpen(true)}
            >
              ➕ הוסף לקוח טיפול
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">התעניינות</h3>
              <div className="text-3xl font-black gradient-text">{stats.interest}</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">טיפול בודד</h3>
              <div className="text-sm text-muted-foreground mb-1">350₪</div>
              <div className="text-3xl font-black gradient-text">{stats.single}</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">5 מפגשים</h3>
              <div className="text-sm text-muted-foreground mb-1">1,500₪</div>
              <div className="text-3xl font-black gradient-text">{stats.pack5}</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">10 מפגשים</h3>
              <div className="text-sm text-muted-foreground mb-1">2,750₪</div>
              <div className="text-3xl font-black gradient-text">{stats.pack10}</div>
            </CardContent>
          </Card>
          <Card className="premium-card text-center">
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-primary mb-2">חבילה מותאמת</h3>
              <div className="text-3xl font-black gradient-text">{stats.custom}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-card">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-black gradient-text text-center">
              רשימת לקוחות טיפול ({therapyContacts?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead className="text-right font-black text-lg">שם הלקוח</TableHead>
                    <TableHead className="text-right font-black text-lg">סוג טיפול</TableHead>
                    <TableHead className="text-right font-black text-lg">טלפון</TableHead>
                    <TableHead className="text-right font-black text-lg">אימייל</TableHead>
                    <TableHead className="text-right font-black text-lg">סטטוס</TableHead>
                    <TableHead className="text-right font-black text-lg">הערות</TableHead>
                    <TableHead className="text-right font-black text-lg">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {therapyContacts && therapyContacts.length > 0 ? (
                    therapyContacts.map((tc: any) => (
                      <TableRow key={tc.id} className="table-row">
                        <TableCell className="font-semibold">
                          <Link 
                            to={`/customer/${tc.contact?.id}`}
                            className="text-primary hover:underline"
                          >
                            {tc.contact?.first_name} {tc.contact?.last_name || ''}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {tc.domain?.icon} {tc.domain?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{tc.contact?.phone || '-'}</TableCell>
                        <TableCell>{tc.contact?.email || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={tc.status === 'active' ? 'default' : 'secondary'}
                          >
                            {tc.status === 'active' && '✅ פעיל'}
                            {tc.status === 'paused' && '⏸️ מושהה'}
                            {tc.status === 'completed' && '✔️ הושלם'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {tc.contact?.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <Link to={`/customer/${tc.contact?.id}`}>
                            <Button size="sm" variant="outline">
                              צפייה
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="table-row">
                      <TableCell colSpan={7} className="py-16">
                        <div className="empty-state">
                          <div className="text-8xl mb-6">🧠</div>
                          <h3 className="text-3xl font-black gradient-text mb-4">אין לקוחות טיפול במערכת</h3>
                          <p className="text-xl text-primary/70 font-semibold mb-8">
                            לחץ על "הוסף לקוח טיפול" כדי להתחיל
                          </p>
                          <Button 
                            className="btn-primary text-xl px-12 py-4"
                            onClick={() => setWizardOpen(true)}
                          >
                            ➕ הוסף לקוח ראשון
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

export default Therapy;
