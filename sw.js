const CACHE = 'paris-news-a6a541bf14';
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/cover.jpg", "img/ex_cezanne.jpg", "img/logo.png", "img/w00.jpg", "img/w01.jpg", "img/w02.jpg", "img/w03.jpg", "img/w04.jpg", "img/w05.jpg", "img/w06.jpg", "img/w07.jpg", "img/w08.jpg", "img/w09.jpg", "img/w10.jpg", "img/w11.jpg", "img/w12.jpg", "img/w13.jpg", "img/w14.jpg", "img/w15.jpg", "img/w16.jpg", "img/w17.jpg", "img/w18.jpg", "img/w19.jpg", "img/w20.jpg", "img/w21.jpg", "img/w22.jpg", "img/w23.jpg", "img/w24.jpg", "img/w25.jpg", "img/w26.jpg", "img/w30.jpg", "img/w31.jpg", "img/w32.jpg", "img/w33.jpg", "img/w34.jpg", "img/w40.jpg", "img/w41.jpg", "img/w42.jpg"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 페이지·데이터: 온라인이면 최신, 오프라인이면 저장본
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(fetch(req, { cache: 'no-store' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  // 이미지·글꼴·PDF: 저장본 우선, 없으면 받아서 저장
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
    return r;
  })));
});
