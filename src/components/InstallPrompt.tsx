import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show again for 7 days
      }
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setIsInstalled(true);
      localStorage.removeItem('pwa-install-dismissed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="bg-gradient-to-br from-primary to-primary-foreground text-white shadow-2xl border-0 overflow-hidden">
        <div className="p-4 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-2 left-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 pr-6">
            <div className="flex-shrink-0 bg-white/20 p-3 rounded-xl">
              <Smartphone className="w-8 h-8" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">התקן את MindFlow CRM</h3>
              <p className="text-sm text-white/90 mb-3">
                גישה מהירה, עבודה ללא אינטרנט, וחוויה משופרת
              </p>
              
              <Button
                onClick={handleInstallClick}
                className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                size="sm"
              >
                <Download className="w-4 h-4 ml-2" />
                התקן עכשיו
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
