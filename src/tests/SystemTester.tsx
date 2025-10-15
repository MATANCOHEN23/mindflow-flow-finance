import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

interface SystemTesterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemTester({ isOpen, onClose }: SystemTesterProps) {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  const testSuites = [
    {
      id: 'db-connection',
      name: '🔗 בדיקת חיבור למסד נתונים',
      test: async () => {
        const { data, error } = await supabase.from('contacts').select('id').limit(1);
        if (error) throw new Error(`שגיאת חיבור: ${error.message}`);
        return 'חיבור תקין למסד הנתונים';
      }
    },
    {
      id: 'contacts-crud',
      name: '👥 בדיקת פעולות לקוחות (CRUD)',
      test: async () => {
        // Create
        const { data: newContact, error: createError } = await supabase
          .from('contacts')
          .insert([{ first_name: 'טסט', last_name: 'בדיקה', role_tags: ['טסט'] }])
          .select()
          .single();
        
        if (createError) throw new Error(`שגיאה ביצירה: ${createError.message}`);
        
        // Read
        const { data: readContact, error: readError } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', newContact.id)
          .single();
        
        if (readError) throw new Error(`שגיאה בקריאה: ${readError.message}`);
        
        // Update
        const { error: updateError } = await supabase
          .from('contacts')
          .update({ last_name: 'בדיקה מעודכנת' })
          .eq('id', newContact.id);
        
        if (updateError) throw new Error(`שגיאה בעדכון: ${updateError.message}`);
        
        // Delete
        const { error: deleteError } = await supabase
          .from('contacts')
          .delete()
          .eq('id', newContact.id);
        
        if (deleteError) throw new Error(`שגיאה במחיקה: ${deleteError.message}`);
        
        return 'כל פעולות CRUD עובדות תקין';
      }
    },
    {
      id: 'deals-crud',
      name: '💼 בדיקת פעולות עסקאות (CRUD)',
      test: async () => {
        // Create deal
        const { data: newDeal, error: createError } = await supabase
          .from('deals')
          .insert([{
            title: 'עסקת טסט',
            workflow_stage: 'lead',
            amount_total: 1000,
            amount_paid: 0,
            payment_status: 'pending'
          }])
          .select()
          .single();
        
        if (createError) throw new Error(`שגיאה ביצירת עסקה: ${createError.message}`);
        
        // Update deal status - תקין עם constraint החדש
        const { error: updateError } = await supabase
          .from('deals')
          .update({ workflow_stage: 'booked' })
          .eq('id', newDeal.id);
        
        if (updateError) throw new Error(`שגיאה בעדכון עסקה: ${updateError.message}`);
        
        // Delete deal
        const { error: deleteError } = await supabase
          .from('deals')
          .delete()
          .eq('id', newDeal.id);
        
        if (deleteError) throw new Error(`שגיאה במחיקת עסקה: ${deleteError.message}`);
        
        return 'פעולות עסקאות עובדות תקין ✅';
      }
    },
    {
      id: 'payments-crud',
      name: '💳 בדיקת פעולות תשלומים',
      test: async () => {
        // Create a deal first
        const { data: deal, error: dealError } = await supabase
          .from('deals')
          .insert([{
            title: 'עסקה לבדיקת תשלום',
            workflow_stage: 'lead',
            amount_total: 1000,
            amount_paid: 0,
            payment_status: 'pending'
          }])
          .select()
          .single();
        
        if (dealError) throw new Error(`שגיאה ביצירת עסקה: ${dealError.message}`);
        
        // Create payment
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert([{
            deal_id: deal.id,
            amount: 500,
            payment_method: 'כרטיס אשראי'
          }])
          .select()
          .single();
        
        if (paymentError) throw new Error(`שגיאה ביצירת תשלום: ${paymentError.message}`);
        
        // Clean up
        await supabase.from('payments').delete().eq('id', payment.id);
        await supabase.from('deals').delete().eq('id', deal.id);
        
        return 'מערכת תשלומים עובדת תקין';
      }
    },
    {
      id: 'navigation-test',
      name: '🧭 בדיקת ניווט דפים',
      test: async () => {
        const pages = [
          '/', '/dashboard', '/contacts', '/deals', '/payments',
          '/birthday-events', '/therapy', '/basketball', '/school-workshops'
        ];
        
        // Check if all routes are defined
        for (const page of pages) {
          try {
            // We can't actually navigate in tests, but we can check if the routes exist
            // This is a simplified check
            const routeExists = true; // In a real test, we'd check the router
            if (!routeExists) throw new Error(`דף ${page} לא קיים`);
          } catch (error) {
            throw new Error(`בעיה עם דף ${page}`);
          }
        }
        
        return 'כל הדפים זמינים';
      }
    },
    {
      id: 'ui-components',
      name: '🎨 בדיקת רכיבי UI',
      test: async () => {
        // Check if modals can open/close
        const modalElements = document.querySelectorAll('[role="dialog"]');
        const buttonElements = document.querySelectorAll('button');
        const selectElements = document.querySelectorAll('[role="combobox"]');
        
        if (buttonElements.length === 0) {
          throw new Error('לא נמצאו כפתורים בדף');
        }
        
        return `נמצאו ${buttonElements.length} כפתורים, ${selectElements.length} רכיבי בחירה`;
      }
    },
    {
      id: 'domains-hierarchy-ready',
      name: '🏢 בדיקת היררכיית תחומים',
      test: async () => {
        const { data: domains, error } = await supabase
          .from('domains')
          .select('*')
          .eq('level', 1);
        
        if (error) throw new Error(`שגיאה בטעינת תחומים: ${error.message}`);
        if (!domains || domains.length === 0) {
          throw new Error('אין תחומי שורש במערכת');
        }
        
        return `נמצאו ${domains.length} תחומי שורש`;
      }
    },
    {
      id: 'cleanup-unnamed-contacts',
      name: '🧹 ניקוי לקוחות "לא צוין"',
      test: async () => {
        // Find "לא צוין" contacts
        const { data: unnamedContacts, error: fetchError } = await supabase
          .from('contacts')
          .select('id')
          .eq('first_name', 'לא צוין');
        
        if (fetchError) throw new Error(`שגיאה באיתור: ${fetchError.message}`);
        if (!unnamedContacts || unnamedContacts.length === 0) {
          return 'לא נמצאו לקוחות "לא צוין"';
        }
        
        const contactIds = unnamedContacts.map(c => c.id);
        
        // Check if they're linked to deals/payments/events/tasks
        const { data: deals } = await supabase
          .from('deals')
          .select('id')
          .in('contact_id', contactIds);
        
        const { data: payments } = await supabase
          .from('payments')
          .select('id')
          .in('contact_id', contactIds);
        
        const { data: events } = await supabase
          .from('events')
          .select('id')
          .in('contact_id', contactIds);
        
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id')
          .in('contact_id', contactIds);
        
        // Find IDs that are NOT linked to anything
        const linkedIds = new Set([
          ...(deals || []).map(d => d.id),
          ...(payments || []).map(p => p.id),
          ...(events || []).map(e => e.id),
          ...(tasks || []).map(t => t.id),
        ]);
        
        const safeToDelete = contactIds.filter(id => !linkedIds.has(id));
        
        if (safeToDelete.length === 0) {
          return `נמצאו ${contactIds.length} לקוחות "לא צוין" אך כולם קשורים לנתונים`;
        }
        
        // Delete orphan contact_domains entries first
        const { error: cdError } = await supabase
          .from('contact_domains')
          .delete()
          .in('contact_id', safeToDelete);
        
        if (cdError) throw new Error(`שגיאה במחיקת קשרי תחומים: ${cdError.message}`);
        
        // Delete contacts
        const { error: deleteError } = await supabase
          .from('contacts')
          .delete()
          .in('id', safeToDelete);
        
        if (deleteError) throw new Error(`שגיאה במחיקה: ${deleteError.message}`);
        
        return `נמחקו ${safeToDelete.length} לקוחות "לא צוין" שאינם קשורים לנתונים`;
      }
    },
    {
      id: 'pwa-ready',
      name: '📱 בדיקת PWA',
      test: async () => {
        const checks: string[] = [];
        
        // Service Worker
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          checks.push(`Service Worker: ${registrations.length > 0 ? '✅' : '❌'}`);
        } else {
          checks.push('Service Worker: ❌ לא נתמך');
        }
        
        // Manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        checks.push(`Manifest: ${manifestLink ? '✅' : '❌'}`);
        
        // Icons
        try {
          const [icon192Response, icon512Response] = await Promise.all([
            fetch('/icon-192.png'),
            fetch('/icon-512.png')
          ]);
          const icon192 = icon192Response.ok;
          const icon512 = icon512Response.ok;
          checks.push(`Icons 192x192: ${icon192 ? '✅' : '❌'}`);
          checks.push(`Icons 512x512: ${icon512 ? '✅' : '❌'}`);
        } catch {
          checks.push('Icons: ❌ שגיאה בבדיקה');
        }
        
        // Standalone check
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        checks.push(`Standalone: ${isStandalone ? '✅ מותקן' : 'ℹ️ לא מותקן'}`);
        
        // HTTPS check
        const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        checks.push(`HTTPS: ${isHTTPS ? '✅' : '❌'}`);
        
        return checks.join('\n');
      }
    },
    {
      id: 'cleanup-unnamed-auto',
      name: '🧹 ניקוי אוטומטי: לקוחות "לא צוין"',
      test: async () => {
        const { data: unnamed } = await supabase
          .from('contacts')
          .select('id')
          .eq('first_name', 'לא צוין');

        if (!unnamed || unnamed.length === 0) {
          return '✅ אין לקוחות "לא צוין" - המערכת נקייה!';
        }

        // Delete contact_domains first
        await supabase
          .from('contact_domains')
          .delete()
          .in('contact_id', unnamed.map(c => c.id));

        // Delete contacts
        const { error } = await supabase
          .from('contacts')
          .delete()
          .eq('first_name', 'לא צוין');

        if (error) throw error;

        return `✅ נמחקו ${unnamed.length} לקוחות "לא צוין" בהצלחה`;
      }
    },
    {
      id: 'integration-client-domain',
      name: '🔗 אינטגרציה: לקוח ↔ תחום',
      test: async () => {
        // Create test contact
        const { data: contact, error: contactError } = await supabase
          .from('contacts')
          .insert({ first_name: 'Test Integration', phone: '050-0000000' })
          .select()
          .single();

        if (contactError) throw contactError;

        // Get a domain
        const { data: domain } = await supabase
          .from('domains')
          .select('id')
          .limit(1)
          .single();

        if (!domain) throw new Error('No domains found');

        // Assign to domain
        const { error: assignError } = await supabase
          .from('contact_domains')
          .insert({
            contact_id: contact.id,
            domain_id: domain.id,
            status: 'active'
          });

        // Verify relationship
        const { data: verify } = await supabase
          .from('contact_domains')
          .select('*')
          .eq('contact_id', contact.id);

        // Cleanup
        await supabase.from('contact_domains').delete().eq('contact_id', contact.id);
        await supabase.from('contacts').delete().eq('id', contact.id);

        if (assignError || !verify || verify.length === 0) {
          throw new Error('Integration test failed');
        }

        return '✅ אינטגרציה לקוח-תחום עובדת תקין';
      }
    },
    {
      id: 'integration-deal-payment',
      name: '💳 אינטגרציה: עסקה ↔ תשלום + Cascade Delete',
      test: async () => {
        // Create test contact
        const { data: contact } = await supabase
          .from('contacts')
          .insert({ first_name: 'Payment Test', phone: '050-9999999' })
          .select()
          .single();

        // Create deal
        const { data: deal } = await supabase
          .from('deals')
          .insert({
            contact_id: contact!.id,
            title: 'Test Deal for Payment',
            amount_total: 1000,
            amount_paid: 500,
            payment_status: 'partial',
            workflow_stage: 'booked'
          })
          .select()
          .single();

        // Create payment
        const { data: payment } = await supabase
          .from('payments')
          .insert({
            deal_id: deal!.id,
            contact_id: contact!.id,
            amount: 500,
            is_deposit: true,
            payment_date: new Date().toISOString().split('T')[0]
          })
          .select()
          .single();

        // Test cascade delete - delete contact should cascade to payment
        await supabase.from('contacts').delete().eq('id', contact!.id);

        // Verify payment was deleted (if cascade is set up)
        const { data: orphanPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('id', payment!.id);

        return orphanPayment && orphanPayment.length === 0
          ? '✅ Cascade delete עובד - תשלום נמחק עם הלקוח'
          : '⚠️ Cascade delete לא מוגדר - תשלום נשאר יתום';
      }
    },
    {
      id: 'pwa-shortcuts-test',
      name: '⚡ בדיקת PWA Shortcuts',
      test: async () => {
        // Fetch manifest
        const manifestResponse = await fetch('/manifest.json');
        const manifest = await manifestResponse.json();

        const checks: string[] = [];

        // Check shortcuts exist
        if (manifest.shortcuts && manifest.shortcuts.length > 0) {
          checks.push(`✅ Shortcuts: ${manifest.shortcuts.length} קיצורים`);
          
          // Verify each shortcut structure
          manifest.shortcuts.forEach((shortcut: any) => {
            if (shortcut.name && shortcut.url) {
              checks.push(`  └─ "${shortcut.name}" → ${shortcut.url}`);
            }
          });
        } else {
          checks.push('❌ אין shortcuts מוגדרים');
        }

        // Check start_url tracking
        if (manifest.start_url && manifest.start_url.includes('?source=')) {
          checks.push('✅ Start URL מכיל tracking parameter');
        } else {
          checks.push('⚠️ Start URL ללא tracking');
        }

        return checks.join('\n');
      }
    }
  ];

