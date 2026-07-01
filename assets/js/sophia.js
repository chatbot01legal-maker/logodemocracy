/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — VERSIÓN MÍNIMA FUNCIONAL (solo analisis)
   ═══════════════════════════════════════════════════════ */

function showDebug(msg, isError = false) {
  const content = document.getElementById('viewContent');
  if (content) {
    content.innerHTML = `<div style="padding:20px; color:${isError ? '#ef4444' : '#22c55e'}; background:#0a0a0a; border:1px solid ${isError ? '#ef4444' : '#22c55e'};">
      <h3>🔍 Depuración SOPHIA</h3>
      <pre style="white-space:pre-wrap; font-size:0.8rem; color:#e5e7eb;">${msg}</pre>
    </div>`;
  } else {
    document.body.innerHTML = `<div style="padding:20px; color:red;">❌ No se encontró #viewContent</div>`;
  }
}

// ─── PROTOCOLO (vacío, solo para que no falle) ────────
const PROTOCOL = { version: "3.0", fases: [] };

// ─── VISTAS ────────────────────────────────────────────
const VIEWS = {
  analisis: {
    title: 'Análisis Sophia (prueba)',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Motor de Evaluación</div>
        <h1 class="view-title">Análisis Sophia</h1>
        <div class="view-body">
          <p>✅ Esta vista se renderiza correctamente.</p>
          <p>Si ves esto, el problema está en las otras vistas o en el contenido completo.</p>
          <button id="testBtn" style="padding:10px; background:#3b82f6; border:none; color:#fff; cursor:pointer;">Probar</button>
        </div>
      </div>
    `
  }
};

// ─── SPA ROUTER ────────────────────────────────────────
const SOPHIA = {
  current: 'analisis',

  navigate(id) {
    try {
      const view = VIEWS[id];
      if (!view) {
        showDebug(`❌ Vista "${id}" no encontrada`, true);
        return;
      }
      const titleEl = document.getElementById('viewTitle');
      const contentEl = document.getElementById('viewContent');
      if (!titleEl || !contentEl) {
        showDebug('❌ Elementos DOM no encontrados', true);
        return;
      }
      titleEl.textContent = view.title;
      contentEl.innerHTML = view.render();
      showDebug(`✅ Renderizada vista: ${id}`);
      
      const testBtn = document.getElementById('testBtn');
      if (testBtn) testBtn.addEventListener('click', () => alert('✅ Botón funciona'));
    } catch (e) {
      showDebug(`❌ Error: ${e.message}`, true);
    }
  },

  init() {
    try {
      document.querySelectorAll('.snav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => this.navigate(btn.dataset.view));
      });
      this.navigate('analisis');
    } catch (e) {
      showDebug(`❌ Error en init: ${e.message}`, true);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    SOPHIA.init();
  } catch (e) {
    showDebug(`❌ Error en DOMContentLoaded: ${e.message}`, true);
  }
});
