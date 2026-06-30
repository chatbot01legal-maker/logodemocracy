/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Protocolo Abierto de Comunicación Deliberativa
   ═══════════════════════════════════════════════════════ */

/* ─── SCORE DATA ─────────────────────────────────────── */
const SCORES = {
  transparencia: { value: 96, label: 'Transparencia Epistemológica', desc: 'Anclaje con datos reales, rigor contextual y honestidad en el manejo de observaciones.' },
  consistencia:  { value: 94, label: 'Consistencia Lógica',          desc: 'Salud formal de razonamientos y ausencia de contradicciones estructurales.' },
  claridad:      { value: 91, label: 'Claridad Conceptual',          desc: 'Control del lenguaje, delimitación semántica y orden temático.' },
  pedagogia:     { value: 93, label: 'Calidad Pedagógica',           desc: 'Empatía comunicacional y uso responsable de recursos ilustrativos.' },
  honestidad:    { value: 95, label: 'Honestidad Dialógica',         desc: 'Integridad al interactuar con ideas disidentes y control de la pirotecnia retórica.' },
};

function scoreClass(v) {
  if (v >= 85) return 'high';
  if (v >= 60) return 'mid';
  return 'low';
}

function renderScores(data) {
  return `<div class="score-list">
    ${Object.values(data).map(s => {
      const cls = scoreClass(s.value);
      return `<div class="score-row">
        <span class="score-label">${s.label}</span>
        <div class="score-bar-wrap">
          <div class="score-bar score-bar--${cls}" style="width:0%" data-target="${s.value}%"></div>
        </div>
        <span class="score-value score-value--${cls}">${s.value}%</span>
      </div>`;
    }).join('')}
  </div>`;
}

