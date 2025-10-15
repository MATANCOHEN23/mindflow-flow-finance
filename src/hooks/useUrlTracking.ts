import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Enhanced URL & PWA tracking hook
 * Tracks: PWA mode, installation, shortcuts, sessions, performance
 */
export function useUrlTracking() {
  const location = useLocation();
  
  useEffect(() => {
    const now = new Date().toISOString();
    
    // === Basic Navigation Tracking ===
    localStorage.setItem('last-page', location.pathname);
    localStorage.setItem('last-visit-time', now);
    
    // === Entry Source Tracking ===
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    let entrySource = 'browser';
    
    if (source === 'pwa') {
      entrySource = 'pwa-home';
      console.log('📱 משתמש פתח מאייקון PWA במסך הבית');
    } else if (source === 'shortcut') {
      entrySource = 'pwa-shortcut';
      console.log('⚡ משתמש פתח מקיצור דרך PWA');
    } else if (isPWA) {
      entrySource = 'pwa-installed';
      console.log('📱 משתמש ב-PWA standalone mode (ללא source param)');
    } else {
      entrySource = 'browser';
      console.log('🌐 משתמש פתח מדפדפן רגיל');
    }
    
    localStorage.setItem('entry-source', entrySource);
    
    // === PWA Installation Tracking ===
    if (isPWA) {
      // Check if this is first PWA session
      const pwaFirstInstall = localStorage.getItem('pwa-first-install');
      if (!pwaFirstInstall) {
        localStorage.setItem('pwa-first-install', now);
        console.log('🎉 PWA הותקן לראשונה!', now);
      }
      
      // Track PWA sessions
      const pwaSessions = JSON.parse(localStorage.getItem('pwa-sessions') || '[]');
      pwaSessions.push({
        timestamp: now,
        source: entrySource,
        page: location.pathname
      });
      // Keep only last 50 sessions
      if (pwaSessions.length > 50) {
        pwaSessions.shift();
      }
      localStorage.setItem('pwa-sessions', JSON.stringify(pwaSessions));
    }
    
    // === Page Views Tracking ===
    const pageViews = JSON.parse(localStorage.getItem('page-views') || '{}');
    pageViews[location.pathname] = (pageViews[location.pathname] || 0) + 1;
    localStorage.setItem('page-views', JSON.stringify(pageViews));
    
    // === Performance Metrics ===
    if (performance && performance.navigation) {
      const perfData = {
        loadType: performance.navigation.type, // 0=navigate, 1=reload, 2=back/forward
        timestamp: now,
        page: location.pathname
      };
      
      const perfHistory = JSON.parse(localStorage.getItem('perf-history') || '[]');
      perfHistory.push(perfData);
      if (perfHistory.length > 20) {
        perfHistory.shift();
      }
      localStorage.setItem('perf-history', JSON.stringify(perfHistory));
    }
    
    // === Shortcut Usage Tracking ===
    if (source === 'shortcut') {
      const shortcutUsage = JSON.parse(localStorage.getItem('shortcut-usage') || '{}');
      const pageName = location.pathname.replace('/', '') || 'home';
      shortcutUsage[pageName] = (shortcutUsage[pageName] || 0) + 1;
      localStorage.setItem('shortcut-usage', JSON.stringify(shortcutUsage));
      
      console.log(`⚡ קיצור דרך נוצל: ${pageName} (${shortcutUsage[pageName]} פעמים)`);
    }
    
    // === Session Duration Tracking ===
    const sessionStart = localStorage.getItem('session-start');
    if (!sessionStart) {
      localStorage.setItem('session-start', now);
    }
    
  }, [location]);
  
  // Cleanup on unmount - calculate session duration
  useEffect(() => {
    return () => {
      const sessionStart = localStorage.getItem('session-start');
      if (sessionStart) {
        const duration = new Date().getTime() - new Date(sessionStart).getTime();
        const durationMinutes = Math.round(duration / 60000);
        
        console.log(`⏱️ משך הסשן: ${durationMinutes} דקות`);
        
        // Store session durations
        const sessionDurations = JSON.parse(localStorage.getItem('session-durations') || '[]');
        sessionDurations.push({
          start: sessionStart,
          end: new Date().toISOString(),
          duration: durationMinutes
        });
        if (sessionDurations.length > 30) {
          sessionDurations.shift();
        }
        localStorage.setItem('session-durations', JSON.stringify(sessionDurations));
        
        localStorage.removeItem('session-start');
      }
    };
  }, []);
}

/**
 * Utility function to get PWA analytics summary
 * Can be called from console or SystemTester
 */
export function getPWAAnalytics() {
  return {
    isPWA: window.matchMedia('(display-mode: standalone)').matches,
    firstInstall: localStorage.getItem('pwa-first-install'),
    entrySource: localStorage.getItem('entry-source'),
    lastPage: localStorage.getItem('last-page'),
    lastVisit: localStorage.getItem('last-visit-time'),
    totalSessions: JSON.parse(localStorage.getItem('pwa-sessions') || '[]').length,
    pageViews: JSON.parse(localStorage.getItem('page-views') || '{}'),
    shortcutUsage: JSON.parse(localStorage.getItem('shortcut-usage') || '{}'),
    avgSessionDuration: (() => {
      const durations = JSON.parse(localStorage.getItem('session-durations') || '[]');
      if (durations.length === 0) return 0;
      const total = durations.reduce((sum: number, s: any) => sum + s.duration, 0);
      return Math.round(total / durations.length);
    })()
  };
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).getPWAAnalytics = getPWAAnalytics;
}
