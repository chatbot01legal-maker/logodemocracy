const BASE = "https://logodemocracy.tech";

async function safeText(url) {
  const res = await fetch(url);
  const text = await res.text();

  const looksLikeHTML =
    text.trim().toLowerCase().startsWith("<!doctype html") ||
    text.trim().toLowerCase().startsWith("<html");

  if (!res.ok || looksLikeHTML) {
    throw new Error("Respuesta inválida o archivo no encontrado: " + url);
  }

  return text;
}

function tryJSON(text, fallback = {}) {
  try {
    if (!text || text.trim() === "") return fallback;
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function init() {
  const app = document.getElementById("app");

  if (!app) {
    throw new Error("No existe #app en el HTML");
  }

  app.innerHTML = "<p style='color:#22c55e'>Cargando documento...</p>";

  try {
    const id = new URLSearchParams(location.search).get("id") || "que-es";

    // 1. METADATA
    const metaRaw = await safeText(`${BASE}/metadata/${id}.json`);
    const meta = tryJSON(metaRaw, {
      title: "Sin título",
      section: "Sin sección",
      markdown: null
    });

    // 2. MARKDOWN
    let markdown = "Contenido no disponible aún.";

    if (meta.markdown) {
      const mdPath = meta.markdown.startsWith("/")
        ? meta.markdown.slice(1)
        : meta.markdown;

      markdown = await safeText(`${BASE}/${mdPath}`);
    }

    // 3. RENDER FINAL
    app.innerHTML = `
      <div style="border:1px solid #22c55e33; padding:16px;">
        <h1>${meta.title}</h1>
        <div style="opacity:0.6">${meta.section}</div>
      </div>

      <pre style="white-space:pre-wrap; margin-top:20px;">
${markdown}
      </pre>
    `;

    console.log("RENDER OK");
  } catch (err) {
    app.innerHTML = `
      <div style="color:red;">
        ERROR CRÍTICO:<br>
        ${err.message}
      </div>
    `;

    console.error(err);
  }
}

init();
