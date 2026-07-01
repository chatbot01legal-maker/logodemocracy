/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Protocolo Abierto de Comunicación Deliberativa
   v3.0 — Ontología Pública de la Deliberación (con logs)
   ═══════════════════════════════════════════════════════ */

console.log('📦 SOPHIA.JS cargando...');

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

console.log(`✅ PROTOCOL cargado. Fases: ${PROTOCOL.fases.length}`);

// ─── MECÁNICA DE CÁLCULO (fallback local, no se usa en este modo) ──
function evaluateText(text) {
  console.warn('⚠️ evaluateText local llamado (no debería usarse)');
  return { IRD_global: 0, riesgo: "Normal", fases: [], evidencias: [] };
}

// ─── SISTEMA DE POPUPS ─────────────────────────────────
function showDefinitionPopup(title, definition) {
  console.log(`🔔 Popup: ${title}`);
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
}

// ─── RENDER DE FASES (con popups) ─────────────────────
function renderFase(faseId) {
  console.log(`🖥️ Renderizando fase: ${faseId}`);
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
}

// ─── VISTAS ────────────────────────────────────────────
console.log('🔄 Construyendo vistas...');
const VIEWS = {
  analisis: {
    title: 'Análisis Sophia',
    render: () => `
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
    `
  },
  inicio: {
    title: 'Sophia — Protocolo Abierto de Comunicación Deliberativa',
    render: () => `
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
        <div class="view-section">
          <div class="view-section-title">Trazabilidad Argumentativa</div>
          <div class="card-grid">
            <div class="s-card">
              <div class="s-card-title">Criterios Públicos</div>
              <div class="s-card-body">20 criterios documentados y accesibles, con sus definiciones operacionales.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Historial Versionado</div>
              <div class="s-card-body">Cada modificación queda registrada; se puede comparar la evolución de las reglas del debate.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Auditoría Permanente</div>
              <div class="s-card-body">Cualquier ciudadano puede verificar por qué un texto obtuvo su puntuación.</div>
            </div>
          </div>
        </div>
      </div>`
  },
  opensource: {
    title: 'Open Source Cognitivo',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Transparencia Radical</div>
        <h1 class="view-title">Open Source Cognitivo</h1>
        <div class="view-body">
          <p>El <strong>Open Source Cognitivo</strong> es el principio fundacional de SOPHIA. Todo el conocimiento que utiliza el sistema para evaluar está documentado, es público y versionable.</p>
          <p>Esto incluye:</p>
          <ul style="color:rgba(229,231,235,.6); margin-left:20px; line-height:1.8;">
            <li><strong>Las 5 fases</strong> y sus 20 criterios.</li>
            <li><strong>Los 48 átomos cognitivos</strong> con sus definiciones operacionales.</li>
            <li><strong>Las reglas de interpretación</strong> que determinan las penalizaciones.</li>
            <li><strong>Las meta‑reglas</strong> que contextualizan la evaluación.</li>
          </ul>
          <p><strong>¿Y el algoritmo de IA?</strong> No podemos explicitar completamente la implementación concreta que utiliza el modelo de lenguaje para detectar patrones, porque depende de la arquitectura del modelo y de su entrenamiento. <strong>Pero sí podemos explicitar todo lo que el modelo debe buscar</strong>: los patrones lingüísticos, los umbrales, las relaciones lógicas y las condiciones que activan cada átomo.</p>
          <p>Esto garantiza que, aunque la IA tenga cierta libertad en la ejecución, el <strong>significado de cada evaluación</strong> es fijo y reproducible. Cualquier persona, con cualquier herramienta, puede replicar el mismo resultado aplicando las mismas reglas.</p>
          <p>Es decir: <strong>el protocolo es determinista en su definición</strong>, aunque la implementación técnica pueda variar.</p>
        </div>
        <div class="view-section">
          <div class="view-section-title">Transparencia del instrumento</div>
          <div class="card-grid">
            <div class="s-card">
              <div class="s-card-title">Reglas públicas</div>
              <div class="s-card-body">Todos los criterios y átomos están documentados en el código fuente y en la interfaz.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Versionado semántico</div>
              <div class="s-card-body">Cada cambio en el protocolo se registra y se puede debatir comunitariamente.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Auditoría ciudadana</div>
              <div class="s-card-body">Cualquier persona puede verificar por qué un texto obtuvo una puntuación determinada.</div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  atomos: {
    title: 'Átomos Cognitivos',
    render: () => {
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
            <p>Los <strong>átomos cognitivos</strong> son las unidades semánticas fundamentales del protocolo SOPHIA. Cada uno representa un concepto operacional que la IA debe detectar en el texto para evaluar su calidad deliberativa.</p>
            <p>Se organizan en 20 criterios distribuidos en 5 fases. A continuación se muestra el listado completo.</p>
          </div>
          <div class="view-section">
            <div class="view-section-title">Repositorio completo de átomos</div>
            <div style="max-height:400px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
              ${todosAtomos.map(a => `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.05); padding:6px 0;">
                  <span style="color:var(--accent); font-weight:500; width:120px;">${a.id}</span>
                  <span style="font-size:.75rem; color:rgba(229,231,235,.6); flex:1; padding:0 10px;">${a.definicion}</span>
                  <span style="font-size:.6rem; color:rgba(229,231,235,.3); width:140px; text-align:right;">${a.criterio}</span>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:12px; font-size:.7rem; color:rgba(229,231,235,.3);">
              Total de átomos: ${todosAtomos.length}
            </div>
          </div>
          <div class="view-section">
            <div class="view-section-title">Función dentro del instrumento</div>
            <div class="view-body">
              <p>Cada átomo se activa cuando el texto contiene ciertos patrones lingüísticos (palabras clave, construcciones gramaticales). Su detección contribuye a la penalización del criterio correspondiente, según la severidad asignada y la frecuencia de aparición.</p>
              <p>Esta arquitectura permite que la evaluación sea <strong>transparente y replicable</strong>: cualquier persona puede inspeccionar qué átomos se activaron y por qué.</p>
            </div>
          </div>
        </div>
      `;
    }
  },
  formula: {
    title: 'Fórmula de Cálculo',
    render: () => {
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
          <div class="view-eyebrow">Mecánica del Puntaje</div>
          <h1 class="view-title">¿Cómo se calcula el IRD?</h1>
          <div class="view-body">
            <p>El <strong>Índice de Robustez Deliberativa (IRD)</strong> es un número entre 0 y 100 que refleja la adherencia de un texto al protocolo SOPHIA. Se calcula mediante un proceso jerárquico y determinista.</p>
            <p>Cada <strong>dimensión</strong> (fase) contiene 4 <strong>criterios</strong>. Cada criterio se evalúa a través de <strong>átomos cognitivos</strong> (unidades semánticas).</p>
          </div>

          <div class="view-section">
            <div class="view-section-title">Estructura de evaluación</div>
            <div class="flow-steps">
              <div class="flow-step"><div class="flow-dot">1</div><div class="flow-body"><div class="flow-title">Dimensión</div><div class="flow-desc">Ej: Fase II — Inferencia</div></div></div>
              <div class="flow-step"><div class="flow-dot">2</div><div class="flow-body"><div class="flow-title">Criterio</div><div class="flow-desc">Ej: 2.1 Suficiencia Inferencial</div></div></div>
              <div class="flow-step"><div class="flow-dot">3</div><div class="flow-body"><div class="flow-title">Constructo</div><div class="flow-desc">Ej: Escalamiento Inferencial (entidad teórica)</div></div></div>
              <div class="flow-step"><div class="flow-dot">4</div><div class="flow-body"><div class="flow-title">Átomos Cognitivos</div><div class="flow-desc">Ej: Premisa, Conclusión, Magnitud, Universalización, Extrapolación</div></div></div>
              <div class="flow-step"><div class="flow-dot">5</div><div class="flow-body"><div class="flow-title">Definición operacional</div><div class="flow-desc">Cada átomo tiene una definición concreta y patrones lingüísticos.</div></div></div>
              <div class="flow-step"><div class="flow-dot">6</div><div class="flow-body"><div class="flow-title">Reglas de interpretación</div><div class="flow-desc">Lógica IF-THEN que determina penalizaciones.</div></div></div>
              <div class="flow-step"><div class="flow-dot">7</div><div class="flow-body"><div class="flow-title">Implementación LLM</div><div class="flow-desc">Patrones de búsqueda (ej: "todos", "siempre").</div></div></div>
              <div class="flow-step"><div class="flow-dot">8</div><div class="flow-body"><div class="flow-title">Salida obligatoria</div><div class="flow-desc">Acta de infracción con puntaje, átomos activados y evidencias.</div></div></div>
            </div>
          </div>

          <div class="view-section">
            <div class="view-section-title">Fórmula de agregación</div>
            <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border); font-family:monospace; font-size:.85rem; color:#e5e7eb; margin-bottom:16px;">
              <div>Penalización<sub>criterio</sub> = min( ∑( Severidad<sub>átomo</sub> × Frecuencia<sub>átomo</sub> ), 25 )</div>
              <div style="margin-top:8px; color:rgba(229,231,235,.5); font-size:.7rem;">
                • Severidad: Nivel 1 (5 pts), Nivel 2 (12.5 pts), Nivel 3 (25 pts)<br>
                • Frecuencia: número de oraciones donde el átomo se activa<br>
                • Tope: 25 pts por criterio (equivale a una violación Nivel 3)
              </div>
            </div>
            <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border);">
              <div style="font-weight:500; color:var(--accent);">Meta‑reglas (contexto)</div>
              <div style="font-size:.8rem; color:rgba(229,231,235,.6); margin-top:8px;">
                <strong>MR-001 (Mitigación):</strong> Si Criterio 3.2 (Incertidumbre) > 80, la penalización por Criterio 4.2 (Emoción) se reduce al 50%.<br>
                <strong>MR-002 (Agravamiento):</strong> Si falla 3.1 (Trazabilidad) y 4.1 (Steelman), penalización duplicada (en desarrollo).<br>
                <strong>MR-003 (Neutralización):</strong> Si el texto es poético/artístico, se anulan criterios retóricos (en desarrollo).
              </div>
            </div>
          </div>

          <div class="view-section">
            <div class="view-section-title">Ejemplo completo: Suficiencia Inferencial (2.1)</div>
            <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border);">
              <div style="font-size:.75rem; color:rgba(229,231,235,.7);">
                <strong>Constructo:</strong> Escalamiento Inferencial<br>
                <strong>Definición:</strong> Propiedad que describe el grado en que una conclusión amplía, mantiene o excede la información contenida en las premisas.<br>
                <strong>Átomos:</strong> Premisa, Conclusión, Magnitud, Universalización, Extrapolación<br>
                <strong>Regla:</strong> Si magnitud(conclusión) > magnitud(premisas) y evidencia adicional = ausente → reducción parcial.<br>
                <strong>Implementación LLM:</strong> Buscar "todos", "siempre", "inevitablemente", etc. y comparar con evidencia.<br>
                <strong>Salida:</strong> { "criterio":"2.1", "constructo":"Escalamiento Inferencial", "puntaje":72, "átomos_activados":["magnitud","universalización"], "justificación":"...", "evidencias":["..."] }
              </div>
            </div>
          </div>

          <div class="view-section">
            <div class="view-section-title">Glosario completo de Átomos</div>
            <div style="max-height:300px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
              ${todosAtomos.map(a => `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.05); padding:4px 0;">
                  <span style="color:var(--accent); font-weight:500;">${a.id}</span>
                  <span style="font-size:.7rem; color:rgba(229,231,235,.5);">${a.definicion}</span>
                  <span style="font-size:.6rem; color:rgba(229,231,235,.3);">${a.criterio}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  },
  fase1: { title: 'Fase 1: Estructura Lógica', render: () => renderFase('fase1') },
  fase2: { title: 'Fase 2: Inferencia', render: () => renderFase('fase2') },
  fase3: { title: 'Fase 3: Calibración Epistémica', render: () => renderFase('fase3') },
  fase4: { title: 'Fase 4: Transparencia Retórica', render: () => renderFase('fase4') },
  fase5: { title: 'Fase 5: Pertinencia Deliberativa', render: () => renderFase('fase5') },
  academia: {
    title: 'Integración con Academia',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Flujo Institucional</div>
        <h1 class="view-title">Integración con Academia y Ágora</h1>
        <div class="view-body">
          <p>SOPHIA actúa como el <strong>protocolo de calidad deliberativa</strong> previo al ingreso de documentos a la <strong>Academia</strong>. No certifica la verdad, pero estima si un argumento fue construido con suficiente responsabilidad.</p>
          <p>Los documentos que superan el umbral mínimo de adherencia (IRD ≥ 75%) pueden ser sometidos a discusión en el <strong>Ágora</strong>, donde la ciudadanía delibera y vota su inclusión en el repositorio académico.</p>
        </div>
        <div class="view-section">
          <div class="view-section-title">Estándar Mínimo de Adherencia</div>
          <div class="score-list">
            <div class="score-row">
              <span class="score-label">IRD Global Mínimo</span>
              <div class="score-bar-wrap">
                <div class="score-bar score-bar--mid" style="width:0%" data-target="75%"></div>
              </div>
              <span class="score-value score-value--mid">75%</span>
            </div>
          </div>
        </div>
      </div>`
  },
  relaciones: {
    title: 'Ecosistema Deliberativo',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Red de Inteligencia Colectiva</div>
        <h1 class="view-title">Ecosistema Deliberativo</h1>
        <div class="view-body">
          <p>SOPHIA no busca producir consenso; busca mejorar las condiciones estructurales bajo las cuales el desacuerdo puede ser intelectualmente fértil.</p>
        </div>
        <div class="view-section">
          <div class="view-section-title">Nodos de Interacción</div>
          <div class="relation-grid">
            <div class="relation-card relation-card--academia">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Academia & Ágora</span>
              </div>
              <div class="relation-desc">SOPHIA asegura que los documentos que ingresan a la Academia posean trazabilidad argumentativa mínima para ser debatidos responsablemente.</div>
            </div>
            <div class="relation-card relation-card--rey">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Rey Filósofo</span>
              </div>
              <div class="relation-desc">Cuando un texto presenta baja adherencia, Rey Filósofo actúa como tutor, orientando sobre cómo mejorar la comunicación.</div>
            </div>
            <div class="relation-card relation-card--logos">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Logos</span>
              </div>
              <div class="relation-desc">Logos audita la matriz estructural del código; SOPHIA audita la honestidad de la arquitectura retórica.</div>
            </div>
            <div class="relation-card relation-card--aletheia">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Aletheia</span>
              </div>
              <div class="relation-desc">SOPHIA fiscaliza el rigor formal; Aletheia mapea la veracidad empírica de las fuentes.</div>
            </div>
          </div>
        </div>
      </div>`
  },
  informe: {
    title: 'Auditoría de Adherencia',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Motor de Evaluación</div>
        <h1 class="view-title">Auditoría de Adherencia</h1>
        <div class="view-body">
          <p>Ingresa un texto para estimar su <strong>Índice de Robustez Deliberativa (IRD)</strong>. SOPHIA calculará el puntaje basándose en las 5 fases, 20 criterios y 48 átomos del protocolo.</p>
          <p>El resultado es un <strong>acta de infracción</strong> con el desglose por fase, las infracciones detectadas y las evidencias textuales.</p>
        </div>
        <div class="eval-tool">
          <textarea class="sophia-input" id="evalInput" placeholder="Pega aquí el documento a auditar. SOPHIA evaluará su adherencia al protocolo de comunicación deliberativa..."></textarea>
          <div class="eval-actions">
            <button class="btn-primary" id="evalBtn">Auditar Documento →</button>
            <span class="eval-note">El algoritmo es determinista y basado en reglas públicas.</span>
          </div>
        </div>
        <div id="evalResult"></div>
      </div>`
  }
};
console.log(`✅ Vistas cargadas: ${Object.keys(VIEWS).join(', ')}`);

// ─── SPA ROUTER ────────────────────────────────────────
const SOPHIA = {
  current: 'analisis',

  navigate(id) {
    console.log(`🔀 Navegando a: ${id}`);
    const view = VIEWS[id];
    if (!view) {
      console.error(`❌ Vista ${id} no encontrada`);
      return;
    }
    this.current = id;

    const titleEl = document.getElementById('viewTitle');
    const contentEl = document.getElementById('viewContent');

    if (!titleEl || !contentEl) {
      console.error('❌ Elementos #viewTitle o #viewContent no encontrados en el DOM');
      return;
    }

    titleEl.textContent = view.title;
    contentEl.innerHTML = view.render();
    console.log(`✅ Renderizada vista: ${id}`);

    this._animateBars(contentEl);

    if (id === 'analisis') {
      console.log('📎 Vinculando carga de archivos y evaluación...');
      this._bindFileUpload();
      this._bindEval('analisis');
    } else if (id === 'informe') {
      this._bindEval('informe');
    }

    if (id.startsWith('fase')) {
      this._bindPopups(contentEl);
    }

    document.querySelectorAll('.snav-item[data-view]').forEach(el => {
      el.classList.toggle('active', el.dataset.view === id);
    });

    contentEl.scrollTop = 0;
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

  _bindPopups(root) {
    console.log('🔗 Vinculando popups...');
    root.querySelectorAll('[data-constructo]').forEach(el => {
      el.style.cursor = 'pointer';
      el.style.color = 'var(--accent)';
      el.addEventListener('click', () => {
        const constructo = el.dataset.constructo;
        let def = 'Definición no disponible.';
        for (const fase of PROTOCOL.fases) {
          for (const crit of fase.criterios) {
            if (crit.constructo === constructo) {
              def = crit.definicion;
              break;
            }
          }
        }
        showDefinitionPopup(`Constructo: ${constructo}`, def);
      });
    });
    root.querySelectorAll('[data-atomo]').forEach(el => {
      el.style.cursor = 'pointer';
      el.style.color = '#d97706';
      el.addEventListener('click', () => {
        const atomo = el.dataset.atomo;
        let def = 'Definición no disponible.';
        for (const fase of PROTOCOL.fases) {
          for (const crit of fase.criterios) {
            for (const a of crit.atomos) {
              if (a.id === atomo) {
                def = a.definicion;
                break;
              }
            }
          }
        }
        showDefinitionPopup(`Átomo: ${atomo}`, def);
      });
    });
  },

  _bindFileUpload() {
    console.log('📎 Configurando carga de archivos...');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const preview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const evalInput = document.getElementById('evalInput');

    if (!uploadArea || !fileInput || !uploadBtn) return;

    const handleFile = (file) => {
      if (!file) return;
      console.log(`📂 Archivo seleccionado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['txt', 'pdf'].includes(ext)) {
        alert('Formato no soportado. Usa .txt o .pdf.');
        return;
      }
      fileName.textContent = file.name;
      fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
      preview.style.display = 'block';

      if (ext === 'txt') {
        const reader = new FileReader();
        reader.onload = (e) => {
          evalInput.value = e.target.result;
          console.log(`✅ Archivo TXT cargado: ${file.name}`);
        };
        reader.readAsText(file);
      } else if (ext === 'pdf') {
        console.log('📄 Cargando PDF.js...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        script.onload = () => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map(item => item.str);
              fullText += strings.join(' ') + '\n';
            }
            evalInput.value = fullText;
            console.log(`✅ PDF cargado: ${file.name}, ${pdf.numPages} páginas`);
          };
          reader.readAsArrayBuffer(file);
        };
        document.head.appendChild(script);
      }
    };

    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--accent)';
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.borderColor = 'rgba(59,130,246,.3)';
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'rgba(59,130,246,.3)';
      if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });
  },

  _bindEval(source) {
    console.log('🔘 Vinculando botón de evaluación...');
    const btn = document.getElementById('evalBtn');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async () => {
      const input = document.getElementById('evalInput');
      if (!input) return;
      const text = input.value.trim();
      const out = document.getElementById('evalResult');

      if (!text) {
        out.innerHTML = `<p style="color:rgba(239,68,68,.7);font-size:.78rem;margin-top:12px;">Ingresa o carga un texto para estimar su calidad deliberativa.</p>`;
        return;
      }

      console.log(`📤 Enviando texto a evaluar (${text.length} caracteres)`);
      out.innerHTML = `<p style="color:rgba(229,231,235,.35);font-size:.72rem;margin-top:12px;">Analizando con SOPHIA (motor local + IA)...</p>`;

      try {
        const userId = localStorage.getItem('userId') || null;
        console.log(`👤 userId: ${userId || 'anonimo'}`);

        const response = await fetch('/api/sophia/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, userId })
        });

        console.log(`📥 Respuesta del servidor: ${response.status}`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const resultado = await response.json();
        console.log(`✅ Evaluación completada. IRD: ${resultado.ird}%`);

        const localData = resultado.local;
        const enriched = {
          ...localData,
          IRD_global: resultado.ird,
          riesgo: resultado.risk,
          llm_review: resultado.llm_review
        };
        this._renderEvaluation(enriched, out);
      } catch (error) {
        console.error('❌ Error en evaluación:', error);
        out.innerHTML = `<p style="color:rgba(239,68,68,.7);font-size:.78rem;margin-top:12px;">Error al conectar con el servidor: ${error.message}</p>`;
      }
    });
  },

  _renderEvaluation(resultado, out) {
    console.log('📊 Renderizando acta de infracción...');
    const fasesHTML = resultado.fases.map(f => `
      <div style="margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,.04); border-left: 2px solid ${f.puntaje >= 80 ? 'var(--q-high)' : 'var(--q-mid)'};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 500; color: #e5e7eb;">${f.nombre}</span>
          <span style="font-size: 0.9rem; color: ${f.puntaje >= 80 ? 'var(--q-high)' : 'var(--q-mid)'};">${f.puntaje}%</span>
        </div>
        ${f.infracciones && f.infracciones.length > 0 ? `
          <div style="font-size: 0.7rem; color: rgba(229,231,235,.5); margin-top: 6px;">
            Infracciones: ${f.infracciones.map(inf => {
              let texto = `${inf.criterio} (${inf.penalizacion} pts)`;
              if (inf.meta_regla_aplicada) texto += ` • ${inf.meta_regla_aplicada}`;
              return texto;
            }).join('; ')}
          </div>
        ` : `<div style="font-size: 0.7rem; color: rgba(229,231,235,.25); margin-top: 6px;">Sin infracciones detectadas</div>`}
      </div>
    `).join('');

    const evidenciasHTML = (resultado.evidencias || []).slice(0, 5).map(e => `
      <div style="font-size: 0.7rem; color: rgba(229,231,235,.5); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.04);">
        <span style="color: var(--accent);">${e.atomo}</span> — “${e.fragmento}”
      </div>
    `).join('');

    const llmReviewHTML = resultado.llm_review && !resultado.llm_review.error ? `
      <div style="margin-top: 20px; padding: 14px; background: rgba(139,92,246,.08); border-left: 2px solid #8b5cf6;">
        <div style="font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8b5cf6; margin-bottom: 10px;">Revisión Semántica (IA)</div>
        <div style="font-size: 0.75rem; color: rgba(229,231,235,.6);">
          ${resultado.llm_review.evidence_quality ? `<div>Calidad de evidencia: <strong>${resultado.llm_review.evidence_quality}</strong></div>` : ''}
          ${resultado.llm_review.tone_proportionality ? `<div>Proporcionalidad tonal: <strong>${resultado.llm_review.tone_proportionality}</strong></div>` : ''}
          ${resultado.llm_review.overall_comment ? `<div style="margin-top:6px;">${resultado.llm_review.overall_comment}</div>` : ''}
        </div>
      </div>
    ` : '';

    out.innerHTML = `
      <div class="report-card" style="margin-top:20px;">
        <div class="report-card-header">
          <span class="report-card-title">Acta de Infracción</span>
          <span class="report-stamp">PROTOCOLO SOPHIA v0.92-beta</span>
        </div>
        <div class="report-card-body">
          <div class="report-meta">
            <div class="report-meta-item">
              <div class="meta-value">${resultado.IRD_global}%</div>
              <div class="meta-label">IRD Global</div>
            </div>
            <div class="report-meta-item">
              <div class="meta-value">${resultado.IRD_global >= 75 ? '✓' : '✗'}</div>
              <div class="meta-label">${resultado.IRD_global >= 75 ? 'Calidad Aceptada' : 'Calidad Insuficiente'}</div>
            </div>
            <div class="report-meta-item">
              <div class="meta-value">${resultado.riesgo}</div>
              <div class="meta-label">Riesgo Deliberativo</div>
            </div>
          </div>
          <div style="margin: 16px 0;">${fasesHTML}</div>
          ${evidenciasHTML ? `
            <div style="margin-top: 20px; padding: 14px; background: rgba(59,130,246,.05); border-left: 2px solid var(--accent);">
              <div style="font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px;">Evidencias Textuales (muestra)</div>
              ${evidenciasHTML}
            </div>
          : ''}
          ${llmReviewHTML}
          <div style="font-size: 0.6rem; color: rgba(229,231,235,.2); margin-top: 12px;">
            * Evaluación híbrida: motor local + IA complementaria.
          </div>
        </div>
      </div>
    `;
    console.log('✅ Acta de infracción renderizada');
    this._animateBars(out);
  },

  init() {
    console.log('🚀 Inicializando SOPHIA...');
    document.querySelectorAll('.snav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.view));
    });
    this.navigate('analisis');
    console.log('✅ SOPHIA inicializada correctamente');
  }
};

console.log('✅ Objeto SOPHIA definido');

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM completamente cargado');
  SOPHIA.init();
});
