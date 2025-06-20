
export interface Contact {
  id: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  phone_parent?: string;
  email?: string;
  child_name?: string;
  role_tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  contact_id?: string;
  title: string;
  category?: string;
  package_type?: string;
  amount_total: number;
  amount_paid: number;
  payment_status: 'pending' | 'partial' | 'paid';
  workflow_stage?: string;
  next_action_date?: string;
  notes?: string;
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  deal_id?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  is_deposit: boolean;
  notes?: string;
  created_at: string;
}

export interface Event {
  id: string;
  deal_id?: string;
  event_date?: string;
  location?: string;
  participants_count?: number;
  staff_assigned: string[];
  status: string;
  extras: Record<string, any>;
  created_at: string;
}

export interface Task {
  id: string;
  related_type?: string;
  related_id?: string;
  task_type?: string;
  due_date?: string;
  status: string;
  assigned_to?: string;
  auto_generated: boolean;
  created_at: string;
}
