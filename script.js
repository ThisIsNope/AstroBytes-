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
document.getElementById('pan-up').addEventListener('click', () => pan(0, 100));
document.getElementById('pan-down').addEventListener('click', () => pan(0, -100));
document.getElementById('pan-left').addEventListener('click', () => pan(100, 0));
document.getElementById('pan-right').addEventListener('click', () => pan(-100, 0));

// Funciones de zoom
function zoom(factor) {
    scale *= factor;
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

function updateZoom() {
    mapViewport.style.transform = `translate(-50%, -50%) scale(${scale}) translate(${posX}px, ${posY}px)`;
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    zoomSlider.value = Math.round(scale * 100);
    updateMinimap();
}

// Funciones de pan (movimiento)
function pan(deltaX, deltaY) {
    posX += deltaX / scale;
    posY += deltaY / scale;
    updateZoom();
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
// Fecha de la imagen que quieres ver (YYYY-MM-DD)
const fecha = "2025-10-04";

// Crear el visor
var viewer = OpenSeadragon({
    id: "openseadragon",
    prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",
    showNavigator: true,
    tileSources: {
        type: "tilemapservice",
        width: 16384,  // tamaño máximo (puede variar según dataset)
        height: 8192,
        tileSize: 512,
        minLevel: 0,
        maxLevel: 8,
        getTileUrl: function (level, x, y) {
            return `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${fecha}/250m/${level}/${y}/${x}.jpg`;
        }
    }
});