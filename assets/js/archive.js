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
     FILE CLICK HANDLER
  ========================= */

  document.querySelectorAll(".file").forEach(el => {
    el.addEventListener("click", () => {

      // limpiar nombre tipo "📄 que_es.md"
      const raw = el.textContent.trim();
      const fileName = raw.replace("📄", "").trim();

      loadDocument(fileName);
    });
  });

  /* =========================
     SIDEBAR TOGGLE
  ========================= */

  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  // ❗ NO cortar el script completo si algo no existe
  if (sidebar && toggle) {

    toggle.addEventListener("click", (event) => {

      event.stopPropagation();

      const collapsed = sidebar.classList.toggle("collapsed");

      toggle.textContent = collapsed ? "▸" : "◂";
    });

  }


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

  
  }
  /* =========================
     AUTO LOAD INICIAL
  ========================= */

  loadDocument("intro.md");

});
