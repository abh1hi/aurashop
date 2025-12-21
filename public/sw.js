const CACHE_NAME = 'aurashop-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/admin/',
    '/vendor/',
    '/index.html',
    '/admin/index.html',
    '/vendor/index.html',
    '/manifest-customer.json',
    '/manifest-admin.json',
    '/manifest-vendor.json'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Create cache
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // 1. CRITICAL: Ignore non-GET requests (POST, PUT, DELETE, etc.)
    if (event.request.method !== 'GET') return;

    // 2. CRITICAL: Ignore non-http/https schemes (e.g., chrome-extension://, ws://)
    if (!event.request.url.startsWith('http')) return;

    // Navigation requests: always try network first, fall back to offline page if possible (or index.html)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request).then((response) => {
                    // For MPA, finding the right fallback is tricky without build injection.
                    // We will just return the cached page if available, or error.
                    if (response) return response;

                    // Basic fallback logic based on URL
                    if (event.request.url.includes('/admin/')) return caches.match('/admin/index.html');
                    if (event.request.url.includes('/vendor/')) return caches.match('/vendor/index.html');
                    return caches.match('/index.html');
                });
            })
        );
        return;
    }

    // Asset requests: Stale-while-revalidate
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Check if we received a valid response
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => {
                    // Network failed, nothing to do here as we handle cachedResponse below
                });
                return cachedResponse || fetchPromise;
            });
        })
    );
});
