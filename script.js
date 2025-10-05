//buttons
// Variables globales
let scale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;

const mapViewport = document.getElementById('map-viewport');
const mapImage = document.getElementById('map-image');
const zoomLevel = document.getElementById('zoom-level');
const zoomSlider = document.getElementById('zoom-slider');
const loading = document.getElementById('loading');
const viewportIndicator = document.getElementById('viewport-indicator');

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
    // updateMinimap(); // Comenta esto si no tienes minimapa
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

// ===== OPENSEADRAGON CONFIGURATION =====
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
    if(id === "asteroids"){
        planet.style.userSelect = "none";
    planet.style.pointerEvents = "none";
        planet.draggable = false;
    }
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
}