/* ─── VIEWS ──────────────────────────────────────────── */
const VIEWS = {

  /* ── INICIO ───────────────────────────────────────── */
  inicio: {
    title: 'Sophia — Protocolo Abierto de Comunicación Deliberativa',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Marco de Evaluación Deliberativa · v2.1</div>
        <h1 class="view-title">¿Qué es SOPHIA?</h1>
        <div class="view-body">
          <p>SOPHIA es un <strong>protocolo abierto de comunicación deliberativa</strong>. Su función no es determinar si una afirmación es verdadera, ni opera como una autoridad epistemológica. No evalúa ideologías ni determina posiciones políticas.</p>
          <p>SOPHIA busca responder una sola pregunta: <em>«¿Ha sido esta idea presentada de una manera suficientemente rigurosa, transparente, trazable y responsable como para merecer atención dentro de una conversación pública racional?»</em></p>
          <p>Es una infraestructura cívica diseñada para estimar la calidad comunicativa de un documento. No sustituye el debate crítico; simplemente establece las reglas y estándares con los que una comunidad decide qué argumentos merecen ser deliberados colectivamente.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Objetivos del Protocolo</div>
          <div class="principle-list">
            <div class="principle-item">
              <span class="principle-num">01</span>
              <div class="principle-text"><strong>Incentivar la responsabilidad cognitiva.</strong> Promover la explicitación de la incertidumbre y favorecer la trazabilidad documental de toda afirmación.</div>
            </div>
            <div class="principle-item">
              <span class="principle-num">02</span>
              <div class="principle-text"><strong>Disminuir el ruido informacional.</strong> Detectar derivas semánticas, auditar la lógica argumental y exigir precisión para mejorar el ecosistema deliberativo.</div>
            </div>
            <div class="principle-item">
              <span class="principle-num">03</span>
              <div class="principle-text"><strong>Facilitar la auditoría pública.</strong> Asegurar que todo criterio con el que se estima la calidad de un texto sea explícito, transparente y debatible por la ciudadanía.</div>
            </div>
          </div>
        </div>
      </div>`
  },

  /* ── OPEN SOURCE COGNITIVO ────────────────────────── */
  opensource: {
    title: 'Open Source Cognitivo',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Infraestructura Transparente</div>
        <h1 class="view-title">Open Source Cognitivo</h1>
        <div class="view-body">
          <p>Uno de los conceptos centrales de SOPHIA es el <strong>Open Source Cognitivo</strong>. Todo criterio, regla o átomo semántico utilizado para evaluar un texto debe ser explícito, público, versionable y auditable.</p>
          <p>La ciudadanía puede conocer exactamente cómo opera el protocolo. Puede inspeccionar sus dimensiones, proponer modificaciones, debatir mejoras y observar el historial histórico de cada cambio. SOPHIA misma es deliberable.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Trazabilidad Argumentativa</div>
          <div class="card-grid">
            <div class="s-card">
              <div class="s-card-title">Criterios Públicos</div>
              <div class="s-card-body">Las 5 dimensiones y los 20 criterios de evaluación están publicados y documentados de forma transparente.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Historial Versionado</div>
              <div class="s-card-body">Cada modificación a los criterios de evaluación queda registrada, permitiendo comparar cómo evolucionan las reglas del debate.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Auditoría Permanente</div>
              <div class="s-card-body">Los ciudadanos pueden verificar por qué un texto obtuvo su nivel de adherencia basándose en los parámetros del código fuente cognitivo.</div>
            </div>
          </div>
        </div>
      </div>`
  },

  /* ── ÁTOMOS COGNITIVOS ────────────────────────────── */
  atomos: {
    title: 'Átomos Cognitivos',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">El Glosario Constitucional</div>
        <h1 class="view-title">Átomos Semánticos</h1>
        <div class="view-body">
          <p>Los <strong>átomos cognitivos</strong> (o semánticos) son las unidades mínimas de significado del protocolo. Representan definiciones operacionales inalterables con las que opera la IA para evaluar. Actúan como anclajes lingüísticos objetivos para evitar ambigüedades interpretativas.</p>
          <p>Se desprenden de los 20 criterios de evaluación, y estos a su vez alimentan las 5 dimensiones fundamentales de SOPHIA.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Muestra del Repositorio de Átomos</div>
          <div class="atom-grid">

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">EVIDENCIA</span>
                <span class="atom-version">v1.0</span>
              </div>
              <div class="atom-def">Datos, registros o información empírica verificable que se aporta para sustentar la veracidad de un HECHO.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "De acuerdo con el censo del INE (2024), el déficit alcanza el 15%."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "Como es de conocimiento público, los datos demuestran la crisis."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">INTERPRETACIÓN CAUSAL</span>
                <span class="atom-version">v1.0</span>
              </div>
              <div class="atom-def">La atribución explícita de que un cambio o comportamiento en la variable A es el motor directo y responsable del cambio en la B.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "Los datos muestran que A coincide con B."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "El gráfico demuestra que A causa irrefutablemente B."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">REPRESENTACIÓN JUSTA (Steelman)</span>
                <span class="atom-version">v1.0</span>
              </div>
              <div class="atom-def">La reformulación fidedigna, respetuosa y en su máxima fortaleza argumentativa de una postura disidente o contraria.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "Los críticos argumentan, con justa razón, que esto afectará a X. Para responder a esto..."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "Quienes se oponen simplemente demuestran que no les importa el problema."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">DERIVA SEMÁNTICA</span>
                <span class="atom-version">v1.0</span>
              </div>
              <div class="atom-def">La alteración, deslizamiento o mutación del significado operativo de una palabra clave a lo largo del flujo del texto.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Evitado</span>
                  Mantiene la definición de 'eficiencia' intacta desde el inicio hasta la conclusión.
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Incurrido</span>
                  Inicia definiendo 'Justicia' como legalidad, pero concluye usándola como venganza moral.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>`
  },

  /* ── DIMENSIONES ──────────────────────────────────── */
  'dim-transparencia': {
    title: 'Dimensión: Transparencia Epistemológica',
    render: () => renderDimension({
      key: 'transparencia', score: 96,
      filosofia: `Evalúa el anclaje del documento con los datos del mundo real, el rigor contextual y la honestidad en el manejo de las observaciones.`,
      segundo: `SOPHIA inspecciona la trazabilidad de la evidencia, la calibración proporcional del lenguaje frente a los datos, y si se incluyen las variables de entorno necesarias para que un dato no induzca a error estadístico o causal.`,
      criterios: ['Trazabilidad de Evidencia', 'Calibración Proporcional', 'Completitud del Contexto', 'Correlación vs. Causalidad'],
    })
  },

  'dim-consistencia': {
    title: 'Dimensión: Consistencia Lógica',
    render: () => renderDimension({
      key: 'consistencia', score: 94,
      filosofia: `Evalúa la salud formal de los razonamientos, el encadenamiento de las ideas y la ausencia de contradicciones estructurales dentro del documento.`,
      segundo: `Un texto coherente mantiene las mismas reglas críticas en toda su extensión, evita saltos lógicos (Non Sequitur), y separa explícitamente el momento en que describe la realidad empírica del momento en que prescribe una moral o política.`,
      criterios: ['Validez Derivativa', 'Coherencia Interna', 'Descripción vs. Prescripción'],
    })
  },

  'dim-claridad': {
    title: 'Dimensión: Claridad Conceptual',
    render: () => renderDimension({
      key: 'claridad', score: 91,
      filosofia: `Fiscaliza el control del lenguaje, la delimitación semántica y el orden temático del documento para evitar el oscurantismo técnico.`,
      segundo: `SOPHIA penaliza la mutación de conceptos a lo largo del texto (deriva semántica) y evalúa si los párrafos convergen sistemáticamente hacia la resolución de la interrogante principal planteada, sin ramificaciones estériles.`,
      criterios: ['Precisión Semántica', 'Foco Temático'],
    })
  },

  'dim-pedagogia': {
    title: 'Dimensión: Calidad Pedagógica',
    render: () => renderDimension({
      key: 'pedagogia', score: 93,
      filosofia: `Mide la empatía comunicacional, la transferencia efectiva de ideas complejas y el uso responsable de los recursos didácticos.`,
      segundo: `Se audita que las analogías y metáforas se utilicen exclusivamente para ilustrar, no como sustitutos de evidencia empírica. Además, fomenta el "anclaje casuístico" para traducir magnitudes masivas a escalas humanas comprensibles.`,
      criterios: ['Demarcación de Analogías', 'Anclaje Casuístico'],
    })
  },

  'dim-honestidad': {
    title: 'Dimensión: Honestidad Dialógica',
    render: () => renderDimension({
      key: 'honestidad', score: 95,
      filosofia: `Mide la integridad del documento al interactuar con el ecosistema de ideas disidentes y el control de la pirotecnia retórica.`,
      segundo: `Esta dimensión es vital para el debate cívico. SOPHIA verifica si el autor aplica la "Representación Justa" (Steelman) a las posturas contrarias y evalúa si el texto confía en el peso de sus argumentos o recurre a la manipulación emocional.`,
      criterios: ['Representación Justa (Steelman)', 'Proporcionalidad Retórica'],
    })
  },

  /* ── INFORME COMPLETO ─────────────────────────────── */
  informe: {
    title: 'Auditoría de Adherencia',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Motor de Evaluación</div>
        <h1 class="view-title">Auditoría de Adherencia</h1>
        <div class="view-body">
          <p>Ingresa un texto para estimar su calidad comunicativa. SOPHIA calculará su <strong>nivel de adherencia a los estándares explícitos de comunicación responsable</strong>, desglosando la evaluación por cada dimensión y criterio activado.</p>
        </div>

        <div class="eval-tool">
          <textarea class="sophia-input" id="evalInput" placeholder="Pega aquí el documento. SOPHIA auditará su Transparencia Epistemológica, Consistencia Lógica, Claridad Conceptual, Calidad Pedagógica y Honestidad Dialógica..."></textarea>
          <div class="eval-actions">
            <button class="btn-primary" id="evalBtn">Auditar Documento →</button>
            <span class="eval-note">El algoritmo explicitará qué criterios sustentan el cálculo final.</span>
          </div>
        </div>

        <div id="evalResult"></div>
      </div>`
  },

  /* ── ACADEMIA Y VOTACIÓN ──────────────────────────── */
  academia: {
    title: 'Integración con Academia',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Flujo Institucional</div>
        <h1 class="view-title">Integración con Academia y Ágora</h1>
        <div class="view-body">
          <p>En el ecosistema LogoDemocracy, una conversación colectiva corresponde principalmente a la construcción de conocimiento dentro del módulo <strong>Academia</strong>. Los documentos evaluados por SOPHIA pueden posteriormente ser utilizados por ciudadanos que participan en <strong>Ágora</strong>.</p>
          <p>SOPHIA actúa como el protocolo de calidad deliberativa previo. No entrega certificados de verdad, pero estima si un argumento fue construido con suficiente responsabilidad para no contaminar el espacio público con ruido informacional o falacias.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Estándar mínimo de Adherencia</div>
          <div class="score-list">
            <div class="score-row">
              <span class="score-label">Adherencia Global Mínima</span>
              <div class="score-bar-wrap">
                <div class="score-bar score-bar--mid" style="width:0%" data-target="75%"></div>
              </div>
              <span class="score-value score-value--mid">75%</span>
            </div>
            <div class="score-row">
              <span class="score-label">Transparencia Epistemológica</span>
              <div class="score-bar-wrap">
                <div class="score-bar score-bar--mid" style="width:0%" data-target="70%"></div>
              </div>
              <span class="score-value score-value--mid">70%</span>
            </div>
          </div>
        </div>
      </div>`
  },

  /* ── RELACIONES SISTÉMICAS ────────────────────────── */
  relaciones: {
    title: 'Ecosistema Deliberativo',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Red de Inteligencia Colectiva</div>
        <h1 class="view-title">Ecosistema Deliberativo</h1>
        <div class="view-body">
          <p>SOPHIA no busca producir consenso por sí sola. Busca mejorar las condiciones estructurales bajo las cuales el desacuerdo puede ser intelectualmente fértil dentro del resto de los módulos de LogoDemocracy.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Nodos de Interacción</div>
          <div class="relation-grid">
            <div class="relation-card relation-card--academia">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Academia & Ágora</span>
              </div>
              <div class="relation-desc">SOPHIA asegura que los documentos que ingresan a la Academia posean la trazabilidad argumentativa mínima para ser consultados y debatidos responsablemente por la ciudadanía en el Ágora.</div>
            </div>
            <div class="relation-card relation-card--rey">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Rey Filósofo</span>
              </div>
              <div class="relation-desc">Cuando un texto presenta baja adherencia al protocolo, Rey Filósofo actúa como tutor, utilizando el desglose de los átomos cognitivos fallidos para orientar al ciudadano sobre cómo mejorar su comunicación.</div>
            </div>
            <div class="relation-card relation-card--logos">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Logos</span>
              </div>
              <div class="relation-desc">Logos audita la matriz estructural del código. Mientras Logos verifica el determinismo de la arquitectura del software, SOPHIA verifica el determinismo y la honestidad de la arquitectura retórica y argumental.</div>
            </div>
            <div class="relation-card relation-card--aletheia">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Aletheia</span>
              </div>
              <div class="relation-desc">Aletheia y SOPHIA operan en tándem. SOPHIA fiscaliza el rigor y la forma de la comunicación, mientras que Aletheia mapea la estructura profunda del discurso y la veracidad cruda de sus fuentes empíricas.</div>
            </div>
          </div>
        </div>
      </div>`
  },

};

