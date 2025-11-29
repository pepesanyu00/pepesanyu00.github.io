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

    // LANGUAGE SWITCHER
    const langToggle = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = 'en';

    const translations = {
        en: {
            nav_research: "Research",
            nav_conferences: "Conferences",
            nav_hobbies: "Hobbies",
            nav_ai: "AI Twin",
            hero_tagline: "PhD student at the University of Málaga",
            hero_bio: "PhD Researcher focused on Machine Learning optimization and High-Performance Computing. Specialized in developing efficient solutions of ML models on RISC-V architectures and parallel algorithms. Passionate about bridging the gap between state-of-the-art research and real-world systems to build functional, scalable, and high-performance products.",
            section_research: "Research Experience",
            p1_date: "2024 - Present",
            p1_title: "Anomaly Detection with Deep Learning",
            p1_desc: "Development of a novel Transformer-based architecture for anomaly detection in industrial sensor time series.",
            btn_details: "View Details",
            modal_desc_title: "Detailed Description",
            p1_modal_desc: "This project focuses on creating robust Deep Learning models capable of identifying anomalous patterns in massive data streams from IoT sensors in industrial environments.",
            modal_method_title: "Methodology",
            p1_modal_li1: "Time series preprocessing using sliding window techniques and adaptive normalization.",
            p1_modal_li2: "Implementation of a modified Transformer architecture with sparse attention mechanisms to improve computational efficiency.",
            p1_modal_li3: "Unsupervised training using an error reconstruction approach.",
            modal_results_title: "Results",
            p1_modal_results: "The proposed model outperformed traditional baselines (LSTM, Autoencoders) by 15% in terms of F1-Score on the public SWaT dataset.",
            btn_paper: "View Paper",
            btn_repo: "GitHub Repo",
            p2_title: "Genetic Algorithms Optimization",
            p2_desc: "Comparative study on the efficiency of evolutionary algorithms in large-scale combinatorial optimization problems.",
            p2_modal_desc: "Research on how to parallelize genetic algorithms using OpenMP and MPI to solve the Traveling Salesman Problem (TSP) with millions of cities.",
            modal_contrib_title: "Contributions",
            p2_modal_li1: "Design of a new crossover operator that better preserves optimal substructures.",
            p2_modal_li2: "Hybrid CPU-GPU implementation to accelerate fitness function evaluation.",
            p3_title: "Contextual Recommendation System",
            p3_desc: "Implementation of a hybrid recommendation system for e-learning platforms, integrating collaborative and content-based filtering.",
            p3_modal_desc: "Development of a recommendation engine for an educational platform with over 10,000 active users.",
            modal_tech_title: "Technologies",
            p3_modal_tech: "Matrix Factorization was used for collaborative filtering and NLP (TF-IDF) for course content analysis.",
            section_conferences: "Conferences & Summer Schools",
            conf1_date: "Jul 2024",
            conf1_loc: "Vienna, Austria - Attendee & Poster Presenter",
            conf2_date: "Aug 2023",
            conf2_loc: "Montreal, Canada - Scholarship Recipient",
            conf3_date: "Nov 2022",
            conf3_loc: "New Orleans, USA - Virtual Attendee",
            section_hobbies: "Beyond the Lab",
            hobby1_title: "Photography",
            hobby1_desc: "Capturing urban landscapes and nature during my travels.",
            hobby2_title: "Hiking",
            hobby2_desc: "Disconnecting in the mountains every weekend.",
            hobby3_title: "Sci-Fi",
            hobby3_desc: "Avid reader of Asimov, Philip K. Dick, and Ursula K. Le Guin.",
            section_ai: "Ask My Digital Twin",
            ai_subtitle: "An experimental AI-powered interface (simulated) to answer your questions about my profile.",
            ai_welcome: "Hello! I am [Your Name]'s virtual assistant. Ask me about my projects, contact info, or hobbies."
        },
        es: {
            nav_research: "Investigación",
            nav_conferences: "Congresos",
            nav_hobbies: "Aficiones",
            nav_ai: "Gemelo IA",
            hero_tagline: "Estudiante de Doctorado en la Universidad de Málaga",
            hero_bio: "Investigador de doctorado enfocado en la optimización de Machine Learning y Computación de Alto Rendimiento. Especializado en desarrollar soluciones eficientes de modelos de ML en arquitecturas RISC-V y algoritmos paralelos. Apasionado por cerrar la brecha entre la investigación de vanguardia y los sistemas del mundo real para construir productos funcionales, escalables y de alto rendimiento.",
            section_research: "Experiencia en Investigación",
            p1_date: "2024 - Presente",
            p1_title: "Detección de Anomalías con Deep Learning",
            p1_desc: "Desarrollo de una arquitectura novedosa basada en Transformers para la detección de anomalías en series temporales de sensores industriales.",
            btn_details: "Ver Detalles",
            modal_desc_title: "Descripción Detallada",
            p1_modal_desc: "Este proyecto se centra en la creación de modelos robustos de Deep Learning capaces de identificar patrones anómalos en flujos de datos masivos provenientes de sensores IoT en entornos industriales.",
            modal_method_title: "Metodología",
            p1_modal_li1: "Preprocesamiento de series temporales utilizando técnicas de ventana deslizante y normalización adaptativa.",
            p1_modal_li2: "Implementación de una arquitectura Transformer modificada con mecanismos de atención dispersa para mejorar la eficiencia computacional.",
            p1_modal_li3: "Entrenamiento no supervisado utilizando un enfoque de reconstrucción de errores.",
            modal_results_title: "Resultados",
            p1_modal_results: "El modelo propuesto superó a los baselines tradicionales (LSTM, Autoencoders) en un 15% en términos de F1-Score en el dataset público SWaT.",
            btn_paper: "Ver Paper",
            btn_repo: "Repositorio GitHub",
            p2_title: "Optimización de Algoritmos Genéticos",
            p2_desc: "Estudio comparativo sobre la eficiencia de algoritmos evolutivos en problemas de optimización combinatoria a gran escala.",
            p2_modal_desc: "Investigación sobre cómo paralelizar algoritmos genéticos utilizando OpenMP y MPI para resolver el problema del viajante de comercio (TSP) con millones de ciudades.",
            modal_contrib_title: "Contribuciones",
            p2_modal_li1: "Diseño de un nuevo operador de cruce que preserva mejor las subestructuras óptimas.",
            p2_modal_li2: "Implementación híbrida CPU-GPU para acelerar la evaluación de la función de fitness.",
            p3_title: "Sistema de Recomendación Contextual",
            p3_desc: "Implementación de un sistema híbrido de recomendación para plataformas de e-learning, integrando filtrado colaborativo y basado en contenido.",
            p3_modal_desc: "Desarrollo de un motor de recomendación para una plataforma educativa con más de 10,000 usuarios activos.",
            modal_tech_title: "Tecnologías",
            p3_modal_tech: "Se utilizó Matrix Factorization para el filtrado colaborativo y NLP (TF-IDF) para el análisis de contenido de los cursos.",
            section_conferences: "Congresos & Summer Schools",
            conf1_date: "Jul 2024",
            conf1_loc: "Viena, Austria - Asistente & Presentador de Poster",
            conf2_date: "Ago 2023",
            conf2_loc: "Montreal, Canadá - Becado",
            conf3_date: "Nov 2022",
            conf3_loc: "New Orleans, USA - Asistente Virtual",
            section_hobbies: "Fuera del Laboratorio",
            hobby1_title: "Fotografía",
            hobby1_desc: "Capturando paisajes urbanos y naturaleza en mis viajes.",
            hobby2_title: "Senderismo",
            hobby2_desc: "Desconectando en la montaña cada fin de semana.",
            hobby3_title: "Ciencia Ficción",
            hobby3_desc: "Ávido lector de Asimov, Philip K. Dick y Ursula K. Le Guin.",
            section_ai: "Pregunta a mi Gemelo Digital",
            ai_subtitle: "Una interfaz experimental impulsada por IA (simulada) para responder tus dudas sobre mi perfil.",
            ai_welcome: "¡Hola! Soy el asistente virtual de [Tu Nombre]. Pregúntame sobre mis proyectos, contacto o aficiones."
        }
    };

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        langText.textContent = lang === 'en' ? 'ES' : 'EN';
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        updateLanguage(currentLang);
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
