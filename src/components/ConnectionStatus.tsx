
import { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Loader, RefreshCw } from 'lucide-react';

export function ConnectionStatus() {
  const [status, setStatus] = useState<{
    connected: boolean;
    error: string | null;
    checking: boolean;
  }>({ connected: false, error: null, checking: true });
  
  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    const result = await checkSupabaseConnection();
    setStatus({ ...result, checking: false });
  };
  
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = () => {
    if (status.checking) return 'bg-gray-100 text-gray-700';
    if (status.connected) return 'bg-green-100 text-green-700';
    return 'bg-red-100 text-red-700';
  };
  
  const getMessage = () => {
    if (status.checking) return 'בודק חיבור...';
    if (status.connected) return 'מחובר ל-Supabase';
    if (status.error === 'SCHEMA_NOT_EXPOSED') {
      return 'שגיאה: Exposed Schemas לא מוגדר כ-public';
    }
    if (status.error === 'TABLES_MISSING') {
      return 'שגיאה: טבלאות חסרות - הרץ את ה-SQL';
    }
    return 'שגיאת חיבור';
  };
  
  return (
    <div className={`fixed bottom-4 left-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-lg z-50 ${getStatusColor()}`}>
      {status.checking && <Loader className="animate-spin" size={16} />}
      {!status.checking && status.connected && <CheckCircle size={16} />}
      {!status.checking && !status.connected && <AlertCircle size={16} />}
      <span>{getMessage()}</span>
      <button 
        onClick={checkConnection}
        className="ml-2 hover:opacity-70"
        title="בדוק שוב"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
}
