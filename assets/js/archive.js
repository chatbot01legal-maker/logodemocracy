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
     MODAL POP-UP SOPHIA
  ========================= */
  window.openSophiaModal = function() {
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
    
    // Aprovechamos la renderización visual nativa de Sophia y el análisis ya cacheado
    if (typeof currentDocumentAnalysis !== 'undefined' && currentDocumentAnalysis) {
      if (window.SOPHIA && typeof window.SOPHIA._renderEvaluation === 'function') {
        contentDiv.innerHTML = "";
        window.SOPHIA._renderEvaluation(currentDocumentAnalysis, contentDiv);
      } else {
        contentDiv.innerHTML = "<p>Error: El renderizador visual de SOPHIA no está cargado.</p>";
      }
    } else {
      contentDiv.innerHTML = "<p>El análisis aún no se ha cargado o está en proceso...</p>";
    }
  };

  /* =========================
     EVALUAR DOCUMENTO CON CACHÉ
     Llama al backend, que evalúa una sola vez por documento y
     reutiliza el resultado guardado — no repite la llamada a la IA
     en cada visita, salvo que el texto o el protocolo cambien.
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
        : raw; // fallback defensivo si sophia.js no cargó

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
      if (irdEl) irdEl.innerHTML = '--';
    }
  }
});

