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

// Register service worker with auto-update
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    const shouldUpdate = confirm(
      '🎉 גרסה חדשה של האפליקציה זמינה!\n\nהאם ברצונך לרענן ולקבל את העדכון?'
    );
    if (shouldUpdate) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('✅ App ready to work offline');
  },
  onRegistered(registration) {
    console.log('✅ Service Worker registered:', registration);
    
    // Check for updates every 60 seconds
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60000);
    }
  },
  onRegisterError(error) {
    console.error('❌ Service Worker registration error:', error);
  },
});

createRoot(document.getElementById("root")!).render(<App />);
