// v1.0.1 - Adding basic caching
const CACHE_NAME = 'kc-stock-system-cache-v1';
const URLS_TO_CACHE = [
  'index.html', // Cache the main HTML file
  '/' // Cache the root to handle navigation
];

// Event: install
// Fired when the service worker is first installed.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Event: activate
// Fired when the service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event: fetch
// Fired for every network request. This strategy is "Cache falling back to network".
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});