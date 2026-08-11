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
      modal.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:10000; display:flex; justify-content:center; align-items:center; padding:20px;";
      modal.innerHTML = `
        <div style="background:#111827; border:1px solid rgba(59,130,246,0.4); border-radius:8px; width:100%; max-width:800px; max-height:90vh; overflow-y:auto; padding:20px; color:#e5e7eb; box-shadow:0 10px 30px rgba(0,0,0,0.8);">
          <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
            <h3 style="margin:0; font-size:1rem; color:var(--accent);">Auditoría Completa SOPHIA v4.0</h3>
            <button onclick="document.getElementById('sophia-modal').style.display='none'" style="background:none; border:none; color:#aaa; font-size:1.2rem; cursor:pointer;">✕</button>
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

    // 1. Si el análisis ya está en memoria para ESTE documento, lo mostramos directo
    if (currentDocumentAnalysis && currentDocumentAnalysis.docId === asset.file) {
      renderAnalysis(contentDiv, asset);
      return;
    }

    // 2. Si no, lo solicitamos al servidor bajo demanda (reutiliza caché existente o evalúa)
    contentDiv.innerHTML = `<p style="color:#60a5fa;">Recuperando reporte de auditoría SOPHIA...</p>`;
    await evaluateDocumentCached(asset.file, asset.content);

    if (currentDocumentAnalysis) {
      renderAnalysis(contentDiv, asset);
    } else {
      contentDiv.innerHTML = `
        <p><strong>Documento:</strong> ${asset.title}</p>
        <p><strong>IRD:</strong> ${asset.sophia.ird}/100</p>
        <p><strong>Riesgo:</strong> ${asset.sophia.risk}</p>
        <p style="margin-top:15px; color:#ef4444; font-size:0.8rem;">No se pudo conectar con el servicio de auditoría.</p>
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
        <p><strong>Índice de Robustez (IRD):</strong> <span style="color:#60a5fa; font-weight:bold;">${currentDocumentAnalysis.IRD_global ?? '--'}/100</span></p>
        <p><strong>Riesgo Epistémico:</strong> ${currentDocumentAnalysis.riesgo ?? 'ND'}</p>
      `;
    }
  }

  /* =========================
     EVALUAR DOCUMENTO CON CACHÉ
  ========================= */
  async function evaluateDocumentCached(name, text) {
    const irdEl = document.getElementById("sophia-ird");
    if (irdEl) irdEl.innerHTML = `…`;

    try {
      const res = await fetch("/api/sophia/evaluate-cached", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, docId: name })
      });
      if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);

      const raw = await res.json();
      const normalized = typeof normalizeSophiaResult === 'function'
        ? normalizeSophiaResult(raw)
        : raw;

      normalized.docId = name;
      currentDocumentAnalysis = normalized;

      if (currentActiveAsset) {
        currentActiveAsset.asset.sophia = {
          ird: normalized.IRD_global,
          risk: normalized.riesgo
        };
      }

      if (irdEl) {
        irdEl.innerHTML = `${normalized.IRD_global ?? '--'}<span style="font-size: 0.65rem; color: rgba(229,231,235,0.4);">/100</span>`;
      }
    } catch (err) {
      console.error("❌ Error evaluando documento con SOPHIA:", err);
      currentDocumentAnalysis = null;
      if (irdEl) irdEl.innerHTML = `--<span style="font-size: 0.65rem; color: rgba(229,231,235,0.4);">/100</span>`;
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

      // Limpiamos caché del documento anterior al cambiar de archivo
      if (currentDocumentAnalysis && currentDocumentAnalysis.docId !== name) {
        currentDocumentAnalysis = null;
      }

      // 2. Actualizar UI inicial con la metadata del frontmatter
      const irdEl = document.getElementById("sophia-ird");
      const riskEl = document.getElementById("sophia-risk");
      if (irdEl) irdEl.innerHTML = `${meta.ird}<span style="font-size: 0.85rem; color: rgba(229,231,235,0.4);">/100</span>`;
      if (riskEl) riskEl.textContent = meta.risk;

      // 3. Reconstruir el Activo Cognitivo
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
        metadata: { originModule: "Academia" }
      };

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
      <div style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
        <label style="font-size:0.75rem; color:#aaa; margin-bottom:5px; display:block;">Buscar por Tags</label>
        <input type="text" id="tag-input" value="${tagSearchQuery}" placeholder="Ej: logica, episteme..." style="width:100%; padding:8px; border-radius:4px; background:#111827; border:1px solid #444; color:#fff; font-size:0.8rem;">
      </div>
      <div class="docs-list" style="display: flex; flex-direction: column; gap: 10px; color: #e5e7eb;">
    `;
        
    for (const [lib, folders] of Object.entries(grouped)) {
      html += `<details open style="margin-bottom: 5px;">
                <summary style="cursor: pointer; font-weight: 600; margin-bottom: 5px; color: var(--accent, #ccc); font-size: 0.95rem; user-select: none;">📚 ${lib}</summary>
                <div style="padding-left: 15px; margin-top: 5px;">`;
      
      for (const [folder, files] of Object.entries(folders)) {
        if (folder) {
          html += `<details open style="margin-bottom: 5px;">
                    <summary style="cursor: pointer; font-size: 0.85rem; margin-bottom: 5px; color: #aaa; user-select: none;">📁 ${folder}</summary>
                    <div style="padding-left: 15px;">`;
        }
        
        files.forEach(f => {
          html += `<div class="file" data-file="${f.file}" style="cursor: pointer; padding: 6px 0; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); transition: color 0.2s;">📄 ${f.title}</div>`;
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

