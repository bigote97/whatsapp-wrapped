/**
 * WhatsApp Wrapped - Análisis gamificado de chat de WhatsApp (Versión Navegador)
 * Analiza las palabras más usadas por cada persona en el grupo
 */

class WhatsAppAnalyzer {
    constructor() {
        this.messages = [];
        this.wordCountByPerson = new Map();
        this.messageCountByPerson = new Map();
        this.conversationStarts = new Map();
        this.conversationEnds = new Map();
        this.responseTimes = new Map();
        this.groupName = null;
    }

    parseChat(content) {
        /**Parsea el contenido de WhatsApp y extrae mensajes con sus autores y timestamps*/
        // Patrón para detectar líneas con fecha, hora y nombre
        // Formato: DD/MM/YYYY, HH:MM - Nombre: mensaje
        const datePattern = /^(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}) - (.+?): (.+)$/;
        
        let currentAuthor = null;
        let currentMessage = [];
        let currentTimestamp = null;
        
        // Patrón para detectar creación del grupo
        const groupPattern = /creó el grupo "(.+?)"/;
        
        const lines = content.split('\n');
        
        for (const line of lines) {
            // Intentar extraer el nombre del grupo
            if (!this.groupName) {
                const groupMatch = line.match(groupPattern);
                if (groupMatch) {
                    this.groupName = groupMatch[1];
                }
            }
            
            const trimmedLine = line.trim();
            
            // Si la línea está vacía, la saltamos
            if (!trimmedLine) {
                continue;
            }
            
            // Intentamos hacer match con el patrón de mensaje
            const match = trimmedLine.match(datePattern);
            
            if (match) {
                // Si hay un mensaje previo, lo guardamos
                if (currentAuthor && currentMessage.length > 0 && currentTimestamp) {
                    const fullMessage = currentMessage.join(' ');
                    this.messages.push({
                        author: currentAuthor,
                        message: fullMessage,
                        timestamp: currentTimestamp
                    });
                }
                
                // Nuevo mensaje
                const [, dateStr, timeStr, author, message] = match;
                currentAuthor = author.trim();
                currentMessage = [message];
                
                // Parsear timestamp
                try {
                    // Formato: DD/MM/YYYY HH:MM
                    const [day, month, year] = dateStr.split('/');
                    const [hour, minute] = timeStr.split(':');
                    currentTimestamp = new Date(year, month - 1, day, hour, minute);
                } catch (error) {
                    // Si falla el parsing, usar null
                    currentTimestamp = null;
                }
            } else {
                // Continuación del mensaje anterior
                if (currentAuthor) {
                    currentMessage.push(trimmedLine);
                }
            }
        }
        
