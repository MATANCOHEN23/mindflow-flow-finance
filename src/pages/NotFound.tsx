import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4" dir="rtl">
        <div className="mb-8 text-9xl animate-bounce">🔍</div>
        
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          אופס! הדף לא נמצא
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          הדף שחיפשת לא קיים או הועבר למיקום אחר.
          אולי כדאי לנסות אחת מהאופציות הבאות:
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="btn-premium gap-2">
              <Home className="w-5 h-5" />
              חזור לדף הבית
            </Button>
          </Link>
          
          <Link to="/contacts">
            <Button size="lg" variant="outline" className="gap-2">
              <Users className="w-5 h-5" />
              לרשימת לקוחות
            </Button>
          </Link>
        </div>
        
        {/* Debug info for development */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <strong>Debug Info:</strong>
            </div>
            <p className="font-mono text-xs">
              Attempted path: <code className="bg-white px-1 rounded">{location.pathname}</code>
            </p>
            <p className="font-mono text-xs mt-1">
              Search params: <code className="bg-white px-1 rounded">{location.search || 'none'}</code>
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotFound;
