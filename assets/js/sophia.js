/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Protocolo Abierto de Comunicación Deliberativa
   v3.0 — Ontología Pública de la Deliberación (con try/catch visible)
   ═══════════════════════════════════════════════════════ */

// ─── DEPURACIÓN VISIBLE ────────────────────────────────
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

// ─── PROTOCOLO SOPHIA v3.0 ────────────────────────────
const PROTOCOL = {
  version: "3.0",
  fases: [
    {
      id: "fase1",
      nombre: "Estructura Lógica",
      descripcion: "Integridad de la arquitectura base del argumento.",
      criterios: [
        {
          id: "1.1",
          nombre: "No Contradicción",
          constructo: "Consistencia Interna",
          definicion: "Determinar si el discurso presenta proposiciones excluyentes sin resolución.",
          atomos: [
            { id: "discurso", definicion: "El flujo total de enunciados emitidos por el autor.", patrones: [] },
            { id: "proposiciones", definicion: "Enunciados declarativos que afirman o niegan un estado de cosas.", patrones: [] },
            { id: "excluyentes", definicion: "Propiedad de dos enunciados que no pueden ser ambos verdaderos simultáneamente.", patrones: ["pero", "sin embargo", "no obstante", "aunque"] },
            { id: "resolucion", definicion: "Explicación lógica que reconcilia dos elementos aparentemente opuestos.", patrones: ["por lo tanto", "en consecuencia", "de modo que"] }
          ],
          severidad: 12.5
        },
        {
          id: "1.2",
          nombre: "Continuidad Semántica",
          constructo: "Estabilidad Conceptual",
          definicion: "Evaluar la estabilidad del significado de los conceptos a lo largo del argumento.",
          atomos: [
            { id: "estabilidad", definicion: "Propiedad de mantener una definición constante sin fluctuaciones.", patrones: [] },
            { id: "significado", definicion: "La definición operativa asignada a un término en la primera instancia de uso.", patrones: [] },
            { id: "conceptos", definicion: "Unidades léxicas que portan el peso del contenido temático.", patrones: [] },
            { id: "argumento", definicion: "La serie encadenada de enunciados que buscan probar una tesis.", patrones: [] }
          ],
          severidad: 12.5
        },
        {
          id: "1.3",
          nombre: "Ausencia de Falsas Dicotomías",
          constructo: "Reducción de Complejidad",
          definicion: "Verificar si se fuerza una elección binaria ante un problema multidimensional.",
          atomos: [
            { id: "eleccion", definicion: "Proceso de selección entre opciones presentadas.", patrones: ["o", "o bien", "alternativa"] },
            { id: "binaria", definicion: "Estructura que reduce el espectro a solo dos posibilidades.", patrones: ["dos opciones", "dos caminos", "dos posibilidades"] },
            { id: "problema", definicion: "El fenómeno central objeto de análisis.", patrones: [] },
            { id: "multidimensional", definicion: "Fenómeno que requiere más de dos variables para ser comprendido.", patrones: ["complejo", "múltiples factores", "diversos aspectos"] }
          ],
          severidad: 12.5
        },
        {
          id: "1.4",
          nombre: "Integridad de las Premisas",
          constructo: "Anclaje Inferencial",
          definicion: "Asegurar que cada enunciado declarativo tenga un soporte lógico.",
          atomos: [
            { id: "enunciado", definicion: "Unidad mínima de sentido completo.", patrones: [] },
            { id: "declarativo", definicion: "Que afirma la existencia o realidad de algo.", patrones: [] },
            { id: "soporte", definicion: "Elemento (dato, premisa, inferencia) que justifica la validez de otro.", patrones: ["porque", "ya que", "dado que"] },
            { id: "logico", definicion: "Relación de necesidad entre una base y su consecuencia.", patrones: ["si... entonces", "implica", "conlleva"] }
          ],
          severidad: 12.5
        }
      ]
    },
    {
      id: "fase2",
      nombre: "Inferencia",
      descripcion: "Ingeniería de la derivación argumentativa.",
      criterios: [
        {
          id: "2.1",
          nombre: "Suficiencia Inferencial",
          constructo: "Escalamiento Inferencial",
          definicion: "Medir si la conclusión es proporcional a la magnitud de las premisas.",
          atomos: [
            { id: "conclusion", definicion: "Resultado final derivado de un proceso de razonamiento.", patrones: ["en conclusión", "por lo tanto", "así pues"] },
            { id: "magnitud", definicion: "Alcance cuantitativo o cualitativo de la afirmación (particular vs. universal).", patrones: ["todos", "siempre", "nunca", "nadie"] },
            { id: "premisas", definicion: "Enunciados base tomados como ciertos para derivar la conclusión.", patrones: [] }
          ],
          severidad: 12.5
        },
        {
          id: "2.2",
          nombre: "Causalidad Rigurosa",
          constructo: "Nexo Causal",
          definicion: "Diferenciar la correlación estadística de la causalidad demostrada.",
          atomos: [
            { id: "correlacion", definicion: "Observación de dos variables que fluctúan simultáneamente.", patrones: ["correlación", "asociación", "relación"] },
            { id: "causalidad", definicion: "Nexo necesario donde un evento (causa) produce mecánicamente otro (efecto).", patrones: ["causa", "provoca", "genera", "desencadena"] }
          ],
          severidad: 12.5
        },
        {
          id: "2.3",
          nombre: "Proporcionalidad Generalizadora",
          constructo: "Generalización Justificada",
          definicion: "Evitar que una anécdota se convierta en una regla universal.",
          atomos: [
            { id: "anecdota", definicion: "Registro de un caso singular o no representativo.", patrones: ["por ejemplo", "como en el caso de", "una vez"] },
            { id: "regla", definicion: "Afirmación que pretende validez para todos los casos de un conjunto.", patrones: ["siempre", "nunca", "todos", "ninguno"] }
          ],
          severidad: 12.5
        },
        {
          id: "2.4",
          nombre: "Inmunidad a Petición de Principio",
          constructo: "Circularidad Lógica",
          definicion: "Detectar la circularidad cuando la asunción es la misma conclusión.",
          atomos: [
            { id: "circularidad", definicion: "Estructura donde el final del argumento repite el inicio sin avanzar.", patrones: ["porque", "ya que", "dado que"] },
            { id: "asuncion", definicion: "Premisa no demostrada que se introduce como base del razonamiento.", patrones: ["asumiendo", "suponiendo", "dando por sentado"] }
          ],
          severidad: 25.0
        }
      ]
    },
    {
      id: "fase3",
      nombre: "Calibración Epistémica",
      descripcion: "Relación con el conocimiento y la evidencia.",
      criterios: [
        {
          id: "3.1",
          nombre: "Trazabilidad de la Evidencia",
          constructo: "Anclaje Empírico",
          definicion: "Identificar el origen y la verificabilidad de los datos.",
          atomos: [
            { id: "origen", definicion: "Fuente documental o empírica de la información.", patrones: ["según", "fuente", "estudio", "informe"] },
            { id: "verificabilidad", definicion: "Capacidad de comprobar la información mediante una fuente externa.", patrones: ["verificable", "comprobable", "contrastable"] },
            { id: "datos", definicion: "Cifras, hechos o registros utilizados como evidencia.", patrones: ["%", "dato", "cifra", "número"] }
          ],
          severidad: 12.5
        },
        {
          id: "3.2",
          nombre: "Declaración de Incertidumbre",
          constructo: "Honestidad Epistémica",
          definicion: "Comparar el matiz del lenguaje con la certeza de la afirmación.",
          atomos: [
            { id: "matiz", definicion: "Modificador probabilístico (probablemente, posiblemente).", patrones: ["probablemente", "posiblemente", "quizás", "tal vez"] },
            { id: "lenguaje", definicion: "El conjunto de palabras elegidas para expresar la postura.", patrones: [] },
            { id: "certeza", definicion: "Ausencia de duda expresada en una predicción o hecho futuro.", patrones: ["es seguro", "indudablemente", "sin duda", "claramente"] }
          ],
          severidad: 12.5
        },
        {
          id: "3.3",
          nombre: "Delimitación Hecho-Valor",
          constructo: "Distinción Epistémica",
          definicion: "Distinguir claramente el hecho empírico del juicio moral.",
          atomos: [
            { id: "hecho", definicion: "Afirmación sobre un estado de cosas objetivo.", patrones: ["es", "está", "existe"] },
            { id: "juicio", definicion: "Valoración subjetiva sobre la bondad o maldad de un hecho.", patrones: ["bueno", "malo", "justo", "injusto", "debería"] }
          ],
          severidad: 12.5
        },
        {
          id: "3.4",
          nombre: "Completitud del Contexto",
          constructo: "Integridad Contextual",
          definicion: "Auditar la omisión de variables críticas en el entorno del dato.",
          atomos: [
            { id: "variables", definicion: "Elementos que afectan el comportamiento o lectura de un dato.", patrones: ["variable", "factor", "condición"] },
            { id: "entorno", definicion: "Situación, época o circunstancias que rodean al dato.", patrones: ["contexto", "entorno", "circunstancia"] }
          ],
          severidad: 12.5
        }
      ]
    },
    {
      id: "fase4",
      nombre: "Transparencia Retórica",
      descripcion: "Limpieza y honestidad comunicativa.",
      criterios: [
        {
          id: "4.1",
          nombre: "Representación Justa (Steelman)",
          constructo: "Alteridad Cognitiva",
          definicion: "Evaluar si el argumento contrario es tratado de forma robusta.",
          atomos: [
            { id: "argumento", definicion: "Exposición de razones en contra o a favor.", patrones: ["argumento", "razón", "tesis"] },
            { id: "contrario", definicion: "Postura disidente a la del emisor.", patrones: ["contrario", "opositor", "crítico", "disidente"] },
            { id: "robusta", definicion: "Versión que conserva toda la fuerza lógica de la postura opuesta.", patrones: ["fortaleza", "sólido", "robusto"] }
          ],
          severidad: 12.5
        },
        {
          id: "4.2",
          nombre: "Neutralidad Emocional",
          constructo: "Sustitución Argumental por Activación Emocional",
          definicion: "Identificar adjetivos que cargan la intención del texto.",
          atomos: [
            { id: "adjetivos", definicion: "Modificadores que cualifican sustantivos con carga subjetiva.", patrones: ["terrible", "maravilloso", "horrible", "excelente", "lamentable"] },
            { id: "intencion", definicion: "Propósito subyacente de manipular la reacción del lector.", patrones: ["manipulación", "engaño", "sesgo"] }
          ],
          severidad: 12.5
        },
        {
          id: "4.3",
          nombre: "Despersonalización del Debate",
          constructo: "Separación Identidad-Argumento",
          definicion: "Separar la identidad del emisor del argumento presentado.",
          atomos: [
            { id: "identidad", definicion: "Rasgos, afiliaciones o carácter del sujeto que emite el discurso.", patrones: ["yo", "mi", "nuestro", "ellos"] },
            { id: "argumento", definicion: "Estructura racional que debe sostenerse por sí misma.", patrones: [] }
          ],
          severidad: 12.5
        },
        {
          id: "4.4",
          nombre: "Claridad Denotativa",
          constructo: "Precisión Léxica",
          definicion: "Detectar el uso de palabras ambiguas sin definición.",
          atomos: [
            { id: "palabras", definicion: "Unidades léxicas usadas para transmitir conceptos.", patrones: [] },
            { id: "ambiguas", definicion: "Términos que admiten múltiples interpretaciones (ej: 'justo', 'bueno') sin definición operacional.", patrones: ["justo", "bueno", "libertad", "democracia", "igualdad"] }
          ],
          severidad: 12.5
        }
      ]
    },
    {
      id: "fase5",
      nombre: "Pertinencia Deliberativa",
      descripcion: "Valor cívico y utilidad pública.",
      criterios: [
        {
          id: "5.1",
          nombre: "Focalización Temática",
          constructo: "Relevancia Central",
          definicion: "Evitar que una tangente desvíe el núcleo del debate.",
          atomos: [
            { id: "tangente", definicion: "Tema introducido que no altera lógicamente la conclusión del núcleo.", patrones: ["digresión", "tangente", "fuera de tema"] },
            { id: "nucleo", definicion: "El problema central definido explícitamente en el inicio del intercambio.", patrones: ["objeto", "propósito", "tema central"] }
          ],
          severidad: 12.5
        },
        {
          id: "5.2",
          nombre: "Responsabilidad Constructiva",
          constructo: "Aportación Propositiva",
          definicion: "Garantizar que toda crítica incluya una propuesta alternativa.",
          atomos: [
            { id: "critica", definicion: "Señalamiento de un error o falla en el argumento ajeno.", patrones: ["crítica", "objeción", "pero"] },
            { id: "propuesta", definicion: "Aporte de una visión, solución o vía de acción nueva.", patrones: ["propongo", "sugiero", "alternativa", "solución"] }
          ],
          severidad: 12.5
        },
        {
          id: "5.3",
          nombre: "Universalidad (Simetría)",
          constructo: "Equidad Epistémica",
          definicion: "Aplicar el mismo estándar de prueba para ambos lados.",
          atomos: [
            { id: "estandar", definicion: "Nivel de exigencia requerido para aceptar una evidencia.", patrones: ["estándar", "criterio", "exigencia"] },
            { id: "prueba", definicion: "Elemento de juicio que sostiene una afirmación.", patrones: ["prueba", "evidencia", "demostración"] },
            { id: "pluralidad", definicion: "Reconocimiento de la diversidad de enfoques metodológicos legítimos.", patrones: ["pluralidad", "diversidad", "múltiples perspectivas"] }
          ],
          severidad: 12.5
        },
        {
          id: "5.4",
          nombre: "Falsabilidad",
          constructo: "Refutabilidad",
          definicion: "Exponer el argumento a la evidencia refutadora.",
          atomos: [
            { id: "evidencia", definicion: "Información que entra en conflicto directo con la tesis.", patrones: ["contraejemplo", "refutación", "objeción"] },
            { id: "refutadora", definicion: "Capaz de demostrar la falsedad del argumento.", patrones: ["refutar", "falsear", "desmentir"] }
          ],
          severidad: 25.0
        }
      ]
    }
  ]
};

