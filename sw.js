const CACHE_NAME = 'foli-cache-v8';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './reader.html',
  './add_event.html',
  './manifest.json',
  './icons/icon-512.png',
  './i18n.js',
  './lunar.js',
  './recipe_data.js',
  './diet_logic.js',
  './video_data.js',
  './audio_data.js',
  './ai_chat.js',
  './video_snippet.js',
  './search_data.js'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate worker immediately
});

// Activate Event: Cleanup Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache First Strategy with Dynamic Caching
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension requests or other non-http schemes
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      // 1. Return cached response if found (Cache First)
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors' && networkResponse.type !== 'opaque') {
          return networkResponse;
        }

        // 3. Clone and cache the new content (Dynamic Caching)
        // This ensures "content loaded once" is available offline next time
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Use the original request to cache, but if we used ignoreSearch above, 
          // we should probably be careful. But here we cache the exact request URL.
          // This allows versioned files to be cached separately if needed, 
          // or we can strip search params if we want to deduplicate.
          // For safety, let's cache the exact URL requested.
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((error) => {
        // Network failed (offline) and not in cache
        console.log('SW: Fetch failed', error);
      });
    })
  );
});
