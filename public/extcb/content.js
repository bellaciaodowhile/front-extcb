// URL de tu API externa donde enviarás los datos
const API_URL = "https://api-extcb.onrender.com/api/resultados"; 

let ultimoPayloadString = ""; // Para guardar una copia del último estado enviado

function extraerDatos() {
  try {
    // 1. Extraer métricas generales y convertir niveles en un array dinámico
    const nivelesRaw = document.getElementById("strNiveles")?.innerText.trim();
    
    // PROTECCIÓN ANTI-PARPADEO: Si el elemento está vacío momentáneamente por una recarga de la página,
    // ignoramos este ciclo para evitar enviar datos rotos o vacíos.
    if (!nivelesRaw) {
      return null;
    }

    const niveles = nivelesRaw
      .split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));

    const preguntas = document.getElementById("strPreguntas")?.innerText.trim() || "0";
    const punteoTotal = document.getElementById("strPunteo")?.innerText.trim() || "0";

    // 2. Extraer todos los participantes de la tabla de forma dinámica
    const tabla = document.querySelector("#GridResultados table#table-5-column");
    const participantes = [];

    if (tabla) {
      const filas = tabla.querySelectorAll("tbody tr");
      filas.forEach((fila) => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length >= 9) {
          const no = celdas[0]?.innerText.trim();
          
          const avatarImg = celdas[1]?.querySelector("img");
          const avatarUrl = avatarImg ? avatarImg.src : "";
          const avatarTitle = avatarImg ? avatarImg.title : "";
          
          const usuarioLink = celdas[2]?.querySelector("a");
          const usuarioNombre = usuarioLink ? usuarioLink.innerText.trim() : celdas[2]?.innerText.trim();
          const usuarioPerfilUrl = usuarioLink ? usuarioLink.href : "";

          const sedeEquipo = celdas[3]?.innerText.trim();
          const correctas = celdas[4]?.innerText.trim();
          const puntos = celdas[5]?.innerText.trim();
          const tiempo = celdas[6]?.innerText.trim();
          const avance = celdas[7]?.innerText.trim();

          // 3. Detección de estado
          const estadoIcon = celdas[8]?.querySelector("i.ace-icon");
          let estado = "Desconocido";
          
          if (estadoIcon) {
            if (estadoIcon.classList.contains("fa-check")) {
              estado = "Completado";
            } else if (estadoIcon.classList.contains("fa-spinner") || estadoIcon.classList.contains("fa-spin")) {
              estado = "Respondiendo";
            } else {
              estado = "En proceso";
            }
          }

          participantes.push({
            no,
            avatar: { url: avatarUrl, title: avatarTitle },
            usuario: { nombre: usuarioNombre, perfilUrl: usuarioPerfilUrl },
            sedeEquipo,
            correctas: parseInt(correctas) || 0,
            puntos: parseInt(puntos) || 0,
            tiempo,
            avance: parseInt(avance) || 0,
            estado
          });
        }
      });
    }

    // 4. Paquete de datos consolidado
    const payload = {
      configuracion: {
        niveles: niveles,
        preguntasTotales: parseInt(preguntas),
        punteoMaximo: parseInt(punteoTotal)
      },
      totalParticipantes: participantes.length,
      participantes
    };

    return payload;

  } catch (error) {
    console.error("Error al extraer los datos:", error);
    return null;
  }
}

async function enviarAAPI(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.warn("La API respondió con un estado no exitoso:", response.status);
    }
  } catch (error) {
    console.error("Error de red al enviar a la API:", error);
  }
}

// Comprobación cada 2 segundos
setInterval(() => {
  const datosExtraidos = extraerDatos();
  if (!datosExtraidos) return; // Si dio null por parpadeo, no hace nada y espera al próximo ciclo

  // Convertimos el objeto actual a texto para compararlo fácilmente
  const payloadString = JSON.stringify(datosExtraidos);

  // Si los datos son diferentes al último envío (cambió el nivel de forma estable, puntos, etc.)
  if (payloadString !== ultimoPayloadString) {
    console.log("¡Cambio detectado! Enviando actualización a la API...", datosExtraidos);
    enviarAAPI(datosExtraidos);
    
    // Actualizamos el registro con este nuevo estado
    ultimoPayloadString = payloadString;
  } else {
    console.log("Sin cambios en la vista, omitiendo petición.");
  }
}, 2000);