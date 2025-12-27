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
      athletes: {
        Row: {
          age: number
          clinician_id: string
          code_unique: string
          context_notes: string | null
          created_at: string
          id: string
          parent_contact_minimal: Json
          sport: string | null
          updated_at: string
        }
        Insert: {
          age: number
          clinician_id: string
          code_unique: string
          context_notes?: string | null
          created_at?: string
          id?: string
          parent_contact_minimal?: Json
          sport?: string | null
          updated_at?: string
        }
        Update: {
          age?: number
          clinician_id?: string
          code_unique?: string
          context_notes?: string | null
          created_at?: string
          id?: string
          parent_contact_minimal?: Json
          sport?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor: string
          id: string
          payload_minimal: Json
          timestamp: string
        }
        Insert: {
          action: string
          actor: string
          id?: string
          payload_minimal?: Json
          timestamp?: string
        }
        Update: {
          action?: string
          actor?: string
          id?: string
          payload_minimal?: Json
          timestamp?: string
        }
        Relationships: []
      }
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
      chunks: {
        Row: {
          chunk_text: string
          clinician_id: string
          created_at: string
          id: string
          metadata_json: Json
          source_id: string
        }
        Insert: {
          chunk_text: string
          clinician_id: string
          created_at?: string
          id?: string
          metadata_json?: Json
          source_id: string
        }
        Update: {
          chunk_text?: string
          clinician_id?: string
          created_at?: string
          id?: string
          metadata_json?: Json
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chunks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
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
      measure_results: {
        Row: {
          athlete_id: string
          clinician_id: string
          created_at: string
          date: string
          id: string
          interpretation_text: string | null
          measure_id: string
          raw_scores_json: Json
        }
        Insert: {
          athlete_id: string
          clinician_id: string
          created_at?: string
          date: string
          id?: string
          interpretation_text?: string | null
          measure_id: string
          raw_scores_json?: Json
        }
        Update: {
          athlete_id?: string
          clinician_id?: string
          created_at?: string
          date?: string
          id?: string
          interpretation_text?: string | null
          measure_id?: string
          raw_scores_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "measure_results_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measure_results_measure_id_fkey"
            columns: ["measure_id"]
            isOneToOne: false
            referencedRelation: "measures"
            referencedColumns: ["id"]
          },
        ]
      }
      measures: {
        Row: {
          age_range: string | null
          citations: string | null
          clinician_id: string
          created_at: string
          id: string
          licensing_notes: string | null
          name: string
          purpose: string | null
          scoring_notes: string | null
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          citations?: string | null
          clinician_id: string
          created_at?: string
          id?: string
          licensing_notes?: string | null
          name: string
          purpose?: string | null
          scoring_notes?: string | null
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          citations?: string | null
          clinician_id?: string
          created_at?: string
          id?: string
          licensing_notes?: string | null
          name?: string
          purpose?: string | null
          scoring_notes?: string | null
          updated_at?: string
        }
        Relationships: []
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
      protocols: {
        Row: {
          athlete_id: string
          clinician_id: string
          created_at: string
          generated_text_he: string
          id: string
          parent_message_he: string
          selected_technique_ids: string[]
          session_no: number
          sources_used_json: Json
          status: string
        }
        Insert: {
          athlete_id: string
          clinician_id: string
          created_at?: string
          generated_text_he: string
          id?: string
          parent_message_he: string
          selected_technique_ids?: string[]
          session_no: number
          sources_used_json?: Json
          status?: string
        }
        Update: {
          athlete_id?: string
          clinician_id?: string
          created_at?: string
          generated_text_he?: string
          id?: string
          parent_message_he?: string
          selected_technique_ids?: string[]
          session_no?: number
          sources_used_json?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocols_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          athlete_id: string
          clinician_id: string
          created_at: string
          date: string
          goals_json: Json
          homework_json: Json
          id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          athlete_id: string
          clinician_id: string
          created_at?: string
          date: string
          goals_json?: Json
          homework_json?: Json
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          clinician_id?: string
          created_at?: string
          date?: string
          goals_json?: Json
          homework_json?: Json
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          clinician_id: string
          created_at: string
          id: string
          text: string
          title: string
          type: string
        }
        Insert: {
          clinician_id: string
          created_at?: string
          id?: string
          text: string
          title: string
          type: string
        }
        Update: {
          clinician_id?: string
          created_at?: string
          id?: string
          text?: string
          title?: string
          type?: string
        }
        Relationships: []
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
      techniques: {
        Row: {
          age_max: number | null
          age_min: number | null
          clinician_id: string
          contraindications: string | null
          created_at: string
          evidence_level: string
          homework: string | null
          id: string
          name: string
          script_he: string | null
          source_refs: Json
          steps_json: Json
          target_problem: string | null
          updated_at: string
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          clinician_id: string
          contraindications?: string | null
          created_at?: string
          evidence_level?: string
          homework?: string | null
          id?: string
          name: string
          script_he?: string | null
          source_refs?: Json
          steps_json?: Json
          target_problem?: string | null
          updated_at?: string
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          clinician_id?: string
          contraindications?: string | null
          created_at?: string
          evidence_level?: string
          homework?: string | null
          id?: string
          name?: string
          script_he?: string | null
          source_refs?: Json
          steps_json?: Json
          target_problem?: string | null
          updated_at?: string
        }
        Relationships: []
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