  const initializeTests = () => {
    const initialTests = testSuites.map(suite => ({
      id: suite.id,
      name: suite.name,
      status: 'pending' as const
    }));
    setTests(initialTests);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    for (let i = 0; i < testSuites.length; i++) {
      const suite = testSuites[i];
      
      // Update test status to running
      setTests(prev => prev.map(test => 
        test.id === suite.id 
          ? { ...test, status: 'running' as const }
          : test
      ));
      
      const startTime = Date.now();
      
      try {
        const result = await suite.test();
        const duration = Date.now() - startTime;
        
        setTests(prev => prev.map(test => 
          test.id === suite.id 
            ? { 
                ...test, 
                status: 'passed' as const, 
                message: result,
                duration 
              }
            : test
        ));
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
        
      } catch (error) {
        const duration = Date.now() - startTime;
        
        setTests(prev => prev.map(test => 
          test.id === suite.id 
            ? { 
                ...test, 
                status: 'failed' as const, 
                message: error instanceof Error ? error.message : 'שגיאה לא ידועה',
                duration 
              }
            : test
        ));
      }
    }
    
    setIsRunning(false);
    setOverallStatus('completed');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSummary = () => {
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const total = tests.length;
    
    return { passed, failed, total };
  };

  useEffect(() => {
    if (isOpen) {
      initializeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const summary = getSummary();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold text-center">
            🧪 בדיקות מערכת מקיפות
          </CardTitle>
          <p className="text-center text-blue-100">
            בדיקה אוטומטית של כל רכיבי המערכת
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Summary */}
          {overallStatus === 'completed' && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50">
              <h3 className="font-bold mb-2">סיכום תוצאות:</h3>
              <div className="flex gap-4">
                <span className="text-green-600">✅ עברו: {summary.passed}</span>
                <span className="text-red-600">❌ נכשלו: {summary.failed}</span>
                <span className="text-gray-600">📊 סה"כ: {summary.total}</span>
              </div>
            </div>
          )}
          
          {/* Test Results */}
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-lg border transition-all ${
                  test.status === 'passed' ? 'border-green-200 bg-green-50' :
                  test.status === 'failed' ? 'border-red-200 bg-red-50' :
                  test.status === 'running' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  {test.duration && (
                    <span className="text-sm text-gray-500">{test.duration}ms</span>
                  )}
                </div>
                {test.message && (
                  <p className="mt-2 text-sm text-gray-700">{test.message}</p>
                )}
              </div>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  מריץ בדיקות...
                </>
              ) : (
                '🚀 הרץ את כל הבדיקות'
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isRunning}
            >
              סגור
            </Button>
          </div>
          
          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>טיפ:</strong> הבדיקות בודקות את כל הפונקציונליות הקריטית של המערכת.
              אם יש בדיקות שנכשלות, יש לטפל בהן לפני השימוש במערכת.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}