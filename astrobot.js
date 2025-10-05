let viewer;

function getZoomedImageBase64() {
    if(viewer && viewer.drawer && viewer.drawer.canvas) {
        try {
            const base64Url = viewer.drawer.canvas.toDataURL('image/jpeg', 0.8);
            return base64Url;
        } catch (error) {
            console.error('Error getting canvas data:', error);
            return null;
        }
    }
    return null;
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
            base64_image: base64Data, 
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