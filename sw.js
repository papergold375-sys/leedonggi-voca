const CACHE_NAME = 'idonggi-voca-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  // English audio (word + example)
  './audio/claim-word.mp3',
  './audio/establish-word.mp3',
  './audio/expert-word.mp3',
  './audio/immediate-word.mp3',
  './audio/emphasis-word.mp3',
  './audio/claim-example-en.mp3',
  './audio/establish-example-en.mp3',
  './audio/expert-example-en.mp3',
  './audio/immediate-example-en.mp3',
  './audio/emphasis-example-en.mp3',
  // Korean audio (meaning + example)
  './audio/claim-meaning.mp3',
  './audio/establish-meaning.mp3',
  './audio/expert-meaning.mp3',
  './audio/immediate-meaning.mp3',
  './audio/emphasis-meaning.mp3',
  './audio/claim-example-ko.mp3',
  './audio/establish-example-ko.mp3',
  './audio/expert-example-ko.mp3',
  './audio/immediate-example-ko.mp3',
  './audio/emphasis-example-ko.mp3',
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (event.request.method === 'GET' && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
