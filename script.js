document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // AI Chat Simulation
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    const knowledgeBase = {
        "hola": "¡Hola! Soy el asistente virtual de este portafolio. ¿En qué puedo ayudarte?",
        "quien eres": "Soy una IA simulada diseñada para ayudarte a navegar por este portafolio.",
        "proyectos": "Puedes ver los proyectos de investigación en la sección 'Investigación' más arriba. ¡Son muy interesantes!",
        "contacto": "Puedes contactar a través de las redes sociales listadas en el pie de página o en la sección de inicio.",
        "aficiones": "Al investigador le encanta el senderismo, la fotografía y la ciencia ficción.",
        "default": "Interesante pregunta. Como soy una IA en entrenamiento, te sugiero explorar la web para encontrar esa respuesta o contactar directamente al autor."
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const textP = document.createElement('p');
        textP.textContent = text;
        
        messageDiv.appendChild(textP);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleChat() {
        const text = chatInput.value.trim().toLowerCase();
        if (!text) return;

        addMessage(chatInput.value, 'user');
        chatInput.value = '';

        // Simulate AI thinking delay
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot', 'loading');
        loadingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            chatMessages.removeChild(loadingDiv);
            
            let response = knowledgeBase["default"];
            
            // Simple keyword matching
            for (const key in knowledgeBase) {
                if (text.includes(key)) {
                    response = knowledgeBase[key];
                    break;
                }
            }
            
            addMessage(response, 'bot');
        }, 1500);
    }

    chatSend.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
});
