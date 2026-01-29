import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContact } from '@/hooks/useContacts';
import { useContactDomains, useUnassignContactFromDomain, useUpdateContactDomainStatus } from '@/hooks/useDomains';
import { useDeals } from '@/hooks/useDeals';
import { usePaymentsByContact } from '@/hooks/usePayments';
import { useEventsByContact } from '@/hooks/useEvents';
import { useTasksByContact } from '@/hooks/useTasks';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PaymentForm } from '@/components/Forms/PaymentForm';
import { EventForm } from '@/components/Forms/EventForm';
import { TaskForm } from '@/components/Forms/TaskForm';
import { toast } from 'sonner';
import { PremiumLoader } from '@/components/PremiumLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  CalendarDays,
  Edit,
  Trash2,
  Plus,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { openWhatsApp, getGeneralContactMessage } from '@/lib/whatsapp';

export default function CustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contact, isLoading: contactLoading } = useContact(id!);
  const { data: contactDomains, isLoading: domainsLoading } = useContactDomains(id!);
  const { data: deals } = useDeals();
  const { data: contactPayments } = usePaymentsByContact(id!);
  const { data: contactEvents } = useEventsByContact(id!);
  const { data: contactTasks } = useTasksByContact(id!);

  const [activeTab, setActiveTab] = useState('deals');
  const [isPaymentFormOpen, setPaymentFormOpen] = useState(false);
  const [isEventFormOpen, setEventFormOpen] = useState(false);
  const [isTaskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  if (contactLoading || domainsLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <PremiumLoader size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!contact) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-bold">לקוח לא נמצא</h1>
          <Button onClick={() => navigate('/contacts')}>
            <ArrowRight className="ml-2" />
            חזור לרשימת לקוחות
          </Button>
        </div>
      </MainLayout>
    );
  }

  // חישוב סטטיסטיקות
  const contactDeals = deals?.filter(deal => deal.contact_id === id) || [];
  const totalPaid = contactDeals.reduce((sum, deal) => sum + deal.amount_paid, 0);
  const totalPending = contactDeals.reduce((sum, deal) => sum + (deal.amount_total - deal.amount_paid), 0);
  const activeDeals = contactDeals.filter(deal => deal.payment_status !== 'paid').length;

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/contacts')}>
            <ArrowRight className="ml-2" />
            חזור לרשימת לקוחות
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="ml-2 w-4 h-4" />
              ערוך פרטים
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="ml-2 w-4 h-4" />
              מחק לקוח
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {contact.first_name[0]}{contact.last_name?.[0] || ''}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {contact.first_name} {contact.last_name}
                  </h1>
                  {contact.child_name && (
                    <p className="text-muted-foreground">ילד/ה: {contact.child_name}</p>
                  )}
                </div>
              </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {contactDomains && contactDomains.length > 0 ? (
                contactDomains.map(cd => {
                  const domain = (cd as any).domain;
                  return (
                    <Link
                      key={cd.id}
                      to={`/domain/${domain?.id}`}
                      className="inline-block"
                    >
                      <Badge 
                        variant="secondary" 
                        className="gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
                      >
                        {cd.status === 'active' && '✅'}
                        {cd.status === 'paused' && '⏸️'}
                        {cd.status === 'completed' && '✔️'}
                        {domain?.icon} {domain?.name || 'תחום לא ידוע'}
                      </Badge>
                    </Link>
                  );
                })
              ) : (
                <Badge variant="outline">אין תחומים</Badge>
              )}
            </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{contact.phone}</span>
                    <button
                      onClick={() => openWhatsApp(contact.phone!, getGeneralContactMessage(contact.first_name))}
                      className="p-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      title="שלח הודעת WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {contact.phone_parent && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>הורה: {contact.phone_parent}</span>
                    <button
                      onClick={() => openWhatsApp(contact.phone_parent!, getGeneralContactMessage(contact.first_name))}
                      className="p-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      title="שלח הודעת WhatsApp להורה"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{contact.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    הצטרף: {format(new Date(contact.created_at), 'd MMM yyyy', { locale: he })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">סה"כ שולם</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">
              ₪{totalPaid.toLocaleString('he-IL')}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">ממתין לתשלום</p>
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">
              ₪{totalPending.toLocaleString('he-IL')}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">עסקאות פעילות</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {activeDeals}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <CalendarDays className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">אירועים קרובים</p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              0
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="deals">עסקאות</TabsTrigger>
              <TabsTrigger value="payments">תשלומים</TabsTrigger>
              <TabsTrigger value="events">אירועים</TabsTrigger>
              <TabsTrigger value="tasks">משימות</TabsTrigger>
              <TabsTrigger value="notes">הערות</TabsTrigger>
            </TabsList>

            <TabsContent value="deals" className="space-y-4">
              {contactDeals.length > 0 ? (
                <div className="space-y-3">
                  {contactDeals.map(deal => (
                    <Card key={deal.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{deal.title}</h3>
                          <p className="text-sm text-muted-foreground">{deal.category}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold">
                            ₪{deal.amount_total.toLocaleString('he-IL')}
                          </p>
                          <Badge 
                            variant={
                              deal.payment_status === 'paid' ? 'default' : 
                              deal.payment_status === 'partial' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {deal.payment_status === 'paid' && 'שולם'}
                            {deal.payment_status === 'partial' && 'חלקי'}
                            {deal.payment_status === 'pending' && 'ממתין'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>אין עסקאות ללקוח זה</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">תשלומים</h3>
                <Button onClick={() => { setSelectedPayment(null); setPaymentFormOpen(true); }} size="sm">
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף תשלום
                </Button>
              </div>
              {contactPayments && contactPayments.length > 0 ? (
                <div className="space-y-3">
                  {contactPayments.map((payment: any) => (
                    <Card key={payment.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">₪{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.payment_date && format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: he })}
                          </p>
                          {payment.payment_method && (
                            <p className="text-xs text-muted-foreground">אמצעי תשלום: {payment.payment_method}</p>
                          )}
                          {payment.notes && <p className="text-sm mt-2">{payment.notes}</p>}
                        </div>
                        <Badge variant={payment.is_deposit ? 'secondary' : 'default'}>
                          {payment.is_deposit ? 'מקדמה' : 'תשלום מלא'}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>אין תשלומים ללקוח זה</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">אירועים</h3>
                <Button onClick={() => { setSelectedEvent(null); setEventFormOpen(true); }} size="sm">
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף אירוע
                </Button>
              </div>
              {contactEvents && contactEvents.length > 0 ? (
                <div className="space-y-3">
                  {contactEvents.map((event: any) => (
                    <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{event.title}</p>
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            {event.event_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(event.event_date), 'dd/MM/yyyy', { locale: he })}
                              </span>
                            )}
                            {event.event_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {event.event_time}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </span>
                            )}
                          </div>
                          {event.notes && <p className="text-sm mt-2">{event.notes}</p>}
                        </div>
                        <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                          {event.status === 'scheduled' ? 'מתוכנן' : 
                           event.status === 'completed' ? 'הושלם' : 
                           event.status === 'cancelled' ? 'בוטל' : event.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>אין אירועים ללקוח זה</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">משימות</h3>
                <Button onClick={() => { setSelectedTask(null); setTaskFormOpen(true); }} size="sm">
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף משימה
                </Button>
              </div>
              {contactTasks && contactTasks.length > 0 ? (
                <div className="space-y-3">
                  {contactTasks.map((task: any) => (
                    <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{task.title}</p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                          <div className="flex gap-3 mt-2 text-sm">
                            {task.due_date && (
                              <span className="text-muted-foreground">
                                📅 {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: he })}
                              </span>
                            )}
                            {task.assigned_to && (
                              <span className="text-muted-foreground">👤 {task.assigned_to}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            variant={
                              task.priority === 'high' ? 'destructive' : 
                              task.priority === 'medium' ? 'default' : 
                              'secondary'
                            }
                          >
                            {task.priority === 'high' ? '🔴 דחוף' : 
                             task.priority === 'medium' ? '🟡 בינוני' : 
                             '🟢 נמוך'}
                          </Badge>
                          <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                            {task.status === 'pending' ? 'ממתין' :
                             task.status === 'in_progress' ? 'בתהליך' :
                             task.status === 'completed' ? 'הושלם' : task.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>אין משימות ללקוח זה</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              {contact.notes ? (
                <Card className="p-4 bg-amber-50 dark:bg-amber-950/30">
                  <p className="whitespace-pre-wrap">{contact.notes}</p>
                </Card>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>אין הערות ללקוח זה</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Forms */}
        <PaymentForm
          isOpen={isPaymentFormOpen}
          onClose={() => {
            setPaymentFormOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
        
        <EventForm
          isOpen={isEventFormOpen}
          onClose={() => {
            setEventFormOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
        
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => {
            setTaskFormOpen(false);
            setSelectedTask(null);
          }}
        />
      </div>
    </MainLayout>
  );
}
