import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Clear old caches on load
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      // Remove old versions
      if (name.includes('workbox-precache-v2-') || 
          name.includes('old') || 
          name.includes('v1')) {
        console.log('🗑️ Deleting old cache:', name);
        caches.delete(name);
      }
    });
  });
}

// Enhanced Service Worker registration
let deferredUpdatePrompt: (() => Promise<void>) | null = null;

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Store the update function
    deferredUpdatePrompt = () => updateSW(true);
    
    // Show custom notification with options
    const userChoice = confirm(
      '🎉 גרסה חדשה של MindFlow CRM זמינה!\n\n' +
      '✨ מה חדש:\n' +
      '• ביצועים משופרים\n' +
      '• תיקוני באגים\n' +
      '• תכונות חדשות\n\n' +
      'האם ברצונך לרענן עכשיו?\n\n' +
      '(אם תבחר "ביטול", תוכל לעדכן מאוחר יותר)'
    );
    
    if (userChoice) {
      updateSW(true);
    } else {
      // Show persistent notification that update is available
      console.log('⏳ עדכון נדחה - זמין לביצוע מאוחר יותר');
      
      // Add update badge/notification in UI (optional)
      localStorage.setItem('pwa-update-available', 'true');
      
      // Show reminder after 1 hour
      setTimeout(() => {
        if (deferredUpdatePrompt && localStorage.getItem('pwa-update-available') === 'true') {
          const reminderChoice = confirm(
            '🔔 תזכורת: גרסה חדשה עדיין ממתינה\n\n' +
            'רוצה לעדכן עכשיו?'
          );
          if (reminderChoice) {
            deferredUpdatePrompt();
            localStorage.removeItem('pwa-update-available');
          }
        }
      }, 60 * 60 * 1000); // 1 hour
    }
  },
  onOfflineReady() {
    console.log('✅ האפליקציה מוכנה לעבודה ללא אינטרנט');
  },
  onRegistered(registration) {
    console.log('✅ Service Worker רשום בהצלחה:', registration);
    
    // Check for updates every 60 seconds
    if (registration) {
      setInterval(() => {
        console.log('🔍 מחפש עדכונים...');
        registration.update();
      }, 60000);
    }
    
    // Clear update flag on successful registration
    localStorage.removeItem('pwa-update-available');
  },
  onRegisterError(error) {
    console.error('❌ שגיאה ברישום Service Worker:', error);
  },
});

createRoot(document.getElementById("root")!).render(<App />);
