const CACHE_NAME = 'foli-cache-v19.7';
const ASSETS_TO_CACHE = [
  './',
  './flag.png',
  './index.html?v=19.6',
  './reader.html?v=19.4',
  './add_event.html?v=19.4',
  './manifest.json?v=19.4',
  './icons/icon-512.png',
  './i18n.js?v=19.4',
  './lunar.js?v=19.4',
  './recipe_data.js?v=19.4',
  './diet_logic.js?v=19.4',
  './sutras_data.js?v=19.4',
  './video_data.js?v=19.4',
  './audio_data_v13.js',
  './ai_chat.js?v=19.4',
  './video_snippet.js?v=19.4',
  './search_data.js?v=19.4'
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

        // 3. Cache the new resource (Dynamic Caching)
        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
