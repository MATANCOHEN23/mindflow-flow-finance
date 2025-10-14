
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://khlxdlvlyycatlaslusc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobHhkbHZseXljYXRsYXNsdXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNzQzNTUsImV4cCI6MjA3NTk1MDM1NX0.InSenGI3tbRCAVQhSSmnH-EA-kPNT8oTmku0SuMlpz8";

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
