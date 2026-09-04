document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  let allDocuments = [];
  let currentActiveAsset = null;
  let tagSearchQuery = "";
  let currentDocumentAnalysis = null; 

  // 1. Exponer el Activo Cognitivo para el Rey Filósofo
  window.Academy = window.Academy || {};
  window.Academy.getCurrentCognitiveAsset = () => currentActiveAsset;

  /* =========================
     EXTRACTOR FRONTMATTER YAML
  ========================= */
  function parseFrontmatter(mdText) {
    let meta = { ird: "--", risk: "ND", title: "Documento" };
    let body = mdText;
    if (mdText.startsWith("---")) {
      const parts = mdText.split("---");
      if (parts.length >= 3) {
        const fm = parts[1];
        body = parts.slice(2).join("---").trim();
        const irdMatch = fm.match(/sophia_ird:\s*"?(\d+)"?/);
        const riskMatch = fm.match(/sophia_risk:\s*"?([^"\n]+)"?/);
        const titleMatch = fm.match(/title:\s*"?([^"\n]+)"?/);
        if (irdMatch) meta.ird = irdMatch[1];
        if (riskMatch) meta.risk = riskMatch[1];
        if (titleMatch) meta.title = titleMatch[1];
      }
    }
    return { meta, body };
  }

  /* =========================
     MODAL POP-UP SOPHIA (ESTRATEGIA B: BAJO DEMANDA)
  ========================= */
  window.openSophiaModal = async function() {
    let modal = document.getElementById("sophia-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "sophia-modal";
      modal.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.72); z-index:10000; display:flex; justify-content:center; align-items:center; padding:20px;";
      modal.innerHTML = `
        <div style="background:#050a12; border:1px solid var(--c-sophia); border-radius:8px; width:100%; max-width:800px; max-height:90vh; overflow-y:auto; padding:20px; color:var(--c-text); box-shadow:0 10px 30px rgba(28,26,22,0.25);">
          <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--c-border); padding-bottom:10px;">
            <h3 style="margin:0; font-size:1rem; color:var(--c-sophia);">Auditoría Completa SOPHIA v4.0</h3>
            <button onclick="document.getElementById('sophia-modal').style.display='none'" style="background:none; border:none; color:var(--c-muted); font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div id="sophia-modal-content" style="font-size:0.85rem; line-height:1.6;"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    
    modal.style.display = "flex";
    const contentDiv = document.getElementById("sophia-modal-content");
    const asset = currentActiveAsset ? currentActiveAsset.asset : null;

    if (!asset) {
      contentDiv.innerHTML = "<p>No hay ningún documento activo para analizar.</p>";
      return;
    }

    if (currentDocumentAnalysis && currentDocumentAnalysis.docId === asset.file) {
      renderAnalysis(contentDiv, asset);
      return;
    }

    contentDiv.innerHTML = `<p style="color:var(--c-sophia);">Recuperando reporte de auditoría SOPHIA...</p>`;
    await evaluateDocumentCached(asset.file, asset.content);

    if (currentDocumentAnalysis) {
      renderAnalysis(contentDiv, asset);
    } else {
      contentDiv.innerHTML = `
        <p><strong>Documento:</strong> ${asset.title}</p>
        <p style="margin-top:15px; color:var(--c-seal); font-size:0.8rem;">No se pudo recuperar el análisis previamente generado por SOPHIA.</p>
        <p style="margin-top:15px; color:var(--c-seal); font-size:0.8rem;">No se pudo conectar con el servicio de auditoría.</p>
      `;
    }
  };

  function renderAnalysis(container, asset) {
    if (window.SOPHIA && typeof window.SOPHIA._renderEvaluation === 'function') {
      container.innerHTML = "";
      window.SOPHIA._renderEvaluation(currentDocumentAnalysis, container);
    } else {
      container.innerHTML = `
        <p><strong>Documento:</strong> ${asset.title}</p>
        <p style="color:var(--c-muted);">El análisis de SOPHIA está disponible, pero no se pudo cargar su visualización completa.</p>
      `;
    }
  }

  /* =========================
     EVALUAR DOCUMENTO CON CACHÉ
  ========================= */
  async function evaluateDocumentCached(name) {
    try {
      const res = await fetch(
        `/api/sophia/analysis/${encodeURIComponent(name)}`
      );

      if (res.status === 404) {
        currentDocumentAnalysis = null;
        return false;
      }

      if (!res.ok) {
        throw new Error(`El servidor respondió ${res.status}`);
      }

      const raw = await res.json();

      const normalized =
        typeof normalizeSophiaResult === 'function'
          ? normalizeSophiaResult(raw)
          : raw;

      normalized.docId = name;
      currentDocumentAnalysis = normalized;

      if (currentActiveAsset) {
        currentActiveAsset.asset.sophia = {
          fullAnalysis: normalized
        };
      }

      return true;

    } catch (err) {
      console.error(
        "❌ Error recuperando análisis SOPHIA desde caché:",
        err
      );
      currentDocumentAnalysis = null;
      return false;
    }
  }

  /* =========================
     LOAD MARKDOWN DOCUMENT
  ========================= */
  async function loadDocument(name) {
    if (!content) return;
    try {
      content.innerHTML = "Cargando...";
      const filePath = `/pages/academy/content/${name}`;
      const res = await fetch(filePath);
      if (!res.ok) throw new Error("No se pudo cargar: " + filePath);
      
      const rawText = await res.text();
      const { meta, body } = parseFrontmatter(rawText);
      content.innerHTML = marked.parse(body);

      if (currentDocumentAnalysis && currentDocumentAnalysis.docId !== name) {
        currentDocumentAnalysis = null;
      }

            currentActiveAsset = {
        source: "Academia",
        contractVersion: "1.0",
        objective: `Acompañar en la comprensión del documento: ${meta.title}`,
        asset: {
          title: meta.title,
          file: name,
          content: body,
          sophia: { ird: meta.ird, risk: meta.risk }
        },
        metadata: {
          originModule: "Academia"
        }
      };

      // ─────────────────────────────────────────────────
      // SINCRONIZAR INMEDIATAMENTE EL CONTEXTO DEL
      // REY FILÓSOFO CON EL DOCUMENTO QUE EL USUARIO
      // ACABA DE ABRIR.
      //
      // Esto evita que ReyFilosofoChat conserve el
      // documento anterior como activeAsset.
      // ─────────────────────────────────────────────────
      if (
        window.ReyFilosofoChat &&
        typeof window.ReyFilosofoChat.setActiveAsset === "function"
      ) {
        window.ReyFilosofoChat.setActiveAsset(currentActiveAsset);
      }

    } catch (err) {
      console.error(err);
      content.innerHTML = "Error cargando documento.";
    }
  }

  /* =========================
     LOAD TREE & RENDER
  ========================= */
  async function loadTree() {
    try {
      const res = await fetch("/pages/academy/data/tree.json");
      allDocuments = await res.json();
      renderSidebar();
    } catch (err) {
      console.error("Error cargando índice:", err);
    }
  }

  function renderSidebar() {
    const treeContainer = document.getElementById("tree");
    if (!treeContainer) return;

    const query = tagSearchQuery.toLowerCase().trim();
    
    const filteredDocs = query === "" ? allDocuments : allDocuments.filter(doc => {
      return doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query));
    });

    const grouped = {};
    filteredDocs.forEach(doc => {
      const lib = doc.library || "Sin clasificar";
      const folder = doc.folder || "";
      if (!grouped[lib]) grouped[lib] = {};
      if (!grouped[lib][folder]) grouped[lib][folder] = [];
      grouped[lib][folder].push(doc);
    });

    let html = `
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--c-border); padding-bottom: 15px;">
        <label style="font-size:0.75rem; color:var(--c-muted); margin-bottom:5px; display:block;">Buscar por Tags</label>
        <input type="text" id="tag-input" value="${tagSearchQuery}" placeholder="Ej: logica, episteme..." style="width:100%; padding:8px; border-radius:4px; background:var(--c-bg); border:1px solid var(--c-border); color:var(--c-text); font-size:0.8rem;">
      </div>
      <div class="docs-list" style="display: flex; flex-direction: column; gap: 10px; color: var(--c-text);">
    `;
        
    for (const [lib, folders] of Object.entries(grouped)) {
      html += `<details open style="margin-bottom: 5px;">
                <summary style="cursor: pointer; font-weight: 600; margin-bottom: 5px; color: var(--accent); font-size: 0.95rem; user-select: none;">📚 ${lib}</summary>
                <div style="padding-left: 15px; margin-top: 5px;">`;
      
      for (const [folder, files] of Object.entries(folders)) {
        if (folder) {
          html += `<details style="margin-bottom: 5px;">
                    <summary style="cursor: pointer; font-size: 0.85rem; margin-bottom: 5px; color: var(--c-muted); user-select: none;">📁 ${folder}</summary>
                    <div style="padding-left: 15px;">`;
        }
        
        files.forEach(f => {
          html += `<div class="file" data-file="${f.file}" style="cursor: pointer; padding: 6px 0; font-size: 0.85rem; border-bottom: 1px solid var(--c-border); transition: color 0.2s;">📄 ${f.title}</div>`;
        });
        
        if (folder) html += `</div></details>`;
      }
      html += `</div></details>`;
    }
    html += `</div>`;
    treeContainer.innerHTML = html;

    const inputEl = document.getElementById("tag-input");
    if (inputEl) {
      inputEl.addEventListener("input", (e) => {
        tagSearchQuery = e.target.value;
        renderSidebar();
        const newEl = document.getElementById("tag-input");
        if (newEl) {
          newEl.focus();
          newEl.setSelectionRange(newEl.value.length, newEl.value.length);
        }
      });
    }

    treeContainer.querySelectorAll('.file').forEach(el => {
      el.addEventListener('click', (e) => {
        loadDocument(e.target.getAttribute('data-file'));
      });
    });
  }

  loadTree();
  loadDocument("intro.md");
});
        
