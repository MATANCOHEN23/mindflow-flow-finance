import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Enhanced URL & PWA tracking hook
 * Tracks: PWA mode, installation, shortcuts, sessions, performance
 */
export function useUrlTracking() {
  const location = useLocation();
  
  useEffect(() => {
    try {
      const now = new Date().toISOString();
      
      // === Basic Navigation Tracking ===
      try {
        localStorage.setItem('last-page', location.pathname);
        localStorage.setItem('last-visit-time', now);
      } catch (e) {
        console.warn('Failed to save navigation tracking:', e);
      }
      
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
      
      try {
        localStorage.setItem('entry-source', entrySource);
      } catch (e) {
        console.warn('Failed to save entry source:', e);
      }
      
      // === PWA Installation Tracking ===
      if (isPWA) {
        try {
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
        } catch (e) {
          console.warn('Failed to save PWA tracking:', e);
        }
      }
      
      // === Page Views Tracking ===
      try {
        const pageViews = JSON.parse(localStorage.getItem('page-views') || '{}');
        pageViews[location.pathname] = (pageViews[location.pathname] || 0) + 1;
        localStorage.setItem('page-views', JSON.stringify(pageViews));
      } catch (e) {
        console.warn('Failed to save page views:', e);
      }
      
      // === Performance Metrics (FIXED - using new API) ===
      try {
        if (performance && performance.getEntriesByType) {
          const navigationEntries = performance.getEntriesByType('navigation');
          if (navigationEntries && navigationEntries.length > 0) {
            const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
            
            const perfData = {
              loadType: navEntry.type, // 'navigate', 'reload', 'back_forward', 'prerender'
              timestamp: now,
              page: location.pathname,
              loadTime: Math.round(navEntry.loadEventEnd - navEntry.fetchStart)
            };
            
            const perfHistory = JSON.parse(localStorage.getItem('perf-history') || '[]');
            perfHistory.push(perfData);
            if (perfHistory.length > 20) {
              perfHistory.shift();
            }
            localStorage.setItem('perf-history', JSON.stringify(perfHistory));
          }
        }
      } catch (e) {
        console.warn('Failed to save performance metrics:', e);
      }
      
      // === Shortcut Usage Tracking ===
      if (source === 'shortcut') {
        try {
          const shortcutUsage = JSON.parse(localStorage.getItem('shortcut-usage') || '{}');
          const pageName = location.pathname.replace('/', '') || 'home';
          shortcutUsage[pageName] = (shortcutUsage[pageName] || 0) + 1;
          localStorage.setItem('shortcut-usage', JSON.stringify(shortcutUsage));
          
          console.log(`⚡ קיצור דרך נוצל: ${pageName} (${shortcutUsage[pageName]} פעמים)`);
        } catch (e) {
          console.warn('Failed to save shortcut usage:', e);
        }
      }
      
      // === Session Duration Tracking ===
      try {
        const sessionStart = localStorage.getItem('session-start');
        if (!sessionStart) {
          localStorage.setItem('session-start', now);
        }
      } catch (e) {
        console.warn('Failed to save session start:', e);
      }
      
    } catch (error) {
      console.error('URL tracking error:', error);
    }
  }, [location]);
  
  // Cleanup on unmount - calculate session duration
  useEffect(() => {
    return () => {
      try {
        const sessionStart = localStorage.getItem('session-start');
        if (sessionStart) {
          const duration = new Date().getTime() - new Date(sessionStart).getTime();
          const durationMinutes = Math.round(duration / 60000);
          
          console.log(`⏱️ משך הסשן: ${durationMinutes} דקות`);
          
          // Store session durations
          try {
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
          } catch (e) {
            console.warn('Failed to save session duration:', e);
          }
        }
      } catch (error) {
        console.error('Session cleanup error:', error);
      }
    };
  }, []);
}

/**
 * Utility function to get PWA analytics summary
 * Can be called from console or SystemTester
 */
export function getPWAAnalytics() {
  try {
    return {
      isPWA: window.matchMedia('(display-mode: standalone)').matches,
      firstInstall: localStorage.getItem('pwa-first-install') || 'Not installed',
      entrySource: localStorage.getItem('entry-source') || 'Unknown',
      lastPage: localStorage.getItem('last-page') || '/',
      lastVisit: localStorage.getItem('last-visit-time') || 'Never',
      totalSessions: (() => {
        try {
          return JSON.parse(localStorage.getItem('pwa-sessions') || '[]').length;
        } catch (e) {
          return 0;
        }
      })(),
      pageViews: (() => {
        try {
          return JSON.parse(localStorage.getItem('page-views') || '{}');
        } catch (e) {
          return {};
        }
      })(),
      shortcutUsage: (() => {
        try {
          return JSON.parse(localStorage.getItem('shortcut-usage') || '{}');
        } catch (e) {
          return {};
        }
      })(),
      avgSessionDuration: (() => {
        try {
          const durations = JSON.parse(localStorage.getItem('session-durations') || '[]');
          if (durations.length === 0) return 0;
          const total = durations.reduce((sum: number, s: any) => sum + s.duration, 0);
          return Math.round(total / durations.length);
        } catch (e) {
          return 0;
        }
      })()
    };
  } catch (error) {
    console.error('getPWAAnalytics error:', error);
    return {
      isPWA: false,
      firstInstall: 'Error',
      entrySource: 'Error',
      lastPage: 'Error',
      lastVisit: 'Error',
      totalSessions: 0,
      pageViews: {},
      shortcutUsage: {},
      avgSessionDuration: 0,
      error: String(error)
    };
  }
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).getPWAAnalytics = getPWAAnalytics;
}
