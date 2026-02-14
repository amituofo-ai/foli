const CACHE_NAME = 'foli-cache-v14';
const ASSETS_TO_CACHE = [
  './',
  './index.html?v=14',
  './reader.html?v=14',
  './add_event.html?v=14',
  './manifest.json?v=14',
  './icons/icon-512.png',
  './i18n.js?v=14',
  './lunar.js?v=14',
  './recipe_data.js?v=14',
  './diet_logic.js?v=14',
  './video_data.js?v=14',
  './audio_data_v13.js',
  './ai_chat.js?v=14',
  './video_snippet.js?v=14',
  './search_data.js?v=14'
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

  // Exclude media files (mp3, wav, mp4) from caching to support Range requests and save space
  const url = new URL(event.request.url);
  if (url.pathname.match(/\.(mp3|wav|mp4)$/i)) {
      return; // Let the browser handle it (network only)
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
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
