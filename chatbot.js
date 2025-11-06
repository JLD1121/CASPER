    // 📚 Base de conocimiento
        const baseConocimiento = {
            "material": [
            "¿Qué materiales usan?",
            "¿De qué están hechas las cajas?",
            "¿Con qué hacen las cajas?"
        ],
        "precio": [
            "¿Cuánto cuesta una caja?",
            "¿Qué precio tienen?",
            "¿Cuál es el costo?"
        ],
        "ecológico": [
            "¿Tienen cajas ecológicas?",
            "¿Puedo pedir cajas recicladas?",
            "¿Usan materiales amigables con el ambiente?"
        ],
        "tamaño": [
            "¿Qué tamaños tienen?",
            "¿Puedo pedir cajas grandes?",
            "¿Hacen cajas pequeñas?"
        ],
        "personalizar": [
            "¿Se puede poner mi logo?",
            "¿Puedo personalizar la caja?",
            "¿Hacen diseños especiales?"
        ],
        "regalo": [
            "¿Sirven para regalos?",
            "¿Son buenas para envolver un detalle?",
            "¿Puedo usar una para un obsequio?"
        ],
        "estilo": [
            "¿Qué estilos de cajas tienen?",
            "¿Cómo son los diseños?",
            "¿Qué tipo de cajas ofrecen?"
         ]
            },
            respuestas_texto = {
        "material": "Trabajamos con cartón rígido, microcorrugado y kraft ecológico, según la necesidad.",
        "precio": "El costo depende del tamaño, material y cantidad. Entre más unidades pidas, más económico será.",
        "ecológico": "Sí, ofrecemos cajas ecológicas hechas con materiales reciclados y tintas amigables.",
        "tamaño": "Hacemos cajas pequeñas para accesorios, medianas para detalles y grandes para productos especiales.",
        "personalizar": "Claro, puedes personalizar la caja con tu logo, colores, frases o diseños especiales.",
        "regalo": "Son perfectas para regalos, porque dan un toque más elegante que una bolsa común.",
        "estilo": "Ofrecemos cajas con tapa magnética, deslizables, tipo cofre o con ventana transparente."
    };

        // 🤝 Respuestas rápidas
        const respuestasSaludo = [
            "¡Hola! 😊 Soy tu chatbot Casper. ¿En qué te puedo ayudar?",
            "¡Buenos días! 🌟 Puedo responder sobre cualquier duda respecto a las cajas personalizadas.",
            "¡Hola! 👋 ¿Qué te gustaría saber hoy?"
        ];

        const respuestasDespedida = [
            "¡Hasta pronto! 👋 Espero haber aclarado tus dudas.",
            "¡Nos vemos! 😊",
            "¡Adiós! 🌟 Que tengas un gran día."
        ];
        
        // --- Elementos del DOM ---
        const chatWindow = document.getElementById('chat-window');
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');

        // --- Funciones de Utilidad ---

        /**
         * 🧹 Limpia y normaliza el texto.
         * @param {string} texto - El texto de entrada.
         * @returns {string} Texto limpio en minúsculas.
         */
        function limpiarTexto(texto) {
            if (typeof texto !== 'string') return '';
            texto = texto.toLowerCase();
            // Elimina caracteres especiales, pero mantiene '¿', '?', 'áéíóúñ' y espacios.
            texto = texto.replace(/[^\w\s¿?áéíóúñ]/g, ' ');
            // Elimina múltiples espacios y recorta
            return texto.trim().split(/\s+/).join(' ');
        }
        
        /**
         * 🎯 Calcula la similitud de Jaccard entre dos textos (basado en palabras).
         * @param {string} textoA - Texto del usuario.
         * @param {string} textoB - Pregunta de la base de conocimiento.
         * @returns {number} Puntuación de similitud (0 a 1).
         */
        function calcularSimilitud(textoA, textoB) {
            const cleanA = limpiarTexto(textoA);
            const cleanB = limpiarTexto(textoB);
            
            const wordsA = new Set(cleanA.split(' ').filter(w => w.length > 1));
            const wordsB = new Set(cleanB.split(' ').filter(w => w.length > 1));

            if (wordsA.size === 0 || wordsB.size === 0) return 0;

            const intersectionSize = [...wordsA].filter(x => wordsB.has(x)).length;
            const unionSize = wordsA.size + wordsB.size - intersectionSize;

            return intersectionSize / unionSize;
        }

        /**
         * 💬 Crea y añade un mensaje a la interfaz de chat.
         * @param {string} texto - El contenido del mensaje.
         * @param {string} tipo - 'bot' o 'user'.
         */
        function addMessage(texto, tipo) {
            const messageWrapper = document.createElement('div');
            messageWrapper.className = `flex ${tipo === 'user' ? 'justify-end' : 'justify-start'}`;

            const messageBubble = document.createElement('div');
            messageBubble.className = `max-w-xs md:max-w-sm p-3 rounded-xl shadow-md text-sm ${
                tipo === 'user' ? 'message-user' : 'message-bot'
            }`;
            messageBubble.innerHTML = texto.replace(/\n/g, '<br>'); // Respeta saltos de línea

            messageWrapper.appendChild(messageBubble);
            chatMessages.appendChild(messageWrapper);

            // Desplazar hacia abajo para ver el nuevo mensaje
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        /**
         * 🚀 Lógica principal del chatbot para encontrar la mejor respuesta.
         * @param {string} preguntaUsuario - La pregunta del usuario.
         * @returns {string} La mejor respuesta encontrada.
         */
        function encontrarMejorRespuesta(preguntaUsuario) {
            const preguntaLimpia = limpiarTexto(preguntaUsuario);
            
            // Detección de saludos y despedidas
            const saludos = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'qué tal', 'hey', 'ole', 'oe', 'parce','holis', 'holisssss',];
            if (saludos.some(s => preguntaLimpia.includes(s))) {
                return respuestasSaludo[Math.floor(Math.random() * respuestasSaludo.length)];
            }

            const despedidas = ['adiós', 'hasta luego', 'nos vemos', 'chau', 'bye', 'salir', 'terminar'];
            if (despedidas.some(d => preguntaLimpia.includes(d))) {
                return respuestasDespedida[Math.floor(Math.random() * respuestasDespedida.length)];
            }

            let mejorRespuesta = "";
            let mejorPuntuacion = 0;
            let materiaEncontrada = "";

            for (const materia in baseConocimiento) {
                const preguntas = baseConocimiento[materia];
                for (const preguntaBase in preguntas) {
                    const puntuacion = calcularSimilitud(preguntaLimpia, limpiarTexto(preguntaBase));
                    
                    if (puntuacion > mejorPuntuacion) {
                        mejorPuntuacion = puntuacion;
                        mejorRespuesta = preguntas[preguntaBase];
                        materiaEncontrada = materia;
                    }
                }
            }

            const umbralMinimo = 0.15; // Un umbral más bajo para la similitud Jaccard
            
            if (mejorPuntuacion > umbralMinimo) {
                const materiaCapitalizada = materiaEncontrada.charAt(0).toUpperCase() + materiaEncontrada.slice(1);
                return `📚 [${materiaCapitalizada}] ${mejorRespuesta}`;
            } else {
                return [
                    "🤔 No estoy seguro, ¿puedes reformular la pregunta?",
                    "❓ Hmm, no tengo esa información. Intenta con preguntas más directas como '¿Qué productos ofrecen?' o '¿Cómo puedo comprar?'."
                ][Math.floor(Math.random() * 2)];
            }
        }

        /**
         * 📩 Maneja el envío de mensajes por el usuario.
         */
        function sendMessage() {
            const userText = userInput.value.trim();
            if (userText === '') return;

            // 1. Mostrar mensaje del usuario
            addMessage(userText, 'user');
            userInput.value = '';
            
            // 2. Obtener respuesta del bot (simulación de tiempo de respuesta)
            setTimeout(() => {
                const botResponse = encontrarMejorRespuesta(userText);
                addMessage(botResponse, 'bot');
            }, 500);
        }
        
        /**
         * 🔄 Muestra u oculta la ventana del chat.
         */
        function toggleChat() {
            chatWindow.classList.toggle('hidden');
            // Usamos clases de Tailwind y CSS para la animación
            setTimeout(() => {
                chatWindow.classList.toggle('open');
            }, 10); // Un pequeño retraso para asegurar la animación

            if (chatWindow.classList.contains('open')) {
                // Al abrir, forzar un saludo y enfoque
                userInput.focus();
                if (chatMessages.children.length === 0) {
                    setTimeout(() => {
                        addMessage(respuestasSaludo[0], 'bot');
                    }, 500);
                }
            }
        }

        // --- Inicialización ---
        window.onload = function() {
            // Eliminar la clase 'hidden' después de la carga para que la transición funcione la primera vez que se abre.
            // La visibilidad inicial se controla solo por CSS/JS al hacer click.
            // Para mantenerlo cerrado por defecto, lo dejaremos como está, con el `hidden` inicial.
        };