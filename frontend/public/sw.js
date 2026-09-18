// ============================================
// CoursesGuy Service Worker
// Version: 1.0.0
// ============================================

const CACHE_VERSION = 'coursesguy-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Files to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/app-icon.svg',
  '/logo-box.svg',
  '/offline.html',
  '/icons/android/launchericon-192x192.png',
  '/icons/android/launchericon-512x512.png',
  '/icons/ios/180.png',
];

// ============================================
// INSTALL EVENT - Precache static assets
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Precache failed:', err);
      })
  );
});

// ============================================
// ACTIVATE EVENT - Clean old caches
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete old versions
              return name.startsWith('coursesguy-') &&
                     name !== STATIC_CACHE &&
                     name !== DYNAMIC_CACHE &&
                     name !== API_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// ============================================
// FETCH EVENT - Cache strategies
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other schemes
  if (!url.protocol.startsWith('http')) return;

  // ==========================================
  // API calls - Network First (always fresh)
  // ==========================================
  if (url.pathname.startsWith('/api/') || url.hostname.includes('api.')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // ==========================================
  // Images / fonts / icons - Cache First
  // ==========================================
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ==========================================
  // JS / CSS - Stale While Revalidate
  // ==========================================
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.match(/\.(js|css)$/)
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // ==========================================
  // HTML navigation - Network First with offline fallback
  // ==========================================
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // ==========================================
  // Everything else - Network First
  // ==========================================
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ============================================
// CACHE STRATEGIES
// ============================================

/**
 * Cache First — good for static assets
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update cache in background
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network First — try network, fallback to cache
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: 'Offline' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Network First with offline.html fallback for HTML pages
 */
async function networkFirstWithFallback(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    
    // Fallback to offline page
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) return offlinePage;
    
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stale While Revalidate — return cache, update in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// ============================================
// MESSAGE EVENT - Handle updates from app
// ============================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ============================================
// PUSH NOTIFICATIONS (optional, for future)
// ============================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New update from CoursesGuy',
    icon: '/icons/android/launchericon-192x192.png',
    badge: '/icons/android/launchericon-96x96.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'CoursesGuy', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

console.log('[SW] Service Worker loaded');