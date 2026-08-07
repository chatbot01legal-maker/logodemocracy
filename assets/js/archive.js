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
     LOAD TREE (TAGS + JERARQUÍA)
  ========================= */
  async function loadTree() {
    try {
      const res = await fetch("/pages/academy/data/tree.json");
      const docs = await res.json();
      const treeContainer = document.getElementById("tree");
      if (!treeContainer) return;

      // 1. Extraer tags únicos
      const allTags = new Set();
      docs.forEach(doc => {
        if (doc.tags) doc.tags.forEach(tag => allTags.add(tag));
      });
      const tags = Array.from(allTags).sort();

      let currentTag = null; // null significa "Todos"

      function render() {
        // --- SECCIÓN TAGS ---
        const tagsHtml = tags.map(tag => {
          const isActive = tag === currentTag;
          return `<span class="tag" data-tag="${tag}" style="cursor: pointer; display: inline-block; padding: 6px 10px; margin: 3px; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--s-border, #444); background: ${isActive ? 'var(--accent, #666)' : 'transparent'}; color: ${isActive ? '#fff' : '#e5e7eb'}; transition: all 0.2s;">${tag}</span>`;
        }).join('');

        const allBtnActive = !currentTag;
        const tagsSection = `
          <div class="tags-container" style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
            <span class="tag" data-tag="all" style="cursor: pointer; display: inline-block; padding: 6px 10px; margin: 3px; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--s-border, #444); background: ${allBtnActive ? 'var(--accent, #666)' : 'transparent'}; color: ${allBtnActive ? '#fff' : '#e5e7eb'}; transition: all 0.2s;">Todos</span>
            ${tagsHtml}
          </div>
        `;

        // --- SECCIÓN JERARQUÍA ---
        // Filtrar documentos
        const filteredDocs = currentTag ? docs.filter(d => d.tags && d.tags.includes(currentTag)) : docs;
        
        // Agrupar por Librería > Carpeta
        const grouped = {};
        filteredDocs.forEach(doc => {
          const lib = doc.library || "Sin clasificar";
          const folder = doc.folder || "";
          if (!grouped[lib]) grouped[lib] = {};
          if (!grouped[lib][folder]) grouped[lib][folder] = [];
          grouped[lib][folder].push(doc);
        });

        // Construir HTML de Acordeones
        let hierarchyHtml = `<div class="docs-list" style="display: flex; flex-direction: column; gap: 10px; color: #e5e7eb;">`;
        
        for (const [lib, folders] of Object.entries(grouped)) {
          // Librería (Acordeón principal)
          hierarchyHtml += `
            <details open style="margin-bottom: 5px;">
              <summary style="cursor: pointer; font-weight: 600; margin-bottom: 5px; color: var(--accent, #ccc); font-size: 0.95rem; user-select: none;">📚 ${lib}</summary>
              <div style="padding-left: 15px; margin-top: 5px;">
          `;
          
          for (const [folder, files] of Object.entries(folders)) {
            // Carpeta (Acordeón secundario, si existe)
            if (folder) {
              hierarchyHtml += `
                <details open style="margin-bottom: 5px;">
                  <summary style="cursor: pointer; font-size: 0.85rem; margin-bottom: 5px; color: #aaa; user-select: none;">📁 ${folder}</summary>
                  <div style="padding-left: 15px;">
              `;
            }
            
            // Archivos
            files.forEach(f => {
              hierarchyHtml += `
                <div class="file" data-file="${f.file}" style="cursor: pointer; padding: 6px 0; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); transition: color 0.2s;">
                  📄 ${f.title}
                </div>
              `;
            });
            
            if (folder) {
              hierarchyHtml += `</div></details>`;
            }
          }
          hierarchyHtml += `</div></details>`;
        }
        hierarchyHtml += `</div>`;

        // Inyectar todo en el contenedor
        treeContainer.innerHTML = tagsSection + hierarchyHtml;

        // --- EVENTOS ---
        treeContainer.querySelectorAll('.tag').forEach(el => {
          el.addEventListener('click', (e) => {
            const selected = e.target.getAttribute('data-tag');
            currentTag = selected === 'all' ? null : selected;
            render(); 
          });
        });

        treeContainer.querySelectorAll('.file').forEach(el => {
          el.addEventListener('click', (e) => {
            const fileName = e.target.getAttribute('data-file');
            loadDocument(fileName);
          });
        });
      }

      render(); 
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
