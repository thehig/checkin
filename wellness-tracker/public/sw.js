const CACHE_NAME = 'wellness-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip caching for:
  // 1. POST, PUT, DELETE requests (only cache GET requests)
  // 2. API calls to external services (Supabase, etc.)
  // 3. Chrome extensions and other non-http(s) requests
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/rest/v1/') ||
    event.request.url.includes('supabase.co') ||
    !event.request.url.startsWith('http')
  ) {
    // Just fetch without caching
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Wellness Reminder';
  const options = {
    body: data.body || 'Time to check in!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'complete', title: 'Complete' },
      { action: 'snooze', title: 'Snooze 15m' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'complete') {
    // Handle complete action
    event.waitUntil(
      clients.openWindow('/?action=complete&id=' + event.notification.data.id)
    );
  } else if (event.action === 'snooze') {
    // Handle snooze action
    event.waitUntil(
      clients.openWindow('/?action=snooze&id=' + event.notification.data.id)
    );
  } else {
    // Default: open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
