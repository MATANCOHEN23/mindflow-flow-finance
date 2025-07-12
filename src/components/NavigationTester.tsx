import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface NavigationTest {
  path: string;
  name: string;
  description: string;
  status: 'pending' | 'success' | 'error';
  expectedElements?: string[];
}

export function NavigationTester() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tests, setTests] = useState<NavigationTest[]>([
    {
      path: '/',
      name: 'דף הבית',
      description: 'דף הנחיתה הראשי של המערכת',
      status: 'pending',
      expectedElements: ['welcome', 'hero', 'features']
    },
    {
      path: '/dashboard',
      name: 'לוח בקרה',
      description: 'סקירה כללית של הנתונים והסטטיסטיקות',
      status: 'pending',
      expectedElements: ['charts', 'stats', 'widgets']
    },
    {
      path: '/contacts',
      name: 'לקוחות',
      description: 'ניהול רשימת הלקוחות',
      status: 'pending',
      expectedElements: ['table', 'add-button', 'search']
    },
    {
      path: '/deals',
      name: 'עסקאות',
      description: 'ניהול עסקאות ולוח הקנבן',
      status: 'pending',
      expectedElements: ['board-view', 'table-view', 'deal-cards']
    },
    {
      path: '/payments',
      name: 'תשלומים',
      description: 'מעקב אחר תשלומים והכנסות',
      status: 'pending',
      expectedElements: ['payment-list', 'totals', 'filters']
    },
    {
      path: '/birthday-events',
      name: 'אירועי יום הולדת',
      description: 'ניהול אירועי יום הולדת',
      status: 'pending',
      expectedElements: ['events-calendar', 'event-cards']
    },
    {
      path: '/therapy',
      name: 'טיפולים',
      description: 'ניהול מטופלים וטיפולים',
      status: 'pending',
      expectedElements: ['patients-list', 'sessions']
    },
    {
      path: '/basketball',
      name: 'אימוני כדורסל',
      description: 'ניהול מתאמנים ואימונים',
      status: 'pending',
      expectedElements: ['trainees-list', 'teams']
    },
    {
      path: '/school-workshops',
      name: 'סדנאות בית ספר',
      description: 'ניהול סדנאות חינוכיות',
      status: 'pending',
      expectedElements: ['workshops-list', 'schools']
    }
  ]);

  const testNavigation = async (test: NavigationTest) => {
    try {
      // Navigate to the path
      navigate(test.path);
      
      // Wait a bit for the page to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if navigation was successful
      if (window.location.pathname === test.path) {
        setTests(prev => prev.map(t => 
          t.path === test.path 
            ? { ...t, status: 'success' as const }
            : t
        ));
      } else {
        throw new Error('Navigation failed');
      }
    } catch (error) {
      setTests(prev => prev.map(t => 
        t.path === test.path 
          ? { ...t, status: 'error' as const }
          : t
      ));
    }
  };

  const testAllNavigation = async () => {
    for (const test of tests) {
      await testNavigation(test);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })));
  };

  const getStatusIcon = (status: NavigationTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const currentTest = tests.find(test => test.path === location.pathname);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardTitle className="text-2xl font-bold text-center">
          🧭 בדיקת ניווט מערכת
        </CardTitle>
        <p className="text-center text-purple-100">
          בדיקה אוטומטית של כל דפי המערכת ופונקציונליות הניווט
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Current Location Indicator */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">📍 מיקום נוכחי:</h3>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">
              {location.pathname}
            </span>
            {currentTest && (
              <span className="text-blue-700">→ {currentTest.name}</span>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-3 mb-6">
          {tests.map((test) => (
            <div
              key={test.path}
              className={`p-4 rounded-lg border transition-all ${
                test.status === 'success' ? 'border-green-200 bg-green-50' :
                test.status === 'error' ? 'border-red-200 bg-red-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <span className="font-medium">{test.name}</span>
                    <span className="ml-2 font-mono text-sm text-gray-500">
                      {test.path}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testNavigation(test)}
                  className="flex items-center gap-2"
                >
                  בדוק
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{test.description}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={testAllNavigation}
            className="flex-1"
          >
            🚀 בדוק את כל הדפים
          </Button>
          <Button
            onClick={resetTests}
            variant="outline"
          >
            איפוס בדיקות
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">💡 הוראות שימוש:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• לחץ על "בדוק" ליד כל דף לבדיקה נפרדת</li>
            <li>• לחץ על "בדוק את כל הדפים" לבדיקה אוטומטית של כל המערכת</li>
            <li>• הבדיקה תוודא שכל דף נטען תקין וניתן לגשת אליו</li>
            <li>• ✅ ירוק = הדף עובד תקין, ❌ אדום = יש בעיה בדף</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}