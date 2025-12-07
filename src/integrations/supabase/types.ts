export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_he: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_he: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_he?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_domains: {
        Row: {
          contact_id: string | null
          created_at: string | null
          custom_pricing: Json | null
          domain_id: string | null
          id: string
          joined_date: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          custom_pricing?: Json | null
          domain_id?: string | null
          id?: string
          joined_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          custom_pricing?: Json | null
          domain_id?: string | null
          id?: string
          joined_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_domains_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_domains_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_domains_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "revenue_by_domain"
            referencedColumns: ["domain_id"]
          },
        ]
      }
      contacts: {
        Row: {
          category: string | null
          child_name: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          notes: string | null
          phone: string | null
          phone_parent: string | null
          role_tags: string[] | null
          sub_category: Json | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          child_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          phone_parent?: string | null
          role_tags?: string[] | null
          sub_category?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          child_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          phone_parent?: string | null
          role_tags?: string[] | null
          sub_category?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          amount_paid: number | null
          amount_total: number | null
          category: string | null
          category_id: string | null
          contact_id: string | null
          created_at: string | null
          custom_fields: Json | null
          domain_id: string | null
          id: string
          next_action_date: string | null
          notes: string | null
          package_type: string | null
          payment_status: string | null
          title: string
          updated_at: string | null
          workflow_stage: string | null
        }
        Insert: {
          amount_paid?: number | null
          amount_total?: number | null
          category?: string | null
          category_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          domain_id?: string | null
          id?: string
          next_action_date?: string | null
          notes?: string | null
          package_type?: string | null
          payment_status?: string | null
          title: string
          updated_at?: string | null
          workflow_stage?: string | null
        }
        Update: {
          amount_paid?: number | null
          amount_total?: number | null
          category?: string | null
          category_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          domain_id?: string | null
          id?: string
          next_action_date?: string | null
          notes?: string | null
          package_type?: string | null
          payment_status?: string | null
          title?: string
          updated_at?: string | null
          workflow_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "revenue_by_domain"
            referencedColumns: ["domain_id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          level: number
          name: string
          order_index: number | null
          parent_id: string | null
          pricing_notes: string | null
          pricing_type: string | null
          pricing_value: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level: number
          name: string
          order_index?: number | null
          parent_id?: string | null
          pricing_notes?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          name?: string
          order_index?: number | null
          parent_id?: string | null
          pricing_notes?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "domains_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "revenue_by_domain"
            referencedColumns: ["domain_id"]
          },
        ]
      }
      events: {
        Row: {
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          event_date: string | null
          event_time: string | null
          extras: Json | null
          id: string
          location: string | null
          notes: string | null
          participants_count: number | null
          staff_assigned: string[] | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          event_date?: string | null
          event_time?: string | null
          extras?: Json | null
          id?: string
          location?: string | null
          notes?: string | null
          participants_count?: number | null
          staff_assigned?: string[] | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          event_date?: string | null
          event_time?: string | null
          extras?: Json | null
          id?: string
          location?: string | null
          notes?: string | null
          participants_count?: number | null
          staff_assigned?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          due_date: string | null
          id: string
          is_deposit: boolean | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          status: string | null
        }
        Insert: {
          amount: number
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          due_date?: string | null
          id?: string
          is_deposit?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          due_date?: string | null
          id?: string
          is_deposit?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_packages: {
        Row: {
          created_at: string | null
          domain_id: string | null
          id: string
          is_active: boolean | null
          name: string
          name_he: string
          price: number
          price_per_session: number | null
          sessions_count: number
        }
        Insert: {
          created_at?: string | null
          domain_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_he: string
          price: number
          price_per_session?: number | null
          sessions_count: number
        }
        Update: {
          created_at?: string | null
          domain_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_he?: string
          price?: number
          price_per_session?: number | null
          sessions_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_packages_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_packages_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "revenue_by_domain"
            referencedColumns: ["domain_id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          event_id: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      client_growth: {
        Row: {
          cumulative_clients: number | null
          month: string | null
          new_clients: number | null
        }
        Relationships: []
      }
      deals_by_stage: {
        Row: {
          avg_value: number | null
          deal_count: number | null
          total_value: number | null
          workflow_stage: string | null
        }
        Relationships: []
      }
      monthly_performance: {
        Row: {
          active_clients: number | null
          deals_paid: number | null
          month: string | null
          payment_count: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      revenue_by_domain: {
        Row: {
          client_count: number | null
          deal_count: number | null
          domain_icon: string | null
          domain_id: string | null
          domain_name: string | null
          total_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_domain_full_path: { Args: { domain_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