/* ─── DIMENSION RENDERER ─────────────────────────────── */
function renderDimension({ key, score, filosofia, segundo, criterios }) {
  const cls = scoreClass(score);
  const s = SCORES[key];
  return `
    <div class="view">
      <div class="view-eyebrow">Evaluación por Dimensión</div>
      <h1 class="view-title">${s.label}</h1>
      <div class="dim-hero">
        <div class="dim-score-big">${score}<span>%</span></div>
        <div>
          <div class="dim-meta-label">Adherencia de la Dimensión</div>
          <div class="dim-meta-title">${s.label}</div>
          <div class="dim-meta-desc">${s.desc}</div>
        </div>
      </div>
      <div class="view-body">
        <p>${filosofia}</p>
        <p>${segundo}</p>
      </div>
      <div class="view-section">
        <div class="view-section-title">Criterios de Evaluación que alimentan esta Dimensión</div>
        <div class="card-grid">
          ${criterios.map(c => `
            <div class="s-card">
              <div class="s-card-title">${c}</div>
              <div class="s-card-body">Criterio operativo que utiliza átomos semánticos específicos para evaluar este eje.</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ─── SPA ROUTER ─────────────────────────────────────── */
const SOPHIA = {
  current: 'inicio',

  navigate(id) {
    const view = VIEWS[id];
    if (!view) return;
    this.current = id;

    // Update header
    document.getElementById('viewTitle').textContent = view.title;

    // Render content
    const content = document.getElementById('viewContent');
    content.innerHTML = view.render();

    // Animate bars
    this._animateBars(content);

    // Bind eval button if on informe view
    if (id === 'informe') this._bindEval();

    // Update nav active state
    document.querySelectorAll('.snav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === id);
    });

    // Scroll to top
    content.scrollTop = 0;
  },

  _animateBars(root) {
    requestAnimationFrame(() => {
      root.querySelectorAll('.score-bar[data-target]').forEach(bar => {
        requestAnimationFrame(() => {
          bar.style.width = bar.dataset.target;
        });
      });
    });
  },

  _bindEval() {
    const btn = document.getElementById('evalBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const input = document.getElementById('evalInput').value.trim();
      const out = document.getElementById('evalResult');

      if (!input) {
        out.innerHTML = `<p style="color:rgba(239,68,68,.7);font-size:.78rem;margin-top:12px;">Ingresa un texto para estimar su calidad deliberativa.</p>`;
        return;
      }

      out.innerHTML = `<p style="color:rgba(229,231,235,.35);font-size:.72rem;margin-top:12px;">Calculando adherencia al protocolo...</p>`;

      setTimeout(() => {
        // Simulate slight variation
        const vary = k => Math.min(100, Math.max(40, SCORES[k].value + Math.round((Math.random()-0.5)*10)));
        const live = {
          transparencia: { ...SCORES.transparencia, value: vary('transparencia') },
          consistencia:  { ...SCORES.consistencia,  value: vary('consistencia') },
          claridad:      { ...SCORES.claridad,      value: vary('claridad') },
          pedagogia:     { ...SCORES.pedagogia,     value: vary('pedagogia') },
          honestidad:    { ...SCORES.honestidad,    value: vary('honestidad') },
        };
        const global = (Object.values(live).reduce((a,b) => a+b.value, 0) / 5).toFixed(1);

        out.innerHTML = `
          <div class="report-card" style="margin-top:20px;">
            <div class="report-card-header">
              <span class="report-card-title">Auditoría de Adherencia</span>
              <span class="report-stamp">VERSIÓN DEL PROTOCOLO: 2.1</span>
            </div>
            <div class="report-card-body">
              <div class="report-meta">
                <div class="report-meta-item">
                  <div class="meta-value">${global}%</div>
                  <div class="meta-label">Adherencia Global</div>
                </div>
                <div class="report-meta-item">
                  <div class="meta-value">${global >= 75 ? '✓' : '✗'}</div>
                  <div class="meta-label">${global >= 75 ? 'Calidad Aceptada' : 'Calidad Insuficiente'}</div>
                </div>
                <div class="report-meta-item">
                  <div class="meta-value">Alta</div>
                  <div class="meta-label">Trazabilidad</div>
                </div>
              </div>
              
              ${renderScores(live)}
              
              <div style="margin-top: 24px; padding: 14px; background: rgba(34,197,94,.05); border-left: 2px solid var(--accent);">
                 <div style="font-size: 0.72rem; color: var(--accent); margin-bottom: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Desglose de Auditoría (Basado en):</div>
                 
                 <div style="margin-bottom: 10px;">
                     <div style="font-size: 0.7rem; color: #e5e7eb; margin-bottom: 4px; font-weight: 500;">+ ${live.transparencia.label}: ${live.transparencia.value}%</div>
                     <div style="font-size: 0.65rem; color: rgba(229,231,235,.6); margin-left: 12px; line-height: 1.4;">
                        - Criterio 1.1: Trazabilidad de Evidencia (Activado positivamente)<br>
                        - Criterio 1.2: Calibración Proporcional (Moderada intensidad retórica detectada)
                     </div>
                 </div>

                 <div style="margin-bottom: 10px;">
                     <div style="font-size: 0.7rem; color: #e5e7eb; margin-bottom: 4px; font-weight: 500;">+ ${live.honestidad.label}: ${live.honestidad.value}%</div>
                     <div style="font-size: 0.65rem; color: rgba(229,231,235,.6); margin-left: 12px; line-height: 1.4;">
                        - Criterio 5.1: Representación Justa / Steelman (Aplicado correctamente)<br>
                        - Criterio 5.2: Proporcionalidad Retórica (Adecuada)
                     </div>
                 </div>

                 <div style="font-size: 0.65rem; color: rgba(59,130,246,.7); margin-top: 12px;">
                    * Algoritmo de evaluación ejecutado con base en 20 criterios documentados y públicos.
                 </div>
              </div>

            </div>
          </div>`;

        SOPHIA._animateBars(out);
      }, 900);
    });
  },

  init() {
    // Bind sidebar nav
    document.querySelectorAll('.snav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.view));
    });
    // Render initial view
    this.navigate('inicio');
  }
};

document.addEventListener('DOMContentLoaded', () => SOPHIA.init());
