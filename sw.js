const CACHE_NAME = 'foli-cache-v18';
const ASSETS_TO_CACHE = [
  './',
  './index.html?v=18',
  './reader.html?v=18',
  './add_event.html?v=18',
  './manifest.json?v=18',
  './icons/icon-512.png',
  './i18n.js?v=18',
  './lunar.js?v=18',
  './recipe_data.js?v=18',
  './diet_logic.js?v=18',
  './video_data.js?v=18',
  './audio_data_v13.js',
  './ai_chat.js?v=18',
  './video_snippet.js?v=18',
  './search_data.js?v=18'
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
  
  // Strategy for announcement.html: Network First (Freshness over Cache)
  if (url.pathname.endsWith('announcement.html')) {
      event.respondWith(
          fetch(event.request)
              .then(response => {
                  // If valid response, clone and cache
                  if (response && response.status === 200) {
                      const responseToCache = response.clone();
                      caches.open(CACHE_NAME).then(cache => {
                          cache.put(event.request, responseToCache);
                      });
                      return response;
                  }
                  // If network fails or 404, try cache
                  return caches.match(event.request);
              })
              .catch(() => {
                  // Offline -> fallback to cache
                  return caches.match(event.request);
              })
      );
      return;
  }

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
