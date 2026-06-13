async function init() {
  const app = document.getElementById("app");

  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "que-es";

    // 🔥 base del repo (CRÍTICO en GitHub Pages)
    const BASE = "/logodemocracy";

    const metaUrl = `${BASE}/metadata/${id}.json`;

    const metaRes = await fetch(metaUrl);
    if (!metaRes.ok) throw new Error("JSON no encontrado: " + metaUrl);

    const meta = await metaRes.json();

    // 🔥 quitar slash inicial del markdown (CRÍTICO)
    const mdPath = meta.markdown.startsWith("/")
      ? meta.markdown.slice(1)
      : meta.markdown;

    const mdUrl = `${BASE}/${mdPath}`;

    const mdRes = await fetch(mdUrl);
    if (!mdRes.ok) throw new Error("MD no encontrado: " + mdUrl);

    const markdown = await mdRes.text();

    app.innerHTML = `
      <div style="border:1px solid #22c55e33; padding:20px;">
        <h2>${meta.title}</h2>
        <div style="opacity:0.6; font-size:12px;">
          ${meta.section} · v${meta.version}
        </div>
      </div>

      <pre style="white-space:pre-wrap; margin-top:20px;">
${markdown}
      </pre>
    `;

  } catch (err) {
    console.error(err);

    app.innerHTML = `
      <div style="color:red;">
        ERROR:<br><br>
        ${err.message}
      </div>
    `;
  }
}

init();
