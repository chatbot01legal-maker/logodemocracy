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
  const philBtn = document.querySelector(".philosopher-btn");
  if (philBtn) {
    philBtn.addEventListener("click", () => {
      // Guardamos el activo actual en localStorage para que el Rey Filósofo lo reciba
      localStorage.setItem("current_cognitive_asset", JSON.stringify(currentCognitiveAsset));
      // Redirigimos a la vista del Rey Filósofo
      window.location.href = "/pages/rey-filosofo.html";
    });
  }

  /* =========================
     AUTO LOAD INICIAL
  ========================= */

  loadTree();
  loadDocument("intro.md");

});
