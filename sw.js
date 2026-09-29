/* Árbol Familiar — service worker opcional (solo actúa si la app se sirve por https, p. ej. GitHub Pages).
   Guarda una copia de la app en el teléfono para que abra sin internet. Los datos del árbol NO pasan por aquí. */
var CACHE = 'arbol-familiar-v11';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || req.url.indexOf(self.location.origin) !== 0) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req).then(function (guardado) {
      var red = fetch(req).then(function (res) {
        if (res && res.ok) c.put(req, res.clone());
        return res;
      }).catch(function () { return guardado; });
      return guardado || red;
    });
  }));
});
