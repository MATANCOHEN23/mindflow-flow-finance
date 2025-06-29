
import { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        setStatus('connected');
        setMessage('מחובר ל-Supabase');
      } else {
        setStatus('error');
        setMessage('בדוק Settings > API > Exposed Schemas = public');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed bottom-4 left-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm z-50
      ${status === 'connected' ? 'bg-green-100 text-green-700' : 
        status === 'error' ? 'bg-red-100 text-red-700' : 
        'bg-gray-100 text-gray-700'}`}>
      {status === 'checking' && <Loader className="animate-spin" size={16} />}
      {status === 'connected' && <CheckCircle size={16} />}
      {status === 'error' && <AlertCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}
