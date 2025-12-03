// Función para generar avatar genérico basado en iniciales
function generateAvatar(name) {
    // Obtener iniciales
    const words = name.trim().split(/\s+/);
    let initials = '';
    if (words.length >= 2) {
        initials = words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
    } else {
        initials = name.substring(0, 2).toUpperCase();
    }
    
    // Colores para los avatares (paleta consistente)
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
        '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea',
        '#fed6e3', '#a8caba', '#5d4e75', '#ffecd2', '#fcb69f'
    ];
    
    // Generar color basado en el nombre (hash simple)
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    const bgColor = colors[colorIndex];
    
    // Crear canvas para el avatar
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Dibujar círculo de fondo
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(100, 100, 100, 0, 2 * Math.PI);
    ctx.fill();
    
    // Dibujar texto (iniciales)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 100, 100);
    
    return canvas.toDataURL();
}

// Cache de avatares generados
const avatarCache = new Map();

// Función para obtener avatar (genérico o desde cache)
function getAvatarPath(authorName) {
    // Verificar cache primero
    if (avatarCache.has(authorName)) {
        return avatarCache.get(authorName);
    }
    
    // Generar nuevo avatar
    const avatarDataUrl = generateAvatar(authorName);
    avatarCache.set(authorName, avatarDataUrl);
    return avatarDataUrl;
}
// Función para crear confeti
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
    }
      setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}
