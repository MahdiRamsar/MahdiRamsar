const CACHE_NAME = 'mahdi-site-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/404.html',
    '/1.jpg',
    '/posts.json',
    '/manifest.json',
    '/images/taghato-eshgh-va-kheshm.webp',
    '/images/hal-e-delam-khoob-nist.webp',
    '/images/an-faje-ye-mehraban-lanati.webp',
    '/images/bozorgtarin-eshtebah-ma.webp',
    '/images/roozi-ta-kharhare-ashiq-boodam.webp',
    '/images/che-fargh-mikonad-bidar-basham-ya-dar-khab.webp',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;

    // استراتژی Stale-While-Revalidate برای صفحات HTML
    if (request.mode === 'navigate') {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                const fetchPromise = fetch(request)
                    .then(networkResponse => {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, networkResponse.clone());
                        });
                        return networkResponse;
                    })
                    .catch(() => cachedResponse);
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // برای سایر درخواست‌ها: cache-first
    event.respondWith(
        caches.match(request)
            .then(response => response || fetch(request))
            .catch(() => {
                return new Response('Network error', { status: 503 });
            })
    );
});
