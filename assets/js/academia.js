const BASE_PATH = "/logodemocracy";

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "que-es";
}

async function loadJSON(id) {
  const url = `${BASE_PATH}/metadata/${id}.json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("No se encontró metadata: " + url);

  return res.json();
}

async function loadMarkdown(path) {
  const url = `${BASE_PATH}${path}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("No se encontró markdown: " + url);

  return res.text();
}

function render(meta, markdown) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div style="
      border:1px solid rgba(34,197,94,0.2);
      padding:20px;
      margin-bottom:30px;
      background: rgba(5,10,18,0.6);
    ">

      <div style="font-size:12px; opacity:0.7; letter-spacing:1px;">
        ARCHIVO / ${meta.section} /
      </div>

      <h1 style="font-size:32px; margin-top:10px; color:#f8fafc;">
        ${meta.title}
      </h1>

      <div style="font-size:12px; opacity:0.6; margin-top:10px;">
        Documento: ${meta.id}.md
      </div>

      <div style="font-size:12px; opacity:0.6;">
        Versión: ${meta.version}
      </div>

    </div>

    <article style="
      line-height:1.7;
      font-size:16px;
      color:#cbd5e1;
      white-space:pre-wrap;
    ">
      ${markdown}
    </article>
  `;
}

async function init() {
  const app = document.getElementById("app");

  try {
    const id = getIdFromURL();

    const meta = await loadJSON(id);
    const markdown = await loadMarkdown(meta.markdown);

    render(meta, markdown);

  } catch (err) {
    console.error(err);

    app.innerHTML = `
      <div style="color:red;">
        Error cargando documento<br><br>
        ${err.message}
      </div>
    `;
  }
}

init();
