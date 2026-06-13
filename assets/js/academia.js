/* Constantes de configuracion */
const BASE = "https://logodemocracy.tech";

/* Funciones de telemetria */
function logScreen(msg, isError = false) {
  const app = document.getElementById("app");
  if (!app) return;
  const color = isError ? "#ff4444" : "#444";
  const weight = isError ? "bold" : "normal";
  app.innerHTML += `<div style="color:${color}; font-weight:${weight}; font-family:monospace; font-size:13px; padding:4px; border-bottom:1px solid #eee;">[Log] ${msg}</div>`;
}

/* Captura de errores globales - Movido al inicio */
window.onerror = (msg, url, line) => logScreen(`Error Global: ${msg} (Línea: ${line})`, true);
window.addEventListener("unhandledrejection", (e) => logScreen(`Promesa Rechazada: ${e.reason}`, true));

async function safeText(url) {
  logScreen(`Iniciando fetch: ${url}`);
  /* Uso estricto de cache: 'no-store' */
  const res = await fetch(url, { cache: "no-store" });
  logScreen(`Status HTTP: ${res.status}`);
  const text = await res.text();
  const looksLikeHTML = text.trim().toLowerCase().startsWith("<!doctype html") || text.trim().toLowerCase().startsWith("<html");
  if (!res.ok || looksLikeHTML) {
    throw new Error(`Respuesta inválida (${res.status}): El endpoint devolvió HTML o falló.`);
  }
  logScreen(`Fetch exitoso. Tamaño: ${text.length} bytes`);
  return text;
}

function tryJSON(text, fallback = {}) {
  try {
    const parsed = JSON.parse(text);
    logScreen(`JSON parseado correctamente`);
    return parsed;
  } catch (e) {
    logScreen(`Fallo al parsear JSON: ${e.message}`, true);
    return fallback;
  }
}

async function init() {
  const app = document.getElementById("app");
  if (!app) {
    alert("Error Crítico: Contenedor #app no existe en el DOM.");
    return;
  }
  app.innerHTML = `<h3 style="color:#333; font-family:sans-serif;">Modo Diagnóstico Activo</h3>`;
  logScreen("DOM cargado. Ejecutando init()...");
  try {
    const id = new URLSearchParams(location.search).get("id") || "que-es";
    logScreen(`Parámetro ID detectado: ${id}`);
    const metaUrl = `${BASE}/metadata/${id}.json`;
    const metaRaw = await safeText(metaUrl);
    const meta = tryJSON(metaRaw);
    let markdown = "Contenido no disponible aún.";
    if (meta.markdown) {
      logScreen(`Ruta markdown detectada: ${meta.markdown}`);
      const mdPath = meta.markdown.replace(/^\//, "");
      markdown = await safeText(`${BASE}/${mdPath}`);
    } else {
      logScreen("Advertencia: El JSON no contiene la propiedad 'markdown'", true);
    }
    logScreen("Renderizando vista final...");
    setTimeout(() => {
      app.innerHTML = `<h1>${meta.title || 'Sin Título'}</h1><div>${meta.section || 'Sin Sección'}</div><pre style="white-space: pre-wrap; font-family:sans-serif;">${markdown}</pre>`;
    }, 2000);
  } catch (err) {
    logScreen(`Excepción capturada en init(): ${err.message}`, true);
  }
}

/* Delegacion segura de la ejecucion */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
