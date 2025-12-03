# 🏆 WhatsApp Wrapped - Chat Gamificado

Una aplicación web para analizar y visualizar estadísticas de tu chat de WhatsApp de forma gamificada. Todo funciona directamente en tu navegador, sin necesidad de servidores ni instalaciones.

## ✨ Características

- 🌐 **100% Web-based**: Funciona completamente en el navegador, sin necesidad de servidor
- 📤 **Subida de archivos**: Sube tu historial de chat directamente desde la interfaz
- 📦 **Soporte ZIP**: Acepta archivos `.txt` o `.zip` con el historial
- 💾 **LocalStorage**: Los datos se guardan localmente en tu navegador
- 🎨 **Avatares automáticos**: Genera avatares genéricos basados en iniciales
- 📱 **Responsive**: Diseño adaptado para móviles y tablets
- 🎊 **Gamificación**: Podios, medallas, confeti y rankings competitivos

## 📁 Estructura del Proyecto

```
whatsapp-wrapped/
├── index.html          # Página principal
├── script.js           # Lógica de la aplicación
├── analyzer.js         # Motor de análisis de chat
├── styles.css          # Estilos y animaciones
├── .gitignore          # Archivos ignorados por Git
└── README.md           # Este archivo
```

## 🚀 Cómo usar

### Opción 1: Usar desde GitHub Pages

Visita: [https://bigote97.github.io/whatsapp-wrapped/](https://bigote97.github.io/whatsapp-wrapped/)

### Opción 2: Ejecutar localmente

1. **Clona o descarga el repositorio**
   ```bash
   git clone https://github.com/bigote97/whatsapp-wrapped.git
   cd whatsapp-wrapped
   ```

2. **Abre `index.html` en tu navegador**
   - Haz doble clic en el archivo `index.html`
   - O arrastra el archivo a tu navegador
   - O usa un servidor local (opcional):
     ```bash
     # Con Python
     python -m http.server 8000
     
     # Con Node.js
     npx http-server
     ```
     Luego visita `http://localhost:8000`

3. **Exporta tu chat de WhatsApp**
   - Abre la conversación del grupo en WhatsApp
   - Toca el ícono de los tres puntos (⋮) en la esquina superior derecha
   - Selecciona "Más" → "Exportar chat"
   - Elige si incluir o no archivos multimedia (recomendamos "Sin multimedia")
   - Guarda el archivo `.txt` o `.zip` en tu dispositivo

4. **Sube el archivo en la aplicación**
   - Haz clic en el área de carga o arrastra el archivo
   - La aplicación analizará el chat automáticamente
   - Los datos se guardarán en tu navegador (localStorage)

5. **¡Disfruta de tus estadísticas!**
   - Navega por las diferentes secciones usando los botones inferiores
   - Cada sección muestra podios y rankings gamificados

## 📊 Métricas incluidas

- 💬 **Quién envió más mensajes** - Podio con los top 3 y ranking completo
- 🚀 **Quién inició más conversaciones** - Podio con los top 3
- ⚡ **Quién respondió más rápido** - Tabla con tiempos promedio de respuesta
- 🏁 **Quién terminó más conversaciones** - Podio con los top 3
- 🔤 **Podio de palabras más usadas** - Top 10 palabras con sus campeones
- 🏆 **Podio general** - Ranking definitivo basado en todas las métricas

## 🎨 Características de diseño

- ✨ **Gradientes animados** y efectos visuales modernos
- 🎊 **Confeti** cuando se muestran los ganadores
- 🏆 **Podios visuales** con medallas y avatares
- 📊 **Tablas y tarjetas** para mostrar estadísticas
- 🎯 **Navegación intuitiva** con botones animados
- 💫 **Transiciones suaves** entre secciones
- 📱 **Diseño responsive** optimizado para todos los dispositivos

## 🔧 Requisitos

- **Navegador web moderno** (Chrome, Firefox, Edge, Safari)
- **JavaScript habilitado**
- **LocalStorage habilitado** (para guardar los datos)

**No se requiere:**
- ❌ Python
- ❌ Node.js
- ❌ Servidor web
- ❌ Instalaciones adicionales

## 💾 Almacenamiento de datos

Los datos analizados se guardan automáticamente en el **localStorage** de tu navegador. Esto significa que:

- ✅ Los datos persisten entre sesiones
- ✅ No se envían a ningún servidor (privacidad total)
- ✅ Puedes subir un nuevo archivo para reemplazar los datos actuales
- ✅ Puedes limpiar los datos desde la configuración del navegador si lo deseas

## 🔄 Actualizar datos

Para analizar un nuevo chat o actualizar los datos:

1. Haz clic en el botón **"📁 Nuevo"** en la esquina superior derecha
2. Confirma que deseas subir un nuevo archivo
3. Selecciona o arrastra el nuevo archivo de historial
4. Los datos anteriores serán reemplazados automáticamente

## 🎯 Cómo funciona

1. **Análisis en el navegador**: El archivo se procesa completamente en tu dispositivo usando JavaScript
2. **Extracción de datos**: Se extraen mensajes, timestamps, autores y palabras
3. **Cálculo de métricas**: Se calculan estadísticas como tiempos de respuesta, inicios de conversación, etc.
4. **Filtrado inteligente**: Se filtran palabras comunes (stop words) para mostrar palabras significativas
5. **Visualización**: Los datos se presentan de forma gamificada con podios y rankings

## 🔒 Privacidad

- ✅ **100% local**: Todo el procesamiento ocurre en tu navegador
- ✅ **Sin servidor**: No se envían datos a ningún servidor externo
- ✅ **Sin tracking**: No se utiliza ningún servicio de analytics
- ✅ **Tus datos, tu control**: Los datos solo se guardan en tu navegador

## 🐛 Solución de problemas

### El archivo no se carga
- Verifica que el archivo sea `.txt` o `.zip`
- Asegúrate de que el archivo no esté corrupto
- Intenta exportar el chat nuevamente desde WhatsApp

### Los datos no se muestran
- Verifica que JavaScript esté habilitado en tu navegador
- Abre la consola del navegador (F12) para ver errores
- Intenta limpiar el localStorage y subir el archivo nuevamente

### La página no carga
- Verifica que todos los archivos estén en la misma carpeta
- Asegúrate de que `index.html`, `script.js`, `analyzer.js` y `styles.css` estén presentes
- Intenta usar un servidor local en lugar de abrir el archivo directamente

## 📝 Notas

- El análisis puede tardar unos segundos dependiendo del tamaño del archivo
- Se recomienda exportar el chat **sin multimedia** para archivos más pequeños y procesamiento más rápido
- Los avatares se generan automáticamente basándose en las iniciales de cada persona
- El filtro de palabras ignora conectores comunes y palabras muy cortas para mostrar resultados más significativos

## 🌐 Demo en vivo

Visita la versión en vivo: [https://bigote97.github.io/whatsapp-wrapped/](https://bigote97.github.io/whatsapp-wrapped/)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

---

**¡Disfruta descubriendo quién domina tu grupo de WhatsApp! 🏆**