// Función para crear un podio
function createPodium(data, containerId, valueFormatter, showConfetti = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const top3 = data.slice(0, 3);
    const medals = ['🥇', '🥈', '🥉'];
    const classes = ['first', 'second', 'third'];
    
    top3.forEach((item, index) => {
        const podiumItem = document.createElement('div');
        podiumItem.className = 'podium-item';
        podiumItem.style.animationDelay = `${index * 0.2}s`;
        
        const podiumPlace = document.createElement('div');
        podiumPlace.className = `podium-place ${classes[index]}`;
        
        const avatarPath = getAvatarPath(item.author);
        
        podiumPlace.innerHTML = `
            <div class="podium-avatar-container">
                <img src="${avatarPath}" alt="${item.author}" class="avatar">
                <div class="medal">${medals[index]}</div>
                <div class="podium-name">${item.author}</div>
                <div class="podium-value">${valueFormatter(item)}</div>
            </div>
        `;
        
        podiumItem.appendChild(podiumPlace);
        container.appendChild(podiumItem);
    });
    // Lanzar confeti solo para el primer podio (más mensajes)
    if (showConfetti && top3.length > 0) {
        setTimeout(() => createConfetti(), 1000);
    }
}
// Función para crear tabla de tiempos de respuesta
function createResponseTable(data) {
    const tbody = document.getElementById('responseTable');
    tbody.innerHTML = '';
    
    // Filtrar "Meta AI" de los tiempos de respuesta
    const filteredData = data.filter(item => 
        !item.author.toLowerCase().includes('meta ai') && 
        item.author !== 'Meta AI'
    );
    
    const medals = ['🥇', '🥈', '🥉'];
    
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        const medal = index < 3 ? medals[index] : `${index + 1}.`;
        const timeStr = item.avg_hours 
            ? `${item.avg_hours} horas` 
            : `${item.avg_minutes} minutos`;
        
        const avatarPath = getAvatarPath(item.author);
        
        row.innerHTML = `
            <td><span class="rank-badge ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${medal}</span></td>
            <td>
                <img src="${avatarPath}" alt="${item.author}" class="avatar-small">
                <strong>${item.author}</strong>
            </td>
            <td><span class="time-badge">${timeStr}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}
// Función para crear grid de palabras
function createWordsGrid(data) {
    const grid = document.getElementById('wordsGrid');
    grid.innerHTML = '';
    
    const medals = ['🥇', '🥈', '🥉'];
    
    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'word-card';
        
        const medal = index < 3 ? medals[index] : `${index + 1}.`;
        
        const championAvatarPath = getAvatarPath(item.main_author);
        
        let otherAuthors = '';
        if (item.all_authors.length > 1) {
            otherAuthors = '<div style="margin-top: 10px; font-size: 0.9em;">';
            item.all_authors.slice(1, 4).forEach(author => {
                const authorAvatarPath = getAvatarPath(author.author);
                otherAuthors += `
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <img src="${authorAvatarPath}" alt="${author.author}" class="avatar-word">
                        <span>${author.author}: ${author.count} veces</span>
                    </div>
                `;
            });
            otherAuthors += '</div>';
        }
        
        card.innerHTML = `
            <div class="word-title">${medal} ${item.word.toUpperCase()}</div>
            <div class="word-champion" style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <img src="${championAvatarPath}" alt="${item.main_author}" class="avatar-word">
                <span>👤 Campeón/a: ${item.main_author}</span>
            </div>
            <div class="word-stats">
                ${item.main_count} veces (de ${item.total_count} total)
            </div>
            ${otherAuthors}
        `;
        
        grid.appendChild(card);
    });
}
// Variables globales
let appData = null;
let currentSection = 'messagesSection';
// Calcular puntaje general
function calculateOverallScore(data) {
    const scores = {};
    const people = new Set();
    
    // Recopilar todas las personas (excluyendo Meta AI)
    data.message_stats.forEach(item => {
        if (!item.author.toLowerCase().includes('meta ai')) {
            people.add(item.author);
            scores[item.author] = { total: 0, details: {} };
        }
    });
    
    // Puntaje por mensajes (máximo 25 puntos)
    const maxMessages = Math.max(...data.message_stats.map(m => m.count));
    data.message_stats.forEach(item => {
        if (scores[item.author]) {
            const points = Math.round((item.count / maxMessages) * 25);
            scores[item.author].total += points;
            scores[item.author].details.mensajes = points;
        }
    });
    
    // Puntaje por inicios de conversación (máximo 25 puntos)
    const maxStarts = Math.max(...data.conversation_starts.map(s => s.count));
    data.conversation_starts.forEach(item => {
        if (scores[item.author]) {
            const points = Math.round((item.count / maxStarts) * 25);
            scores[item.author].total += points;
            scores[item.author].details.inicios = points;
        }
    });
    
    // Puntaje por finales de conversación (máximo 20 puntos)
    const maxEnds = Math.max(...data.conversation_ends.map(e => e.count));
    data.conversation_ends.forEach(item => {
        if (scores[item.author]) {
            const points = Math.round((item.count / maxEnds) * 20);
            scores[item.author].total += points;
            scores[item.author].details.finales = points;
        }
    });
    
    // Puntaje por velocidad de respuesta (máximo 20 puntos - menor tiempo = más puntos)
    const filteredResponses = data.response_times.filter(r => 
        !r.author.toLowerCase().includes('meta ai')
    );
    if (filteredResponses.length > 0) {
        const minTime = Math.min(...filteredResponses.map(r => r.avg_minutes));
        const maxTime = Math.max(...filteredResponses.map(r => r.avg_minutes));
        filteredResponses.forEach(item => {
            if (scores[item.author]) {
                // Invertir: menor tiempo = más puntos
                const normalized = (maxTime - item.avg_minutes) / (maxTime - minTime);
                const points = Math.round(normalized * 20);
                scores[item.author].total += points;
                scores[item.author].details.velocidad = points;
            }
        });
    }
    
    // Puntaje por palabras ganadas (máximo 10 puntos)
    const wordWins = {};
    data.words_podium.forEach((word, index) => {
        if (word.main_author && scores[word.main_author]) {
            if (!wordWins[word.main_author]) wordWins[word.main_author] = 0;
            wordWins[word.main_author] += (10 - index); // Más puntos para top palabras
        }
    });
    Object.keys(wordWins).forEach(author => {
        if (scores[author]) {
            const points = Math.min(10, wordWins[author]);
            scores[author].total += points;
            scores[author].details.palabras = points;
        }
    });
    
    // Convertir a array y ordenar
    return Array.from(Object.entries(scores))
        .map(([author, score]) => ({ author, ...score }))
        .sort((a, b) => b.total - a.total);
}
// Crear podio general
function createOverallPodium(scores) {
    const container = document.getElementById('overallPodium');
    container.innerHTML = '';
    
    const top3 = scores.slice(0, 3);
    const medals = ['🥇', '🥈', '🥉'];
    const classes = ['first', 'second', 'third'];
    
    top3.forEach((item, index) => {
        const podiumItem = document.createElement('div');
        podiumItem.className = `overall-podium-item ${classes[index]}`;
        podiumItem.style.animationDelay = `${index * 0.2}s`;
        
        const avatarPath = getAvatarPath(item.author);
        const details = Object.entries(item.details)
            .map(([key, value]) => `${key}: ${value}pts`)
            .join(' • ');
        
        podiumItem.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; color: #333;">
                <img src="${avatarPath}" alt="${item.author}" class="avatar" style="width: 100px; height: 100px;">
                <div style="color: #333;">
                    <div style="font-size: 2em; margin-bottom: 10px; color: #333; font-weight: bold;">${medals[index]} ${item.author}</div>
                    <div class="overall-score" style="color: #333;">${item.total} puntos</div>
                    <div class="overall-details" style="color: #555;">${details}</div>
                </div>
            </div>
        `;
        
        container.appendChild(podiumItem);
    });
    
    // Mostrar todos los participantes
    if (scores.length > 3) {
        const allParticipants = document.createElement('div');
        allParticipants.style.marginTop = '40px';
        allParticipants.innerHTML = '<h3 style="color: black; margin-bottom: 20px; font-size: 1.5em; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">📊 Ranking Completo</h3>';
        
        scores.forEach((item, index) => {
            const participant = document.createElement('div');
            participant.style.cssText = 'background: rgba(255,255,255,0.3); padding: 15px; margin: 10px 0; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; color: #333;';
            participant.style.animationDelay = `${(index + 3) * 0.1}s`;
            participant.style.animation = 'slideInUp 0.5s ease both';
            
            const avatarPath = getAvatarPath(item.author);
            participant.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px; color: #333;">
                    <span style="font-size: 1.5em; width: 40px; color: #333; font-weight: bold;">${index + 1}.</span>
                    <img src="${avatarPath}" alt="${item.author}" class="avatar-small">
                    <strong style="font-size: 1.2em; color: #333;">${item.author}</strong>
                </div>
                <div style="font-size: 1.3em; font-weight: bold; color: #333;">${item.total} pts</div>
            `;
            allParticipants.appendChild(participant);
        });
        
        container.appendChild(allParticipants);
    }
    
    // Lanzar confeti para el ganador
    setTimeout(() => createConfetti(), 500);
}
// Orden de las secciones
const sectionOrder = [
    'messagesSection',
    'startsSection',
    'responseSection',
    'endsSection',
    'wordsSection',
    'finalSection'
];

// Función para obtener la siguiente sección
function getNextSection(currentSectionId) {
    const currentIndex = sectionOrder.indexOf(currentSectionId);
    if (currentIndex !== -1 && currentIndex < sectionOrder.length - 1) {
        return sectionOrder[currentIndex + 1];
    }
    return null;
}

// Navegación entre secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        currentSection = sectionId;
        
        // Actualizar botones de navegación
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('pulse');
            
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });
        
        // Agregar efecto de pulso al botón de la siguiente sección
        const nextSectionId = getNextSection(sectionId);
        if (nextSectionId) {
            const nextButton = document.querySelector(`.nav-button[data-section="${nextSectionId}"]`);
            if (nextButton) {
                // Esperar un poco antes de iniciar la animación
                setTimeout(() => {
                    nextButton.classList.add('pulse');
                }, 500);
            }
        }
        
        // Scroll suave al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
// Función para actualizar meta tags dinámicamente
function updateMetaTags(groupName) {
    // Actualizar meta title
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) {
        metaTitle.setAttribute('content', `🏆 WhatsApp Wrapped - ${groupName}`);
    }
    
    // Actualizar Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', `🏆 WhatsApp Wrapped - ${groupName}`);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', `Descubre quién domina ${groupName}. Estadísticas gamificadas con podios, rankings y métricas divertidas.`);
    }
    
    // Actualizar Twitter
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', `🏆 WhatsApp Wrapped - ${groupName}`);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', `Descubre quién domina ${groupName}. Estadísticas gamificadas con podios, rankings y métricas divertidas.`);
    }
    
    // Actualizar description general
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `Descubre quién domina ${groupName}. Estadísticas gamificadas: quién envió más mensajes, quién respondió más rápido, podio de palabras y más.`);
    }
}

// Función para extraer contenido de archivo ZIP
async function extractZipContent(file) {
    try {
        const zip = await JSZip.loadAsync(file);
        // Buscar el archivo .txt dentro del ZIP
        for (const fileName in zip.files) {
            if (fileName.endsWith('.txt')) {
                const txtFile = zip.files[fileName];
                return await txtFile.async('string');
            }
        }
        throw new Error('No se encontró archivo .txt en el ZIP');
    } catch (error) {
        throw new Error('Error al extraer el archivo ZIP: ' + error.message);
    }
}

// Función para leer contenido de archivo TXT
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        console.log('Iniciando lectura de archivo TXT:', file.name);
        
        // Validar que el archivo existe y tiene tamaño
        if (!file || file.size === 0) {
            reject(new Error('El archivo está vacío o no se pudo acceder'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            console.log('Archivo leído exitosamente, tamaño del contenido:', e.target.result.length);
            if (!e.target.result || e.target.result.length === 0) {
                reject(new Error('El archivo está vacío'));
                return;
            }
            resolve(e.target.result);
        };
        
        reader.onerror = (e) => {
            console.error('Error en FileReader:', e);
            reject(new Error('Error al leer el archivo. Verifica que el archivo no esté corrupto.'));
        };
        
        reader.onabort = () => {
            console.error('Lectura de archivo abortada');
            reject(new Error('La lectura del archivo fue cancelada'));
        };
        
        // Intentar leer con diferentes encodings si falla UTF-8
        try {
            reader.readAsText(file, 'utf-8');
        } catch (error) {
            console.error('Error al iniciar lectura:', error);
            reject(new Error('No se pudo iniciar la lectura del archivo: ' + error.message));
        }
    });
}

// Función para procesar archivo subido
async function processUploadedFile(file) {
    const uploadStatus = document.getElementById('uploadStatus');
    const uploadArea = document.getElementById('uploadArea');
    const statusText = document.getElementById('uploadStatusText') || uploadStatus.querySelector('p');
    
    // Validar que el archivo existe
    if (!file) {
        console.error('No se seleccionó ningún archivo');
        statusText.textContent = '❌ Error: No se seleccionó ningún archivo';
        statusText.style.color = '#ffcccc';
        uploadArea.style.display = 'block';
        uploadStatus.style.display = 'block';
        return;
    }
    
    console.log('Archivo seleccionado:', file.name, 'Tamaño:', file.size, 'bytes');
    
    // Ocultar área de upload y mostrar estado
    uploadArea.style.display = 'none';
    uploadStatus.style.display = 'flex'; // Cambiar a flex para mejor visualización
    statusText.textContent = '📁 Archivo seleccionado: ' + file.name;
    statusText.style.color = '#ffffff';
    
    // Asegurar que el spinner sea visible
    const spinner = uploadStatus.querySelector('.spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
    
    // Pequeño delay para que el usuario vea el feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        let content;
        
        // Determinar si es ZIP o TXT
        statusText.textContent = '📦 Leyendo archivo...';
        console.log('Leyendo archivo:', file.name);
        
        if (file.name.endsWith('.zip')) {
            statusText.textContent = '📦 Extrayendo contenido del ZIP...';
            content = await extractZipContent(file);
            console.log('Contenido extraído del ZIP, longitud:', content.length);
        } else if (file.name.endsWith('.txt')) {
            statusText.textContent = '📄 Leyendo archivo de texto...';
            content = await readTextFile(file);
            console.log('Archivo TXT leído, longitud:', content.length);
        } else {
            throw new Error('Formato de archivo no soportado. Use .txt o .zip');
        }
        
        // Validar que el contenido no esté vacío
        if (!content || content.length === 0) {
            throw new Error('El archivo está vacío o no se pudo leer correctamente');
        }
        
        // Analizar el contenido
        statusText.textContent = '🔍 Analizando mensajes...';
        console.log('Iniciando análisis del chat...');
        
        const analyzer = new WhatsAppAnalyzer();
        const data = analyzer.analyze(content);
        
        console.log('Análisis completado:', data);
        
        // Guardar en localStorage
        statusText.textContent = '💾 Guardando datos...';
        localStorage.setItem('whatsapp_wrapped_data', JSON.stringify(data));
        console.log('Datos guardados en localStorage');
        
        // Ocultar upload y mostrar splash
        document.getElementById('uploadScreen').style.display = 'none';
        document.getElementById('splashScreen').style.display = 'flex';
        
        // Cargar y mostrar datos
        loadDataFromStorage();
        
    } catch (error) {
        console.error('Error procesando archivo:', error);
        console.error('Stack trace:', error.stack);
        
        let errorMessage = 'Error desconocido';
        if (error.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        // Ocultar spinner en caso de error
        const spinner = uploadStatus.querySelector('.spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
        
        statusText.textContent = `❌ Error: ${errorMessage}`;
        statusText.style.color = '#ffcccc';
        uploadArea.style.display = 'block';
        uploadStatus.style.display = 'flex';
        
        // Mostrar error también en consola para debugging
        console.error('Mensaje de error completo:', errorMessage);
        
        // Resetear el input para permitir seleccionar el mismo archivo de nuevo
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
    }
}

// Función para cargar datos desde localStorage
function loadDataFromStorage() {
    try {
        const storedData = localStorage.getItem('whatsapp_wrapped_data');
        if (!storedData) {
            throw new Error('No hay datos guardados');
        }
        
        appData = JSON.parse(storedData);
        
        // Actualizar pantalla de inicio y meta tags
        if (appData.group_name) {
            const groupName = appData.group_name;
            document.getElementById('splashGroupName').textContent = groupName;
            document.getElementById('groupNameDisplay').textContent = groupName;
            
            // Actualizar título de la página
            document.title = `🏆 WhatsApp Wrapped - ${groupName}`;
            
            // Actualizar meta tags dinámicamente
            updateMetaTags(groupName);
            
            // Actualizar imagen del grupo con avatar genérico
            const groupAvatar = getAvatarPath(groupName);
            const splashGroupImage = document.getElementById('splashGroupImage');
            const groupImage = document.getElementById('groupImage');
            if (splashGroupImage) {
                splashGroupImage.src = groupAvatar;
            }
            if (groupImage) {
                groupImage.src = groupAvatar;
            }
        } else {
            document.getElementById('splashGroupName').textContent = 'Grupo de WhatsApp';
        }
        
        // Mostrar botón de inicio después de un delay más corto
        setTimeout(() => {
            const startButton = document.getElementById('startButton');
            if (startButton) {
                startButton.classList.add('visible');
                console.log('Botón de inicio mostrado');
            }
        }, 1000);
        
        // Ocultar loading y mostrar contenido cuando se presione el botón
        document.getElementById('startButton').addEventListener('click', () => {
            const splashScreen = document.getElementById('splashScreen');
            splashScreen.classList.add('hidden');
            
            // Esperar a que termine la animación antes de mostrar el contenido
            setTimeout(() => {
                splashScreen.style.display = 'none';
                document.getElementById('mainContainer').style.display = 'block';
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'block';
                document.getElementById('navigation').style.display = 'flex';
                
                // Crear podios y tablas
                createPodium(appData.message_stats, 'messagesPodium', (item) => `${item.count} mensajes`, true);
                createPodium(appData.conversation_starts, 'startsPodium', (item) => `${item.count} conversaciones`);
                createPodium(appData.conversation_ends, 'endsPodium', (item) => `${item.count} conversaciones`);
                createResponseTable(appData.response_times);
                createWordsGrid(appData.words_podium);
                
                // Calcular y mostrar podio general
                const overallScores = calculateOverallScore(appData);
                createOverallPodium(overallScores);
                
                // Mostrar primera sección (esto también activará el pulso en el siguiente botón)
                showSection('messagesSection');
            }, 500);
        });
        
        // Configurar navegación
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.addEventListener('click', () => {
                showSection(btn.dataset.section);
            });
        });
        
        // Configurar botón de subir nuevo archivo
        const uploadNewButton = document.getElementById('uploadNewButton');
        if (uploadNewButton) {
            uploadNewButton.addEventListener('click', () => {
                showCustomModal(
                    'Subir nuevo archivo',
                    '¿Deseas subir un nuevo archivo? Esto reemplazará los datos actuales.',
                    () => {
                        localStorage.removeItem('whatsapp_wrapped_data');
                        location.reload();
                    }
                );
            });
        }
        
    } catch (error) {
        console.error('Error cargando datos:', error);
        // Si no hay datos, mostrar pantalla de upload
        document.getElementById('uploadScreen').style.display = 'flex';
        document.getElementById('splashScreen').style.display = 'none';
    }
}

// Cargar datos al iniciar (desde localStorage o mostrar upload)
function init() {
    // Configurar upload de archivos
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadStatus = document.getElementById('uploadStatus');
    
    // Función para manejar la selección de archivo
    function handleFileSelection(file) {
        console.log('Archivo seleccionado en handleFileSelection:', file);
        if (file) {
            // Validar tipo de archivo
            if (!file.name.endsWith('.txt') && !file.name.endsWith('.zip')) {
                const statusText = document.getElementById('uploadStatusText') || uploadStatus.querySelector('p');
                const spinner = uploadStatus.querySelector('.spinner');
                if (spinner) spinner.style.display = 'none';
                uploadStatus.style.display = 'flex';
                statusText.textContent = '❌ Error: Solo se aceptan archivos .txt o .zip';
                statusText.style.color = '#ffcccc';
                uploadArea.style.display = 'block';
                setTimeout(() => {
                    uploadStatus.style.display = 'none';
                }, 5000);
                return;
            }
            
            // Validar tamaño (máximo 50MB)
            if (file.size > 50 * 1024 * 1024) {
                const statusText = document.getElementById('uploadStatusText') || uploadStatus.querySelector('p');
                const spinner = uploadStatus.querySelector('.spinner');
                if (spinner) spinner.style.display = 'none';
                uploadStatus.style.display = 'flex';
                statusText.textContent = '❌ Error: El archivo es demasiado grande (máximo 50MB)';
                statusText.style.color = '#ffcccc';
                uploadArea.style.display = 'block';
                setTimeout(() => {
                    uploadStatus.style.display = 'none';
                }, 5000);
                return;
            }
            
            processUploadedFile(file);
        } else {
            console.log('No se seleccionó ningún archivo');
        }
    }
    
    // Múltiples eventos para mejor compatibilidad con Android
    fileInput.addEventListener('change', (e) => {
        console.log('Evento change disparado');
        const file = e.target.files[0];
        handleFileSelection(file);
    });
    
    // También escuchar el evento 'input' para Android
    fileInput.addEventListener('input', (e) => {
        console.log('Evento input disparado');
        const file = e.target.files[0];
        handleFileSelection(file);
    });
    
    // Click directo en el área de upload (para móviles)
    uploadArea.addEventListener('click', (e) => {
        // Solo si no se hizo click en el label directamente
        if (e.target === uploadArea || e.target.closest('.upload-label')) {
            fileInput.click();
        }
    });
    
    // Drag and drop (solo para desktop)
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.txt') || file.name.endsWith('.zip'))) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelection(file);
        }
    });
    
    // Configurar toggle del tutorial
    const tutorialToggle = document.getElementById('tutorialToggle');
    const tutorialContent = document.getElementById('tutorialContent');
    const tutorialArrow = tutorialToggle.querySelector('.tutorial-arrow');
    
    if (tutorialToggle && tutorialContent) {
        tutorialToggle.addEventListener('click', () => {
            const isVisible = tutorialContent.style.display !== 'none';
            tutorialContent.style.display = isVisible ? 'none' : 'block';
            tutorialArrow.textContent = isVisible ? '▼' : '▲';
            tutorialToggle.classList.toggle('active');
        });
    }
    
    // Intentar cargar datos desde localStorage
    const storedData = localStorage.getItem('whatsapp_wrapped_data');
    if (storedData) {
        // Ocultar upload y mostrar splash
        document.getElementById('uploadScreen').style.display = 'none';
        document.getElementById('splashScreen').style.display = 'flex';
        loadDataFromStorage();
    } else {
        // Mostrar pantalla de upload
        document.getElementById('uploadScreen').style.display = 'flex';
        document.getElementById('splashScreen').style.display = 'none';
    }
}

// Función para mostrar modal personalizado
function showCustomModal(title, message, onConfirm) {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Remover listeners previos
    const newConfirm = modalConfirm.cloneNode(true);
    const newCancel = modalCancel.cloneNode(true);
    modalConfirm.parentNode.replaceChild(newConfirm, modalConfirm);
    modalCancel.parentNode.replaceChild(newCancel, modalCancel);
    
    // Agregar nuevos listeners
    newConfirm.addEventListener('click', () => {
        hideCustomModal();
        if (onConfirm) onConfirm();
    });
    
    newCancel.addEventListener('click', () => {
        hideCustomModal();
    });
    
    // Cerrar al hacer clic en el overlay
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', () => {
        hideCustomModal();
    });
    
    // Mostrar modal con animación
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('visible');
    }, 10);
}

// Función para ocultar modal
function hideCustomModal() {
    const modal = document.getElementById('customModal');
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
