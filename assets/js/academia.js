console.log("1. JS cargado");

async function init() {
  const app = document.getElementById("app");
  console.log("2. DOM OK");

  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "que-es";

    console.log("3. ID:", id);

    const metaUrl = `metadata/${id}.json`;
    console.log("4. Fetch JSON:", metaUrl);

    const metaRes = await fetch(metaUrl);
    console.log("5. JSON status:", metaRes.status);

    const meta = await metaRes.json();
    console.log("6. JSON OK:", meta);

    const mdUrl = meta.markdown;
    console.log("7. Fetch MD:", mdUrl);

    const mdRes = await fetch(mdUrl);
    console.log("8. MD status:", mdRes.status);

    const markdown = await mdRes.text();
    console.log("9. MD OK");

    app.innerHTML = `
      <h1>${meta.title}</h1>
      <pre>${markdown}</pre>
    `;

    console.log("10. RENDER OK");

  } catch (err) {
    console.error("ERROR:", err);

    app.innerHTML = `
      <div style="color:red;">
        ERROR: ${err.message}
      </div>
    `;
  }
}

init();
