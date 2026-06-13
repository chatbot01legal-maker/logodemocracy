const BASE = "https://logodemocracy.tech";

async function safeText(url) {
  const res = await fetch(url);
  const text = await res.text();

  const looksLikeHTML =
    text.trim().toLowerCase().startsWith("<!doctype html") ||
    text.trim().toLowerCase().startsWith("<html");

  if (!res.ok || looksLikeHTML) {
    throw new Error("Invalid response: " + url);
  }

  return text;
}

function tryJSON(text, fallback = {}) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return fallback;
  }
}

async function init() {
  const app = document.getElementById("app");
  if (!app) return; // Validación de seguridad

  app.innerHTML = "Cargando documento...";

  try {
    const id = new URLSearchParams(location.search).get("id") || "que-es";

    const metaRaw = await safeText(`${BASE}/metadata/${id}.json`);
    const meta = tryJSON(metaRaw);

    let markdown = "Contenido no disponible aún.";

    if (meta.markdown) {
      const mdPath = meta.markdown.replace(/^\//, "");
      markdown = await safeText(`${BASE}/${mdPath}`);
    }

    app.innerHTML = `
      <h1>${meta.title}</h1>
      <div>${meta.section}</div>
      <pre>${markdown}</pre>
    `;

  } catch (err) {
    app.innerHTML = `<div style="color:red;">${err.message}</div>`;
  }
}

// Delegación segura de la ejecución al ciclo del DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
