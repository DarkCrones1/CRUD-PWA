// Seleccionar el contenedor donde se mostrarán las tarjetas
const motorcycleGrid = document.getElementById('motorcycle-grid');

// Función para cargar motos desde localStorage
function loadMotorcycles() {
    const motorcycles = JSON.parse(localStorage.getItem('motorcycles')) || [];
    displayMotorcycleCatalog(motorcycles);
}

// Mostrar motos en tarjetas
function displayMotorcycleCatalog(motorcycleData) {
    motorcycleGrid.innerHTML = ''; // Limpiar la grilla actual

    motorcycleData.forEach((motorcycleObj, index) => {
        const card = document.createElement('div');
        card.classList.add('anime-card'); // Reutilizando la clase CSS

        // Crear el contenido de la tarjeta para cada moto
        card.innerHTML = `
            <div class="anime-card-content">
                <h3>${motorcycleObj.name}</h3>
                <p>Marca: ${motorcycleObj.brand}</p>
                <p>Cilindrada: ${motorcycleObj.cc} cc</p>
                <p>Precio: $${motorcycleObj.price}</p>
                <button onclick="deleteMotorcycle(${index})">Eliminar</button>
            </div>
        `;

        // Agregar la tarjeta al contenedor
        motorcycleGrid.appendChild(card);
    });
}

// Seleccionar el formulario del DOM
const motorcycleForm = document.getElementById('motorcycle-form');

// Función para añadir una nueva moto al catálogo
motorcycleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('name-input').value;
    const brand = document.getElementById('brand-input').value;
    const cc = document.getElementById('cc-input').value;
    const price = document.getElementById('price-input').value;

    // Crear un objeto con los datos de la nueva moto
    const newMotorcycle = { name, brand, cc, price };

    // Obtener motos existentes y añadir la nueva
    const motorcycles = JSON.parse(localStorage.getItem('motorcycles')) || [];
    motorcycles.push(newMotorcycle);
    localStorage.setItem('motorcycles', JSON.stringify(motorcycles));

    // Refrescar la lista de motos después de añadir
    loadMotorcycles();

    // Limpiar el formulario
    motorcycleForm.reset();
});

// Función para eliminar una moto del catálogo
function deleteMotorcycle(index) {
    const motorcycles = JSON.parse(localStorage.getItem('motorcycles')) || [];
    motorcycles.splice(index, 1); // Eliminar la moto en la posición del índice
    localStorage.setItem('motorcycles', JSON.stringify(motorcycles)); // Actualizar localStorage
    loadMotorcycles(); // Refrescar la lista de motos
}

// Cargar las motos al iniciar la página
loadMotorcycles();
