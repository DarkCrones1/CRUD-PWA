// Seleccionar elementos del DOM
const motorcycleGrid = document.getElementById('motorcycle-grid');
const motorcycleForm = document.getElementById('motorcycle-form');

// Función para cargar motos desde el servidor
async function loadMotorcycles() {
    try {
        const response = await fetch('http://localhost:5162/api/Moto');
        if (!response.ok) throw new Error('Error al obtener datos del servidor');

        const data = await response.json();
        const motorcycles = data.Data;
        displayMotorcycleCatalog(motorcycles);
    } catch (error) {
        console.error('Error al cargar motos:', error);
        motorcycleGrid.innerHTML = '<p>Error al cargar las motos. Verifique su conexión.</p>';
    }
}

// Mostrar motos en tarjetas
function displayMotorcycleCatalog(motorcycleData) {
    motorcycleGrid.innerHTML = ''; // Limpiar contenido

    motorcycleData.forEach((motorcycle) => {
        const card = document.createElement('div');
        card.classList.add('motorcycle-card');
        card.innerHTML = `
            <div class="motorcycle-card-content">
                <img src="${motorcycle.ImageUrl}" alt="${motorcycle.Name}" class="motorcycle-image">
                <h3>${motorcycle.Name}</h3>
                <p>Marca: ${motorcycle.Brand}</p>
                <p>Cilindrada: ${motorcycle.CubicCentimeters} cc</p>
                <p>Precio: $${motorcycle.Price.toLocaleString()}</p>
                <p>Estado: ${motorcycle.AvailableStatusName || 'No disponible'}</p>
                <p>Descripción: ${motorcycle.Description}</p>
            </div>
        `;
        motorcycleGrid.appendChild(card);
    });
}

// Guardar motos offline si no hay conexión
function saveMotorcycleOffline(motorcycle) {
    const unsynced = JSON.parse(localStorage.getItem('unsyncedMotorcycles')) || [];
    unsynced.push(motorcycle);
    localStorage.setItem('unsyncedMotorcycles', JSON.stringify(unsynced));
    alert('Moto guardada offline. Se sincronizará cuando haya conexión.');
}

// Añadir nueva moto
motorcycleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener datos del formulario
    const name = document.getElementById('name-input').value;
    const description = document.getElementById('description-input').value;
    const brand = document.getElementById('brand-input').value;
    const cc = parseInt(document.getElementById('cc-input').value, 10);
    const price = parseFloat(document.getElementById('price-input').value);
    const imageUrl = document.getElementById('image-url-input').value;

    const newMotorcycle = { Name: name, Description: description, Brand: brand, CubicCentimeters: cc, Price: price, ImageUrl: imageUrl };

    try {
        const response = await fetch('http://localhost:5162/api/Moto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMotorcycle),
        });

        if (!response.ok) throw new Error('Error al enviar los datos al servidor');

        console.log('Moto añadida con éxito');
        loadMotorcycles();
        motorcycleForm.reset();
    } catch (error) {
        console.error('Error al añadir moto:', error);
        saveMotorcycleOffline(newMotorcycle);
        motorcycleForm.reset();
    }
});

// Registrar Service Worker
if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        console.log('Service Worker registrado');
        if (navigator.onLine) reg.sync.register('sync-motorcycles');
    });
}

// Función para verificar conexión y sincronizar motos
async function checkConnectionAndSync() {
    if (navigator.onLine) {
        console.log('Conexión restaurada. Intentando sincronizar motos.');
        await syncMotorcycles(); // Intentar sincronizar si hay motos sin sincronizar
    } else {
        console.log('Sin conexión a internet.');
    }
}

// Detectar cambio en el estado de conexión (online/offline)
window.addEventListener('online', checkConnectionAndSync);
window.addEventListener('offline', () => {
    console.log('Modo offline. Los datos se guardarán localmente.');
});

// Función para sincronizar motos manualmente
async function syncMotorcycles() {
    const unsyncedMotorcycles = JSON.parse(localStorage.getItem('unsyncedMotorcycles')) || [];
    if (unsyncedMotorcycles.length === 0) {
        console.log('No hay motos sin sincronizar.');
        return;
    }

    try {
        for (const motorcycle of unsyncedMotorcycles) {
            const response = await fetch('http://localhost:5162/api/Moto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(motorcycle),
            });

            if (response.ok) {
                console.log(`Moto sincronizada: ${motorcycle.Name}`);
            } else {
                console.error(`Error al sincronizar moto: ${motorcycle.Name}`);
                throw new Error('Error al sincronizar moto');
            }
        }

        // Limpiar datos offline una vez sincronizados
        localStorage.setItem('unsyncedMotorcycles', JSON.stringify([]));
    } catch (error) {
        console.error('Error al sincronizar motos:', error);
    }
}

// Intentar sincronizar si la página se carga y hay conexión
document.addEventListener('DOMContentLoaded', () => {
    if (navigator.onLine) {
        checkConnectionAndSync(); // Verificar la conexión y sincronizar si es posible
    }
});


// Cargar motos al iniciar la página
loadMotorcycles();
