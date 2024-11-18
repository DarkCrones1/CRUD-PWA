self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open('v1').then((cache) => {
          return cache.addAll([
              '/',
              '/index.html',
              '/css/style.css',
              '/js/app.js',
              '/manifest.json',
              '/images/icon.png',
              '/images/icon-512.png'
          ]);
      })
  );
  console.log('Service Worker installed.');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          return response || fetch(event.request);
      })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-motorcycles') {
      event.waitUntil(syncMotorcycles());
  }
});

async function syncMotorcycles() {
  const unsyncedMotorcycles = JSON.parse(localStorage.getItem('unsyncedMotorcycles')) || [];
  // Simula el envío de datos al servidor
  console.log('Sincronizando motos:', unsyncedMotorcycles);
  // Una vez sincronizados, limpiar los datos offline
  localStorage.setItem('unsyncedMotorcycles', JSON.stringify([]));
}

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/icon-512.png',
  });
});
