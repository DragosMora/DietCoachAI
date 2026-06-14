const CACHE_NAME = 'dietcoach-v28';

// Core app shell assets — these MUST load for offline use
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon.png'
];

// External assets — cached opportunistically; won't break install if unavailable
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// ── INSTALL ──────────────────────────────────────────────────────────────────
// Cache core assets first (fail-fast). Then cache externals individually
// so a single CDN hiccup doesn't abort the whole install.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Must succeed — these are the app shell
      await cache.addAll(CORE_ASSETS);

      // Best-effort for external CDN assets
      await Promise.allSettled(
        EXTERNAL_ASSETS.map((url) =>
          cache.add(url).catch((err) =>
            console.warn('[SW] Could not cache external asset:', url, err)
          )
        )
      );
    })
  );
  // Take over immediately without waiting for old tab to close
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────────────────────────
// Delete any old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim()) // Take control of all open tabs
  );
});

// ── FETCH ─────────────────────────────────────────────────────────────────────
// Strategy: Cache-First for app shell; Network-First for everything else
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests (e.g. POST)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For navigations (page loads), try network first, then fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If network is good, update the cache and return
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', responseToCache));
          return networkResponse;
        })
        .catch(() => {
          // If offline, use the cache
          return caches.match('/index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Cache hit — return immediately
        return cachedResponse;
      }

      // Not in cache — fetch from network, then cache for next time
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Completely offline and not cached — return nothing gracefully
          console.warn('[SW] Fetch failed and no cache for:', event.request.url);
        });
    })
  );
});
