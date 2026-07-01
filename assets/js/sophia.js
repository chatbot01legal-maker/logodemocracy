/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Todas las vistas (contenido simple)
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

// ─── VISTAS (todas con contenido simple) ─────────────
const VIEWS = {
  analisis: {
    title: 'Análisis Sophia',
    render: () => `
      <div class="view">
        <h1>Análisis Sophia</h1>
        <p>Esta es la vista de análisis.</p>
        <p>Si ves esto, la vista funciona.</p>
      </div>
    `
  },
  inicio: {
    title: 'Protocolo Sophia',
    render: () => `
      <div class="view">
        <h1>Protocolo Sophia</h1>
        <p>Esta es la vista de inicio.</p>
        <p>Contiene la filosofía y descripción del protocolo.</p>
      </div>
    `
  },
  opensource: {
    title: 'Open Source Cognitivo',
    render: () => `
      <div class="view">
        <h1>Open Source Cognitivo</h1>
        <p>Explicación del principio de transparencia y código abierto.</p>
      </div>
    `
  },
  atomos: {
    title: 'Átomos Cognitivos',
    render: () => `
      <div class="view">
        <h1>Átomos Cognitivos</h1>
        <p>Listado completo de átomos (próximamente).</p>
      </div>
    `
  },
  fase1: {
    title: 'Fase 1: Estructura Lógica',
    render: () => `
      <div class="view">
        <h1>Estructura Lógica</h1>
        <p>Contenido de la fase 1.</p>
      </div>
    `
  },
  fase2: {
    title: 'Fase 2: Inferencia',
    render: () => `
      <div class="view">
        <h1>Inferencia</h1>
        <p>Contenido de la fase 2.</p>
      </div>
    `
  },
  fase3: {
    title: 'Fase 3: Calibración Epistémica',
    render: () => `
      <div class="view">
        <h1>Calibración Epistémica</h1>
        <p>Contenido de la fase 3.</p>
      </div>
    `
  },
  fase4: {
    title: 'Fase 4: Transparencia Retórica',
    render: () => `
      <div class="view">
        <h1>Transparencia Retórica</h1>
        <p>Contenido de la fase 4.</p>
      </div>
    `
  },
  fase5: {
    title: 'Fase 5: Pertinencia Deliberativa',
    render: () => `
      <div class="view">
        <h1>Pertinencia Deliberativa</h1>
        <p>Contenido de la fase 5.</p>
      </div>
    `
  },
  formula: {
    title: 'Fórmula de Cálculo',
    render: () => `
      <div class="view">
        <h1>Fórmula de Cálculo</h1>
        <p>Explicación de la fórmula de agregación.</p>
      </div>
    `
  },
  academia: {
    title: 'Integración con Academia',
    render: () => `
      <div class="view">
        <h1>Academia</h1>
        <p>Relación con el módulo Academia.</p>
      </div>
    `
  },
  relaciones: {
    title: 'Ecosistema Deliberativo',
    render: () => `
      <div class="view">
        <h1>Ecosistema Deliberativo</h1>
        <p>Conexiones con otros módulos de LogoDemocracy.</p>
      </div>
    `
  },
  informe: {
    title: 'Auditoría de Adherencia',
    render: () => `
      <div class="view">
        <h1>Auditoría de Adherencia</h1>
        <p>Formulario para evaluar textos (versión simple).</p>
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
    } catch (e) {
      showDebug(`❌ Error en navigate: ${e.message}`, true);
    }
  },

  init() {
    try {
      document.querySelectorAll('.snav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => this.navigate(btn.dataset.view));
      });
      this.navigate('analisis');
      showDebug('✅ SOPHIA inicializada correctamente. Todas las vistas están definidas.');
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
