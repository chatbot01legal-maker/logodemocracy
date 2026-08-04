document.addEventListener("DOMContentLoaded", () => {

  const content = document.getElementById("content");

  // Activo cognitivo inicial por defecto (intro.md) para que el Rey Filósofo lo tenga desde el segundo uno
  let currentCognitiveAsset = {
    type: "academy_document",
    version: "1.0",
    content: {
      id: "intro.md",
      title: "intro.md",
      markdown: "Platón soñó con reyes filósofos. Nosotros exploramos otra posibilidad. Que cualquier ciudadano pueda aprender a pensar como uno. Bienvenido a la Academia.",
      loadedAt: new Date().toISOString()
    }
  };

  // ─── API pública de Academia ────────────────────────
  // Única forma en que otros módulos (el conector del Rey Filósofo, y en el
  // futuro cualquier otro) pueden leer el activo cognitivo actual. Es un
  // getter de solo lectura sobre la variable del closure de arriba: nunca
  // devuelve una copia vieja, siempre el documento que se ve en pantalla
  // en el momento exacto en que se lo consulta.
  window.Academy = {
    getCurrentCognitiveAsset: () => currentCognitiveAsset
  };

  /* =========================
     LOAD MARKDOWN DOCUMENT
  ========================= */

  async function loadDocument(name) {
    if (!content) return;

    try {
      content.innerHTML = "Cargando...";

      // 1. construir ruta (AJUSTA AQUÍ SI CAMBIA TU ESTRUCTURA)
      const filePath = `/pages/academy/content/${name}`;

      // 2. fetch markdown
      const res = await fetch(filePath);

      if (!res.ok) {
        throw new Error("No se pudo cargar: " + filePath);
      }

      const md = await res.text();

      // 3. Actualizar el activo cognitivo con el documento real cargado
      currentCognitiveAsset = {
        type: "academy_document",
        version: "1.0",
        content: {
          id: name,
          title: name,
          markdown: md,
          loadedAt: new Date().toISOString()
        }
      };

      // 4. render markdown
      content.innerHTML = marked.parse(md);

    } catch (err) {
      console.error(err);
      content.innerHTML = "Error cargando documento.";
    }
  }


  /* =========================
     LOAD TREE (DINÁMICO)
  ========================= */

  async function loadTree() {
    const res = await fetch("/pages/academy/data/tree.json");
    const tree = await res.json();

    const treeContainer = document.getElementById("tree");

    if (!treeContainer) return;
    
    treeContainer.innerHTML = Object.entries(tree)
      .map(([folder, files]) => `
        <div class="folder">📁 ${folder}</div>
        ${Object.keys(files).map(file => `
          <div class="file">📄 ${file}</div>
        `).join("")}
      `)
      .join("");

    /* =========================
       CLICK HANDLERS (DINÁMICO)
    ========================= */

    document.querySelectorAll(".file").forEach(el => {
      el.addEventListener("click", () => {

        const raw = el.textContent.trim();
        const fileName = raw.replace("📄", "").trim();

        loadDocument(fileName);
      });
    });
  }

  /* =========================
     VINCULACIÓN BOTÓN PROFUNDIZAR
  ========================= */
  // NOTA: la vinculación del botón .philosopher-btn con el Rey Filósofo
  // vive en el script inline de archive-template.html (lee
  // window.Academy.getCurrentCognitiveAsset(), construye la sesión con
  // CognitiveSessionFactory.fromAcademy() y abre ReyFilosofoChat.open()).
  // Aquí NO debe registrarse ningún otro listener sobre ese botón: el
  // mecanismo anterior (localStorage + redirección a rey-filosofo.html)
  // fue retirado por completo — pertenecía a la arquitectura previa a
  // CognitiveSession y competía con el listener nuevo.

  /* =========================
     AUTO LOAD INICIAL
  ========================= */

  loadTree();
  loadDocument("intro.md");

});
