// Service worker Pabrik Pixel: menyimpan "cangkang" aplikasi agar terbuka cepat & tetap tampil saat sinyal hilang.
// Data GitHub (api.github.com) TIDAK pernah disimpan di sini.
const V = 'pabrik-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/ikon-192.png', 'icons/ikon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin === self.location.origin && !u.pathname.includes('/demo/')) {
    // jaringan dulu (selalu versi terbaru), cadangan dari cache bila offline
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  } else if (u.host === 'fonts.googleapis.com' || u.host === 'fonts.gstatic.com') {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(e.request, c)); return res; })));
  }
});
