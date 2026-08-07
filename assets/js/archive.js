document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  /* =========================
     LOAD MARKDOWN DOCUMENT
  ========================= */
  async function loadDocument(name) {
    if (!content) return;
    try {
      content.innerHTML = "Cargando...";
      const filePath = `/pages/academy/content/${name}`;
      const res = await fetch(filePath);
      if (!res.ok) {
        throw new Error("No se pudo cargar: " + filePath);
      }
      const md = await res.text();
      content.innerHTML = marked.parse(md);
    } catch (err) {
      console.error(err);
      content.innerHTML = "Error cargando documento.";
    }
  }

  /* =========================
     LOAD TREE (SISTEMA DE TAGS)
  ========================= */
  async function loadTree() {
    try {
      const res = await fetch("/pages/academy/data/tree.json");
      const docs = await res.json();
      const treeContainer = document.getElementById("tree");
      if (!treeContainer) return;

      // Extraer tags únicos y ordenarlos alfabéticamente
      const allTags = new Set();
      docs.forEach(doc => {
        if (doc.tags) doc.tags.forEach(tag => allTags.add(tag));
      });
      const tags = Array.from(allTags).sort();

      let currentTag = null; // null significa "Todos"

      function render() {
        // Generar HTML de Etiquetas
        const tagsHtml = tags.map(tag => {
          const isActive = tag === currentTag;
          return `<span class="tag" data-tag="${tag}" style="cursor: pointer; display: inline-block; padding: 6px 10px; margin: 3px; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--s-border, #444); background: ${isActive ? 'var(--accent, #666)' : 'transparent'}; color: ${isActive ? '#fff' : '#e5e7eb'}; transition: all 0.2s;">${tag}</span>`;
        }).join('');

        // Filtrar y generar HTML de Documentos
        const filteredDocs = currentTag ? docs.filter(d => d.tags && d.tags.includes(currentTag)) : docs;
        
        const docsHtml = filteredDocs.map(doc => `
          <div class="file" data-file="${doc.file}" style="cursor: pointer; padding: 10px 5px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e5e7eb; font-size: 0.9rem;">
            📄 ${doc.title}
          </div>
        `).join('');

        const allBtnActive = !currentTag;
        
        // Inyectar en el contenedor
        treeContainer.innerHTML = `
          <div class="tags-container" style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
            <span class="tag" data-tag="all" style="cursor: pointer; display: inline-block; padding: 6px 10px; margin: 3px; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--s-border, #444); background: ${allBtnActive ? 'var(--accent, #666)' : 'transparent'}; color: ${allBtnActive ? '#fff' : '#e5e7eb'}; transition: all 0.2s;">Todos</span>
            ${tagsHtml}
          </div>
          <div class="docs-list" style="display: flex; flex-direction: column; gap: 5px;">
            ${docsHtml}
          </div>
        `;

        // Event Listeners: Etiquetas
        treeContainer.querySelectorAll('.tag').forEach(el => {
          el.addEventListener('click', (e) => {
            const selected = e.target.getAttribute('data-tag');
            currentTag = selected === 'all' ? null : selected;
            render(); // Re-renderizar con el filtro
          });
        });

        // Event Listeners: Archivos
        treeContainer.querySelectorAll('.file').forEach(el => {
          el.addEventListener('click', (e) => {
            const fileName = e.target.getAttribute('data-file');
            loadDocument(fileName);
          });
        });
      }

      render(); // Render inicial
    } catch (err) {
      console.error("Error cargando índice de la academia:", err);
    }
  }

  /* =========================
     AUTO LOAD INICIAL
  ========================= */
  loadTree();
  loadDocument("intro.md");
});
