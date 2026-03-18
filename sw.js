/**
 * Service worker - cache-first strategy for PWA offline support
 * Precache static assets on install; serve from cache when available
 */
const CACHE_NAME = 'moto-arcade-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/js/main.js',
  '/js/game/state.js',
  '/js/game/entities.js',
  '/js/game/road.js',
  '/js/game/collision.js',
  '/js/game/spawner.js',
  '/js/game/input.js',
  '/js/audio.js',
  '/js/storage.js',
  '/js/pwa.js',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then(
        (response) => {
          const clone = response.clone();
          if (response.ok && response.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        },
        () => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html').then((fallback) => {
              if (fallback) return fallback;
              const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline - Motorcycle Arcade</title><style>body{font-family:system-ui,sans-serif;background:#1a1a1a;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:1rem}button{background:#4a9;color:#fff;border:none;padding:12px 24px;font-size:1rem;border-radius:8px;cursor:pointer;margin-top:1rem}button:hover{background:#5ba}</style></head><body><h1>You're Offline</h1><p>Motorcycle Arcade needs to be loaded online first. Please check your connection and try again.</p><button onclick="location.reload()">Retry</button></body></html>`;
              return new Response(html, { headers: { 'Content-Type': 'text/html' } });
            });
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        }
      );
    })
  );
});
