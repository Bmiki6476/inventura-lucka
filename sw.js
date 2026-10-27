// Service worker Inventúra Lucka – verzia 21a6afc09c
// Stránka: najprv sieť (nová verzia hneď), bez signálu z pamäte. Knižnice a ikony: z pamäte.
// Volania servera (script.google.com) sa NIKDY neukladajú – offline fronta zmien je v appke.
const CACHE = 'inventura-21a6afc09c';
const ZAKLAD = ['./', 'index.html', 'manifest.webmanifest', 'ikona-192.png', 'ikona-512.png', 'apple-touch-icon.png', 'favicon-32.png'];
const KNIZNICE = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ZAKLAD)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const k = res.clone(); caches.open(CACHE).then(c => c.put('index.html', k)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }
  if (u.origin === location.origin || KNIZNICE.includes(u.hostname)) {
    e.respondWith(caches.match(r).then(z => z || fetch(r).then(res => {
      if (res.ok || res.type === 'opaque') { const k = res.clone(); caches.open(CACHE).then(c => c.put(r, k)); }
      return res;
    })));
  }
});
