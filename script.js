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
            p1_date: "2025 (Under development)",
            p1_title: "Sparse inference accelerator for unstructured pruning optimization on CNN",
            p1_desc: "Development of a specialized FPGA-deployable co-processor to accelerate unstructured pruning in CNNs, implementing a full flow from PyTorch analysis to execution.",
            btn_details: "View Details",
            modal_desc_title: "Detailed Description",
            p1_modal_desc: "This project tackles a critical challenge in AI hardware acceleration: unstructured pruning in Convolutional Neural Networks (CNNs). While pruning theoretically reduces computational load, the resulting irregularity in memory access patterns often degrades performance on conventional hardware. The goal is to design a specialized co-processor capable of exploiting this sparsity to maximize throughput and energy efficiency on edge devices.",
            modal_method_title: "Methodology",
            p1_modal_li1: "Creation of post-training methods to analyse and classificate all kernels in a CNN model.",
            p1_modal_li2: "Design of a dispatcher that receives the data and send it to the accelerator.",
            p1_modal_li3: "Design of an MMIO accelerator that accelerates sparse kernel convolutions.",
            p1_modal_li4: "Integration of the accelerator with a RISC-V CPU, in order to validate and verificate the design with real benchmarks.",
            modal_results_title: "Status",
            p1_modal_results: "This project is under development, and it is expected to finish on the first quarter of 2026.",
            btn_paper: "View Paper",
            btn_repo: "GitHub Repo",
            p2_title: "Scalable Vectorization of Time Series Analysis: A Matrix Profile Implementation on RISC-V and ARM",
            p2_desc: "Vector length agnostic implementation of RISC-V Vector Extension and ARM SVE on time series analysis algorithms. Performance comparation and exploration.",
            p2_modal_desc: "Study of the benefits of Vector Length agnostic approaches to time series analisys algorithms (SCAMP and SCRIMP) using RISC-V Vector Extension (RVV) and ARM Scalable Vector Extension (SVE). We propose implementations that exploit vectorization as much as possible in these algorithms and conduct a comprehensive evaluation to understand the trade-offs. Our results show an average speedup relative to the non-vectorized implementation of 66× on RISC-V (with vector length 16384 bits), and 8× on ARM (with vector length 2048 bits).",
            modal_contrib_title: "Methodology",
            p2_modal_li1: "Vectorization of SCAMP and SCRIMP on RVV and SVE via intrinsics.",
            p2_modal_li2: "Design of two equivalent processors for RISC-V and ARM architectures on gem5.",
            p2_modal_li3: "Verification and validation of the proposed implementations on real matrix profile benchmarks.",
            p3_title: "Transactional Barriers in Matrix Profile algorithms.",
            p3_desc: "A robust synchronization mechanism using Hardware Transactional Memory in time series analysis algorithms.",
            p3_modal_desc: "We propose several optimizations to the original Speculative Barriers Library, and make it compatible with Power8 and Intel. Finally we make a complete study on the factors that affect transactional memory performance on time series analysis algorithms.",
            modal_tech_title: "Methodology",
            p3_modal_li1: "Optimization of previous speculative barrier by managing transactional abort handling.",
            p3_modal_li2: "Creation of a compatible version of the library on Intel architectures.",
            p3_modal_li3: "Conduction of a multiarchitecture study that validate and verify the proposed implementations.",
            section_conferences: "Conferences & Summer Schools",
            conf1_title: "RISC-V Summit Europe 2025",
            conf1_loc: "Paris, France",
            conf1_date: "May 2025",
            conf1_blog_date: "Written on May 20, 2025",
            conf1_blog_content: "<p>Attending the RISC-V Summit Europe was an incredible experience. I had the opportunity to present my latest research on sparse inference accelerators...</p><p>The keynote speakers were inspiring, discussing the future of open hardware...</p>",
            conf2_title: "BSC Training Course: RISC-V principles",
            conf2_loc: "Barcelona, Spain",
            conf2_date: "Nov 2024",
            conf2_blog_date: "Written on November 15, 2024",
            conf2_blog_content: "<p>This intensive course at the Barcelona Supercomputing Center provided deep insights into the RISC-V ISA...</p><p>We worked on practical exercises involving custom instruction implementation...</p>",
            conf3_title: "ACM Europe Summer School on HPC",
            conf3_loc: "Barcelona, Spain",
            conf3_date: "Sept 2024",
            conf3_blog_date: "Written on September 10, 2024",
            conf3_blog_content: "<p>The ACM Europe Summer School was a fantastic opportunity to network with other PhD students...</p><p>We learned about the latest trends in HPC architectures for AI...</p>",
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
            p1_date: "2025 (En desarrollo)",
            p1_title: "Acelerador de inferencia dispersa para optimización de poda no estructurada en CNN",
            p1_desc: "Desarrollo de un coprocesador especializado desplegable en FPGA para acelerar la poda no estructurada en CNNs, implementando un flujo completo desde el análisis en PyTorch hasta la ejecución.",
            btn_details: "Ver Detalles",
            modal_desc_title: "Descripción Detallada",
            p1_modal_desc: "Este proyecto aborda un desafío crítico en la aceleración de hardware de IA: la poda no estructurada en Redes Neuronales Convolucionales (CNNs). Si bien la poda reduce teóricamente la carga computacional, la irregularidad resultante en los patrones de acceso a memoria a menudo degrada el rendimiento en hardware convencional. El objetivo es diseñar un coprocesador especializado capaz de explotar esta dispersión para maximizar el rendimiento y la eficiencia energética en dispositivos edge.",
            modal_method_title: "Metodología",
            p1_modal_li1: "Creación de métodos post-entrenamiento para analizar y clasificar todos los kernels en un modelo CNN.",
            p1_modal_li2: "Diseño de un dispatcher que recibe los datos y los envía al acelerador.",
            p1_modal_li3: "Diseño de un acelerador MMIO que acelera convoluciones de kernel dispersas.",
            p1_modal_li4: "Integración del acelerador con una CPU RISC-V, para validar y verificar el diseño con benchmarks reales.",
            modal_results_title: "Estado",
            p1_modal_results: "Este proyecto está en desarrollo y se espera que finalice en el primer trimestre de 2026.",
            btn_paper: "Ver Paper",
            btn_repo: "Repositorio GitHub",
            p2_title: "Vectorización Escalable de Análisis de Series Temporales: Implementación de Matrix Profile en RISC-V y ARM",
            p2_desc: "Implementación agnóstica de la longitud vectorial de la Extensión Vectorial RISC-V y ARM SVE en algoritmos de análisis de series temporales. Comparación de rendimiento y exploración.",
            p2_modal_desc: "Estudio de los beneficios de enfoques agnósticos a la longitud vectorial en algoritmos de análisis de series temporales (SCAMP y SCRIMP) utilizando la Extensión Vectorial RISC-V (RVV) y ARM Scalable Vector Extension (SVE). Proponemos implementaciones que explotan la vectorización tanto como sea posible en estos algoritmos y realizamos una evaluación exhaustiva para comprender las compensaciones. Nuestros resultados muestran una aceleración promedio relativa a la implementación no vectorizada de 66× en RISC-V (con longitud vectorial de 16384 bits), y 8× en ARM (con longitud vectorial de 2048 bits).",
            modal_contrib_title: "Metodología",
            p2_modal_li1: "Vectorización de SCAMP y SCRIMP en RVV y SVE vía intrínsecas.",
            p2_modal_li2: "Diseño de dos procesadores equivalentes para arquitecturas RISC-V y ARM en gem5.",
            p2_modal_li3: "Verificación y validación de las implementaciones propuestas en benchmarks reales de matrix profile.",
            p3_title: "Barreras Transaccionales en algoritmos de Matrix Profile",
            p3_desc: "Un mecanismo de sincronización robusto usando Memoria Transaccional Hardware en algoritmos de análisis de series temporales.",
            p3_modal_desc: "Proponemos varias optimizaciones a la librería original de Barreras Especulativas, y la hacemos compatible con Power8 e Intel. Finalmente realizamos un estudio completo sobre los factores que afectan el rendimiento de la memoria transaccional en algoritmos de análisis de series temporales.",
            modal_tech_title: "Metodología",
            p3_modal_li1: "Optimización de la barrera especulativa previa gestionando el manejo de abortos transaccionales.",
            p3_modal_li2: "Creación de una versión compatible de la librería en arquitecturas Intel.",
            p3_modal_li3: "Realización de un estudio multiarquitectura para validar y verificar las implementaciones propuestas.",
            section_conferences: "Congresos & Summer Schools",
            conf1_title: "RISC-V Summit Europe 2025",
            conf1_loc: "París, Francia",
            conf1_date: "Mayo 2025",
            conf1_blog_date: "Escrito el 20 de Mayo de 2025",
            conf1_blog_content: "<p>Asistir al RISC-V Summit Europe fue una experiencia increíble. Tuve la oportunidad de presentar mi última investigación sobre aceleradores de inferencia dispersa...</p><p>Los ponentes principales fueron inspiradores, discutiendo el futuro del hardware abierto...</p>",
            conf2_title: "Curso de Formación BSC: Principios RISC-V",
            conf2_loc: "Barcelona, España",
            conf2_date: "Nov 2024",
            conf2_blog_date: "Escrito el 15 de Noviembre de 2024",
            conf2_blog_content: "<p>Este curso intensivo en el Barcelona Supercomputing Center proporcionó conocimientos profundos sobre la ISA RISC-V...</p><p>Trabajamos en ejercicios prácticos involucrando la implementación de instrucciones personalizadas...</p>",
            conf3_title: "Escuela de Verano ACM Europe en HPC",
            conf3_loc: "Barcelona, España",
            conf3_date: "Sept 2024",
            conf3_blog_date: "Escrito el 10 de Septiembre de 2024",
            conf3_blog_content: "<p>La Escuela de Verano de ACM Europe fue una oportunidad fantástica para conectar con otros estudiantes de doctorado...</p><p>Aprendimos sobre las últimas tendencias en arquitecturas HPC para IA...</p>",
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
    const clickableCards = document.querySelectorAll('.project-card, .conf-card');

    function openModal(card) {
        const isConference = card.classList.contains('conf-card');
        const title = card.querySelector('h3').textContent;
        const hiddenContent = card.querySelector('.hidden-content').innerHTML;

        modalTitle.textContent = title;
        
        let contentHTML = '';

        if (isConference) {
            contentHTML = hiddenContent;
        } else {
            const tags = card.querySelector('.tags').outerHTML;
            const date = card.querySelector('.project-date').textContent;
            
            contentHTML = `
                <div style="margin-bottom: 20px; color: #666; font-weight: bold;">${date}</div>
                ${tags}
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
                ${hiddenContent}
            `;
        }
        
        modalBody.innerHTML = contentHTML;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    clickableCards.forEach(card => {
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
