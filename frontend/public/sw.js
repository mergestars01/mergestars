/* MERGE PWA shell: only a static offline message is cached.
   Never cache authenticated pages, API responses, orders, pricing or identity data. */
const OFFLINE_CACHE = 'merge-static-offline-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(OFFLINE_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('merge-static-offline-') && key !== OFFLINE_CACHE)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.mode !== 'navigate' || request.method !== 'GET' || url.origin !== self.location.origin) return

  event.respondWith(
    fetch(request).catch(async () => (
      (await caches.match(OFFLINE_URL)) || Response.error()
    )),
  )
})
