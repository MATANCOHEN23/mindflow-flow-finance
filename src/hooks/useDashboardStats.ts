import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalRevenue: number;
  activeClients: number;
  openDeals: number;
  pendingPayments: number;
  monthlyRevenue: number;
  completedTasks: number;
  totalTasks: number;
  upcomingEvents: number;
  dealsByStage: Array<{ stage: string; count: number }>;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  // Fetch total revenue from paid payments
  const { data: paidPayments, error: paymentsError } = await supabase
    .from('payments')
    .select('amount, payment_date');

  if (paymentsError) throw paymentsError;

  const totalRevenue = paidPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Calculate current month revenue
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyRevenue = paidPayments
    ?.filter(p => p.payment_date?.startsWith(currentMonth))
    .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Fetch active clients count
  const { count: activeClients, error: clientsError } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true });

  if (clientsError) throw clientsError;

  // Fetch open deals (not won or lost)
  const { count: openDeals, error: dealsError } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .not('workflow_stage', 'in', '("won","lost")');

  if (dealsError) throw dealsError;

  // Fetch pending payments count
  const { count: pendingPayments, error: pendingError } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true });

  if (pendingError) throw pendingError;

  // Fetch deals by stage
  const { data: deals, error: dealsByStageError } = await supabase
    .from('deals')
    .select('workflow_stage');

  if (dealsByStageError) throw dealsByStageError;

  const dealsByStage = calculateDealsByStage(deals || []);

  // Fetch tasks stats
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('status');

  if (tasksError) throw tasksError;

  const completedTasks = tasks?.filter(t => t.status === 'done').length || 0;
  const totalTasks = tasks?.length || 0;

  // Fetch upcoming events
  const { count: upcomingEvents, error: eventsError } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('event_date', now.toISOString())
    .lte('event_date', new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString());

  if (eventsError) throw eventsError;

  return {
    totalRevenue,
    activeClients: activeClients || 0,
    openDeals: openDeals || 0,
    pendingPayments: pendingPayments || 0,
    monthlyRevenue,
    completedTasks,
    totalTasks,
    upcomingEvents: upcomingEvents || 0,
    dealsByStage,
  };
}

// Function removed - no longer needed

function calculateDealsByStage(deals: Array<{ workflow_stage?: string }>) {
  const stages: Record<string, number> = {};
  
  deals.forEach(deal => {
    const stage = deal.workflow_stage || 'ללא שלב';
    stages[stage] = (stages[stage] || 0) + 1;
  });

  return Object.entries(stages).map(([stage, count]) => ({
    stage,
    count,
  }));
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });
}
