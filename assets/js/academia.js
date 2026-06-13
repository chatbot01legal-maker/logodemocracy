const BASE = "/logodemocracy";

async function safeText(url) {
  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("No existe: " + url);
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

  app.innerHTML = "<p style='color:#22c55e'>Cargando documento...</p>";

  try {
    const id = new URLSearchParams(location.search).get("id") || "que-es";

    // 1. META
    const metaRaw = await safeText(`${BASE}/metadata/${id}.json`);
    const meta = tryJSON(metaRaw, {
      title: "Sin título",
      section: "Sin sección",
      markdown: null
    });

    // 2. MARKDOWN (opcional)
    let markdown = "Contenido no disponible aún.";

    if (meta.markdown) {
      try {
        const mdPath = meta.markdown.replace(/^\//, "");
        markdown = await safeText(`${BASE}/${mdPath}`);
      } catch {
        markdown = "No se pudo cargar el contenido.";
      }
    }

    // 3. RENDER SIEMPRE
    app.innerHTML = `
      <div style="border:1px solid #22c55e33; padding:16px;">
        <h1>${meta.title}</h1>
        <div style="opacity:0.6">${meta.section}</div>
      </div>

      <pre style="white-space:pre-wrap; margin-top:20px;">
${markdown}
      </pre>
    `;
  } catch (err) {
    app.innerHTML = `
      <div style="color:red;">
        ERROR CRÍTICO:<br>
        ${err.message}
      </div>
    `;
  }
}

init();
