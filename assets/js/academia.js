const BASE = "https://logodemocracy.tech";

async function safeText(url) {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const looksLikeHTML = text.trim().toLowerCase().startsWith("<!doctype html") || text.trim().toLowerCase().startsWith("<html");
  if (!res.ok || looksLikeHTML) {
    throw new Error(`Error al obtener contenido válido desde: ${url}`);
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
  if (!app) return;

  try {
    const id = new URLSearchParams(location.search).get("id") || "que-es";
    
    /* Nota: Asumimos que los metadatos se alojan en /metadata/id.json en la raiz */
    const metaUrl = `${BASE}/metadata/${id}.json`;
    const metaRaw = await safeText(metaUrl);
    const meta = tryJSON(metaRaw);

    /* Mapeo dinámico para leer el archivo markdown proveído */
    let markdown = "Contenido no disponible aún.";
    const mdPath = `content/es/fundamentos/${id}.md`;
    
    try {
      markdown = await safeText(`${BASE}/${mdPath}`);
    } catch (err) {
      if (meta.markdown) {
        const fallbackPath = meta.markdown.replace(/^\//, "");
        markdown = await safeText(`${BASE}/${fallbackPath}`);
      } else {
        throw err;
      }
    }

    app.innerHTML = `
      <h1 style="color:#22c55e; margin-bottom:10px;">${meta.title || 'Qué es Logodemocracy'}</h1>
      <div style="color:#64748b; margin-bottom:20px; font-size:14px;">${meta.section || 'Fundamentos'}</div>
      <div style="white-space: pre-wrap; line-height:1.6; color:#e2e8f0;">${markdown}</div>
    `;

  } catch (err) {
    app.innerHTML = `
      <p style="color:#ff4444;">Error al cargar el documento.</p>
      <small style="color:#64748b;">Detalle: ${err.message}</small>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
