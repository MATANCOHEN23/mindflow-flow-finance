export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
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
          updated_at: string | null
        }
        Insert: {
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
          updated_at?: string | null
        }
        Update: {
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
          updated_at?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          amount_paid: number | null
          amount_total: number | null
          category: string | null
          contact_id: string | null
          created_at: string | null
          custom_fields: Json | null
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
          contact_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
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
          contact_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
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
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          deal_id: string | null
          event_date: string | null
          extras: Json | null
          id: string
          location: string | null
          participants_count: number | null
          staff_assigned: string[] | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          event_date?: string | null
          extras?: Json | null
          id?: string
          location?: string | null
          participants_count?: number | null
          staff_assigned?: string[] | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          event_date?: string | null
          extras?: Json | null
          id?: string
          location?: string | null
          participants_count?: number | null
          staff_assigned?: string[] | null
          status?: string | null
        }
        Relationships: [
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
          created_at: string | null
          deal_id: string | null
          id: string
          is_deposit: boolean | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          deal_id?: string | null
          id?: string
          is_deposit?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          deal_id?: string | null
          id?: string
          is_deposit?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          auto_generated: boolean | null
          created_at: string | null
          due_date: string | null
          id: string
          related_id: string | null
          related_type: string | null
          status: string | null
          task_type: string | null
        }
        Insert: {
          assigned_to?: string | null
          auto_generated?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          status?: string | null
          task_type?: string | null
        }
        Update: {
          assigned_to?: string | null
          auto_generated?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          status?: string | null
          task_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
