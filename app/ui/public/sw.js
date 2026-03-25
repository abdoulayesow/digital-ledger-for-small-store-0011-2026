// B'tiki Service Worker — offline-first caching for low-end Android
// Bump CACHE_VERSION on each deploy to bust the cache

const CACHE_VERSION = "btiki-shell-v2";
const RUNTIME_CACHE = "btiki-runtime-v1";
const OFFLINE_URL = "/offline";

// App shell files to precache on install
// Only precache truly public, static assets (/ is auth-protected)
const PRECACHE_URLS = [
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon.ico",
];

// ─── Install: precache app shell ─────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// ─── Message: user-controlled skipWaiting ────────────────────────
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ─── Activate: clean old caches, claim clients ───────────────────
self.addEventListener("activate", (event) => {
  const allowed = new Set([CACHE_VERSION, RUNTIME_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !allowed.has(k)).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch strategies ────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // API requests: network-only (data lives in IndexedDB)
  if (url.pathname.startsWith("/api/")) return;

  // Navigation: network-first → cache → offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Next.js static assets (/_next/static/): cache-first (content-hashed, immutable)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((response) => {
              if (response.ok) {
                const clone = response.clone();
                caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
              }
              return response;
            })
            .catch(() => new Response("", { status: 503 }))
      )
    );
    return;
  }

  // Everything else (fonts, images, icons): stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached || new Response("", { status: 503 }));

      return cached || fetched;
    })
  );
});
