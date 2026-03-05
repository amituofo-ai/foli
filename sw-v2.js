const CACHE_NAME = 'foli-cache-v21.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.html?v=21.0',
  './flag.png',
  './reader.html?v=21.0',
  './add_event.html?v=21.0',
  './manifest.json?v=21.0',
  './icons/icon-512.png',
  './i18n.js?v=21.0',
  './lunar.js?v=21.0',
  './sutras_data.js?v=21.0',
  './recipe_data.js?v=21.0',
  './diet_logic.js?v=21.0',
  './video_data.js?v=21.0',
  './audio_data_v13.js?v=21.0',
  './ai_chat.js?v=21.0',
  './search_data.js?v=21.0',
  './events_data.js?v=21.0',
  './live_downloads_data.js?v=21.0',
  'https://cdn.tailwindcss.com'
];

// Install Event: Cache Core Assets (per-item so one 404 doesn't block activate)
// 不在此處 skipWaiting，由頁面點「更新」時發送 SKIP_WAITING，以便顯示更新提醒
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching offline assets');
      return Promise.allSettled(ASSETS_TO_CACHE.map((url) => cache.add(url).catch((err) => {
        console.warn('SW: Cache add failed', url, err);
      })));
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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

  event.respondWith((async () => {
    const reqUrl = new URL(event.request.url);
    const sameOrigin = reqUrl.origin === self.location.origin;

    const matchByPathname = async () => {
      if (!sameOrigin) return null;
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      const pathMatch = keys.find((req) => {
        try {
          const u = new URL(req.url);
          return u.origin === reqUrl.origin && u.pathname === reqUrl.pathname;
        } catch (e) { return false; }
      });
      return pathMatch ? cache.match(pathMatch) : null;
    };

    let resp = await caches.match(event.request);
    if (resp) return resp;
    resp = await matchByPathname();
    if (resp) return resp;

    try {
      const networkResponse = await fetch(event.request);
      if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors' || networkResponse.type === 'opaque')) {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
      }
      return networkResponse;
    } catch (err) {
      const fallback = await matchByPathname();
      return fallback || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});