/* ═══════════════════════════════════════════════════════
   LOGOS.JS — Frontend del instrumento Logos v0.2.1
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
  }

  const VIEWS = {
    comparar: {
      title: 'Comparar Posiciones',
      render: () => `
        <div class="view-eyebrow">Motor v0.2.1 — Gate Determinista</div>
        <h1 class="view-title">Comparación Dialéctica</h1>
        
        <div class="view-section" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <textarea id="logos-posicion-a" placeholder="Pegá el texto de la Posición A..." style="width:100%; min-height:180px; background:var(--s-panel); border:1px solid var(--s-border); color:#e5e7eb; padding:10px; border-radius:4px; resize:vertical;"></textarea>
          <textarea id="logos-posicion-b" placeholder="Pegá el texto de la Posición B..." style="width:100%; min-height:180px; background:var(--s-panel); border:1px solid var(--s-border); color:#e5e7eb; padding:10px; border-radius:4px; resize:vertical;"></textarea>
        </div>

        <div style="margin-top:14px; display:flex; gap:12px; align-items:center;">
          <button class="btn-primary" id="logosCompareBtn">Ejecutar Protocolo Logos v0.2.1 →</button>
          <select id="logos-val-mode" style="background:var(--s-panel); border:1px solid var(--s-border); color:#e5e7eb; padding:6px; border-radius:4px;">
            <option value="USER_ASSERTED_UNVERIFIED">Simular: Fuentes No Verificadas (Espera posterior)</option>
            <option value="USER_ASSERTED_VALIDATED">Simular: El Usuario Afirma Confirmación de Autores</option>
            <option value="NOT_AVAILABLE">Simular: Material Histórico (Sin validación posible)</option>
          </select>
        </div>
        <div id="logos-output" style="margin-top:20px;"></div>
      `
    }
  };

  async function compareWithLogos(posicionA, posicionB, validationMode, outEl) {
    outEl.innerHTML = `<p style="color:rgba(229,231,235,.5); font-size:.82rem;">Ejecutando operaciones cognitivas estrictas…</p>`;
    try {
      const res = await fetch('/api/logos/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posicionA, posicionB, validationMode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error del servidor');
      renderComparison(data, outEl);
    } catch (err) {
      outEl.innerHTML = `<div style="color:#ef4444; border:1px solid #ef4444; padding:10px; border-radius:4px;">${escapeHtml(err.message)}</div>`;
    }
  }

  function renderComparison(data, outEl) {
    const isAbstained = data.state === 'ABSTAINED';
    const crit = data.synthesisEligibility?.criteria || {};

    const qOK = crit.questionAlignment?.status !== 'incompatible';
    const iOK = crit.informationSufficiency?.status === 'sufficient';
    const cOK = crit.conceptualClarity?.status !== 'insuperable';
    const eOK = crit.evidenceSufficiency?.status !== 'insufficient';

    outEl.innerHTML = `
      <div class="view-section" style="border:1px solid var(--s-border); padding:10px; border-radius:4px;">
        <div style="font-size:.72rem; font-weight:bold; color:var(--accent);">ESTADO: ${escapeHtml(data.state)} | FASE FINAL: ${escapeHtml(data.lastCompletedPhase)}</div>
      </div>

      <div class="view-section">
        <div class="view-section-title">1. Reconstrucción con Linaje</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          ${['a', 'b'].map(k => `
            <div class="s-card">
              <div class="s-card-title">Posición ${k.toUpperCase()} <span style="color:var(--accent); font-size:0.7em;">[${escapeHtml(data.reconstructions[k]?.validationStatus)}]</span></div>
              ${(data.reconstructions[k]?.coreClaims || []).map(c => `
                <div style="margin-top:6px; border-left:2px solid var(--accent); padding-left:6px; font-size:.75rem;">
                  <strong>[${escapeHtml(c.id)}]</strong> ${escapeHtml(c.text)}
                  <div style="font-style:italic; color:rgba(229,231,235,0.6); margin-top:2px;">"${escapeHtml(c.evidence?.[0]?.quote)}"</div>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="view-section" style="background:${isAbstained ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)'}; padding:12px; border-radius:4px; border: 1px solid ${isAbstained ? '#ef4444' : '#10b981'};">
        <div class="view-section-title" style="color:${isAbstained ? '#ef4444' : '#10b981'};">
          2. Decision Gate: ${isAbstained ? 'SÍNTESIS SUSPENDIDA (ABSTAINED)' : 'SÍNTESIS HABILITADA'}
        </div>
        <div style="font-size:.82rem; margin-top:8px; line-height:1.6; color:#e5e7eb;">
          <div><span style="color:${qOK ? '#10b981' : '#ef4444'}">${qOK ? '✓' : '✕'}</span> Pregunta compatible</div>
          <div><span style="color:${iOK ? '#10b981' : '#ef4444'}">${iOK ? '✓' : '✕'}</span> Información suficiente</div>
          <div><span style="color:${cOK ? '#10b981' : '#ef4444'}">${cOK ? '✓' : '✕'}</span> Claridad conceptual suficiente</div>
          <div><span style="color:${eOK ? '#10b981' : '#ef4444'}">${eOK ? '✓' : '✕'}</span> Evidencia base suficiente</div>
        </div>
        <p style="font-size:.75rem; margin-top:8px; color:rgba(229,231,235,0.8);"><strong>Razón:</strong> ${escapeHtml(data.synthesisEligibility?.reason)}</p>
      </div>

      ${(!isAbstained && data.synthesis?.generative?.length) ? `
        <div class="view-section">
          <div class="view-section-title">3. Propuestas Generativas</div>
          ${data.synthesis.generative.map(s => `
            <div class="s-card" style="border-left:3px solid #3b82f6;">
              <strong>${escapeHtml(s.title)}</strong> <span style="font-size:0.7em; color:#3b82f6;">[${escapeHtml(s.type)}]</span>
              <div style="font-size:.8rem; margin-top:4px;">${escapeHtml(s.text)}</div>
              <div style="font-size:.7rem; color:rgba(229,231,235,0.6); margin-top:8px; padding-top:6px; border-top:1px dashed var(--s-border);">
                <strong>Linaje de Derivación:</strong> A [${(s.derivedFrom?.positionAClaims || []).join(', ')}] | B [${(s.derivedFrom?.positionBClaims || []).join(', ')}]
                <br><strong>Aportes Logos:</strong> ${(s.derivedFrom?.newElements || []).join(', ')}
              </div>
            </div>`).join('')}
        </div>` : ''}
    `;
  }

  const LOGOS = {
    init() {
      const contentArea = document.getElementById('viewContent');
      if (contentArea) contentArea.innerHTML = VIEWS.comparar.render();
      
      const btn = document.getElementById('logosCompareBtn');
      if (btn) {
        btn.onclick = async () => {
          const a = document.getElementById('logos-posicion-a').value.trim();
          const b = document.getElementById('logos-posicion-b').value.trim();
          const valMode = document.getElementById('logos-val-mode').value;
          const out = document.getElementById('logos-output');
          if (!a || !b) return;
          
          btn.disabled = true;
          const originalText = btn.textContent;
          btn.textContent = 'Evaluando...';
          await compareWithLogos(a, b, valMode, out);
          btn.disabled = false;
          btn.textContent = originalText;
        };
      }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => LOGOS.init());
  else LOGOS.init();
})();
