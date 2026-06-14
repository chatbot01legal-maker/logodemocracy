document.addEventListener("DOMContentLoaded", () => {

  const content = document.getElementById("content");

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

      // 3. render markdown
      content.innerHTML = marked.parse(md);

    } catch (err) {
      console.error(err);
      content.innerHTML = "Error cargando documento.";
    }
  }



  /* =========================
     SIDEBAR TOGGLE
  ========================= */

  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (sidebar && toggle) {

    toggle.addEventListener("click", (event) => {

      event.stopPropagation();

      const collapsed = sidebar.classList.toggle("collapsed");

      toggle.textContent = collapsed ? "▸" : "◂";
    });

  }

  /* =========================
     LOAD TREE (DINÁMICO)
  ========================= */

  async function loadTree() {
    const res = await fetch("/pages/academy/data/tree.json");
    const tree = await res.json();

    const treeContainer = document.getElementById("tree");

    if (!treeContainer) return;
    
console.log("TREE RAW DATA:", tree);
console.log("TREE CONTAINER:", treeContainer);
    
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
     AUTO LOAD INICIAL
  ========================= */

  loadTree();
  loadDocument("intro.md");

});
