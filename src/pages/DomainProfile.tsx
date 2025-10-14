import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDomains, useDomainContacts } from "@/hooks/useDomains";
import { useDeals } from "@/hooks/useDeals";
import { usePayments } from "@/hooks/usePayments";
import { DomainForm } from "@/components/Forms/DomainForm";
import { ArrowRight, Users, DollarSign, FileText, Edit } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function DomainProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: domains } = useDomains();
  const { data: contactDomains, isLoading: contactsLoading } = useDomainContacts(id || "");
  const { data: allDeals } = useDeals();
  const { data: allPayments } = usePayments();
  const [isDomainFormOpen, setIsDomainFormOpen] = useState(false);

  const domain = domains?.find(d => d.id === id);
  
  if (!domain) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  // Get full path breadcrumb
  const getFullPath = (domainId: string): string[] => {
    const path: string[] = [];
    let current = domains?.find(d => d.id === domainId);
    
    while (current) {
      path.unshift(`${current.icon || ''} ${current.name}`);
      current = current.parent_id ? domains?.find(d => d.id === current.parent_id) : undefined;
    }
    
    return path;
  };

  const fullPath = getFullPath(domain.id);
  
  // Get deals for this domain
  const domainDeals = allDeals?.filter(deal => deal.domain_id === id) || [];
  
  // Calculate stats
  const activeClients = contactDomains?.filter(cd => cd.status === 'active').length || 0;
  const totalDeals = domainDeals.length;
  const totalRevenue = domainDeals.reduce((sum, deal) => sum + (deal.amount_paid || 0), 0);

  return (
    <MainLayout>
      <div className="container mx-auto p-6" dir="rtl">
        {/* Header */}
        <div className="mb-6">
          <Link to="/domains" className="text-primary hover:underline flex items-center gap-2 mb-4">
            <ArrowRight className="h-4 w-4" />
            חזרה לניהול תחומים
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {fullPath.map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-2">/</span>}
                    {part}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-5xl">{domain.icon || "📁"}</span>
                <div>
                  <h1 className="text-3xl font-bold">{domain.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">רמה {domain.level}</Badge>
                    {domain.pricing_type && domain.pricing_value && (
                      <Badge variant="secondary">
                        {domain.pricing_type === 'percentage' && `${domain.pricing_value}%`}
                        {domain.pricing_type === 'fixed' && `₪${domain.pricing_value}`}
                        {domain.pricing_type === 'full' && `₪${domain.pricing_value} (מלא)`}
                      </Badge>
                    )}
                    <Badge variant={domain.is_active ? "default" : "destructive"}>
                      {domain.is_active ? "פעיל" : "לא פעיל"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={() => setIsDomainFormOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              ערוך תחום
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">לקוחות פעילים</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">סה"כ עסקאות</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">הכנסות</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪{totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clients">לקוחות ({contactDomains?.length || 0})</TabsTrigger>
            <TabsTrigger value="deals">עסקאות ({totalDeals})</TabsTrigger>
            <TabsTrigger value="settings">הגדרות</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>לקוחות משויכים</CardTitle>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <LoadingSpinner />
                ) : contactDomains && contactDomains.length > 0 ? (
                  <div className="space-y-2">
                    {contactDomains.map((cd) => (
                      <Link
                        key={cd.id}
                        to={`/customer/${cd.contact_id}`}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-medium">לקוח #{cd.contact_id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            הצטרף: {new Date(cd.joined_date).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                        <Badge variant={
                          cd.status === 'active' ? 'default' :
                          cd.status === 'paused' ? 'secondary' : 'outline'
                        }>
                          {cd.status === 'active' ? 'פעיל' :
                           cd.status === 'paused' ? 'מושהה' : 'הושלם'}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    אין לקוחות משויכים לתחום זה
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>עסקאות</CardTitle>
              </CardHeader>
              <CardContent>
                {domainDeals.length > 0 ? (
                  <div className="space-y-2">
                    {domainDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {deal.category}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold">₪{deal.amount_total.toLocaleString()}</p>
                          <Badge variant={
                            deal.payment_status === 'paid' ? 'default' :
                            deal.payment_status === 'partial' ? 'secondary' : 'destructive'
                          }>
                            {deal.payment_status === 'paid' ? 'שולם' :
                             deal.payment_status === 'partial' ? 'חלקי' : 'ממתין'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    אין עסקאות לתחום זה
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>פרטי תחום</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">שם</p>
                  <p className="text-lg">{domain.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">רמה</p>
                  <p className="text-lg">{domain.level}</p>
                </div>

                {domain.pricing_type && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">סוג מחיר</p>
                      <p className="text-lg">
                        {domain.pricing_type === 'percentage' && 'אחוז'}
                        {domain.pricing_type === 'fixed' && 'קבוע'}
                        {domain.pricing_type === 'full' && 'מלא'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ערך מחיר</p>
                      <p className="text-lg">
                        {domain.pricing_type === 'percentage' && `${domain.pricing_value}%`}
                        {(domain.pricing_type === 'fixed' || domain.pricing_type === 'full') && 
                          `₪${domain.pricing_value}`}
                      </p>
                    </div>
                  </>
                )}

                {domain.pricing_notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">הערות מחיר</p>
                    <p className="text-lg">{domain.pricing_notes}</p>
                  </div>
                )}

                <div className="pt-4">
                  <Button onClick={() => setIsDomainFormOpen(true)} className="w-full">
                    ערוך הגדרות
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DomainForm
          isOpen={isDomainFormOpen}
          onClose={() => setIsDomainFormOpen(false)}
          editingDomain={domain}
        />
      </div>
    </MainLayout>
  );
}
