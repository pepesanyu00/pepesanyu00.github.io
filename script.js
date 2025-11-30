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

    // DOM Pruning Demo
    const btnPrune = document.getElementById('btn-prune-web');
    const btnRestore = document.getElementById('btn-restore-web');
    const pruningStats = document.getElementById('pruning-stats');
    const webSparsity = document.getElementById('web-sparsity');
    const webFunctionality = document.getElementById('web-functionality');
    
    const sliderUnstructured = document.getElementById('pruning-slider-unstructured');
    const valUnstructured = document.getElementById('val-unstructured');
    const sliderStructured = document.getElementById('pruning-slider-structured');
    const valStructured = document.getElementById('val-structured');
    
    let originalTextNodes = new Map();
    let isPruned = false;

    // Update slider value display and exclusive logic
    if (sliderUnstructured && valUnstructured && sliderStructured && valStructured) {
        sliderUnstructured.addEventListener('input', (e) => {
            valUnstructured.textContent = `${e.target.value}%`;
            // Reset structured
            if (sliderStructured.value > 0) {
                sliderStructured.value = 0;
                valStructured.textContent = "0%";
                restoreWeb();
            }
            // Apply unstructured
            pruneWeb(); 
        });

        sliderStructured.addEventListener('input', (e) => {
            valStructured.textContent = `${e.target.value}%`;
            // Reset unstructured
            if (sliderUnstructured.value > 0) {
                sliderUnstructured.value = 0;
                valUnstructured.textContent = "0%";
                restoreWeb();
            }
            // Apply structured
            pruneWeb();
        });
    }

    function getTextNodes(node) {
        let textNodes = [];
        if (node.nodeType === 3) { // Text node
            if (node.nodeValue.trim() !== "") {
                textNodes.push(node);
            }
        } else {
            // Exclude the pruning section itself so controls remain visible
            if (node.id === 'pruning-demo' || (node.closest && node.closest('#pruning-demo'))) {
                return [];
            }
            
            for (let child of node.childNodes) {
                textNodes.push(...getTextNodes(child));
            }
        }
        return textNodes;
    }

    function calculateFunctionality(sparsity, type) {
        // Functionality drops differently for structured vs unstructured
        // Unstructured: Linear-ish drop, readable until high sparsity
        // Structured: Exponential drop, unreadable quickly
        
        let functionality;
        if (type === 'unstructured') {
            // Sigmoid-like curve for unstructured (resilient)
            if (sparsity < 30) functionality = 100;
            else if (sparsity > 80) functionality = 0;
            else functionality = 100 - ((sparsity - 30) * 2);
        } else {
            // Steep drop for structured
            if (sparsity < 10) functionality = 100;
            else functionality = Math.max(0, 100 - (sparsity * 1.5));
        }
        return Math.round(functionality);
    }

    function pruneWeb() {
        const sparsityUnstructured = parseInt(sliderUnstructured.value);
        const sparsityStructured = parseInt(sliderStructured.value);
        
        let sparsityPercentage = 0;
        let type = 'unstructured';

        if (sparsityUnstructured > 0) {
            sparsityPercentage = sparsityUnstructured;
            type = 'unstructured';
        } else if (sparsityStructured > 0) {
            sparsityPercentage = sparsityStructured;
            type = 'structured';
        } else {
            // If both 0, maybe restore?
            restoreWeb();
            return;
        }

        if (!isPruned) {
            // Save original text
            const allTextNodes = getTextNodes(document.body);
            allTextNodes.forEach((node, index) => {
                originalTextNodes.set(node, node.nodeValue);
            });
            isPruned = true;
        }

        // Always restore to original before applying new pruning to ensure correct percentage
        originalTextNodes.forEach((value, node) => {
            node.nodeValue = value;
        });

        const protectedStrings = ["José", "Sánchez", "Yun", "JSY"];

        originalTextNodes.forEach((originalText, node) => {
            if (type === 'unstructured') {
                let chars = originalText.split('');
                let indices = chars.map((_, i) => i);
                
                // Filter out indices that are part of protected strings
                let protectedIndices = new Set();
                protectedStrings.forEach(pStr => {
                    let idx = originalText.toLowerCase().indexOf(pStr.toLowerCase());
                    while (idx !== -1) {
                        for (let i = 0; i < pStr.length; i++) {
                            protectedIndices.add(idx + i);
                        }
                        idx = originalText.toLowerCase().indexOf(pStr.toLowerCase(), idx + 1);
                    }
                });

                let pruningIndices = indices.filter(i => 
                    chars[i].trim() !== '' && !protectedIndices.has(i)
                );

                // Shuffle indices
                for (let i = pruningIndices.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [pruningIndices[i], pruningIndices[j]] = [pruningIndices[j], pruningIndices[i]];
                }

                // Calculate how many to remove
                const removeCount = Math.floor(pruningIndices.length * (sparsityPercentage / 100));
                
                // Remove (replace with underscore)
                for (let i = 0; i < removeCount; i++) {
                    chars[pruningIndices[i]] = '_';
                }
                
                node.nodeValue = chars.join('');

            } else {
                // Structured Pruning (Words)
                // Split by spaces but keep delimiters to reconstruct
                let words = originalText.split(/(\s+)/);
                
                let wordIndices = [];
                words.forEach((w, i) => {
                    // If it's not whitespace and not protected
                    if (w.trim().length > 0) {
                        let isProtected = protectedStrings.some(pStr => 
                            w.toLowerCase().includes(pStr.toLowerCase())
                        );
                        if (!isProtected) {
                            wordIndices.push(i);
                        }
                    }
                });

                // Shuffle
                for (let i = wordIndices.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [wordIndices[i], wordIndices[j]] = [wordIndices[j], wordIndices[i]];
                }

                const removeCount = Math.floor(wordIndices.length * (sparsityPercentage / 100));

                for (let i = 0; i < removeCount; i++) {
                    const idx = wordIndices[i];
                    // Replace with underscores of same length
                    words[idx] = '_'.repeat(words[idx].length);
                }

                node.nodeValue = words.join('');
            }
        });

        // Update Stats
        pruningStats.classList.remove('hidden');
        btnRestore.classList.remove('hidden');
        btnPrune.textContent = type === 'unstructured' ? 
            (currentLang === 'es' ? "Re-Aplicar Poda" : "Re-Apply Pruning") : 
            (currentLang === 'es' ? "Re-Aplicar Poda" : "Re-Apply Pruning");
        
        webSparsity.textContent = `${sparsityPercentage}%`;
        
        const functionality = calculateFunctionality(sparsityPercentage, type);
        webFunctionality.textContent = `${functionality}%`;
        
        if (functionality < 50) {
            webFunctionality.style.color = '#ff4d4d';
        } else if (functionality < 80) {
            webFunctionality.style.color = '#ffca28';
        } else {
            webFunctionality.style.color = '#4cc9f0';
        }
    }

    function restoreWeb() {
        if (isPruned) {
            originalTextNodes.forEach((value, node) => {
                node.nodeValue = value;
            });
            pruningStats.classList.add('hidden');
            btnRestore.classList.add('hidden');
            btnPrune.textContent = currentLang === 'es' ? "Aplicar Poda" : "Apply Pruning";
            
            // Reset sliders
            if (sliderUnstructured) {
                sliderUnstructured.value = 0;
                valUnstructured.textContent = "0%";
            }
            if (sliderStructured) {
                sliderStructured.value = 0;
                valStructured.textContent = "0%";
            }
            
            isPruned = false;
        }
    }

    if (btnPrune) {
        btnPrune.addEventListener('click', () => {
            pruneWeb();
        });
        btnRestore.addEventListener('click', restoreWeb);
    }

    // LANGUAGE SWITCHER
    const langToggle = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = 'en';

    const translations = {
        en: {
            nav_about: "About Me",
            nav_research: "Research",
            nav_conferences: "Conferences",
            nav_hobbies: "Hobbies",
            nav_ai: "Pruning Demo",
            hero_tagline: "PhD student at the University of Málaga",
            hero_bio: "PhD Researcher focused on Machine Learning optimization and High-Performance Computing. Specialized in developing efficient solutions of ML models on RISC-V architectures and parallel algorithms. Passionate about bridging the gap between state-of-the-art research and real-world systems to build functional, scalable, and high-performance products.",
            section_research: "Research Experience",
            p1_date: "2025 (Under development)",
            p1_title: "Sparse inference accelerator for unstructured pruning optimization on CNN",
            p1_desc: "Development of a specialized FPGA-deployable co-processor to accelerate unstructured pruning in CNNs, implementing a full flow from PyTorch analysis to execution.",
            card_hover_text: "Click for more details",
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
            section_hobbies: "Beyond the Lab",
            hobbies_desc: "I have been passionate about nature and photography since I was young. I am also passionate about traveling, so when I travel I love taking photos that capture the moments I experience.",
            btn_paper: "View Paper",
            btn_repo: "GitHub Repo",
            p2_title: "Scalable Vectorization of Time Series Analysis: A Matrix Profile Implementation on RISC-V and ARM",
            p2_desc: "Vector length agnostic implementation of RISC-V Vector Extension and ARM SVE on time series analysis algorithms. Performance comparation and exploration.",
            p2_modal_desc: "Study of the benefits of Vector Length agnostic approaches to time series analisys algorithms (SCAMP and SCRIMP) using RISC-V Vector Extension (RVV) and ARM Scalable Vector Extension (SVE). We propose implementations that exploit vectorization as much as possible in these algorithms and conduct a comprehensive evaluation to understand the trade-offs. Our results show an average speedup relative to the non-vectorized implementation of 66× on RISC-V (with vector length 16384 bits), and 8× on ARM (with vector length 2048 bits).",
            modal_contrib_title: "Methodology",
            p2_modal_results: "This project is finished and currently under review for Springer Journal of Supercomputing since September 2025.",
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
            p3_modal_results: "This project is finished and currently in final review stage for Elsevier Journal of Parallel Computing.",
            section_conferences: "Conferences & Summer Schools",
            lnk_linkedin: "View Post",
            conf1_title: "RISC-V Summit Europe 2025",
            conf1_loc: "Paris, France",
            conf1_date: "May 2025",
            conf1_blog_date: "Written on May 20, 2025",
            conf1_blog_content: "<p>This week, I had the pleasure of presenting my work titled 'RISC-V Vector Extension: A Case Study on Time Series Analysis.' It was an incredibly enriching experience, and truly inspiring to witness all the progress happening in this promising industry. This event clearly shows that RISC-V International is achieving great things, and it might well become the go-to architecture in the near future.</p>",
            conf2_title: "SARTECO",
            conf2_loc: "Barcelona, Spain",
            conf2_date: "Nov 2024",
            conf2_blog_date: "Written on July 4, 2025",
            conf2_blog_content: "<p>Last week, I had the chance to attend SARTECO days for the first time, held this year in Seville. I’d heard great things from colleagues who had been to previous editions, and it definitely lived up to the hype. It was a fantastic experience. I got to connect with researchers working on topics closely related to mine, and was genuinely inspired by the level of talent and passion for research that exists in Spain.</p>",
            conf3_title: "ACM Europe Summer School on HPC",
            conf3_loc: "Barcelona, Spain",
            conf3_date: "Sept 2024",
            conf3_blog_date: "Written on September 10, 2024",
            conf3_blog_content: "<p>This week, I had the pleasure of attending the ACM Europe Summer School on HPC Computer Architectures for AI and Dedicated Applications, a great tech event where I had the opportunity to enjoy numerous talks by individuals who dedicate their passion and a significant part of their lives to the pursuit of new knowledge that enables us to move towards a promising technological future. Among these individuals were Mateo Valero, Luca Benini, and Leslie Lamport, among many others. Not only were the talks a great source of inspiration for me, but so was meeting people from all over the world who are striving to make their way in this complex and exciting world of research. During this week, we discussed a wide range of current and important topics such as artificial intelligence, the rise of open architectures like RISC-V, the development of dedicated accelerators, and quantum computing. The latter, explained by the wonderful team from Qilimanjaro, allowed me to gain a much deeper understanding of this technology and its inherent complexity. Finally, I would like to extend my gratitude to the Barcelona Supercomputing Center (BSC) and ACM, Association for Computing Machinery for organizing this event and for promoting science and knowledge about current technologies to those of us who are just beginning our careers. Thanks to events like this, we are motivated to contribute our own small part to the advancement of science.</p>",
            conf4_title: "BSC Training Course: RISC-V principles",
            conf4_loc: "Barcelona, Spain",
            conf4_date: "Nov 2024",
            conf4_blog_date: "Written on November 15, 2024",
            conf4_blog_content: "<p>This intensive course at the Barcelona Supercomputing Center provided deep insights into the RISC-V ISA. We worked on practical exercises involving custom instruction implementation and explored the potential of open hardware for future HPC applications.</p>",
            section_hobbies: "Beyond the Lab",
            hobbies_desc: "I have been passionate about nature and photography since I was young. I am also passionate about traveling, so when I travel I love taking photos that capture the moments I experience.",
            flickr_caption: "Here you have a random photo from my flickr profile :)",
            
            // Pruning Demo Translations
            section_pruning: "Pruning Comparison Demo",
            pruning_subtitle: "Visualizing the difference between Unstructured and Structured Pruning.",
            pruning_expl: "Unstructured pruning removes individual connections (letters), maintaining the overall context. Structured pruning removes entire neurons or channels (words), creating gaps that destroy meaning. Notice how you can still read the text with 50% letters missing, but 50% words missing makes it unintelligible. This is why unstructured pruning yields higher accuracy.",
            pruning_msg: "\"Optimized for efficiency... but is the hardware happy?\"",
            lbl_pruning_unstructured: "Unstructured (Letters)",
            lbl_pruning_structured: "Structured (Words)",
            lbl_sparsity: "Sparsity",
            lbl_functionality: "Functionality",
            btn_apply_pruning: "Apply Pruning",
            btn_restore_web: "Restore Website",
            footer_text: "&copy; 2025 José Sánchez Yun. Designed with passion and code."
        },
        es: {
            nav_about: "Sobre Mí",
            nav_research: "Investigación",
            nav_conferences: "Congresos",
            nav_hobbies: "Aficiones",
            nav_ai: "Demo Poda",
            hero_tagline: "Estudiante de Doctorado en la Universidad de Málaga",
            hero_bio: "Investigador de doctorado enfocado en la optimización de Machine Learning y Computación de Alto Rendimiento. Especializado en desarrollar soluciones eficientes de modelos de ML en arquitecturas RISC-V y algoritmos paralelos. Apasionado por cerrar la brecha entre la investigación de vanguardia y los sistemas del mundo real para construir productos funcionales, escalables y de alto rendimiento.",
            section_research: "Experiencia en Investigación",
            p1_date: "2025 (En desarrollo)",
            p1_title: "Acelerador de inferencia dispersa para optimización de poda no estructurada en CNN",
            p1_desc: "Desarrollo de un coprocesador especializado desplegable en FPGA para acelerar la poda no estructurada en CNNs, implementando un flujo completo desde el análisis en PyTorch hasta la ejecución.",
            card_hover_text: "Click para ver detalles",
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
            section_hobbies: "Más allá del Laboratorio",
            hobbies_desc: "Soy un apasionado de la naturaleza y la fotografía desde que era joven. Además de ello también soy un apasionado de viajar, por lo que cuando viajo me encanta hacer fotos que capturen los momentos que vivo.",
            btn_paper: "Ver Paper",
            btn_repo: "Repositorio GitHub",
            p2_title: "Vectorización Escalable de Análisis de Series Temporales: Implementación de Matrix Profile en RISC-V y ARM",
            p2_desc: "Implementación agnóstica de la longitud vectorial de la Extensión Vectorial RISC-V y ARM SVE en algoritmos de análisis de series temporales. Comparación de rendimiento y exploración.",
            p2_modal_desc: "Estudio de los beneficios de enfoques agnósticos a la longitud vectorial en algoritmos de análisis de series temporales (SCAMP y SCRIMP) utilizando la Extensión Vectorial RISC-V (RVV) y ARM Scalable Vector Extension (SVE). Proponemos implementaciones que explotan la vectorización tanto como sea posible en estos algoritmos y realizamos una evaluación exhaustiva para comprender las compensaciones. Nuestros resultados muestran una aceleración promedio relativa a la implementación no vectorizada de 66× en RISC-V (con longitud vectorial de 16384 bits), y 8× en ARM (con longitud vectorial de 2048 bits).",
            modal_contrib_title: "Metodología",
            p2_modal_li1: "Vectorización de SCAMP y SCRIMP en RVV y SVE vía intrínsecas.",
            p2_modal_li2: "Diseño de dos procesadores equivalentes para arquitecturas RISC-V y ARM en gem5.",
            p2_modal_li3: "Verificación y validación de las implementaciones propuestas en benchmarks reales de matrix profile.",
            p2_modal_results: "Este proyecto está terminado y está siendo revisado en la revista Springer Journal of Supercomputing desde Septiembre de 2025.",
            p3_title: "Barreras Transaccionales en algoritmos de Matrix Profile",
            p3_desc: "Un mecanismo de sincronización robusto usando Memoria Transaccional Hardware en algoritmos de análisis de series temporales.",
            p3_modal_desc: "Proponemos varias optimizaciones a la librería original de Barreras Especulativas, y la hacemos compatible con Power8 e Intel. Finalmente realizamos un estudio completo sobre los factores que afectan el rendimiento de la memoria transaccional en algoritmos de análisis de series temporales.",
            modal_tech_title: "Metodología",
            p3_modal_li1: "Optimización de la barrera especulativa previa gestionando el manejo de abortos transaccionales.",
            p3_modal_li2: "Creación de una versión compatible de la librería en arquitecturas Intel.",
            p3_modal_li3: "Realización de un estudio multiarquitectura para validar y verificar las implementaciones propuestas.",
            p3_modal_results: "Este proyecto está terminado y actualmente está en la fase final de revisión en la revista Elsevier Journal of Parallel Computing.",
            section_conferences: "Congresos & Summer Schools",
            lnk_linkedin: "Ver Publicación",
            conf1_title: "RISC-V Summit Europe 2025",
            conf1_loc: "París, Francia",
            conf1_date: "Mayo 2025",
            conf1_blog_date: "Escrito el 20 de Mayo de 2025",
            conf1_blog_content: "<p>Esta semana tuve el placer de presentar mi trabajo titulado 'RISC-V Vector Extension: A Case Study on Time Series Analysis'. Fue una experiencia increíblemente enriquecedora y verdaderamente inspiradora ser testigo de todo el progreso que está ocurriendo en esta prometedora industria. Este evento muestra claramente que RISC-V International está logrando grandes cosas y bien podría convertirse en la arquitectura de referencia en un futuro cercano.</p>",
            conf2_title: "SARTECO",
            conf2_loc: "Barcelona, España",
            conf2_date: "Nov 2024",
            conf2_blog_date: "Escrito el 4 de Julio de 2025",
            conf2_blog_content: "<p>La semana pasada tuve la oportunidad de asistir por primera vez a las jornadas SARTECO, celebradas este año en Sevilla. Había escuchado grandes cosas de compañeros que habían asistido a ediciones anteriores, y definitivamente estuvo a la altura. Fue una experiencia fantástica. Pude conectar con investigadores que trabajan en temas muy relacionados con el mío, y me sentí genuinamente inspirado por el nivel de talento y pasión por la investigación que existe en España.</p>",
            conf3_title: "Escuela de Verano ACM Europe en HPC",
            conf3_loc: "Barcelona, España",
            conf3_date: "Sept 2024",
            conf3_blog_date: "Escrito el 10 de Septiembre de 2024",
            conf3_blog_content: "<p>Esta semana tuve el placer de asistir a la Escuela de Verano de ACM Europe sobre Arquitecturas de Computación HPC para IA y Aplicaciones Dedicadas, un gran evento tecnológico donde tuve la oportunidad de disfrutar de numerosas charlas de personas que dedican su pasión y una parte significativa de sus vidas a la búsqueda de nuevo conocimiento que nos permita avanzar hacia un futuro tecnológico prometedor. Entre estas personas se encontraban Mateo Valero, Luca Benini y Leslie Lamport, entre muchos otros. No solo las charlas fueron una gran fuente de inspiración para mí, sino también conocer a personas de todo el mundo que se esfuerzan por abrirse camino en este complejo y emocionante mundo de la investigación. Durante esta semana, discutimos una amplia gama de temas actuales e importantes como la inteligencia artificial, el auge de arquitecturas abiertas como RISC-V, el desarrollo de aceleradores dedicados y la computación cuántica. Esta última, explicada por el maravilloso equipo de Qilimanjaro, me permitió obtener una comprensión mucho más profunda de esta tecnología y su complejidad inherente. Finalmente, me gustaría extender mi gratitud al Barcelona Supercomputing Center (BSC) y a ACM, Association for Computing Machinery por organizar este evento y por promover la ciencia y el conocimiento sobre tecnologías actuales para aquellos de nosotros que recién comenzamos nuestras carreras. Gracias a eventos como este, estamos motivados a contribuir con nuestra pequeña parte al avance de la ciencia.</p>",
            conf4_title: "Curso de Formación BSC: Principios RISC-V",
            conf4_loc: "Barcelona, España",
            conf4_date: "Nov 2024",
            conf4_blog_date: "Escrito el 15 de Noviembre de 2024",
            conf4_blog_content: "<p>Este curso intensivo en el Barcelona Supercomputing Center proporcionó conocimientos profundos sobre la ISA RISC-V. Trabajamos en ejercicios prácticos involucrando la implementación de instrucciones personalizadas y exploramos el potencial del hardware abierto para futuras aplicaciones HPC.</p>",
            section_hobbies: "Fuera del Laboratorio",
            hobbies_desc: "Soy un apasionado de la naturaleza y la fotografía desde que era joven. Además de ello también soy un apasionado de viajar, por lo que cuando viajo me encanta hacer fotos que capturen los momentos que vivo.",
            flickr_caption: "Aquí tienes una foto aleatoria de mi perfil de flickr :)",
            section_ai: "Pregunta a mi Gemelo Digital",
            ai_subtitle: "Una interfaz experimental impulsada por IA (simulada) para responder tus dudas sobre mi perfil.",
            ai_welcome: "¡Hola! Soy el asistente virtual de [Tu Nombre]. Pregúntame sobre mis proyectos, contacto o aficiones.",
            
            // Pruning Demo Translations (ES)
            section_pruning: "Demo Comparativa de Poda",
            pruning_subtitle: "Visualizando la diferencia entre Poda Estructurada y No Estructurada.",
            pruning_expl: "La poda no estructurada elimina conexiones individuales (letras), manteniendo el contexto general. La poda estructurada elimina neuronas o canales completos (palabras), creando vacíos que destruyen el significado. Observa cómo puedes seguir leyendo el texto con un 50% de letras faltantes, pero con un 50% de palabras faltantes se vuelve ininteligible. Por esto la poda no estructurada mantiene mejor la precisión.",
            pruning_msg: "\"Optimizado para eficiencia... ¿pero el hardware está contento?\"",
            lbl_pruning_unstructured: "No Estructurada (Letras)",
            lbl_pruning_structured: "Estructurada (Palabras)",
            lbl_sparsity: "Dispersión (Sparsity)",
            lbl_functionality: "Funcionalidad",
            btn_apply_pruning: "Aplicar Poda",
            btn_restore_web: "Restaurar Web",
            footer_text: "&copy; 2025 José Sánchez Yun. Diseñado con pasión y código."
        }
    };

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-hover]').forEach(element => {
            const key = element.getAttribute('data-i18n-hover');
            if (translations[lang][key]) {
                element.setAttribute('data-hover-text', translations[lang][key]);
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

    // CAROUSEL LOGIC
    const track = document.querySelector('.conferences-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (track && prevBtn && nextBtn) {
        const scrollAmount = 350; // Adjust based on card width + gap

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // FLICKR RANDOM PHOTO (Optional)
    // To enable, replace 'YOUR_FLICKR_ID' with your actual Flickr User ID (e.g., '12345678@N00')
    const flickrId = '196477770@N08'; // Leave empty to use local image
    const flickrImg = document.getElementById('flickr-img');

    if (flickrId && flickrImg) {
        const script = document.createElement('script');
        script.src = `https://api.flickr.com/services/feeds/photos_public.gne?id=${flickrId}&format=json&jsoncallback=flickrCallback`;
        document.body.appendChild(script);
    }

    // Global callback for Flickr JSONP
    window.flickrCallback = function(data) {
        if (data.items && data.items.length > 0) {
            const randomItem = data.items[Math.floor(Math.random() * data.items.length)];
            const flickrImg = document.getElementById('flickr-img');
            if (flickrImg) {
                flickrImg.src = randomItem.media.m.replace('_m.jpg', '_b.jpg'); // Try to get higher res
                flickrImg.alt = randomItem.title;
            }
        }
    };

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});
