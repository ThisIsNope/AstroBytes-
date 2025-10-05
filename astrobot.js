let viewer;

function getZoomedImageBase64() {
    if(viewer){
        const base64Url = viewer.drawer.canvas.toDataURL('image/jpg',0.8);
        return base64Url;
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

    const API_URL = 'http://10.50.0.178 :8000/Spacebot/spacebot-analyze';
    
    // 2. HACER LA PETICIÓN POST A TU API
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // Quitamos el prefijo 'data:image/jpeg;base64,' ya que tu función Python lo maneja
            base64_image: base64Image, 
            user_question: userQuestion
        })
    })
    .then(response => response.json())
    .then(data => {
        // 3. MOSTRAR LA RESPUESTA
        if (data.status === 'success') {
            responseDiv.innerHTML = <p><strong>SpaceBot:</strong> ${data.description}</p>; 
        } else {
            responseDiv.innerHTML = <p style="color:red;">Error: ${data.detail}</p>; 
        }
    })
    .catch(error => {
        responseDiv.innerHTML = <p style="color:red;">Fallo de conexión. ¿Está la API de FastAPI corriendo?</p>;
        console.error('Error de conexión:', error);
    });
}