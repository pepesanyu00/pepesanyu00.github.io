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

    // MODAL LOGIC
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal');
    const projectCards = document.querySelectorAll('.project-card');

    function openModal(card) {
        const title = card.querySelector('h3').textContent;
        const hiddenContent = card.querySelector('.hidden-content').innerHTML;
        const tags = card.querySelector('.tags').outerHTML;
        const date = card.querySelector('.project-date').textContent;

        modalTitle.textContent = title;
        
        // Construct modal body content
        let contentHTML = `
            <div style="margin-bottom: 20px; color: #666; font-weight: bold;">${date}</div>
            ${tags}
            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
            ${hiddenContent}
        `;
        
        modalBody.innerHTML = contentHTML;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    closeModalBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
