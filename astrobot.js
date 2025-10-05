async function getZoomedImageBase64() {
    try {
        if (!viewer) {
            console.log("Viewer no está inicializado");
            return null;
        }

        // Forzar redibujado
        viewer.forceRedraw();
        await new Promise(resolve => setTimeout(resolve, 200));

        const osdCanvas = viewer.drawer.canvas;
        
        if (!osdCanvas) {
            console.log("No se encontró el canvas del drawer");
            return null;
        }

        console.log("Canvas WebGL encontrado:", osdCanvas.width, "x", osdCanvas.height);

        // Crear un canvas 2D para capturar el contenido
        const captureCanvas = document.createElement('canvas');
        const ctx = captureCanvas.getContext('2d');
        
        captureCanvas.width = osdCanvas.width;
        captureCanvas.height = osdCanvas.height;

        // Dibujar fondo negro (para espacio)
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);

        // Intentar dibujar el canvas WebGL en el canvas 2D
        try {
            ctx.drawImage(osdCanvas, 0, 0);
            console.log("✅ Canvas WebGL dibujado en canvas 2D");
        } catch (error) {
            console.log("❌ No se pudo dibujar el canvas WebGL:", error.message);
            return captureFallback();
        }

        // Verificar si el canvas tiene contenido
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        console.log("Pixel (0,0):", imageData);

        const base64Url = captureCanvas.toDataURL('image/jpeg', 0.8);
        console.log("✅ Imagen capturada correctamente");
        return base64Url;
        
    } catch (error) {
        console.error('Error capturando imagen:', error);
        return null;
    }
}

// Fallback: Capturar usando el viewport bounds
function captureFallback() {
    try {
        console.log("Usando método fallback...");
        
        const container = document.getElementById('map-viewport');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Dibujar fondo negro para espacio
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Obtener información del viewport actual
        const viewport = viewer.viewport;
        const zoom = viewport.getZoom();
        const center = viewport.getCenter();
        
        console.log("Viewport - Zoom:", zoom, "Center:", center);
        
        // Aquí podrías dibujar elementos básicos basados en el estado del viewport
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Zoom: ${zoom.toFixed(2)}`, 10, 30);
        ctx.fillText(`Center: ${center.x.toFixed(2)}, ${center.y.toFixed(2)}`, 10, 60);
        ctx.fillText('Modo fallback - Imagen no disponible', 10, 90);
        
        const base64Url = canvas.toDataURL('image/jpeg', 0.8);
        console.log("✅ Fallback capturado");
        return base64Url;
        
    } catch (error) {
        console.error('Error en fallback:', error);
        return null;
    }
}

// Método alternativo: Usar WebGL readPixels (más avanzado)
function captureWebGL() {
    try {
        const osdCanvas = viewer.drawer.canvas;
        const gl = osdCanvas.getContext('webgl') || osdCanvas.getContext('experimental-webgl');
        
        if (!gl) {
            console.log("No se pudo obtener contexto WebGL");
            return null;
        }

        // Crear un canvas 2D para el resultado
        const captureCanvas = document.createElement('canvas');
        const ctx = captureCanvas.getContext('2d');
        captureCanvas.width = osdCanvas.width;
        captureCanvas.height = osdCanvas.height;

        // Leer los pixels de WebGL
        const pixels = new Uint8Array(osdCanvas.width * osdCanvas.height * 4);
        gl.readPixels(0, 0, osdCanvas.width, osdCanvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        // Crear ImageData y ponerlo en el canvas 2D
        const imageData = ctx.createImageData(osdCanvas.width, osdCanvas.height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);

        const base64Url = captureCanvas.toDataURL('image/jpeg', 0.8);
        console.log("✅ WebGL capturado via readPixels");
        return base64Url;

    } catch (error) {
        console.error('Error capturando WebGL:', error);
        return null;
    }
}

function analyzeCurrentView() {
    const base64Image = getZoomedImageBase64();
    const userQuestion = document.getElementById('user-question').value;
    const responseDiv = document.getElementById('ai-response');

    if (!base64Image) {
        responseDiv.innerHTML = "Error: No hay imagen visible para analizar.";
        return;
    }

    responseDiv.innerHTML = "Analizando con SpaceBot...";

    const API_URL = 'http://192.168.1.102:8000/Spacebot/spacebot-analyze';
    
    // 2. HACER LA PETICIÓN POST A TU API
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            base64_image: base64Image, 
            user_question: userQuestion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            responseDiv.innerHTML = `<p><strong>SpaceBot:</strong> ${data.description}</p>`; 
        } else {
            responseDiv.innerHTML = `<p style="color:red;">Error: ${data.detail}</p>`; 
        }
    })
    .catch(error => {
        responseDiv.innerHTML = `<p style="color:red;">Fallo de conexión. ¿Está la API de FastAPI corriendo?</p>`;
        console.error('Error de conexión:', error);
    });
}


async function testImageCapture() {
    const base64 = await getZoomedImageBase64();
    if (base64){
        console.log("URL: "+base64);
    }else{
        console.log("No");
    }
}

testImageCapture();