const CACHE_NAME = 'vesto-cache-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icon.svg',
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Only intercept GET requests
  if (e.request.method !== 'GET') return;
  
  // Try to fetch from network, fallback to cache if offline
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then((response) => {
        return response || caches.match('/');
      });
    })
  );
});
