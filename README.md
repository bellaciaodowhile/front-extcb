# Leaderboard Pro - Extensión de Google Chrome

Tablero interactivo de clasificación en tiempo real con diseño estilo juego arcade, podio animado, efectos de sonido y actualización periódica cada 2 segundos. Diseñado para ejecutarse completamente localmente en Google Chrome mediante **Chrome Storage API** (`chrome.storage.local`).

---

## 🎮 Características Principales

1. **Diseño Gamificado con Podio 3D**:
   - **1er Lugar**: Trofeo Dorado con corona, avatar incrustado, destellos y badge ribbon `#1`.
   - **2do Lugar**: Trofeo Plateado con avatar y badge `#2`.
   - **3er Lugar**: Trofeo Bronce con avatar y badge `#3`.
2. **Lista Interactiva (#4 en adelante)**:
   - Tarjetas redondeadas estilizadas con avatar, usuario, sede/equipo, respuestas correctas, puntos en fuente llamativa y barra de progreso.
   - Detección visual de estado: **Check Verde** (`fa-check` = Completado) y **Spinner Animado** (`fa-spinner` = En progreso).
3. **Actualización en Tiempo Real cada 2 Segundos**:
   - Polling automático configurable cada 2000 ms.
   - Algoritmo de comparación delta para animar nuevos participantes y reordenar puestos suavemente con `motion`.
4. **Sonidos Sutiles con Web Audio API**:
   - Chime melódico al unirse un nuevo participante.
   - Fanfarria de victoria y destellos cuando un participante finaliza el cuestionario (`fa-check`).
   - Control de volumen y botón para silenciar.
5. **Persistencia Local con Chrome Storage API**:
   - Almacena automáticamente los datos localmente en `chrome.storage.local`.
   - Incluye fallback automático a `localStorage` para modo navegador/web.

---

## 🚀 Guía de Instalación para Desarrolladores

Para cargar esta extensión en Google Chrome desde el código fuente, sigue estos sencillos pasos:

### Paso 1: Instalar dependencias y compilar el proyecto
Abre tu terminal en la raíz del proyecto y ejecuta:

```bash
# Instalar dependencias si no lo has hecho
npm install

# Compilar la aplicación y la extensión
npm run build
```

Esto generará la carpeta `dist/` con todos los archivos estáticos necesarios (`index.html`, `manifest.json`, `content.js`, `background.js`, scripts y estilos compilados).

---

### Paso 2: Abrir la gestión de extensiones en Chrome
1. Abre **Google Chrome**.
2. En la barra de direcciones, escribe o pega:
   ```text
   chrome://extensions/
   ```
   y presiona Enter.

---

### Paso 3: Activar el "Modo de desarrollador"
1. En la esquina superior derecha de la pantalla de extensiones, activa el switch **"Modo de desarrollador"** (Developer mode).

---

### Paso 4: Cargar la extensión descomprimida
1. En la esquina superior izquierda, haz clic en el botón **"Cargar descomprimida"** (Load unpacked).
2. Selecciona la carpeta **`dist`** generada en el Paso 1.
3. ¡Listo! La extensión **"Leaderboard Pro - Clasificación en Vivo"** aparecerá en tu lista de extensiones y en la barra de extensiones de Chrome (ícono de rompecabezas).

---

## 🔍 ¿Cómo funciona la lectura automática de la tabla?

El script de contenido (`content.js`) se ejecuta en segundo plano e inspecciona el DOM cada 2 segundos buscando:
- Elementos con ID `<p id="GridResultados">` o tablas `<table id="table-5-column">`.
- Extrae de cada fila (`<tr>`):
  - **No.** (Posición/Puesto)
  - **Avatar** (`<img>` con `src` y `title`)
  - **Usuario** (`<a>` con nombre y enlace a resultados)
  - **Sede/Equipo** (`PIAR`, `LUGAR1`, `LUGAR2`, etc.)
  - **Correctas** (Número de aciertos)
  - **Puntos** (Puntaje total)
  - **Tiempo** (Duración formato `00:00:41.360`)
  - **Avance** (Preguntas respondidas / 20)
  - **Estado** (Presencia de `.green`, `fa-check` para terminado o `fa-spinner` para en curso)
- Guarda los datos directamente en `chrome.storage.local` y actualiza la vista inmediatamente.

---

## 🛠️ Modos de Prueba Integrados
Dentro de la aplicación puedes:
- **Pegar HTML en Vivo**: Permite pegar o editar el código HTML crudo para verificar cómo se parsea al instante.
- **Simular 2s**: Genera cambios de progreso incrementales, nuevos aciertos y nuevos participantes para probar las animaciones y los efectos de sonido.
- **Filtrar por Sede y Búsqueda**: Encuentra participantes rápidamente por nombre o equipo.
