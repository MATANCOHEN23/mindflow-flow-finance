import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/Layout/MainLayout';
import { CheckCircle, Smartphone, Monitor, Download, Share2, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) setPlatform('ios');
    else if (isAndroid) setPlatform('android');
    else setPlatform('desktop');

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Listen for beforeinstallprompt (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl">האפליקציה מותקנת! 🎉</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                MindFlow CRM כבר מותקנת במכשיר שלך ופועלת כאפליקציה עצמאית.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm">
                  💡 <strong>טיפ:</strong> תוכל למצוא את האפליקציה במסך הבית או בתפריט האפליקציות שלך
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Smartphone className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-2">התקן את MindFlow CRM</CardTitle>
            <p className="text-muted-foreground">
              גישה מהירה, עבודה ללא אינטרנט, וחוויית שימוש משופרת
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Download className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-bold mb-1">גישה מהירה</h3>
                <p className="text-sm text-muted-foreground">פתיחה ישירה ממסך הבית</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Monitor className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-bold mb-1">מסך מלא</h3>
                <p className="text-sm text-muted-foreground">ללא סרגל הדפדפן</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-bold mb-1">עבודה אופליין</h3>
                <p className="text-sm text-muted-foreground">גם ללא אינטרנט</p>
              </div>
            </div>

            {/* Android - Direct Install */}
            {platform === 'android' && deferredPrompt && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <h3 className="font-bold text-xl mb-3 text-green-800">
                  🤖 Android - התקנה אוטומטית
                </h3>
                <Button 
                  onClick={handleInstallClick}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-5 h-5 ml-2" />
                  התקן אפליקציה
                </Button>
              </div>
            )}

            {/* Android - Manual Instructions */}
            {platform === 'android' && !deferredPrompt && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  🤖 הוראות התקנה ל-Android
                </h3>
                <ol className="space-y-3 text-right list-decimal list-inside">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>פתח את <strong>Chrome</strong> במכשיר האנדרואיד</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>לחץ על <MoreVertical className="w-4 h-4 inline" /> (שלוש נקודות) בפינה העליונה</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>בחר <strong>"הוסף למסך הבית"</strong> או <strong>"Install app"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>אשר את ההתקנה</span>
                  </li>
                </ol>
              </div>
            )}

            {/* iOS Instructions */}
            {platform === 'ios' && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                  🍎 הוראות התקנה ל-iPhone/iPad
                </h3>
                <ol className="space-y-4 text-right list-decimal list-inside">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600 min-w-[24px]">1.</span>
                    <span>פתח את האתר ב<strong>Safari</strong> (חשוב! לא Chrome או דפדפן אחר)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600 min-w-[24px]">2.</span>
                    <span>לחץ על כפתור <Share2 className="w-4 h-4 inline text-blue-500 mx-1" /> <strong>"שיתוף"</strong> בתחתית המסך או בסרגל הכתובות</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600 min-w-[24px]">3.</span>
                    <span>גלול למטה עד שתראה <strong>"הוסף למסך הבית"</strong> (Add to Home Screen) ולחץ עליו</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600 min-w-[24px]">4.</span>
                    <span>תוכל לשנות את השם (או להשאיר "MindFlow CRM")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600 min-w-[24px]">5.</span>
                    <span>לחץ <strong>"הוסף"</strong> (Add) בפינה הימנית העליונה</span>
                  </li>
                </ol>

                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>חשוב:</strong> ההתקנה עובדת רק דרך Safari! אם אתה משתמש ב-Chrome או דפדפן אחר, העתק את הכתובת ופתח ב-Safari.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-bold mb-2 text-blue-900">💡 טיפים חשובים:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                      <li>אחרי ההתקנה - האייקון יופיע במסך הבית שלך</li>
                      <li>האפליקציה תיפתח במסך מלא ללא סרגל כתובות</li>
                      <li>תעבוד גם ללא אינטרנט (עבור נתונים שכבר נטענו)</li>
                      <li><strong>לחץ ארוך</strong> על האייקון יציג קיצורי דרך למסכים שונים! ⚡</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-bold mb-2 text-green-900">✨ יתרונות נוספים:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                      <li>טעינה מהירה יותר מאתר רגיל</li>
                      <li>פחות צריכה של סוללה וגלישה</li>
                      <li>עדכונים אוטומטיים ברקע</li>
                      <li>עבודה גם באזורים עם קליטה חלשה</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Instructions */}
            {platform === 'desktop' && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Monitor className="w-6 h-6 text-gray-600" />
                  💻 הוראות התקנה למחשב
                </h3>
                {deferredPrompt ? (
                  <div className="text-center">
                    <p className="mb-4">התקן את האפליקציה למחשב שלך לגישה מהירה</p>
                    <Button 
                      onClick={handleInstallClick}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-5 h-5 ml-2" />
                      התקן אפליקציה
                    </Button>
                  </div>
                ) : (
                  <ol className="space-y-3 text-right list-decimal list-inside">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-gray-600">1.</span>
                      <span>לחץ על <Download className="w-4 h-4 inline" /> בסרגל הכתובות (Chrome/Edge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-gray-600">2.</span>
                      <span>או: תפריט <MoreVertical className="w-4 h-4 inline" /> → "התקן MindFlow CRM"</span>
                    </li>
                  </ol>
                )}
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">💡 למה להתקין?</h4>
              <ul className="space-y-1 text-sm">
                <li>✅ פתיחה מהירה ממסך הבית</li>
                <li>✅ חוויית שימוש כמו אפליקציה רגילה</li>
                <li>✅ עבודה גם כשאין אינטרנט (נתונים נשמרים מקומית)</li>
                <li>✅ התראות ועדכונים (בקרוב)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
