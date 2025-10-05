//buttons
// Variables globales
let scale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;
let planetsData = {};
let currentOpenModal = null;

const mapViewport = document.getElementById('map-viewport');
const mapImage = document.getElementById('map-image');
const zoomLevel = document.getElementById('zoom-level');
const zoomSlider = document.getElementById('zoom-slider');
const loading = document.getElementById('loading');
const viewportIndicator = document.getElementById('viewport-indicator');

// CREAR CONTENEDOR DE MODALES SI NO EXISTE
if (!document.getElementById('planet-modals')) {
    const modalsContainer = document.createElement('div');
    modalsContainer.id = 'planet-modals';
    modalsContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(modalsContainer);
}
const planetModalsContainer = document.getElementById('planet-modals');

// Mapeo de nombres en inglés a los IDs que usas en el HTML
const planetIdMap = {
    'Sun': 'sun',
    'Mercury': 'mercury',
    'Venus': 'venus',
    'Earth': 'earth',
    'Mars': 'mars',
    'Jupiter': 'jupiter',
    'Saturn': 'saturn',
    'Uranus': 'uranus',
    'Neptune': 'neptune'
};

// Cargar datos de planetas al inicio
fetch('planetData.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Convertir el array a un objeto con los IDs correctos
        planetsData = {};
        data.forEach(planet => {
            const planetId = planetIdMap[planet.name];
            if (planetId) {
                planetsData[planetId] = {
                    name: planet.name,
                    description: createDescriptionFromData(planet),
                    modalSize: getModalSize(planetId),
                    gifSrc: 'Eduardo/gifs/modal_click_btn.gif'
                };
            }
        });

        createPlanetModals();
        console.log('Planets data loaded successfully', planetsData);
    })
    .catch(error => {
        console.error('Error loading planets data:', error);
        // Datos de fallback
        planetsData = getFallbackPlanetData();
        createPlanetModals();
    });

// Función para crear descripción desde tus datos
function createDescriptionFromData(planet) {
    return `
        <strong>Tipo:</strong> ${planet.type}<br>
        <strong>Edad:</strong> ${planet.age}<br>
        <strong>Diámetro:</strong> ${planet.characteristics.diameter}<br>
        <strong>Temperatura:</strong> ${planet.characteristics.surface_temperature}<br>
        <strong>Composición:</strong> ${planet.characteristics.composition}<br>
        <strong>Período orbital:</strong> ${planet.characteristics.orbital_period || 'N/A'}<br>
        <br>
        <strong>Historia:</strong> ${planet.history.formation.description}
    `;
}

// Función para determinar tamaño del modal
function getModalSize(planetId) {
    const sizes = {
        'sun': 'w-96 h-80',
        'jupiter': 'w-96 h-84',
        'saturn': 'w-96 h-84',
        'earth': 'w-88 h-80',
        'venus': 'w-84 h-76',
        'uranus': 'w-88 h-80',
        'neptune': 'w-88 h-80',
        'mars': 'w-80 h-72',
        'mercury': 'w-80 h-72'
    };
    return sizes[planetId] || 'w-80 h-72';
}

