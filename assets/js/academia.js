async function loadJSON(id) {
  const res = await fetch(`/metadata/${id}.json`);
  if (!res.ok) throw new Error("No se encontró metadata");
  return res.json();
}

async function loadMarkdown(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("No se encontró markdown");
  return res.text();
}

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "que-es";
}

function render(meta, markdown) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div style="border:1px solid rgba(34,197,94,0.2); padding:20px; margin-bottom:30px;">
      <div style="font-size:12px; opacity:0.7;">
        ARCHIVO / ${meta.section} /
      </div>

      <h1 style="font-size:32px; margin-top:10px;">
        ${meta.title}
      </h1>

      <div style="font-size:12px; opacity:0.6;">
        Documento: ${meta.markdown}
      </div>

      <div style="margin-top:10px; font-size:12px; opacity:0.6;">
        Versión: ${meta.version}
      </div>
    </div>

    <article style="line-height:1.6; font-size:16px;">
      <pre style="white-space:pre-wrap;">${markdown}</pre>
    </article>
  `;
}

async function init() {
  try {
    const id = getIdFromURL();

    const meta = await loadJSON(id);
    const markdown = await loadMarkdown(meta.markdown);

    render(meta, markdown);

  } catch (err) {
    document.getElementById("app").innerHTML =
      "<p style='color:red;'>Error cargando documento</p>";
    console.error(err);
  }
}

init();
