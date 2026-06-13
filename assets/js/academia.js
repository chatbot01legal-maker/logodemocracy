const BASE = "/logodemocracy";

function render(app, html) {
  app.innerHTML = html;
}

async function safeFetch(url) {
  const res = await fetch(url);
  const text = await res.text();

  // Intento detectar si GitHub devolvió HTML en vez de archivo real
  const isHtml = text.trim().startsWith("<!DOCTYPE html>");

  return { ok: res.ok && !isHtml, status: res.status, data: text };
}

async function init() {
  const app = document.getElementById("app");

  render(app, "<p style='color:#22c55e'>Cargando documento...</p>");

  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "que-es";

    // 1. METADATA
    const metaUrl = `${BASE}/metadata/${id}.json`;
    const metaRes = await safeFetch(metaUrl);

    if (!metaRes.ok) {
      throw new Error("No se pudo cargar metadata: " + metaUrl);
    }

    const meta = JSON.parse(metaRes.data);

    // 2. MARKDOWN
    const mdPath = meta.markdown.replace(/^\//, "");
    const mdUrl = `${BASE}/${mdPath}`;

    const mdRes = await safeFetch(mdUrl);

    if (!mdRes.ok) {
      throw new Error("No se pudo cargar markdown: " + mdUrl);
    }

    const markdown = mdRes.data;

    // 3. RENDER FINAL
    render(app, `
      <div style="border:1px solid #22c55e33; padding:20px; margin-bottom:20px;">
        <div style="font-size:12px; opacity:0.6;">${meta.section}</div>
        <h1 style="margin:0;">${meta.title}</h1>
        <div style="font-size:12px; opacity:0.5;">v${meta.version}</div>
      </div>

      <pre style="white-space:pre-wrap; line-height:1.5;">
${markdown}
      </pre>
    `);

  } catch (err) {
    render(app, `
      <div style="color:#ff4d4d;">
        <h3>Error cargando documento</h3>
        <p>${err.message}</p>
      </div>
    `);
  }
}

init();
