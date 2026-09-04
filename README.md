# Leaderboard Pro

Tablero interactivo de clasificación en tiempo real con diseño estilo juego arcade, podio animado, efectos de sonido y actualización periódica cada 2 segundos.

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