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
              '/images/icon-512.png',
          ]);
      })
  );
  console.log('Service Worker instalado.');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-motorcycles') {
      event.waitUntil(syncMotorcycles());
  }
});

async function syncMotorcycles() {
  const unsyncedMotorcycles = JSON.parse(localStorage.getItem('unsyncedMotorcycles')) || [];
  if (unsyncedMotorcycles.length === 0) return;

  try {
      for (const motorcycle of unsyncedMotorcycles) {
          await fetch('http://localhost:5162/api/Moto', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(motorcycle),
          });
      }
      console.log('Motos sincronizadas con éxito.');
      localStorage.setItem('unsyncedMotorcycles', JSON.stringify([])); // Limpiar datos offline
  } catch (error) {
      console.error('Error al sincronizar motos:', error);
  }
}

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/icon-512.png',
  });
});
