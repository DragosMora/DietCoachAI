// Import Google Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log('Google Workbox loaded successfully in Service Worker.');

  // Configuration for pre-caching or real-time caching strategies
  
  // 1. Cache-First for static resources (App Shell, Fonts, Icons, CSS, JS)
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: 'dietcoach-static-resources',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
      ],
    })
  );

  // 2. Cache-First for Google fonts
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // Cache for 1 year
        }),
      ],
    })
  );

  // 3. Network-First for mutable data streams (APIs)
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'dietcoach-api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // Cache for 24 hours in case of disconnection
        }),
      ],
    })
  );

  // 4. Background Sync for actions that failed due to connection issues
  const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('dietcoachSyncQueue', {
    maxRetentionTime: 24 * 60 // Retry for 24 hours
  });

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.includes('/api/meals') || url.pathname.includes('/api/weight'),
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
  );

} else {
  console.log('Loading Google Workbox failed.');
}