        // Guardar el último mensaje
        if (currentAuthor && currentMessage.length > 0 && currentTimestamp) {
            const fullMessage = currentMessage.join(' ');
            this.messages.push({
                author: currentAuthor,
                message: fullMessage,
                timestamp: currentTimestamp
            });
        }
    }

    cleanWord(word) {
        /**Limpia una palabra: elimina puntuación y convierte a minúsculas*/
        // Eliminar emojis y caracteres especiales, mantener solo letras y números
        return word.toLowerCase().replace(/[^\w\s]/g, '').trim();
    }

    countWords() {
        /**Cuenta las palabras por persona*/
        // Palabras comunes a ignorar (stop words en español MUY completo)
        const stopWords = new Set([
            // Artículos
            'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del',
            // Preposiciones y conjunciones
            'de', 'que', 'y', 'a', 'en', 'por', 'con', 'para', 'como', 'o', 'pero',
            'si', 'sin', 'sobre', 'entre', 'hasta', 'desde', 'hacia', 'según', 'durante',
            'mediante', 'contra', 'bajo', 'tras', 'ante', 'cabe', 'so', 'cuando', 'donde',
            'mientras', 'aunque', 'porque', 'pues', 'sino', 'mas',
            // Pronombres
            'se', 'le', 'me', 'te', 'nos', 'os', 'lo', 'la', 'los', 'las', 'le', 'les',
            'él', 'ella', 'ellos', 'ellas', 'yo', 'tú', 'vos', 'nosotros', 'nosotras',
            'ustedes', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
            'aquel', 'aquella', 'aquellos', 'aquellas', 'mi', 'tu', 'su', 'nuestro',
            'nuestra', 'vuestro', 'vuestra', 'mío', 'tuyo', 'suyo', 'eso', 'esta',
            // Verbos comunes - todas las conjugaciones frecuentes
            'ser', 'es', 'son', 'soy', 'eres', 'somos', 'sois', 'fue', 'fueron', 'era',
            'eran', 'será', 'serán', 'sería', 'serían', 'sido', 'siendo',
            'estar', 'está', 'están', 'estoy', 'estás', 'estamos', 'estáis', 'estaba',
            'estaban', 'estuve', 'estuvieron', 'estará', 'estarán', 'estado', 'estando',
            'tener', 'tiene', 'tienen', 'tengo', 'tienes', 'tenemos', 'tenéis', 'tenía',
            'tenían', 'tuve', 'tuvieron', 'tendrá', 'tendrán', 'tenido', 'teniendo',
            'haber', 'ha', 'han', 'he', 'has', 'hemos', 'habéis', 'había', 'habían',
            'hubo', 'hubieron', 'habrá', 'habrán', 'habido', 'habiendo',
            'hacer', 'hace', 'hacen', 'hago', 'haces', 'hacemos', 'hacéis', 'hacía',
            'hacían', 'hice', 'hicieron', 'hará', 'harán', 'hecho', 'haciendo',
            'poder', 'puede', 'pueden', 'puedo', 'puedes', 'podemos', 'podéis', 'podía',
            'podían', 'pude', 'pudieron', 'podrá', 'podrán', 'podido', 'pudiendo',
            'decir', 'dice', 'dicen', 'digo', 'dices', 'decimos', 'decís', 'decía',
            'decían', 'dije', 'dijeron', 'dirá', 'dirán', 'dicho', 'diciendo',
            'ir', 'va', 'van', 'voy', 'vas', 'vamos', 'vais', 'iba', 'iban', 'fue',
            'fueron', 'irá', 'irán', 'ido', 'yendo',
            'ver', 've', 'ven', 'veo', 'ves', 'vemos', 'veis', 'veía', 'veían', 'vi',
            'vieron', 'verá', 'verán', 'visto', 'viendo',
            'dar', 'da', 'dan', 'doy', 'das', 'damos', 'dais', 'daba', 'daban', 'di',
            'dieron', 'dará', 'darán', 'dado', 'dando',
            'saber', 'sabe', 'saben', 'sé', 'sabes', 'sabemos', 'sabéis', 'sabía',
            'sabían', 'supe', 'supieron', 'sabrá', 'sabrán', 'sabido', 'sabiendo',
            'querer', 'quiere', 'quieren', 'quiero', 'quieres', 'queremos', 'queréis',
            'quería', 'querían', 'quise', 'quisieron', 'querrá', 'querrán', 'querido',
            'queriendo',
            'llegar', 'llega', 'llegan', 'llegué', 'llegaste', 'llegamos', 'llegasteis',
            'llegaba', 'llegaban', 'llegó', 'llegaron', 'llegará', 'llegarán',
            'pasar', 'pasa', 'pasan', 'paso', 'pasas', 'pasamos', 'pasáis', 'pasaba',
            'pasaban', 'pasé', 'pasaron', 'pasará', 'pasarán', 'pasado', 'pasando',
            'deber', 'debe', 'deben', 'debo', 'debes', 'debemos', 'debéis', 'debía',
            'debían', 'debí', 'debieron', 'deberá', 'deberán', 'debido', 'debiendo',
            'poner', 'pone', 'ponen', 'pongo', 'pones', 'ponemos', 'ponéis', 'ponía',
            'ponían', 'puse', 'pusieron', 'pondrá', 'pondrán', 'puesto', 'poniendo',
            'parecer', 'parece', 'parecen', 'parezco', 'pareces', 'parecemos', 'parecéis',
            'parecía', 'parecían', 'pareció', 'parecieron', 'parecerá', 'parecerán',
            'quedar', 'queda', 'quedan', 'quedo', 'quedas', 'quedamos', 'quedáis',
            'quedaba', 'quedaban', 'quedó', 'quedaron', 'quedará', 'quedarán',
            'hablar', 'habla', 'hablan', 'hablo', 'hablas', 'hablamos', 'habláis',
            'hablaba', 'hablaban', 'habló', 'hablaron', 'hablará', 'hablarán',
            'llevar', 'lleva', 'llevan', 'llevo', 'llevas', 'llevamos', 'lleváis',
            'llevaba', 'llevaban', 'llevó', 'llevaron', 'llevará', 'llevarán',
            'seguir', 'sigue', 'siguen', 'sigo', 'sigues', 'seguimos', 'seguís',
            'seguía', 'seguían', 'seguí', 'siguieron', 'seguirá', 'seguirán',
            'encontrar', 'encuentra', 'encuentran', 'encuentro', 'encuentras',
            'encontramos', 'encontráis', 'encontraba', 'encontraban', 'encontró',
            'encontraron', 'encontrará', 'encontrarán',
            'llamar', 'llama', 'llaman', 'llamo', 'llamas', 'llamamos', 'llamáis',
            'llamaba', 'llamaban', 'llamó', 'llamaron', 'llamará', 'llamarán',
            'venir', 'viene', 'vienen', 'vengo', 'vienes', 'venimos', 'venís',
            'venía', 'venían', 'vino', 'vinieron', 'vendrá', 'vendrán',
            'pensar', 'piensa', 'piensan', 'pienso', 'piensas', 'pensamos', 'pensáis',
            'pensaba', 'pensaban', 'pensó', 'pensaron', 'pensará', 'pensarán',
            'salir', 'sale', 'salen', 'salgo', 'sales', 'salimos', 'salís', 'salía',
            'salían', 'salió', 'salieron', 'saldrá', 'saldrán',
            'volver', 'vuelve', 'vuelven', 'vuelvo', 'vuelves', 'volvemos', 'volvéis',
            'volvía', 'volvían', 'volvió', 'volvieron', 'volverá', 'volverán',
            'tomar', 'toma', 'toman', 'tomo', 'tomas', 'tomamos', 'tomáis', 'tomaba',
            'tomaban', 'tomó', 'tomaron', 'tomará', 'tomarán',
            'tratar', 'trata', 'tratan', 'trato', 'tratas', 'tratamos', 'tratáis',
            'trataba', 'trataban', 'trató', 'trataron', 'tratará', 'tratarán',
            'mirar', 'mira', 'miran', 'miro', 'miras', 'miramos', 'miráis', 'miraba',
            'miraban', 'miró', 'miraron', 'mirará', 'mirarán',
            'contar', 'cuenta', 'cuentan', 'cuento', 'cuentas', 'contamos', 'contáis',
            'contaba', 'contaban', 'contó', 'contaron', 'contará', 'contarán',
            'empezar', 'empieza', 'empiezan', 'empiezo', 'empiezas', 'empezamos',
            'empezáis', 'empezaba', 'empezaban', 'empezó', 'empezaron', 'empezará',
            'empezarán',
            'esperar', 'espera', 'esperan', 'espero', 'esperas', 'esperamos', 'esperáis',
            'esperaba', 'esperaban', 'esperó', 'esperaron', 'esperará', 'esperarán',
            'buscar', 'busca', 'buscan', 'busco', 'buscas', 'buscamos', 'buscáis',
            'buscaba', 'buscaban', 'buscó', 'buscaron', 'buscará', 'buscarán',
            'existir', 'existe', 'existen', 'existo', 'existes', 'existimos', 'existís',
            'existía', 'existían', 'existió', 'existieron', 'existirá', 'existirán',
            'entrar', 'entra', 'entran', 'entro', 'entras', 'entramos', 'entráis',
            'entraba', 'entraban', 'entró', 'entraron', 'entrará', 'entrarán',
            'trabajar', 'trabaja', 'trabajan', 'trabajo', 'trabajas', 'trabajamos',
            'trabajáis', 'trabajaba', 'trabajaban', 'trabajó', 'trabajaron',
            'trabajará', 'trabajarán',
            'escribir', 'escribe', 'escriben', 'escribo', 'escribes', 'escribimos',
            'escribís', 'escribía', 'escribían', 'escribió', 'escribieron',
            'escribirá', 'escribirán',
            'perder', 'pierde', 'pierden', 'pierdo', 'pierdes', 'perdemos', 'perdéis',
            'perdía', 'perdían', 'perdió', 'perdieron', 'perderá', 'perderán',
            'ocurrir', 'ocurre', 'ocurren', 'ocurro', 'ocurres', 'ocurrimos', 'ocurrís',
            'ocurría', 'ocurrían', 'ocurrió', 'ocurrieron', 'ocurrirá', 'ocurrirán',
            'entender', 'entiende', 'entienden', 'entiendo', 'entiendes', 'entendemos',
            'entendéis', 'entendía', 'entendían', 'entendió', 'entendieron',
            'entenderá', 'entenderán',
            'pedir', 'pide', 'piden', 'pido', 'pides', 'pedimos', 'pedís', 'pedía',
            'pedían', 'pidió', 'pidieron', 'pedirá', 'pedirán',
            'recibir', 'recibe', 'reciben', 'recibo', 'recibes', 'recibimos', 'recibís',
            'recibía', 'recibían', 'recibió', 'recibieron', 'recibirá', 'recibirán',
            'recordar', 'recuerda', 'recuerdan', 'recuerdo', 'recuerdas', 'recordamos',
            'recordáis', 'recordaba', 'recordaban', 'recordó', 'recordaron',
            'recordará', 'recordarán',
            'terminar', 'termina', 'terminan', 'termino', 'terminas', 'terminamos',
            'termináis', 'terminaba', 'terminaban', 'terminó', 'terminaron',
            'terminará', 'terminarán',
            'aceptar', 'acepta', 'aceptan', 'acepto', 'aceptas', 'aceptamos', 'aceptáis',
            'aceptaba', 'aceptaban', 'aceptó', 'aceptaron', 'aceptará', 'aceptarán',
            'permitir', 'permite', 'permiten', 'permito', 'permites', 'permitimos',
            'permitís', 'permitía', 'permitían', 'permitió', 'permitieron',
            'permitirá', 'permitirán',
            'aparecer', 'aparece', 'aparecen', 'aparezco', 'apareces', 'aparecemos',
            'aparecéis', 'aparecía', 'aparecían', 'apareció', 'aparecieron',
            'aparecerá', 'aparecerán',
            'conseguir', 'consigue', 'consiguen', 'consigo', 'consigues', 'conseguimos',
            'conseguís', 'conseguía', 'conseguían', 'consiguió', 'consiguieron',
            'conseguirá', 'conseguirán',
            'comenzar', 'comienza', 'comienzan', 'comienzo', 'comienzas', 'comenzamos',
            'comenzáis', 'comenzaba', 'comenzaban', 'comenzó', 'comenzaron',
            'comenzará', 'comenzarán',
            'servir', 'sirve', 'sirven', 'sirvo', 'sirves', 'servimos', 'servís',
            'servía', 'servían', 'sirvió', 'sirvieron', 'servirá', 'servirán',
            'sacar', 'saca', 'sacan', 'saco', 'sacas', 'sacamos', 'sacáis', 'sacaba',
            'sacaban', 'sacó', 'sacaron', 'sacará', 'sacarán',
            'necesitar', 'necesita', 'necesitan', 'necesito', 'necesitas', 'necesitamos',
            'necesitáis', 'necesitaba', 'necesitaban', 'necesitó', 'necesitaron',
            'necesitará', 'necesitarán',
            'mantener', 'mantiene', 'mantienen', 'mantengo', 'mantienes', 'mantenemos',
            'mantenéis', 'mantenía', 'mantenían', 'mantuvo', 'mantuvieron',
            'mantendrá', 'mantendrán',
            'resultar', 'resulta', 'resultan', 'resulto', 'resultas', 'resultamos',
            'resultáis', 'resultaba', 'resultaban', 'resultó', 'resultaron',
            'resultará', 'resultarán',
            'leer', 'lee', 'leen', 'leo', 'lees', 'leemos', 'leéis', 'leía', 'leían',
            'leyó', 'leyeron', 'leerá', 'leerán',
            'caer', 'cae', 'caen', 'caigo', 'caes', 'caemos', 'caéis', 'caía', 'caían',
            'cayó', 'cayeron', 'caerá', 'caerán',
            'cambiar', 'cambia', 'cambian', 'cambio', 'cambias', 'cambiamos', 'cambiáis',
            'cambiaba', 'cambiaban', 'cambió', 'cambiaron', 'cambiará', 'cambiarán',
            'presentar', 'presenta', 'presentan', 'presento', 'presentas', 'presentamos',
            'presentáis', 'presentaba', 'presentaban', 'presentó', 'presentaron',
            'presentará', 'presentarán',
            'crear', 'crea', 'crean', 'creo', 'creas', 'creamos', 'creáis', 'creaba',
            'creaban', 'creó', 'crearon', 'creará', 'crearán',
            'abrir', 'abre', 'abren', 'abro', 'abres', 'abrimos', 'abrís', 'abría',
            'abrían', 'abrió', 'abrieron', 'abrirá', 'abrirán',
            'considerar', 'considera', 'consideran', 'considero', 'consideras',
            'consideramos', 'consideráis', 'consideraba', 'consideraban', 'consideró',
            'consideraron', 'considerará', 'considerarán',
            'oír', 'oye', 'oyen', 'oigo', 'oyes', 'oímos', 'oís', 'oía', 'oían',
            'oyó', 'oyeron', 'oirá', 'oirán',
            'acabar', 'acaba', 'acaban', 'acabo', 'acabas', 'acabamos', 'acabáis',
            'acababa', 'acababan', 'acabó', 'acabaron', 'acabará', 'acabarán',
            'convertir', 'convierte', 'convierten', 'convierto', 'conviertes',
            'convertimos', 'convertís', 'convertía', 'convertían', 'convirtió',
            'convirtieron', 'convertirá', 'convertirán',
            'ganar', 'gana', 'ganan', 'gano', 'ganas', 'ganamos', 'ganáis', 'ganaba',
            'ganaban', 'ganó', 'ganaron', 'ganará', 'ganarán',
            'formar', 'forma', 'forman', 'formo', 'formas', 'formamos', 'formáis',
            'formaba', 'formaban', 'formó', 'formaron', 'formará', 'formarán',
            'traer', 'trae', 'traen', 'traigo', 'traes', 'traemos', 'traéis', 'traía',
            'traían', 'trajo', 'trajeron', 'traerá', 'traerán',
            'partir', 'parte', 'parten', 'parto', 'partes', 'partimos', 'partís',
            'partía', 'partían', 'partió', 'partieron', 'partirá', 'partirán',
            'morir', 'muere', 'mueren', 'muero', 'mueres', 'morimos', 'morís',
            'moría', 'morían', 'murió', 'murieron', 'morirá', 'morirán',
            'realizar', 'realiza', 'realizan', 'realizo', 'realizas', 'realizamos',
            'realizáis', 'realizaba', 'realizaban', 'realizó', 'realizaron',
            'realizará', 'realizarán',
            'suponer', 'supone', 'suponen', 'supongo', 'supones', 'suponemos',
            'suponéis', 'suponía', 'suponían', 'supuso', 'supusieron', 'supondrá',
            'supondrán',
            'comprender', 'comprende', 'comprenden', 'comprendo', 'comprendes',
            'comprendemos', 'comprendéis', 'comprendía', 'comprendían', 'comprendió',
            'comprendieron', 'comprenderá', 'comprenderán',
            'lograr', 'logra', 'logran', 'logro', 'logras', 'logramos', 'lográis',
            'lograba', 'lograban', 'logró', 'lograron', 'logrará', 'lograrán',
            'explicar', 'explica', 'explican', 'explico', 'explicas', 'explicamos',
            'explicáis', 'explicaba', 'explicaban', 'explicó', 'explicaron',
            'explicará', 'explicarán',
            'preguntar', 'pregunta', 'preguntan', 'pregunto', 'preguntas', 'preguntamos',
            'preguntáis', 'preguntaba', 'preguntaban', 'preguntó', 'preguntaron',
            'preguntará', 'preguntarán',
            'tocar', 'toca', 'tocan', 'toco', 'tocas', 'tocamos', 'tocáis', 'tocaba',
            'tocaban', 'tocó', 'tocaron', 'tocará', 'tocarán',
            // Adverbios comunes
            'más', 'muy', 'mucho', 'poco', 'tan', 'tanto', 'también', 'tampoco',
            'ya', 'aún', 'todavía', 'ahora', 'entonces', 'después', 'antes', 'siempre',
            'nunca', 'jamás', 'aquí', 'allí', 'allá', 'ahí', 'así', 'bien', 'mal',
            'mejor', 'peor', 'casi', 'solo', 'solamente', 'incluso', 'además', 'igual',
            'tampoco', 'también', 'recién', 'recien',
            // Conectores y otras palabras comunes
            'todo', 'toda', 'todos', 'todas', 'cada', 'cualquier', 'alguno', 'alguna',
            'algunos', 'algunas', 'ninguno', 'ninguna', 'mismo', 'misma', 'mismos',
            'mismas', 'otro', 'otra', 'otros', 'otras', 'varios', 'varias', 'muchos',
            'muchas', 'pocos', 'pocas', 'ambos', 'ambas', 'bueno', 'buena', 'buenos',
            'buenas', 'malo', 'mala', 'malos', 'malas', 'gran', 'grande', 'grandes',
            'pequeño', 'pequeña', 'pequeños', 'pequeñas',
            // Números comunes
            'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
            'diez', 'cien', 'mil',
            // Tiempo
            'año', 'años', 'día', 'días', 'mes', 'meses', 'semana', 'semanas', 'hora',
            'horas', 'minuto', 'minutos', 'tiempo', 'vez', 'veces', 'momento',
            // Palabras de chat comunes
            'jajaja', 'jajajaja', 'jajajajaja', 'jajajajajaja', 'ahre', 'lpm', 'lol',
            'https', 'http', 'www', 'com', 'multimedia', 'omitido', 'vm', 'tiktok',
            'x.com', 'twitter'
        ]);
        
        for (const msg of this.messages) {
            const author = msg.author;
            const message = msg.message;
            
            // Saltar mensajes que son solo multimedia o links
            if (message.includes('<Multimedia omitido>') || message.startsWith('http')) {
                continue;
            }
            
            // Dividir en palabras
            const words = message.split(/\s+/);
            
            for (const word of words) {
                const cleaned = this.cleanWord(word);
                
                // Filtrar palabras vacías, muy cortas (menos de 4 caracteres) y stop words
                if (cleaned && cleaned.length >= 4 && !stopWords.has(cleaned)) {
                    if (!this.wordCountByPerson.has(author)) {
                        this.wordCountByPerson.set(author, new Map());
                    }
                    const wordMap = this.wordCountByPerson.get(author);
                    wordMap.set(cleaned, (wordMap.get(cleaned) || 0) + 1);
                }
            }
        }
    }

    analyzeMessageStats() {
        /**Analiza estadísticas de mensajes: cantidad, inicios, finales y tiempos de respuesta*/
        // Contar mensajes por persona
        for (const msg of this.messages) {
            const author = msg.author;
            this.messageCountByPerson.set(author, (this.messageCountByPerson.get(author) || 0) + 1);
        }
        
        // Analizar inicios y finales de conversación, y tiempos de respuesta
        // Consideramos un inicio de conversación cuando hay un gap de más de 2 horas
        // Consideramos un final cuando alguien es el último en responder antes de un gap
        const GAP_THRESHOLD = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
        
        if (this.messages.length < 2) {
            return;
        }
        
        // Detectar inicios de conversación
        for (let i = 1; i < this.messages.length; i++) {
            const prevMsg = this.messages[i - 1];
            const currMsg = this.messages[i];
            
            if (prevMsg.timestamp && currMsg.timestamp) {
                const timeDiff = currMsg.timestamp.getTime() - prevMsg.timestamp.getTime();
                
                // Si hay un gap grande, el mensaje actual inicia una conversación
                if (timeDiff > GAP_THRESHOLD) {
                    this.conversationStarts.set(currMsg.author, (this.conversationStarts.get(currMsg.author) || 0) + 1);
                    // El mensaje anterior termina una conversación
                    this.conversationEnds.set(prevMsg.author, (this.conversationEnds.get(prevMsg.author) || 0) + 1);
                }
            }
        }
        
        // El último mensaje siempre termina una conversación
        if (this.messages.length > 0) {
            const lastAuthor = this.messages[this.messages.length - 1].author;
            this.conversationEnds.set(lastAuthor, (this.conversationEnds.get(lastAuthor) || 0) + 1);
        }
        
        // Calcular tiempos de respuesta
        // Un tiempo de respuesta es cuando alguien responde a otro (diferente autor)
        for (let i = 1; i < this.messages.length; i++) {
            const prevMsg = this.messages[i - 1];
            const currMsg = this.messages[i];
            
            // Solo consideramos respuesta si es de un autor diferente
            if (prevMsg.author !== currMsg.author) {
                if (prevMsg.timestamp && currMsg.timestamp) {
                    const timeDiff = currMsg.timestamp.getTime() - prevMsg.timestamp.getTime();
                    
                    // Solo consideramos respuestas rápidas (menos de 24 horas)
                    const oneDay = 24 * 60 * 60 * 1000;
                    if (timeDiff < oneDay && timeDiff > 0) {
                        // Guardar en minutos
                        const responseMinutes = timeDiff / (60 * 1000);
                        if (!this.responseTimes.has(currMsg.author)) {
                            this.responseTimes.set(currMsg.author, []);
                        }
                        this.responseTimes.get(currMsg.author).push(responseMinutes);
                    }
                }
            }
        }
    }

    getAverageResponseTime(author) {
        /**Obtiene el tiempo promedio de respuesta de una persona en minutos*/
        if (!this.responseTimes.has(author) || this.responseTimes.get(author).length === 0) {
            return null;
        }
        const times = this.responseTimes.get(author);
        return times.reduce((sum, time) => sum + time, 0) / times.length;
    }

    getPodium(topN = 10) {
        /**Genera el podio de palabras más usadas con sus autores*/
        // Crear un diccionario: palabra -> [(autor, cantidad), ...]
        const wordRankings = new Map();
        
        for (const [author, wordCounter] of this.wordCountByPerson.entries()) {
            for (const [word, count] of wordCounter.entries()) {
                if (!wordRankings.has(word)) {
                    wordRankings.set(word, []);
                }
                wordRankings.get(word).push([author, count]);
            }
        }
        
        // Ordenar cada palabra por cantidad (de mayor a menor)
        for (const [word, authorList] of wordRankings.entries()) {
            authorList.sort((a, b) => b[1] - a[1]);
        }
        
        // Crear lista de (palabra, autor_principal, cantidad_total, todos_los_autores)
        const podiumData = [];
        for (const [word, authorList] of wordRankings.entries()) {
            const totalCount = authorList.reduce((sum, [, count]) => sum + count, 0);
            const [mainAuthor, mainCount] = authorList[0];
            podiumData.push({
                word: word,
                main_author: mainAuthor,
                main_count: mainCount,
                total_count: totalCount,
                all_authors: authorList.map(([a, c]) => ({ author: a, count: c }))
            });
        }
        
        // Ordenar por cantidad total (de mayor a menor)
        podiumData.sort((a, b) => b.total_count - a.total_count);
        
        return podiumData.slice(0, topN);
    }

    exportToJson() {
        /**Exporta todos los datos a un objeto JSON para la web*/
        // Preparar datos de mensajes
        const messageStats = Array.from(this.messageCountByPerson.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([author, count]) => ({ author, count }));
        
        // Preparar datos de inicios de conversación
        const conversationStarts = Array.from(this.conversationStarts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([author, count]) => ({ author, count }));
        
        // Preparar datos de finales de conversación
        const conversationEnds = Array.from(this.conversationEnds.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([author, count]) => ({ author, count }));
        
        // Preparar datos de tiempos de respuesta
        const responseTimes = [];
        for (const author of this.responseTimes.keys()) {
            const avgTime = this.getAverageResponseTime(author);
            if (avgTime !== null) {
                responseTimes.push({
                    author: author,
                    avg_minutes: Math.round(avgTime * 10) / 10,
                    avg_hours: avgTime >= 60 ? Math.round((avgTime / 60) * 10) / 10 : null
                });
            }
        }
        responseTimes.sort((a, b) => a.avg_minutes - b.avg_minutes);
        
        // Preparar podio de palabras
        const podium = this.getPodium(10);
        const wordsPodium = podium.map(entry => ({
            word: entry.word,
            main_author: entry.main_author,
            main_count: entry.main_count,
            total_count: entry.total_count,
            all_authors: entry.all_authors
        }));
        
        // Crear estructura de datos
        const data = {
            group_name: this.groupName || "Grupo de WhatsApp",
            message_stats: messageStats,
            conversation_starts: conversationStarts,
            conversation_ends: conversationEnds,
            response_times: responseTimes,
            words_podium: wordsPodium,
            total_messages: this.messages.length,
            total_people: this.wordCountByPerson.size
        };
        
        return data;
    }

    analyze(content) {
        /**Ejecuta el análisis completo*/
        this.parseChat(content);
        this.analyzeMessageStats();
        this.countWords();
        return this.exportToJson();
    }
}

