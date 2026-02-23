const CACHE_NAME = 'foli-cache-v20.9';
const ASSETS_TO_CACHE = [
  './',
  './flag.png',
  './index.html?v=20.9',
  './reader.html?v=19.4',
  './add_event.html?v=19.4',
  './manifest.json?v=19.4',
  './icons/icon-512.png',
  './i18n.js?v=19.8',
  './lunar.js?v=19.4',
  './recipe_data.js?v=19.4',
  './diet_logic.js?v=19.4',
  './sutras_data.js?v=19.4',
  './video_data.js?v=19.4',
  './audio_data_v13.js',
  './ai_chat.js?v=19.4',
  './events_data.js?v=20.5', // Add events data to cache
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
  return self.clients.claim();
});

// Fetch Event: Strategies for different assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension requests or other non-http schemes
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Strategy for HTML: Network First, then Cache
  // This ensures users always get the latest app shell.
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If valid response, clone and cache for offline use
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails (offline), fallback to cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Strategy for media: Network only
  // Avoids caching large files and supports Range requests.
  if (url.pathname.match(/\.(mp3|wav|mp4)$/i)) {
      return; // Let the browser handle it (network only)
  }

  // Strategy for other assets (CSS, JS, images): Cache First, then Network
  // This is fast and efficient for static assets.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors' && networkResponse.type !== 'opaque')) {
          return networkResponse;
        }

        // 3. Cache the new resource
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
