import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDomains, useDomainContacts } from "@/hooks/useDomains";
import { useDeals } from "@/hooks/useDeals";
import { usePayments } from "@/hooks/usePayments";
import { ArrowRight, Phone, Mail, User } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function DomainProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: domains } = useDomains();
  const { data: contactDomains, isLoading: contactsLoading } = useDomainContacts(id || "");
  const { data: allDeals } = useDeals();
  const { data: allPayments } = usePayments();

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

  // Get deals for contacts in this domain
  const contactIds = contactDomains?.map(cd => cd.contact_id) || [];
  const domainDeals = allDeals?.filter(deal => contactIds.includes(deal.contact_id || '')) || [];
  const domainPayments = allPayments?.filter(payment => {
    const dealIds = domainDeals.map(d => d.id);
    return payment.deal_id && dealIds.includes(payment.deal_id);
  }) || [];

  // Calculate stats
  const activeClients = contactDomains?.filter(cd => cd.status === 'active').length || 0;
  const totalRevenue = domainPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (contactsLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6" dir="rtl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/domains" className="text-primary hover:underline flex items-center gap-2 mb-6">
            <ArrowRight className="h-4 w-4" />
            חזרה לניהול תחומים
          </Link>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-4xl shadow-lg">
              {domain.icon || "📁"}
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                כרטיס לקוח - {domain.name}
              </h1>
              <p className="text-lg text-muted-foreground">ת.ז דיגיטלי מלא</p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                לקוחות פעילים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-blue-600">{activeClients}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                💼 סה"כ עסקאות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-purple-600">{domainDeals.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                💰 הכנסות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-green-600">₪{totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Client Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">כרטיסי לקוחות ({contactDomains?.length || 0})</h2>
          
          {contactDomains && contactDomains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactDomains.map((cd) => {
                const contactDeals = domainDeals.filter(d => d.contact_id === cd.contact_id);
                const contactPayments = domainPayments.filter(p => {
                  const dealIds = contactDeals.map(d => d.id);
                  return p.deal_id && dealIds.includes(p.deal_id);
                });
                
                return (
                  <Card key={cd.id} className="bg-white shadow-xl border-2 border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-primary to-purple-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        👤 לקוח #{cd.contact_id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={cd.status === 'active' ? 'default' : 'secondary'} className="bg-white text-primary">
                          {cd.status === 'active' ? 'פעיל' :
                           cd.status === 'paused' ? 'מושהה' : 'הושלם'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      {/* פרטי התחום */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                          🏢 פרטי תחום
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm">
                            <strong>תחום:</strong> {domain.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            הצטרף: {new Date(cd.joined_date).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                      </div>

                      {/* עסקאות */}
                      {contactDeals.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg flex items-center gap-2 text-purple-600">
                            💼 עסקאות ({contactDeals.length})
                          </h3>
                          <div className="space-y-2">
                            {contactDeals.slice(0, 3).map(deal => (
                              <div key={deal.id} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                <p className="font-semibold text-purple-900">{deal.title}</p>
                                <p className="text-sm text-purple-700">₪{deal.amount_total.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* תשלומים */}
                      {contactPayments.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg flex items-center gap-2 text-green-600">
                            💳 תשלומים אחרונים ({contactPayments.length})
                          </h3>
                          <div className="space-y-2">
                            {contactPayments.slice(0, 3).map(payment => (
                              <div key={payment.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <p className="font-semibold text-green-900">₪{payment.amount.toLocaleString()}</p>
                                <p className="text-sm text-green-700">
                                  {new Date(payment.payment_date).toLocaleDateString('he-IL')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-gray-50 border-2 border-gray-200">
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground text-lg">
                  אין לקוחות משויכים לתחום זה
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
