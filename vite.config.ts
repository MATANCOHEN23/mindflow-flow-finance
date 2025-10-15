import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'MC-MindFlow CRM',
        short_name: 'MindFlow',
        description: 'מערכת ניהול לקוחות מתקדמת לביצועים נפשיים וספורט',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/?source=pwa',
        dir: 'rtl',
        lang: 'he',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'לקוחות',
            short_name: 'לקוחות',
            description: 'גישה מהירה לרשימת לקוחות',
            url: '/contacts?source=shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'דשבורד',
            short_name: 'דשבורד',
            description: 'מסך ראשי - סטטיסטיקות ומשימות',
            url: '/?source=shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'תשלומים',
            short_name: 'תשלומים',
            description: 'ניהול תשלומים ועסקאות',
            url: '/payments?source=shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'אירועים',
            short_name: 'אירועים',
            description: 'לוח אירועים ומשימות',
            url: '/events?source=shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/khlxdlvlyycatlaslusc\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));