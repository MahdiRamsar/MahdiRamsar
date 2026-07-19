const CACHE_NAME = 'mahdi-site-v2'; // نسخه را افزایش دهید تا کش قدیمی باطل شود
const urlsToCache = [
    '/',
    '/index.html',
    '/1.jpg',
    '/1.webp',
    '/1.avif',
    '/posts.json',
    '/manifest.json',
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
                        // کش نسخه‌ی جدید برای استفاده‌ی بعدی
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, networkResponse.clone());
                        });
                        return networkResponse;
                    })
                    .catch(() => cachedResponse); // اگر شبکه در دسترس نبود، کش شده را برگردان
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // برای درخواست‌های دیگر (تصاویر، فایل‌های استاتیک، JSON)
    event.respondWith(
        caches.match(request)
            .then(response => response || fetch(request))
            .catch(() => {
                // در صورت خطای شبکه (مثلاً قطع اینترنت) می‌توانید یک صفحه‌ی پیش‌فرض نمایش دهید
                // اما در اینجا چیزی برنمی‌گردانیم چون سایت اصلی می‌تواند ۴۰۴ را مدیریت کند
                return new Response('Network error', { status: 503 });
            })
    );
});
