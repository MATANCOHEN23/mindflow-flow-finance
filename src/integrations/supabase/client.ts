
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tfzkuonqbkeirfwigksf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmemt1b25xYmtlaXJmd2lna3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjM5NjAsImV4cCI6MjA2NTczOTk2MH0.yVnOKGt5EvHX4quk_xtCtRWqO6SKHDCNRL7CY-ka1Tg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  db: { 
    schema: 'public'  // Force public schema
  },
  auth: { 
    persistSession: true,
    autoRefreshToken: true 
  }
});

// Enhanced connection checker
export async function checkSupabaseConnection() {
  try {
    // First test - basic connection
    const { data: test1, error: error1 } = await supabase
      .from('contacts')
      .select('id')
      .limit(1);
    
    if (error1?.code === 'PGRST200') {
      console.error('❌ CRITICAL: Exposed Schemas not set to "public" in Supabase');
      return { connected: false, error: 'SCHEMA_NOT_EXPOSED' };
    }
    
    if (error1?.message?.includes('relation') || error1?.message?.includes('does not exist')) {
      console.error('❌ Tables missing - run setup SQL');
      return { connected: false, error: 'TABLES_MISSING' };
    }
    
    return { connected: true, error: null };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}