// Datos de fallback
function getFallbackPlanetData() {
    return {
        sun: {
            name: "Sun",
            description: `
                <strong>Tipo:</strong> Star<br>
                <strong>Edad:</strong> 4.6 billion years<br>
                <strong>Diámetro:</strong> 1.39 million km<br>
                <strong>Temperatura superficial:</strong> 5,500 °C<br>
                <strong>Temperatura del núcleo:</strong> 15 million °C<br>
                <strong>Composición:</strong> 74% hydrogen, 24% helium, 2% heavier elements<br>
                <br>
                <strong>Historia - Formación:</strong> The Sun formed about 4.6 billion years ago from the gravitational collapse of a region within a large molecular cloud composed mainly of hydrogen and helium.<br>
                <br>
                <strong>Fase Actual:</strong> The Sun is currently in the main sequence stage of its life cycle, where it fuses hydrogen into helium in its core, producing light and heat.<br>
                <br>
                <strong>Futuro:</strong> In about 5 billion years, the Sun will exhaust hydrogen in its core and expand into a red giant, engulfing the inner planets. After shedding its outer layers, the Sun will become a white dwarf and slowly cool over billions of years.
            `,
            modalSize: "w-96 h-80",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        mercury: {
            name: "Mercury",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 4,879 km<br>
                <strong>Temperatura superficial:</strong> -173 °C to 427 °C<br>
                <strong>Período orbital:</strong> 88 days<br>
                <strong>Composición:</strong> Iron core with rocky mantle<br>
                <strong>Lunas:</strong> None<br>
                <br>
                <strong>Historia:</strong> Mercury formed as one of the rocky inner planets, composed mostly of metals and silicate rock.
            `,
            modalSize: "w-80 h-72",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        venus: {
            name: "Venus",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 12,104 km<br>
                <strong>Temperatura superficial:</strong> 465 °C<br>
                <strong>Período orbital:</strong> 225 days<br>
                <strong>Composición:</strong> Rocky planet with dense carbon dioxide atmosphere<br>
                <strong>Lunas:</strong> None<br>
                <br>
                <strong>Historia:</strong> Venus formed as a rocky planet and underwent a runaway greenhouse effect that made its surface extremely hot.
            `,
            modalSize: "w-84 h-76",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        earth: {
            name: "Earth",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 12,742 km<br>
                <strong>Temperatura superficial:</strong> -89 °C to 58 °C<br>
                <strong>Período orbital:</strong> 365 days<br>
                <strong>Composición:</strong> Iron core, silicate mantle and crust<br>
                <strong>Lunas:</strong> Moon<br>
                <br>
                <strong>Historia:</strong> Earth formed from accretion of dust and rocks, later developing oceans and life-supporting atmosphere.
            `,
            modalSize: "w-88 h-80",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        mars: {
            name: "Mars",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 6,779 km<br>
                <strong>Temperatura superficial:</strong> -125 °C to 20 °C<br>
                <strong>Período orbital:</strong> 687 days<br>
                <strong>Composición:</strong> Rocky planet with thin CO2 atmosphere<br>
                <strong>Lunas:</strong> Phobos, Deimos<br>
                <br>
                <strong>Historia:</strong> Mars formed as a rocky planet, with evidence suggesting it once had liquid water and possibly habitable conditions.
            `,
            modalSize: "w-80 h-72",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        jupiter: {
            name: "Jupiter",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 139,820 km<br>
                <strong>Temperatura superficial:</strong> -108 °C<br>
                <strong>Período orbital:</strong> 12 years<br>
                <strong>Composición:</strong> Mostly hydrogen and helium<br>
                <strong>Lunas:</strong> Io, Europa, Ganymede, Callisto<br>
                <br>
                <strong>Historia:</strong> Jupiter formed from the rapid accumulation of gas around a rocky and icy core, becoming the largest planet.
            `,
            modalSize: "w-96 h-84",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        saturn: {
            name: "Saturn",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 116,460 km<br>
                <strong>Temperatura superficial:</strong> -139 °C<br>
                <strong>Período orbital:</strong> 29 years<br>
                <strong>Composición:</strong> Hydrogen and helium<br>
                <strong>Lunas:</strong> Titan, Enceladus, Rhea, Iapetus, Mimas<br>
                <br>
                <strong>Historia:</strong> Saturn formed alongside Jupiter, accumulating massive amounts of hydrogen and helium, with its iconic ring system forming later.
            `,
            modalSize: "w-96 h-84",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        uranus: {
            name: "Uranus",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 50,724 km<br>
                <strong>Temperatura superficial:</strong> -224 °C<br>
                <strong>Período orbital:</strong> 84 years<br>
                <strong>Composición:</strong> Hydrogen, helium, water, ammonia, methane<br>
                <strong>Lunas:</strong> Miranda, Ariel, Umbriel, Titania, Oberon<br>
                <br>
                <strong>Historia:</strong> Uranus formed with icy materials and gases, and its tilted axis may have been caused by a massive collision.
            `,
            modalSize: "w-88 h-80",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        },
        neptune: {
            name: "Neptune",
            description: `
                <strong>Tipo:</strong> Planet<br>
                <strong>Edad:</strong> 4.5 billion years<br>
                <strong>Diámetro:</strong> 49,244 km<br>
                <strong>Temperatura superficial:</strong> -214 °C<br>
                <strong>Período orbital:</strong> 165 years<br>
                <strong>Composición:</strong> Hydrogen, helium, methane, ices<br>
                <strong>Lunas:</strong> Triton, Proteus, Nereid<br>
                <br>
                <strong>Historia:</strong> Neptune formed as an ice giant with a thick atmosphere rich in hydrogen, helium, and methane.
            `,
            modalSize: "w-88 h-80",
            gifSrc: "Eduardo/gifs/modal_click_btn.gif"
        }
    };
}

// Crear modales dinámicamente
function createPlanetModals() {
    if (!planetModalsContainer) {
        console.error('planetModalsContainer not found');
        return;
    }

    // Limpiar contenedor primero
    planetModalsContainer.innerHTML = '';

    for (const planetId in planetsData) {
        const planet = planetsData[planetId];
        const modal = document.createElement('div');
        modal.id = `modal-${planetId}`;
        modal.className = `fixed hidden ${planet.modalSize} bg-white rounded-lg shadow-xl border-2 border-yellow-400 pointer-events-auto z-50`;
        modal.innerHTML = `
            <div class="relative h-full flex flex-col">
                <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md" onclick="closeModal('${planetId}')">
                    ×
                </button>
                <div class="h-1/3 bg-cover bg-center rounded-t-lg flex-shrink-0" style="background-image: url('${planet.gifSrc}')"></div>
                <div class="flex-1 p-4 overflow-y-auto">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${planet.name}</h3>
                    <div class="text-gray-600 text-sm leading-relaxed">${planet.description}</div>
                </div>
            </div>
        `;
        planetModalsContainer.appendChild(modal);
    }
}

// Función para mostrar modal
function showModal(planetId) {
    console.log('Mostrando modal para:', planetId);

    // Cerrar modal actual si hay uno abierto
    if (currentOpenModal) {
        closeModal(currentOpenModal);
    }

    const modal = document.getElementById(`modal-${planetId}`);
    if (modal) {
        modal.classList.remove('hidden');
        currentOpenModal = planetId;

        // Posicionamiento responsive
        positionModal(modal);
    } else {
        console.error('Modal no encontrado:', `modal-${planetId}`);
    }
}

// Función auxiliar para posicionamiento responsive
function positionModal(modal) {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        // Para móvil: centrado en la parte inferior
        modal.style.left = '50%';
        modal.style.top = 'auto';
        modal.style.bottom = '20px';
        modal.style.transform = 'translateX(-50%)';
        modal.style.maxWidth = '90vw';
        modal.style.maxHeight = '60vh';
    } else {
        // Para desktop: lado derecho, centrado verticalmente
        modal.style.left = 'auto';
        modal.style.right = '20px';
        modal.style.top = '50%';
        modal.style.bottom = 'auto';
        modal.style.transform = 'translateY(-50%)';
        modal.style.maxWidth = '400px';
        modal.style.maxHeight = '80vh';
    }
}

// Función para cerrar modal
function closeModal(planetId) {
    const modal = document.getElementById(`modal-${planetId}`);
    if (modal) {
        modal.classList.add('hidden');
        if (currentOpenModal === planetId) {
            currentOpenModal = null;
        }
    }
}

// Función para manejar clicks en planetas
function handlePlanetClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const planetId = this.id;
    console.log('Click en planeta:', planetId);
    showModal(planetId);
}

// Controles de zoom
document.getElementById('zoom-in').addEventListener('click', () => zoom(1.2));
document.getElementById('zoom-out').addEventListener('click', () => zoom(0.8));
document.getElementById('reset').addEventListener('click', resetZoom);
zoomSlider.addEventListener('input', () => {
    const newScale = zoomSlider.value / 100;
    zoomTo(newScale);
});

// Controles de navegación
document.getElementById('pan-down').addEventListener('click', () => pan(0, 100));
document.getElementById('pan-up').addEventListener('click', () => pan(0, -100));
document.getElementById('pan-right').addEventListener('click', () => pan(100, 0));
document.getElementById('pan-left').addEventListener('click', () => pan(-100, 0));

// Funciones de zoom
function zoom(factor) {
    scale *= factor;
    if (scale <= 1) {
        scale = 1;
    }
    updateZoom();
}

function zoomTo(newScale) {
    scale = newScale;
    updateZoom();
}

function resetZoom() {
    scale = 1;
    posX = 0;
    posY = 0;
    updateZoom();
}

function pan(deltaX, deltaY) {
    // Calcular los límites basados en el zoom actual
    const container = document.getElementById('map-viewport');

    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Para OpenSeadragon, estimamos el tamaño de la imagen basado en el zoom
    // Cuando scale = 1, la imagen ocupa todo el contenedor
    const imgWidth = containerWidth * scale;
    const imgHeight = containerHeight * scale;

    // Calcular los límites máximos de movimiento
    // Los límites son más restrictivos para evitar que se salga
    const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
    const maxY = Math.max(0, (imgHeight - containerHeight) / 2);

    // Aplicar el movimiento (invertimos la dirección para que sea intuitivo)
    let newPosX = posX - deltaX / scale;
    let newPosY = posY - deltaY / scale;

    // Limitar el movimiento para que no se salga de la imagen
    // Límites más estrictos
    if (imgWidth > containerWidth) {
        newPosX = Math.max(-maxX, Math.min(maxX, newPosX));
    } else {
        newPosX = 0; // Si la imagen es más pequeña, mantener centrada
    }

    // Límites arriba/abajo
    if (imgHeight > containerHeight) {
        newPosY = Math.max(-maxY, Math.min(maxY, newPosY));
    } else {
        newPosY = 0; // Si la imagen es más pequeña, mantener centrada
    }

    posX = newPosX;
    posY = newPosY;
    updateZoom();
}

function updateZoom() {
    // Buscar el elemento interno de OpenSeadragon que contiene la imagen
    const seadragonContainer = document.querySelector('#map-viewport');
    const canvas = document.querySelector('#map-viewport');

    // Aplicar la transformación al canvas de OpenSeadragon si existe
    if (canvas) {
        canvas.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
    }
    // Si no hay canvas, aplicar al contenedor como fallback
    else if (seadragonContainer) {
        seadragonContainer.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
    }
    // Último fallback: aplicar al contenedor principal
    else {
        mapViewport.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
    }

    zoomLevel.textContent = Math.round(scale * 100) + '%';
    zoomSlider.value = Math.round(scale * 100);
}

window.addEventListener('load', () => {
    updateZoom();
});

//Screenshot
document.getElementById('screenshot-btn').addEventListener('click', function () {
    html2canvas(document.body).then(function (canvas) {
        //descarga
        var link = document.createElement('a');
        link.download = 'captura.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

//SideBar
const sidebarWidth = "250px";
function openNav() {
    document.getElementById("mainContent").style.marginLeft = sidebarWidth;
    document.getElementById("mySidebar").style.width = sidebarWidth;
    document.getElementById("open-btn").style.left = "260px";
}

function closeNav() {
    document.getElementById("mainContent").style.marginLeft = "10px";
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("open-btn").style.left = "0px";
}

//openseadragon
var viewer = OpenSeadragon({
    id: "map-viewport",
    prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",
    tileSources: "Eduardo/tiles/space.dzi",
    defaultZoomLevel: 1,
    minZoomLevel: 1,
    maxZoomLevel: 200,
    visibilityRatio: 1.0,
    constrainDuringPan: true,
    zoomPerScroll: 1,
    zoomPerClick: 1,
    mouseNavEnabled: false,
    showNavigationControl: false
});

// Agregar planetas como overlays
viewer.addHandler("open", function () {
    addPlanetOverlay("asteroids", "Eduardo/tiles/asteroids.png", 0.59, 0.52, 0, 0.05);
    addPlanetOverlay("sun", "Eduardo/tiles/sunHD.png", 0.13, 0.2, 0, 0);
    addPlanetOverlay("mercury", "Eduardo/tiles/mercury.png", 0.01, 0.015, -0.05, -0.1);
    addPlanetOverlay("venus", "Eduardo/tiles/venus.png", 0.018, 0.028, -0.09, .1);
    addPlanetOverlay("earth", "Eduardo/tiles/earth.png", 0.025, 0.038, 0.11, .15);
    addPlanetOverlay("mars", "Eduardo/tiles/mars.png", 0.025, 0.039, 0.2, .11);
    addPlanetOverlay("jupiter", "Eduardo/tiles/jupiter.png", 0.10, 0.15, 0.28, -0.20);
    addPlanetOverlay("saturn", "Eduardo/tiles/saturn.png", 0.10, 0.15, -0.35, -0.25);
    addPlanetOverlay("uranus", "Eduardo/tiles/uranus.png", 0.05, 0.12, -0.40, 0.25);
    addPlanetOverlay("neptune", "Eduardo/tiles/neptune.png", 0.05, 0.08, 0.45, 0.32);
});

function addPlanetOverlay(id, src, widthRatio, heightRatio, offsetX, offsetY) {
    var planet = document.createElement("img");
    planet.src = src;
    planet.id = id;

    // HACER LOS PLANETAS CLICKEABLES
    if (id === "asteroids") {
        planet.style.userSelect = "none";
        planet.style.pointerEvents = "none";
        planet.draggable = false;
    } else {
        // Planetas normales: hacerlos clickeables
        planet.style.pointerEvents = "auto";
        planet.style.cursor = "pointer";
    }

    planet.draggable = false;
    planet.loading = "lazy";
    planet.className = "planet-overlay";

    var tiledImage = viewer.world.getItemAt(0);
    var bounds = tiledImage.getBounds();

    var centerX = bounds.x + bounds.width / 2;
    var centerY = bounds.y + bounds.height / 2;

    viewer.addOverlay({
        element: planet,
        location: new OpenSeadragon.Rect(
            centerX - bounds.width * (widthRatio / 2) + (bounds.width * offsetX),
            centerY - bounds.height * (heightRatio / 2) + (bounds.height * offsetY),
            bounds.width * widthRatio,
            bounds.height * heightRatio
        )
    });

    // AGREGAR EVENTO CLICK DIRECTAMENTE AL PLANETA
    if (id !== "asteroids") {
        planet.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Click en planeta:', id);
            showModal(id);
        });
    }
}

// Event listeners globales para cerrar modales
document.addEventListener('click', function (e) {
    // Cerrar modal si se hace click fuera de él
    if (currentOpenModal && !e.target.closest(`#modal-${currentOpenModal}`)) {
        closeModal(currentOpenModal);
    }
});

document.addEventListener('keydown', function (e) {
    // Cerrar modal con ESC
    if (e.key === 'Escape' && currentOpenModal) {
        closeModal(currentOpenModal);
    }
});