function show(step, data = "") {
  const app = document.getElementById("app");

  const el = document.createElement("div");
  el.style.padding = "8px";
  el.style.margin = "4px 0";
  el.style.borderLeft = "2px solid #22c55e";
  el.style.fontSize = "12px";
  el.style.fontFamily = "monospace";
  el.style.color = "#cbd5e1";

  el.textContent = step + (data ? " → " + JSON.stringify(data) : "");

  app.appendChild(el);
}

async function init() {
  const app = document.getElementById("app");

  app.innerHTML = "<h3 style='color:#22c55e'>DEBUG MODE</h3>";

  try {
    show("1. JS cargado");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "que-es";

    show("2. ID detectado", id);

    const metaUrl = `metadata/${id}.json`;
    show("3. Cargando JSON", metaUrl);

    const metaRes = await fetch(metaUrl);
    show("4. JSON status", metaRes.status);

    const meta = await metaRes.json();
    show("5. JSON OK");

    const mdUrl = meta.markdown;
    show("6. Cargando MD", mdUrl);

    const mdRes = await fetch(mdUrl);
    show("7. MD status", mdRes.status);

    const markdown = await mdRes.text();
    show("8. MD OK");

    show("9. Renderizando");

    app.innerHTML += `
      <hr style="margin:20px 0; border-color:#22c55e33;">
      <h1>${meta.title}</h1>
      <pre style="white-space:pre-wrap;">${markdown}</pre>
    `;

    show("10. COMPLETO ✔");

  } catch (err) {
    show("ERROR", err.message);
  }
}

init();
