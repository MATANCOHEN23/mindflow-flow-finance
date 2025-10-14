import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalRevenue: number;
  activeClients: number;
  openDeals: number;
  pendingPayments: number;
  monthlyRevenue: Array<{ month: string; amount: number }>;
  dealsByStage: Array<{ stage: string; count: number }>;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  // Fetch total revenue from paid payments
  const { data: paidPayments, error: paymentsError } = await supabase
    .from('payments')
    .select('amount, payment_date');

  if (paymentsError) throw paymentsError;

  const totalRevenue = paidPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Calculate monthly revenue for the last 6 months
  const monthlyRevenue = calculateMonthlyRevenue(paidPayments || []);

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

  return {
    totalRevenue,
    activeClients: activeClients || 0,
    openDeals: openDeals || 0,
    pendingPayments: pendingPayments || 0,
    monthlyRevenue,
    dealsByStage,
  };
}

function calculateMonthlyRevenue(payments: Array<{ payment_date: string; amount: number }>) {
  const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const last6Months: Array<{ month: string; amount: number }> = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthTotal = payments
      .filter(p => p.payment_date?.startsWith(monthKey))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    last6Months.push({
      month: monthNames[date.getMonth()],
      amount: monthTotal,
    });
  }

  return last6Months;
}

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
