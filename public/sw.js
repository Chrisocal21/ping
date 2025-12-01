// Service Worker for Ping PWA
// Handles offline functionality and caching

const CACHE_NAME = 'ping-v1'
const STATIC_CACHE = 'ping-static-v1'
const DYNAMIC_CACHE = 'ping-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/chat',
  '/login',
  '/signup',
  '/about',
  '/settings',
  '/insights',
  '/manifest.json',
  '/favicon.svg',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('[SW] Failed to cache static assets:', err)
      })
    }).then(() => {
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip caching for API routes (always fetch fresh)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return offline response for API failures
        return new Response(
          JSON.stringify({
            error: 'Offline - please check your connection',
            offline: true
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      })
    )
    return
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, networkResponse)
            })
          }
        }).catch(() => {
          // Network failed, but we have cache - no action needed
        })
        
        return cachedResponse
      }

      // Not in cache, fetch from network
      return fetch(request).then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        
        return networkResponse
      }).catch(() => {
        // Network failed and not in cache - return offline page
        if (request.destination === 'document') {
          return caches.match('/offline.html').then((offlineResponse) => {
            return offlineResponse || new Response(
              '<html><body><h1>Offline</h1><p>Check your connection</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            )
          })
        }
        
        // For other resources, fail silently
        return new Response('Offline', { status: 503 })
      })
    })
  )
})

// Background sync for pending messages (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    console.log('[SW] Background sync: messages')
    // Could implement offline message queue here
  }
})

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  const options = {
    body: event.data?.text() || 'New message from Ping',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  }
  
  event.waitUntil(
    self.registration.showNotification('Ping', options)
  )
})
