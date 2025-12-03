# 🏆 WhatsApp Wrapped - Chat Gamificado

Una herramienta para analizar y visualizar estadísticas de tu chat de WhatsApp de forma gamificada.

## 📁 Estructura del Proyecto

```
whatsapp-wrapped/
├── src/                    # Código fuente (Python y JavaScript)
│   ├── whatsapp_wrapped.py
│   └── whatsapp_wrapped.js
├── web/                    # Archivos web
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── data/                   # Datos (chat y JSON generado)
│   ├── Chat de WhatsApp...txt
│   └── whatsapp_data.json
├── assets/                 # Recursos (imágenes, etc.)
│   └── images/
└── README.md
```

## 🚀 Cómo usar

### 1. Preparar el archivo de chat

Coloca tu archivo de chat de WhatsApp exportado en la carpeta `data/`:
- Exporta el chat desde WhatsApp (Configuración → Chats → Exportar chat)
- Renombra el archivo si es necesario o actualiza la ruta en el script

### 2. Generar los datos

Puedes usar **Python** o **JavaScript** (Node.js) para generar los datos:

#### Opción A: Usando Python

Ejecuta el script Python desde la carpeta `src/`:

```bash
cd src
python whatsapp_wrapped.py
```

O desde la raíz del proyecto:

```bash
python src/whatsapp_wrapped.py
```

#### Opción B: Usando JavaScript (Node.js)

Ejecuta el script JavaScript desde la carpeta `src/`:

```bash
cd src
node whatsapp_wrapped.js
```

O desde la raíz del proyecto:

```bash
node src/whatsapp_wrapped.js
```

Esto generará el archivo `data/whatsapp_data.json` con todos los datos analizados.

### 3. Abrir la página web

Abre el archivo `web/index.html` en tu navegador. Puedes hacerlo de dos formas:

- **Doble clic** en el archivo `web/index.html`
- O arrastra el archivo a tu navegador

**Nota:** La página web buscará automáticamente el archivo JSON en `data/whatsapp_data.json`

## 📊 Métricas incluidas

- 💬 **Quién envió más mensajes** - Podio con los top 3
- 🚀 **Quién inició más conversaciones** - Podio con los top 3
- ⚡ **Quién respondió más rápido** - Tabla con tiempos promedio
- 🏁 **Quién terminó más conversaciones** - Podio con los top 3
- 🔤 **Podio de palabras más usadas** - Top 10 palabras con sus campeones

## 🎨 Características

- ✨ Diseño gamificado con gradientes y animaciones
- 🎊 Confeti cuando se muestran los ganadores
- 📱 Diseño responsive (funciona en móviles)
- 🏆 Podios visuales con medallas
- 📊 Tablas y tarjetas para mostrar estadísticas

## 📝 Requisitos

- **Python 3.x** (si usas la versión Python) o **Node.js** (si usas la versión JavaScript)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

## 🔄 Actualizar datos

Cada vez que quieras actualizar los datos, simplemente ejecuta:

**Con Python:**
```bash
python src/whatsapp_wrapped.py
```

**Con JavaScript:**
```bash
node src/whatsapp_wrapped.js
```

Y recarga la página web en tu navegador.

## 📝 Notas

- Los scripts buscan el archivo de chat en `data/` y generan el JSON en la misma carpeta
- La página web HTML busca el JSON en `data/whatsapp_data.json` (ruta relativa)
- Si cambias la estructura de carpetas, asegúrate de actualizar las rutas en los archivos
- Ambas versiones (Python y JavaScript) producen el mismo resultado

