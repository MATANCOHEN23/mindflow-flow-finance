import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track URL sources and navigation
 * Tracks: PWA home screen, PWA shortcuts, browser direct, bookmark
 */
export function useUrlTracking() {
  const location = useLocation();
  
  useEffect(() => {
    // Save last visited page for analytics
    localStorage.setItem('last-page', location.pathname);
    localStorage.setItem('last-visit-time', new Date().toISOString());
    
    // Track source (PWA, bookmark, direct browser)
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    
    // Log entry source
    if (source === 'pwa') {
      console.log('📱 User opened from PWA home screen icon');
      localStorage.setItem('entry-source', 'pwa-home');
    } else if (source === 'shortcut') {
      console.log('⚡ User opened from PWA shortcut');
      localStorage.setItem('entry-source', 'pwa-shortcut');
    } else if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📱 User in PWA standalone mode (no source param)');
      localStorage.setItem('entry-source', 'pwa-installed');
    } else {
      console.log('🌐 User opened from browser');
      localStorage.setItem('entry-source', 'browser');
    }
    
    // Track page views (for future analytics)
    const pageViews = JSON.parse(localStorage.getItem('page-views') || '{}');
    pageViews[location.pathname] = (pageViews[location.pathname] || 0) + 1;
    localStorage.setItem('page-views', JSON.stringify(pageViews));
    
  }, [location]);
}