// ─── MECÁNICA DE CÁLCULO (fallback) ──────────────────
function evaluateText(text) {
  console.warn('⚠️ evaluateText local llamado (no debería usarse)');
  return { IRD_global: 0, riesgo: "Normal", fases: [], evidencias: [] };
}

// ─── SISTEMA DE POPUPS ─────────────────────────────────
function showDefinitionPopup(title, definition) {
  try {
    const existing = document.querySelector('.sophia-popup-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.className = 'sophia-popup-overlay';
    overlay.innerHTML = `
      <div class="sophia-popup">
        <div class="sophia-popup-header">
          <span class="sophia-popup-title">${title}</span>
          <button class="sophia-popup-close">&times;</button>
        </div>
        <div class="sophia-popup-body">${definition}</div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.sophia-popup-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  } catch (e) {
    showDebug(`❌ Error en popup: ${e.message}`, true);
  }
}

// ─── RENDER DE FASES ─────────────────────────────────────
function renderFase(faseId) {
  try {
    const fase = PROTOCOL.fases.find(f => f.id === faseId);
    if (!fase) return "<p>Fase no encontrada.</p>";
    return `
      <div class="view">
        <div class="view-eyebrow">Fase ${faseId.charAt(faseId.length-1)} del Protocolo</div>
        <h1 class="view-title">${fase.nombre}</h1>
        <div class="view-body">
          <p>${fase.descripcion}</p>
          <p><strong>Constructos clave:</strong> ${fase.criterios.map(c => c.constructo).join(' • ')}</p>
        </div>
        <div class="view-section">
          <div class="view-section-title">Criterios y Átomos</div>
          ${fase.criterios.map(c => `
            <div style="margin-bottom: 20px; background: var(--s-panel); padding: 14px; border-left: 2px solid var(--accent);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 500; color: #e5e7eb;">${c.id} — ${c.nombre}</span>
                <span style="font-size: 0.7rem; color: rgba(229,231,235,.4);">Severidad: ${c.severidad}</span>
              </div>
              <div style="font-size: 0.8rem; color: rgba(229,231,235,.5); margin: 6px 0;">${c.definicion}</div>
              <div style="font-size: 0.7rem; color: rgba(229,231,235,.35);">
                Constructo: <strong style="color: var(--accent); cursor: pointer;" data-constructo="${c.constructo}">${c.constructo}</strong>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                ${c.atomos.map(a => `
                  <span style="background: rgba(59,130,246,.12); padding: 2px 8px; border-radius: 12px; font-size: 0.6rem; color: #d97706; cursor: pointer;" data-atomo="${a.id}">
                    ${a.id}
                  </span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (e) {
    showDebug(`❌ Error en renderFase(${faseId}): ${e.message}`, true);
    return `<p>Error al renderizar la fase: ${e.message}</p>`;
  }
}

// ─── VISTAS ────────────────────────────────────────────
const VIEWS = {
  analisis: {
    title: 'Análisis Sophia',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Motor de Evaluación</div>
            <h1 class="view-title">Análisis Sophia</h1>
            <div class="view-body">
              <p>Carga un documento para estimar su <strong>Índice de Robustez Deliberativa (IRD)</strong> según el protocolo SOPHIA v3.0.</p>
              <p>Formatos aceptados: <strong>.txt, .pdf</strong> (próximamente .docx, .odt).</p>
            </div>
            <div class="eval-tool">
              <div class="upload-area" id="uploadArea" style="border:2px dashed rgba(59,130,246,.3); padding:20px; text-align:center; cursor:pointer; border-radius:4px; transition: border-color .2s;">
                <p style="color:rgba(229,231,235,.4);">Arrastra tu archivo aquí o haz clic para seleccionarlo</p>
                <input type="file" id="fileInput" accept=".txt,.pdf" style="display:none;">
                <button class="btn-primary" id="uploadBtn">Seleccionar archivo</button>
              </div>
              <div id="filePreview" style="margin-top:12px; display:none;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span id="fileName" style="color:var(--accent);"></span>
                  <span id="fileSize" style="color:rgba(229,231,235,.4);font-size:.7rem;"></span>
                </div>
                <textarea class="sophia-input" id="evalInput" placeholder="El contenido del archivo aparecerá aquí..." style="height:150px;"></textarea>
              </div>
              <div class="eval-actions">
                <button class="btn-primary" id="evalBtn">Auditar Documento →</button>
                <span class="eval-note">El algoritmo es determinista y basado en reglas públicas.</span>
              </div>
            </div>
            <div id="evalResult"></div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista analisis: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
  },
  inicio: {
    title: 'Sophia — Protocolo Abierto de Comunicación Deliberativa',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Marco de Evaluación Deliberativa · v3.0</div>
            <h1 class="view-title">¿Qué es SOPHIA?</h1>
            <div class="view-body">
              <p>SOPHIA es un <strong>protocolo abierto de comunicación deliberativa</strong> (RFC de la racionalidad pública). No evalúa la verdad del contenido, sino la <strong>legitimidad del proceso argumentativo</strong>.</p>
              <p>Se fundamenta en una <strong>gramática formal de la deliberación</strong>: un sistema de reglas, átomos semánticos y meta-reglas que cualquier ciudadano puede auditar, debatir y versionar.</p>
              <p>Todo el código fuente cognitivo es <strong>Open Source</strong>; cada criterio, constructo y átomo está documentado y es debatible.</p>
              <p>SOPHIA no censura; <strong>etiqueta</strong>. Su salida es un <em>acta de infracción</em> que detalla qué reglas de la conversación racional han sido violadas y en qué medida.</p>
              <p>Es, en esencia, un <strong>sistema inmunológico cognitivo</strong> para el espacio público.</p>
            </div>
            <div class="view-section">
              <div class="view-section-title">Las 5 Fases del Protocolo</div>
              <div class="card-grid">
                ${PROTOCOL.fases.map(f => `
                  <div class="s-card">
                    <div class="s-card-title">${f.nombre}</div>
                    <div class="s-card-body">${f.descripcion}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista inicio: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
  },
  opensource: {
    title: 'Open Source Cognitivo',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Transparencia Radical</div>
            <h1 class="view-title">Open Source Cognitivo</h1>
            <div class="view-body">
              <p>El <strong>Open Source Cognitivo</strong> es el principio fundacional de SOPHIA. Todo el conocimiento que utiliza el sistema para evaluar está documentado, es público y versionable.</p>
              <p>Esto incluye: las 5 fases, 20 criterios, átomos cognitivos con definiciones operacionales, reglas de interpretación y meta‑reglas.</p>
              <p><strong>¿Y el algoritmo de IA?</strong> No podemos explicitar la implementación concreta, pero sí todo lo que el modelo debe buscar: patrones lingüísticos, umbrales y condiciones.</p>
              <p>El protocolo es determinista en su definición, aunque la implementación técnica pueda variar.</p>
            </div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista opensource: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
  },
  atomos: {
    title: 'Átomos Cognitivos',
    render: () => {
      try {
        const todosAtomos = [];
        PROTOCOL.fases.forEach(f => {
          f.criterios.forEach(c => {
            c.atomos.forEach(a => {
              todosAtomos.push({
                id: a.id,
                definicion: a.definicion,
                patrones: a.patrones,
                criterio: `${c.id} - ${c.nombre}`,
                fase: f.nombre
              });
            });
          });
        });
        return `
          <div class="view">
            <div class="view-eyebrow">Unidades mínimas de significado</div>
            <h1 class="view-title">Átomos Cognitivos</h1>
            <div class="view-body">
              <p>Los <strong>átomos cognitivos</strong> son las unidades semánticas fundamentales del protocolo SOPHIA. Cada uno representa un concepto operacional que la IA debe detectar en el texto.</p>
              <p>Se organizan en 20 criterios distribuidos en 5 fases. Total de átomos: <strong>${todosAtomos.length}</strong>.</p>
            </div>
            <div class="view-section">
              <div class="view-section-title">Listado completo</div>
              <div style="max-height:400px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
                ${todosAtomos.map(a => `
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.05); padding:6px 0;">
                    <span style="color:var(--accent); font-weight:500; width:120px;">${a.id}</span>
                    <span style="font-size:.75rem; color:rgba(229,231,235,.6); flex:1; padding:0 10px;">${a.definicion}</span>
                    <span style="font-size:.6rem; color:rgba(229,231,235,.3); width:140px; text-align:right;">${a.criterio}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista atomos: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
  },
  formula: {
    title: 'Fórmula de Cálculo',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Mecánica del Puntaje</div>
            <h1 class="view-title">¿Cómo se calcula el IRD?</h1>
            <div class="view-body">
              <p>El <strong>Índice de Robustez Deliberativa (IRD)</strong> se calcula así:</p>
              <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border); font-family:monospace; font-size:.85rem; color:#e5e7eb; margin:16px 0;">
                <div>Penalización<sub>criterio</sub> = min( ∑( Severidad<sub>átomo</sub> × Frecuencia<sub>átomo</sub> ), 25 )</div>
                <div style="margin-top:8px; color:rgba(229,231,235,.5); font-size:.7rem;">
                  • Severidad: Nivel 1 (5 pts), Nivel 2 (12.5 pts), Nivel 3 (25 pts)<br>
                  • Frecuencia: número de oraciones donde el átomo se activa<br>
                  • Tope: 25 pts por criterio
                </div>
              </div>
              <p><strong>Meta‑reglas:</strong> MR-001 (mitigación por incertidumbre), MR-002 (agravamiento por falta de Steelman), MR-003 (neutralización para textos poéticos).</p>
            </div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista formula: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
  },
  fase1: { title: 'Fase 1: Estructura Lógica', render: () => renderFase('fase1') },
  fase2: { title: 'Fase 2: Inferencia', render: () => renderFase('fase2') },
  fase3: { title: 'Fase 3: Calibración Epistémica', render: () => renderFase('fase3') },
  fase4: { title: 'Fase 4: Transparencia Retórica', render: () => renderFase('fase4') },
  fase5: { title: 'Fase 5: Pertinencia Deliberativa', render: () => renderFase('fase5') },
  academia: {
    title: 'Integración con Academia',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Flujo Institucional</div>
            <h1 class="view-title">Integración con Academia y Ágora</h1>
            <div class="view-body">
              <p>SOPHIA actúa como el <strong>protocolo de calidad deliberativa</strong> previo al ingreso de documentos a la <strong>Academia</strong>.</p>
              <p>Los documentos con IRD ≥ 75% pueden ser sometidos a discusión en el <strong>Ágora</strong>.</p>
            </div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista academia: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
  },
  relaciones: {
    title: 'Ecosistema Deliberativo',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Red de Inteligencia Colectiva</div>
            <h1 class="view-title">Ecosistema Deliberativo</h1>
            <div class="view-body">
              <p>SOPHIA no busca producir consenso; busca mejorar las condiciones estructurales para que el desacuerdo sea fértil.</p>
              <p><strong>Nodos:</strong> Academia, Rey Filósofo, Logos, Aletheia.</p>
            </div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista relaciones: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
  },
  informe: {
    title: 'Auditoría de Adherencia',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Motor de Evaluación</div>
            <h1 class="view-title">Auditoría de Adherencia</h1>
            <div class="view-body">
              <p>Ingresa un texto para estimar su <strong>Índice de Robustez Deliberativa (IRD)</strong>.</p>
              <div class="eval-tool">
                <textarea class="sophia-input" id="evalInput" placeholder="Pega aquí el documento a auditar..." style="height:150px; width:100%; background:var(--s-panel); border:1px solid var(--s-border); padding:12px; color:#e5e7eb;"></textarea>
                <div class="eval-actions">
                  <button class="btn-primary" id="evalBtn">Auditar Documento →</button>
                </div>
              </div>
              <div id="evalResult"></div>
            </div>
          </div>
        `;
      } catch (e) {
        showDebug(`❌ Error en vista informe: ${e.message}`, true);
        return `<p>Error al renderizar: ${e.message}</p>`;
      }
    }
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
      showDebug('✅ SOPHIA inicializada correctamente.');
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
