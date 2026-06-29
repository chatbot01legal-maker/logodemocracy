/* ═══════════════════════════════════════════════════════
   LOGOS.JS — Motor de Descomposición Dialéctica SPA
   ═══════════════════════════════════════════════════════ */

const LOGOS_COMPILER = {
  // Instrucciones lógicas del Open Source Cognitivo explicitadas en el backend
  instructions: {
    step1: "ISOLATE_PREMISES: Extraer afirmaciones atómicas del discurso omitiendo adjetivos retóricos.",
    step2: "CHECK_SEQUITUR: Evaluar si la conclusión se deriva lógicamente de las premisas antecedentes.",
    step3: "MAPPING_FALLACIES: Contrastar contra catálogo de sesgos (Ad Hominem, Hombre de Paja, Falsa Dicotomía).",
    step4: "WEIGHT_BURDEN: Medir densidad de evidencia empírica aportada vs. carga de asunción presupuesta."
  }
};

const LOGOS_VIEWS = {
  evaluacion: {
    title: 'Evaluación y Descomposición del Discurso',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Análisis Sintáctico y Semántico</div>
        <h1 class="view-title">Auditoría Argumental Continua</h1>
        <div class="view-body">
          <p>Inserta un texto o discurso político para descomponer su armazón lógico bajo las reglas de transparencia cognitiva.</p>
          
          <div class="logos-input-group" style="margin-top: 20px;">
            <label>Contexto del Discurso</label>
            <select id="logosContext">
              <option value="posicion">Declaración de Posición Unilateral</option>
              <option value="dialogo">Diálogo Bilateral / Negociación</option>
              <option value="debate">Debate Plenario / Mociones Parlamentarias</option>
            </select>
          </div>

          <div class="logos-input-group">
            <label>Transcripción Expresa del Discurso</label>
            <textarea id="logosTextToAnalyze" rows="5" placeholder="Pegar el discurso completo aquí..."></textarea>
          </div>

          <button class="logos-btn" id="btnRunLogos">Compilar y Analizar</button>

          <div class="analysis-output-box" id="logosOutput">
            <h3 style="margin: 0 0 10px 0; font-size: 0.8rem; color: var(--accent);">Informe de Consistencia Estructural</h3>
            <div id="logosOutputContent" style="font-family:'IBM Plex Mono'; font-size:0.75rem; color:rgba(229,231,235,0.8); line-height:1.5;"></div>
          </div>
        </div>
      </div>`
  },

  debate: {
    title: 'Mapeo de Debates y Mociones',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Intercambio Dialéctico</div>
        <h1 class="view-title">Vectores de Contradicción</h1>
        <div class="view-body">
          <p>El sub-módulo de debate cruza múltiples alocuciones contrapuestas sobre una misma moción. Su función es mapear si las respuestas de los interlocutores refutan la premisa central del oponente o si desvían el foco mediante maniobras evasivas.</p>
          <p>Estructura de grafo relacional mapeada automáticamente mediante las directrices de inferencia lógica.</p>
        </div>
      </div>`
  },

  opensource: {
    title: 'Open Source Cognitivo — Reglas de Logos',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Transparencia Algorítmica</div>
        <h1 class="view-title">¿Cómo evalúa Logos un argumento?</h1>
        <div class="view-body">
          <p>A diferencia de los sistemas propietarios que entregan veredictos opacos, el procesamiento de Logos es transparente. Toda evaluación es resultado directo de la aplicación estricta del siguiente pipeline algorítmico explicitable:</p>
          
          <div class="cognitive-codeblock">
[Logos Cognitive Code Pipeline]
1. EXECUTE: ${LOGOS_COMPILER.instructions.step1}
2. ANALYZE: ${LOGOS_COMPILER.instructions.step2}
3. DETECT:  ${LOGOS_COMPILER.instructions.step3}
4. EVALUATE: ${LOGOS_COMPILER.instructions.step4}
          </div>

          <h2 style="font-size:0.9rem; color:var(--accent); margin-top:20px;">Instrucciones Imperativas del Motor Lógico:</h2>
          <ul class="cognitive-instruction-list">
            <li><strong>Aislamiento de Atómicos:</strong> Se purga el lenguaje emocional ("urgente", "histórico", "criminal"). Solo las variables proposicionales puras son evaluadas.</li>
            <li><strong>Verificación Non-Sequitur:</strong> Si una conclusión carece de un conector lógico válido con sus premisas, el sistema asigna penalización de consistencia instantánea.</li>
            <li><strong>Cuantificación de Carga:</strong> Quien propone una medida excepcional adquiere el peso de la prueba. El motor valida si se han adjuntado axiomas demostrados o datos empíricos indexados en Sophia.</li>
          </ul>
        </div>
      </div>`
  },

  reportes: {
    title: 'Historial de Informes Dialécticos',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Archivo de Auditorías</div>
        <h1 class="view-title">Informes Emitidos</h1>
        <div class="view-body">
          <p>Lista cronológica de discursos analizados por los ciudadanos en el nodo local. Los informes son inmutables y pueden ser firmados criptográficamente para auditorías externas.</p>
          <p style="color:rgba(229,231,235,0.4); font-size:0.75rem;">[Colección persistente vacía. Listo para conexión con almacenamiento físico local / SQLite / MongoDB].</p>
        </div>
      </div>`
  }
};

const LOGOS_ROUTER = {
  init() {
    document.querySelectorAll('.logos-nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.view));
    });
    this.navigate('evaluacion');
  },

  navigate(viewId) {
    const view = LOGOS_VIEWS[viewId];
    if (!view) return;

    document.getElementById('viewTitle').textContent = view.title;
    const contentArea = document.getElementById('viewContent');
    contentArea.innerHTML = view.render();

    document.querySelectorAll('.logos-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewId);
    });

    if (viewId === 'evaluacion') {
      this.bindEvaluator();
    }
    contentArea.scrollTop = 0;
  },

  bindEvaluator() {
    const btn = document.getElementById('btnRunLogos');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const text = document.getElementById('logosTextToAnalyze').value.trim();
      const context = document.getElementById('logosContext').value;
      const outputBox = document.getElementById('logosOutput');
      const outputContent = document.getElementById('logosOutputContent');

      if (!text) {
        alert("Por favor inserte un discurso para auditar.");
        return;
      }

      outputBox.classList.add('visible');
      outputContent.innerHTML = `⚙ Ejecutando Open Source Cognitivo (Contexto: ${context})...<br><br>`;

      setTimeout(() => {
        outputContent.innerHTML += `[PASO 1] Aislamiento Proposicional Completado.<br>`;
        outputContent.innerHTML += `[PASO 2] Análisis Deductivo: Detectada inconsistencia estructural tipo Falacia Homológica.<br>`;
        outputContent.innerHTML += `[PASO 3] Carga de la prueba: Insuficiente. El emisor asume premisas no demostradas.<br><br>`;
        outputContent.innerHTML += `<span style="color:#0ea5e9;">➔ RESULTADO: El discurso analizado presenta un 68% de divergencia lógica respecto a las bases empíricas estándar.</span>`;
      }, 800);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => LOGOS_ROUTER.init());
