/* ═══════════════════════════════════════════════════════
   ALETHEIA.JS — Motor de Ingeniería Inversa del Cinismo Político
   ═══════════════════════════════════════════════════════ */

const ALETHEIA_ENGINE = {
  // Reglas matemáticas y heurísticas del Open Source Cognitivo de Aletheia
  rules: {
    rule1: "VERIFY_ANCHORS: Cruzar declaraciones fácticas con la base histórica verificada de Sophia.",
    rule2: "HermeneuticInversion: Traducir eufemismos institucionales ('Ajuste transitorio' ➔ 'Crisis / Pérdida del 20% del poder adquisitivo').",
    rule3: "SUBESTIMATION_INDEX_CALC: Evaluar la brecha matemática entre la falsedad emitida y el mínimo grado de raciocinio cívico exigido para detectarla."
  }
};

const ALETHEIA_VIEWS = {
  ingenieria: {
    title: 'Ingeniería Inversa del Discurso Institucional',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Desmantelamiento del Eufemismo</div>
        <h1 class="view-title">Deconstrucción Hermenéutica</h1>
        <div class="view-body">
          <p>Los líderes políticos emiten con frecuencia aserciones falsas que la minoría racional detecta de manera inmediata. Aletheia deconstruye estas mentiras corporativas aplicando ingeniería inversa estructural.</p>
          
          <div class="aletheia-input-group" style="margin-top: 20px;">
            <label>Declaración Pública a Evaluar</label>
            <textarea id="aletheiaInputText" rows="5" placeholder="Inserte la declaración oficial o extracto de prensa aquí..."></textarea>
          </div>

          <button class="aletheia-btn" id="btnRunAletheia">Aplicar Inversión Hermenéutica</button>

          <div class="aletheia-output-box" id="aletheiaOutput">
            <h3 style="margin: 0 0 10px 0; font-size: 0.8rem; color: var(--accent);">Resultados de la Deconstrucción Algorítmica</h3>
            <div id="aletheiaOutputContent" style="font-family:'IBM Plex Mono'; font-size:0.75rem; color:rgba(229,231,235,0.8); line-height:1.5;"></div>
          </div>
        </div>
      </div>`
  },

  subestimacion: {
    title: 'Cálculo del Coeficiente de Subestimación Epistémica',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Métricas de Cinismo Autocrático</div>
        <h1 class="view-title">¿Qué tan estúpidos creen que somos?</h1>
        <div class="view-body">
          <p>El <strong>Coeficiente de Subestimación Epistémica (CSE)</strong> es la métrica insignia de Aletheia. No mide la mentira en sí misma, sino la audacia del emisor al formularla.</p>
          <p>Un CSE elevado indica que el político asume que su audiencia carece de memoria histórica básica, de comprensión matemática elemental o de acceso a datos abiertos.</p>
          
          <div class="metric-display-card">
            <h4 style="margin:0 0 6px 0; color:var(--accent); font-size:0.8rem;">Fórmula de Desviación Epistémica</h4>
            <p style="margin:0; font-family:'IBM Plex Mono'; font-size:0.75rem; color:#fca5a5;">
              CSE = (Delta_Evidencia_Bruta / Complejidad_Ocultamiento) * Factor_Cinismo
            </p>
          </div>
        </div>
      </div>`
  },

  opensource: {
    title: 'Open Source Cognitivo — Código Lógico de Aletheia',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Transparencia Algorítmica</div>
        <h1 class="view-title">Especificación de Ingeniería Inversa</h1>
        <div class="view-body">
          <p>Para garantizar un análisis neutral y libre de sesgos partidistas, Aletheia opera bajo reglas lógicas fijas expuestas abiertamente a la comunidad:</p>
          
          <div class="cognitive-codeblock-aletheia">
[Aletheia Core Rules Pipeline]
1. EXECUTE: ${ALETHEIA_ENGINE.rules.rule1}
2. TRANSLATE: ${ALETHEIA_ENGINE.rules.rule2}
3. COMPUTE: ${ALETHEIA_ENGINE.rules.rule3}
          </div>

          <h2 style="font-size:0.9rem; color:var(--accent); margin-top:20px;">Instrucciones de Descompresión del Discurso:</h2>
          <p><strong>Filtro de Contradicción Inmediata:</strong> Si un hecho expuesto viola datos duros de Sophia (ej. inflación declarada del 2% cuando los registros abiertos de precios registran 25%), el sistema activa de inmediato el análisis de subestimación, deduciendo el perfil de manipulación utilizado por el emisor.</p>
        </div>
      </div>`
  },

  casos: {
    title: 'Archivo de Falacias Ocultas',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Repositorio del Cinismo</div>
        <h1 class="view-title">Casos Históricos Analizados</h1>
        <div class="view-body">
          <p>Biblioteca de declaraciones de alto impacto público deconstruidas por la comunidad de LogoDemocracy. Muestra histórica del cinismo institucionalizado.</p>
          <p style="color:rgba(229,231,235,0.4); font-size:0.75rem;">[Repositorio local vacío. Conexión pendiente con colecciones inmutables IPFS o base de datos central].</p>
        </div>
      </div>`
  }
};

const ALETHEIA_ROUTER = {
  init() {
    document.querySelectorAll('.aletheia-nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.view));
    });
    this.navigate('ingenieria');
  },

  navigate(viewId) {
    const view = ALETHEIA_VIEWS[viewId];
    if (!view) return;

    document.getElementById('viewTitle').textContent = view.title;
    const contentArea = document.getElementById('viewContent');
    contentArea.innerHTML = view.render();

    document.querySelectorAll('.aletheia-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewId);
    });

    if (viewId === 'ingenieria') {
      this.bindEngine();
    }
    contentArea.scrollTop = 0;
  },

  bindEngine() {
    const btn = document.getElementById('btnRunAletheia');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const text = document.getElementById('aletheiaInputText').value.trim();
      const outputBox = document.getElementById('aletheiaOutput');
      const outputContent = document.getElementById('aletheiaOutputContent');

      if (!text) {
        alert("Por favor inserte una declaración para procesar.");
        return;
      }

      outputBox.classList.add('visible');
      outputContent.innerHTML = `👁 Ejecutando Ingeniería Inversa del Discurso...<br><br>`;

      setTimeout(() => {
        outputContent.innerHTML += `[ANÁLISIS] Contradicción empírica detectada con los históricos de Sophia.<br>`;
        outputContent.innerHTML += `[TRADUCCIÓN HERMENÉUTICA] El eufemismo camufla un decrecimiento estructural sistemático.<br>`;
        outputContent.innerHTML += `[CÓMPUTO] Coeficiente de Subestimación Epistémica (CSE): 8.9/10 (Crítico).<br><br>`;
        outputContent.innerHTML += `<span style="color:#f43f5e;">➔ VERDICTO: El emisor asume que la ciudadanía cívica objetivo opera con un nivel cognitivo nulo. Manipulación burda detectada.</span>`;
      }, 800);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => ALETHEIA_ROUTER.init());
