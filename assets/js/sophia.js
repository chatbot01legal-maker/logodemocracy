/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Protocolo Abierto de Comunicación Deliberativa
   v3.0 — Ontología Pública de la Deliberación (Corregido)
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
    console.error(msg);
  }
}

// ─── PROTOCOLO SOPHIA v3.0 ────────────────────────────
const PROTOCOL = {
  version: "4.0",
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

// ─── MECÁNICA DE CÁLCULO (completa) ──────────────────
// ─── ADAPTADOR DE MOTOR: v4.0 (contextual) con fallback a v3.0 ──
// Prioriza SophiaEngineV4 (clasificación documental + perfiles
// contextuales + rutas inferenciales). Si el script no cargó por
// algún motivo, usa el motor v3.0 legacy para no dejar al usuario
// sin evaluación — el mismo patrón de resiliencia que ya usamos
// para la revisión semántica de Gemini.
function evaluateWithBestAvailableEngine(text) {
  if (typeof window !== 'undefined' && window.SophiaEngineV4 && typeof window.SophiaEngineV4.evaluate === 'function') {
    try {
      const resultV4 = window.SophiaEngineV4.evaluate(text);
      if (resultV4) return resultV4;
    } catch (e) {
      console.warn('⚠️ SophiaEngineV4 falló, usando motor v3.0 legacy:', e.message);
    }
  } else {
    console.warn('⚠️ SophiaEngineV4 no está cargado (falta <script src=".../sophiaEngineV4.js">). Usando motor v3.0 legacy.');
  }
  return evaluateText(text);
}

function evaluateText(text) {
  try {
    if (!text || text.trim().length === 0) return null;

    const oraciones = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const resultados = {
      fases: [],
      evidencias: [],
      puntajes_fase: {},
      IRD_global: 0,
      riesgo: "Normal"
    };

    let nivel3_count = 0;

    PROTOCOL.fases.forEach(fase => {
      let penalizacion_fase = 0;
      let infracciones_fase = [];

      fase.criterios.forEach(criterio => {
        let penalizacion_criterio = 0;
        let atomos_activados = [];

        criterio.atomos.forEach(atom => {
          if (atom.patrones && atom.patrones.length > 0) {
            const patrones_unicos = [...new Set(atom.patrones)];
            let frecuencia = 0;
            oraciones.forEach(ora => {
              const lower = ora.toLowerCase();
              if (patrones_unicos.some(p => lower.includes(p))) {
                frecuencia++;
              }
            });
            if (frecuencia > 0) {
              const penalizacion_atomo = criterio.severidad * frecuencia;
              penalizacion_criterio += penalizacion_atomo;
              atomos_activados.push({ atomo: atom.id, frecuencia, severidad: criterio.severidad });
              const evidencia = text.match(new RegExp(`[^.!?]*\\b${patrones_unicos[0]}\\b[^.!?]*[.!?]`, 'i'));
              if (evidencia) {
                resultados.evidencias.push({
                  atomo: atom.id,
                  fragmento: evidencia[0].trim(),
                  criterio: criterio.id
                });
              }
            }
          }
        });

        penalizacion_criterio = Math.min(penalizacion_criterio, 25);
        if (penalizacion_criterio > 0) {
          infracciones_fase.push({
            criterio: `${criterio.id} - ${criterio.nombre}`,
            constructo: criterio.constructo,
            penalizacion: penalizacion_criterio,
            atomos_activados
          });
          penalizacion_fase += penalizacion_criterio;
          if (penalizacion_criterio === 25) nivel3_count++;
        }
      });

      // Meta-regla MR-001: mitigación por incertidumbre
      if (fase.id === "fase4" && resultados.puntajes_fase["fase3"] && resultados.puntajes_fase["fase3"] > 80) {
        const infra42 = infracciones_fase.find(inf => inf.criterio.startsWith("4.2"));
        if (infra42) {
          infra42.penalizacion = infra42.penalizacion * 0.5;
          infra42.meta_regla_aplicada = "MR-001 (Mitigación por Incertidumbre)";
          penalizacion_fase = infracciones_fase.reduce((acc, inf) => acc + inf.penalizacion, 0);
        }
      }

      let puntaje_fase = Math.max(0, 100 - penalizacion_fase);
      if (infracciones_fase.length === 0) puntaje_fase = 100;
      resultados.puntajes_fase[fase.id] = Math.round(puntaje_fase);
      resultados.fases.push({
        id: fase.id,
        nombre: fase.nombre,
        puntaje: Math.round(puntaje_fase),
        infracciones: infracciones_fase
      });
    });

    const puntajes = Object.values(resultados.puntajes_fase);
    const ird = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
    resultados.IRD_global = Math.round(ird);

    if (nivel3_count >= 4) resultados.riesgo = "Riesgo Extremo";
    else if (nivel3_count >= 3) resultados.riesgo = "Alta Fragilidad";
    else if (nivel3_count >= 2) resultados.riesgo = "Atención";
    else resultados.riesgo = "Normal";

    return resultados;
  } catch (e) {
    showDebug(`❌ Error en evaluateText: ${e.message}\n\n${e.stack}`, true);
    return null;
  }
}

// ─── NORMALIZACIÓN DE RESPUESTAS SOPHIA ───────────────
// El backend híbrido (/api/sophia/evaluate) responde con la forma:
//   { local: {fases, evidencias, IRD_global, riesgo}, llm_review, ird, risk, ... }
// El motor local de respaldo (evaluateText) responde con la forma plana:
//   { fases, evidencias, IRD_global, riesgo }
// Esta función unifica ambas en un solo objeto para el render.
function normalizeSophiaResult(raw) {
  if (!raw) return null;

  // ─── Forma híbrida / caché MongoDB ──────────────────
  // El backend puede entregar:
  //
  // {
  //   local: {
  //     fases,
  //     evidencias,
  //     IRD_global,
  //     riesgo,
  //     naturaleza_documental,
  //     naturalezas_secundarias,
  //     hibrido,
  //     confianza_clasificacion,
  //     rutas_evaluadas
  //   },
  //   semantic_review,
  //   confiabilidad_factual,
  //   gemini_review,
  //   metadata
  // }
  //
  // También puede existir la forma antigua con ird/risk.

  if (raw.local && typeof raw.local === 'object') {
    const local = raw.local;

    const llmOk =
      raw.llm_review && !raw.llm_review.error
        ? raw.llm_review
        : null;

    const llmErr =
      raw.llm_review && raw.llm_review.error
        ? raw.llm_review.error
        : null;

    return {
      fases: local.fases || [],
      evidencias: local.evidencias || [],

      IRD_global:
        raw.ird !== undefined
          ? raw.ird
          : local.IRD_global,

      riesgo:
        raw.risk !== undefined
          ? raw.risk
          : local.riesgo,

      naturaleza_documental:
        local.naturaleza_documental,

      naturalezas_secundarias:
        local.naturalezas_secundarias || [],

      hibrido:
        local.hibrido ?? false,

      confianza_clasificacion:
        local.confianza_clasificacion,

      rutas_evaluadas:
        local.rutas_evaluadas || null,

      llm: llmOk,
      llmError: llmErr,

      semantic_review:
        raw.semantic_review || [],

      confiabilidad_factual:
        raw.confiabilidad_factual || null,

      gemini_review:
        raw.gemini_review || null,

      metadata:
        raw.metadata || null
    };
  }

  // ─── Forma plana ─────────────────────────────────────
  return {
    fases: raw.fases || [],
    evidencias: raw.evidencias || [],

    IRD_global: raw.IRD_global,
    riesgo: raw.riesgo,

    naturaleza_documental:
      raw.naturaleza_documental,

    naturalezas_secundarias:
      raw.naturalezas_secundarias || [],

    hibrido:
      raw.hibrido ?? false,

    confianza_clasificacion:
      raw.confianza_clasificacion,

    rutas_evaluadas:
      raw.rutas_evaluadas || null,

    llm: null,
    llmError: null,

    semantic_review:
      raw.semantic_review || [],

    confiabilidad_factual:
      raw.confiabilidad_factual || null,

    gemini_review:
      raw.gemini_review || null,

    metadata:
      raw.metadata || null
  };
}

// ─── VERSIÓN DEL PROTOCOLO (dinámica) ──────────────────
// Se actualiza con metadata.module_versions.protocol tras cada evaluación
// contra el backend. Si aún no hubo ninguna evaluación, cae al PROTOCOL.version
// local (legacy) definido arriba. Nunca queda un número escrito a mano.
let SOPHIA_BACKEND_VERSION = null;
function getSophiaVersion() {
  return SOPHIA_BACKEND_VERSION || (PROTOCOL && PROTOCOL.version) || '4.0';
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
// ─── FRASES "¿SABÍAS QUE...?" PARA LA ESPERA DEL ANÁLISIS ─────
// Se muestran rotando mientras corre la evaluación (1-2 minutos), para que
// la espera se sienta informativa en vez de vacía. Todas describen el
// instrumento real — nada inventado ni genérico.
const SOPHIA_LOADING_FACTS = [
  "¿Sabías que? SOPHIA evalúa tu texto en 5 fases: Estructura Lógica, Inferencia, Calibración Epistémica, Transparencia Retórica y Pertinencia Deliberativa.",
  "¿Sabías que? El Índice de Robustez Deliberativa (IRD) parte de 100 puntos y se descuenta por cada infracción real detectada — nunca se suma por opinión.",
  "¿Sabías que? La Capa 1 de SOPHIA (el motor determinista) no usa IA — son reglas públicas y auditables, siempre las mismas para todos.",
  "¿Sabías que? Después del motor determinista, una IA revisa ese mismo resultado buscando falsos positivos: negaciones, ironía, citas o hipótesis mal interpretadas.",
  "¿Sabías que? SOPHIA distingue entre 'cómo' argumentás (robustez deliberativa) y 'qué' afirmás (confiabilidad factual) — son dos evaluaciones independientes.",
  "¿Sabías que? Para verificar hechos, SOPHIA hace búsquedas reales en internet y solo marca un dato como verificado si encuentra una fuente real que lo respalde.",
  "¿Sabías que? Si SOPHIA no encuentra evidencia suficiente sobre una afirmación, lo dice explícitamente — nunca inventa una fuente para parecer más segura.",
  "¿Sabías que? La fase de Estructura Lógica revisa si tu argumento se contradice a sí mismo o cae en falsas dicotomías (elegir solo entre dos opciones cuando hay más).",
  "¿Sabías que? La fase de Inferencia detecta si confundís correlación con causalidad, o si generalizás a partir de un solo ejemplo.",
  "¿Sabías que? La fase de Calibración Epistémica evalúa si tu nivel de certeza ('creo que' vs. 'es un hecho que') es proporcional a la evidencia que presentás.",
  "¿Sabías que? La fase de Transparencia Retórica busca lenguaje cargado emocionalmente que reemplace argumentos en vez de acompañarlos.",
  "¿Sabías que? La fase de Pertinencia Deliberativa mide si tu texto representa de forma justa a quienes piensan distinto (el llamado 'steelmaning').",
  "¿Sabías que? Todo el proceso de SOPHIA queda registrado por capas — podés ver exactamente qué detectó cada una, no solo el puntaje final.",
  "¿Sabías que? Un IRD alto no garantiza que los datos citados sean ciertos — por eso SOPHIA siempre muestra ambas cosas por separado.",
  "¿Sabías que? La interpretación final que arma SOPHIA usa como contexto obligatorio los resultados de las tres capas anteriores, nunca analiza el texto desde cero.",
  "¿Sabías que? SOPHIA es parte de LogoDemocracy, un ecosistema que busca mejorar la calidad de la deliberación pública con herramientas abiertas.",
  "¿Sabías que? Las 'meta-reglas' de SOPHIA pueden mitigar una penalización si otra fase ya demostró suficiente rigor — el sistema no evalúa cada criterio de forma aislada.",
  "¿Sabías que? Cada infracción que detecta SOPHIA cita el fragmento exacto de tu texto que la originó — nada queda sin evidencia mostrable.",
  "¿Sabías que? SOPHIA fue diseñada para señalar problemas de razonamiento, no para decirte si tu opinión es correcta o incorrecta.",
  "¿Sabías que? Un texto puede tener errores factuales y aun así una estructura argumentativa impecable — SOPHIA te muestra esa tensión en vez de esconderla.",
  "¿Sabías que? El protocolo de SOPHIA es público: cualquiera puede revisar exactamente qué reglas se aplican y por qué.",
  "¿Sabías que? SOPHIA busca ayudarte a pulir una idea antes de publicarla o defenderla, no solo calificarla después de escrita.",
  "¿Sabías que? La ambigüedad léxica (usar palabras que admiten muchas interpretaciones, como 'bueno' o 'justo' sin definirlas) es una de las infracciones más comunes que detecta SOPHIA.",
  "¿Sabías que? SOPHIA revisa si tu conclusión es proporcional al tamaño real de tus premisas, o si estás sacando una conclusión más grande de lo que tu evidencia sostiene.",
  "¿Sabías que? El sistema de verificación de SOPHIA nunca decide si algo es verdadero basándose en su propio conocimiento — siempre busca una fuente externa primero.",
  "¿Sabías que? SOPHIA todavía está en etapa beta — cada evaluación que hacés ayuda a mejorar el instrumento.",
  "¿Sabías que? Podés ver el detalle completo de cada fase, no solo el puntaje total, para entender exactamente dónde mejorar tu argumento.",
  "¿Sabías que? La revisión de falsos positivos existe porque ninguna regla automática es perfecta — por eso una IA vuelve a mirar cada activación antes del resultado final.",
  "¿Sabías que? SOPHIA separa claramente sus observaciones: unas evalúan tu razonamiento, otras evalúan tus datos, y nunca se mezclan en un solo puntaje.",
  "¿Sabías que? El objetivo de SOPHIA no es que tu texto 'apruebe', sino que vos entiendas mejor cómo se construye un argumento sólido."
];

analisis: {
  title: 'Analiza tus ideas con Sophia',
  render: () => {
    try {
      return `
        <div class="view">

          <div class="view-eyebrow">Instrumento de Pensamiento Crítico · v${getSophiaVersion()}</div>

          <h1 class="view-title">Mira cómo estás pensando</h1>

          <div class="view-body">
            <p>
              <strong>SOPHIA te ayuda a examinar tus propias ideas con mayor claridad.</strong>
              Puedes traer un argumento, una opinión, un texto que estés escribiendo o una
              idea que quieras defender, y recorrer con ella cómo estás razonando.
            </p>

            <p>
              SOPHIA busca hacer visible lo que normalmente permanece oculto:
              <strong>qué estás suponiendo, qué evidencia tienes, qué estás infiriendo
              y dónde podría haber un salto o una debilidad en tu razonamiento.</strong>
            </p>

            <p>
              El resultado no es un veredicto sobre si tienes razón o estás equivocado.
              Es un <strong>mapa de tu razonamiento</strong> que puedes revisar, cuestionar
              y utilizar para mejorar tus propias ideas.
            </p>

            <p style="font-size:.75rem; color:rgba(229,231,235,.45);">
              SOPHIA tampoco es infalible. Parte de pensar críticamente consiste en
              poder examinar y cuestionar las propias evaluaciones del instrumento.
            </p>
          </div>

          <div class="eval-tool">

            <div class="upload-area"
                 id="uploadArea"
                 style="border:2px dashed rgba(59,130,246,.3); padding:20px; text-align:center; cursor:pointer; border-radius:4px; transition:border-color .2s;">

              <p style="color:rgba(229,231,235,.4);">
                Sube un documento para examinarlo con SOPHIA
              </p>

              <input
                type="file"
                id="fileInput"
                accept=".txt,.pdf,.docx,.md,.rtf"
                style="display:none;">

              <button class="btn-primary" id="uploadBtn">
                Seleccionar archivo
              </button>

            </div>

            <div id="filePreview" style="margin-top:12px; display:none;">

              <div style="display:flex; justify-content:space-between; align-items:center;">

                <span id="fileName" style="color:var(--accent);"></span>

                <span id="fileSize"
                      style="color:rgba(229,231,235,.4);font-size:.7rem;">
                </span>

              </div>

            </div>

            <p style="text-align:center; color:rgba(229,231,235,.3); font-size:.75rem; margin:14px 0;">
              — o escribe tu idea directamente —
            </p>

            <textarea
              class="sophia-input"
              id="evalInput"
              placeholder="Escribe aquí la idea, argumento o texto que quieres examinar..."
              style="height:150px;">
            </textarea>

            <div class="eval-actions">

              <button class="btn-primary" id="evalBtn">
                Piensa con Sophia →
              </button>

              <span class="eval-note">
                SOPHIA no decide por ti. Te ayuda a examinar cómo estás pensando.
              </span>

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
    title: 'Sophia — Instrumento de Pensamiento Crítico',
    render: () => {
      try {
        return `
          <div class="view">
            <div class="view-eyebrow">Instrumento de Pensamiento Crítico · v${getSophiaVersion()}</div>
            <h1 class="view-title">¿Qué es SOPHIA?</h1>
            <div class="view-body">
              <p>SOPHIA es una herramienta de inteligencia artificial diseñada para ayudarte a <strong>examinar tu propio razonamiento</strong>. No pretende decirte qué pensar ni decidir si tienes razón. Su propósito es hacer visible aquello que normalmente permanece oculto cuando razonamos: nuestras premisas, evidencias, inferencias, supuestos, niveles de confianza y posibles errores.</p>
              <p>SOPHIA reconstruye tu razonamiento y te permite recorrerlo paso a paso. Puedes ver qué detectó, qué evidencia utilizó, qué fue comprobado, qué permanece incierto y dónde podría incluso haberse equivocado el propio instrumento. Porque pensar críticamente no consiste solamente en encontrar errores en las ideas de los demás. También consiste en aprender a examinar las propias.</p>
              <p>Su salida no es un veredicto, sino un <strong>mapa de razonamiento</strong> que muestra caminos sólidos, caminos inciertos, saltos, supuestos y zonas que requieren revisión. <strong>SOPHIA no piensa por ti. Te ayuda a mirar cómo estás pensando.</strong></p>
              <p><strong>Un instrumento abierto y auditable:</strong> SOPHIA no es una caja negra. Sus criterios, mecanismos de evaluación y límites están documentados y pueden ser examinados, discutidos y modificados. No tienes que creerle a SOPHIA; puedes examinar cómo llegó a lo que te está mostrando y cuestionar sus propias evaluaciones.</p>
            </div>
            <div class="view-section">
              <div class="view-section-title">Las 5 Fases del Protocolo (Capa 1 · Motor Determinista)</div>
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
              <div class="view-section-title">Las 4 Capas del Pipeline SOPHIA</div>
              <p style="font-size:.82rem; color:rgba(229,231,235,.65); margin-bottom:14px; line-height:1.5;">
                El motor determinista de arriba es solo la primera de cuatro capas independientes.
                Cada una responde una pregunta distinta, y ninguna modifica el resultado de las demás
                — el Índice de Robustez Deliberativa (IRD) siempre proviene únicamente de la Capa 1.
              </p>
              <div class="card-grid">
                <div class="s-card">
                  <div class="s-card-title">Capa 1 · Motor Determinista</div>
                  <div class="s-card-body">Aplica las 5 fases y sus criterios mediante reglas públicas, sin IA. Produce el IRD, el nivel de riesgo y las áreas de revisión detectadas. Es el único resultado que nunca se modifica.</div>
                </div>
                <div class="s-card">
                  <div class="s-card-title">Capa 2 · Auditoría Factual</div>
                  <div class="s-card-body">Extrae afirmaciones verificables del texto y clasifica cada una: verificada, refutada, en conflicto o con evidencia insuficiente. No altera el IRD — evalúa la confiabilidad de los hechos citados, no la calidad del razonamiento.</div>
                </div>
                <div class="s-card">
                  <div class="s-card-title">Capa 3 · Revisión de Falsos Positivos</div>
                  <div class="s-card-body">Una IA revisa exclusivamente el resultado de la Capa 1 — no el documento desde cero — para detectar activaciones cuestionables: negaciones, ironía, citas, hipótesis o usos metalingüísticos que el motor determinista pudo malinterpretar. Solo produce observaciones; nunca cambia los puntajes.</div>
                </div>
                <div class="s-card">
                  <div class="s-card-title">Capa 4 · Interpretación Semántica Integral</div>
                  <div class="s-card-body">Con el resultado de las tres capas anteriores como contexto obligatorio, una IA construye una interpretación global: qué significa el puntaje, cómo interactúan forma y contenido, y qué preguntas reflexivas propone. Es la única capa narrativa — el resto del pipeline es estructural.</div>
                </div>
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
                <div class="flow-step"><div class="flow-dot">8</div><div class="flow-body"><div class="flow-title">Salida obligatoria</div><div class="flow-desc">Mapa de razonamiento con puntaje, átomos activados y evidencias.</div></div></div>
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
              <p>Ingresa un texto para estimar su <strong>Índice de Robustez Deliberativa (IRD)</strong>. SOPHIA calculará el puntaje basándose en las 5 fases, 20 criterios y 48 átomos del protocolo.</p>
              <p>El resultado es un <strong>mapa de razonamiento</strong> con el desglose por fase, los puntos de revisión detectados y las evidencias textuales.</p>
            </div>
            <div class="eval-tool">
              <textarea class="sophia-input" id="evalInput" placeholder="Pega aquí el documento a auditar. SOPHIA evaluará su adherencia al protocolo de comunicación deliberativa..."></textarea>
              <div class="eval-actions">
                <button class="btn-primary" id="evalBtn">Auditar Documento →</button>
                <span class="eval-note">El algoritmo es determinista y basado en reglas públicas.</span>
              </div>
            </div>
            <div id="evalResult"></div>
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
  current: 'inicio',
  _lastEvaluationData: null, // Nuevo estado para el Motor Cognitivo

  getLastEvaluation() {      // Expone los datos para el Rey Filósofo
    return this._lastEvaluationData;
  },

  // Punto de entrada único para abrir el Rey Filósofo desde SOPHIA.
  // Usa CognitiveSessionFactory (única fuente de verdad de sesiones) con
  // el resultado real de la última evaluación — nunca un texto fijo.
  openReyFilosofo() {
    const evaluation = this.getLastEvaluation();

    if (!evaluation) {
      alert('Primero evaluá un documento en Análisis Sophia para que el Rey Filósofo tenga algo sobre qué conversar.');
      return;
    }
    if (typeof CognitiveSessionFactory === 'undefined') {
      console.error('CognitiveSessionFactory no está disponible.');
      return;
    }
    if (typeof ReyFilosofoChat === 'undefined' || typeof ReyFilosofoChat.open !== 'function') {
      console.error('ReyFilosofoChat no está disponible.');
      return;
    }

    const session = CognitiveSessionFactory.fromSophia(evaluation);
    ReyFilosofoChat.open(session);
  },

  navigate(viewId) {
    try {
      const contentArea = document.getElementById('viewContent');
      if (!contentArea) {
        showDebug(`❌ Error: No se encontró #viewContent`, true);
        return;
      }

      const view = VIEWS[viewId];
      if (!view) {
        contentArea.innerHTML = `<h1>404</h1><p>Vista no encontrada: ${viewId}</p>`;
        return;
      }

      // Actualizar título
      const titleEl = document.getElementById('viewTitle');
      if (titleEl) titleEl.textContent = view.title;

      contentArea.innerHTML = view.render();
      console.log(`✅ Vista cambiada a: ${viewId}`);

      // Inicializar eventos específicos de la vista
      if (viewId === 'analisis') {
        this._bindFileUpload();
        this._bindEval('analisis');
      } else if (viewId === 'informe') {
        this._bindEval('informe');
      }

      // Activar botón correspondiente en el sidebar
      document.querySelectorAll('.snav-item[data-view]').forEach(el => {
        el.classList.toggle('active', el.dataset.view === viewId);
      });

      // Animación de barras (si existe)
      this._animateBars(contentArea);

      // Popups si es una fase
      if (viewId.startsWith('fase')) {
        this._bindPopups(contentArea);
      }
    } catch (e) {
      showDebug(`❌ Error en navigate: ${e.message}\n\n${e.stack}`, true);
    }
  },

  bindUploadEvents() {
    const btn = document.getElementById('uploadBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        document.getElementById('fileInput').click();
      });
    }
  },

  // ─── FUNCIONES AUXILIARES ────────────────────────────
  _animateBars(root) {
    try {
      requestAnimationFrame(() => {
        root.querySelectorAll('.score-bar[data-target]').forEach(bar => {
          requestAnimationFrame(() => {
            bar.style.width = bar.dataset.target;
          });
        });
      });
    } catch (e) {
      console.warn('Error en _animateBars:', e);
    }
  },

  _bindPopups(root) {
    try {
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
    } catch (e) {
      showDebug(`❌ Error en _bindPopups: ${e.message}`, true);
    }
  },

  _bindFileUpload() {
    try {
      const uploadArea = document.getElementById('uploadArea');
      const fileInput = document.getElementById('fileInput');
      const uploadBtn = document.getElementById('uploadBtn');
      const preview = document.getElementById('filePreview');
      const fileName = document.getElementById('fileName');
      const fileSize = document.getElementById('fileSize');
      const evalInput = document.getElementById('evalInput');

      if (!uploadArea || !fileInput || !uploadBtn) return;

      const allowedExtensions = ['txt', 'pdf', 'docx', 'md', 'rtf'];

      const loadScript = (src) => new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
        document.head.appendChild(script);
      });

      const handleFile = async (file) => {
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(ext)) {
          alert('Formato no soportado. Usa .txt, .pdf, .docx, .md o .rtf.');
          return;
        }

        fileName.textContent = file.name;
        fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        preview.style.display = 'block';

        if (ext === 'txt' || ext === 'md' || ext === 'rtf') {
          const reader = new FileReader();
          reader.onload = (e) => { evalInput.value = e.target.result; };
          reader.onerror = () => alert('No se pudo leer el archivo.');
          reader.readAsText(file);
        } else if (ext === 'pdf') {
          try {
            if (typeof pdfjsLib === 'undefined') {
              await loadScript('https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js');
              if (typeof pdfjsLib !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
              }
            }
          } catch (err) {
            alert('No se pudo cargar el lector de PDF. Revisa tu conexión e inténtalo de nuevo.');
            return;
          }

          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const typedarray = new Uint8Array(e.target.result);
              const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
              let fullText = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                fullText += content.items.map(item => item.str).join(' ') + '\n';
              }
              evalInput.value = fullText;
            } catch (err) {
              alert('Error al leer el PDF: ' + err.message);
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (ext === 'docx') {
          try {
            if (typeof mammoth === 'undefined') {
              await loadScript('https://unpkg.com/mammoth/mammoth.browser.min.js');
            }
          } catch (err) {
            alert('No se pudo cargar el lector de DOCX. Revisa tu conexión e inténtalo de nuevo.');
            return;
          }

          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
              evalInput.value = result.value;
            } catch (err) {
              alert('Error al leer el DOCX: ' + err.message);
            }
          };
          reader.readAsArrayBuffer(file);
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

    } catch (e) {
      showDebug(`❌ Error en _bindFileUpload: ${e.message}`, true);
    }
  },
   
  _bindEval(viewId) {
    try {
      const btn = document.getElementById('evalBtn');
      const input = document.getElementById('evalInput');
      const out = document.getElementById('evalResult');

      if (!btn) return;

      btn.onclick = async () => {
        // Bloqueo de doble ejecución: si ya está corriendo un análisis, no
        // hace nada. El botón queda deshabilitado mientras dura el proceso.
        if (btn.disabled) return;

        const text = input ? input.value.trim() : '';
        if (!text) {
          out.innerHTML = `<p style="color:#ef4444;">El texto es requerido.</p>`;
          return;
        }

        btn.disabled = true;
        const originalBtnText = btn.textContent;
        btn.textContent = 'Analizando…';
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';

        // Frases "¿Sabías que...?" rotando mientras dura el análisis (1-2 min),
        // para que la espera se sienta informativa en vez de un simple spinner.
        const shuffled = [...SOPHIA_LOADING_FACTS].sort(() => Math.random() - 0.5);
        let factIndex = 0;
        const renderLoading = () => {
          out.innerHTML = `
            <div style="margin-top:16px; padding:16px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px;">
              <p style="color:var(--accent); font-size:.8rem; margin:0 0 8px 0;">Analizando documento con SOPHIA (Motor Determinista + IA)…</p>
              <p style="color:rgba(229,231,235,.65); font-size:.78rem; line-height:1.5; margin:0;">${shuffled[factIndex % shuffled.length]}</p>
            </div>`;
          factIndex++;
        };
        renderLoading();
        const factInterval = setInterval(renderLoading, 20000);

        try {
          let data = null;

          try {
            const response = await fetch('/api/sophia/evaluate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text,
                userId: localStorage.getItem('userId') || null
              })
            });

            if (response.ok) {
              const resultado = await response.json();
              data = normalizeSophiaResult(resultado);
              if (data && data.metadata && data.metadata.module_versions && data.metadata.module_versions.protocol) {
                SOPHIA_BACKEND_VERSION = data.metadata.module_versions.protocol;
              }
              console.log("📥 Datos recibidos del servidor:", data);
            } else {
              console.warn(`⚠️ /api/sophia/evaluate respondió ${response.status}, usando motor local.`);
            }
          } catch (networkError) {
            console.warn('⚠️ No se pudo contactar /api/sophia/evaluate, usando motor local:', networkError.message);
          }

          if (!data || typeof data.IRD_global === 'undefined') {
            console.log("⚙️ Ejecutando fallback local (evaluateText)...");
            data = normalizeSophiaResult(evaluateWithBestAvailableEngine(text));
          }

          // Guardar estado para el widget Rey Filósofo (Multiorigen)
          this._lastEvaluationData = {
            text: text,
            evaluation: data,
            timestamp: new Date().toISOString()
          };

          this._renderEvaluation(data, out);
          this._bindFeedback(out, text, data);

        } catch (error) {
          console.error('❌ Error en evaluación:', error);
          out.innerHTML = `<p style="color:#ef4444;">Error: ${error.message}</p>`;
        } finally {
          clearInterval(factInterval);
          btn.disabled = false;
          btn.textContent = originalBtnText;
          btn.style.opacity = '';
          btn.style.cursor = '';
        }
      };
    } catch (e) {
      showDebug(`❌ Error en _bindEval: ${e.message}`, true);
    }
  },

  // Agrega, debajo del resultado de una evaluación, un espacio simple para
  // que la persona cuente qué le pareció el análisis que hizo SOPHIA. Es el
  // mecanismo de retroalimentación para calibrar el instrumento — nunca
  // modifica el resultado ya mostrado, solo se envía al servidor.
  _bindFeedback(out, originalText, evaluationData) {
    try {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'margin-top:20px; padding:16px; background:var(--s-panel); border:1px dashed rgba(255,255,255,.15); border-radius:4px;';
      wrapper.innerHTML = `
        <div style="font-size:.75rem; color:rgba(229,231,235,.5); text-transform:uppercase; margin-bottom:8px;">¿Qué te pareció este análisis?</div>
        <p style="font-size:.72rem; color:rgba(229,231,235,.4); margin:0 0 10px 0;">SOPHIA está en beta — contanos si algo te pareció injusto, incorrecto o poco claro. Nos ayuda a calibrar el instrumento.</p>
        <textarea id="sophiaFeedbackInput" placeholder="Ej: la penalización en Transparencia Retórica no me pareció justificada..." style="width:100%; min-height:60px; background:#0a0a0a; border:1px solid rgba(255,255,255,.1); border-radius:4px; color:#e5e7eb; font-size:.78rem; padding:8px; box-sizing:border-box; resize:vertical;"></textarea>
        <div style="display:flex; justify-content:flex-end; align-items:center; gap:10px; margin-top:8px;">
          <span id="sophiaFeedbackStatus" style="font-size:.72rem; color:rgba(229,231,235,.4);"></span>
          <button id="sophiaFeedbackBtn" class="btn-primary" style="font-size:.78rem; padding:6px 14px;">Enviar comentario</button>
        </div>
      `;
      out.appendChild(wrapper);

      const feedbackBtn = wrapper.querySelector('#sophiaFeedbackBtn');
      const feedbackInput = wrapper.querySelector('#sophiaFeedbackInput');
      const feedbackStatus = wrapper.querySelector('#sophiaFeedbackStatus');

      feedbackBtn.onclick = async () => {
        const comentario = feedbackInput.value.trim();
        if (!comentario) {
          feedbackStatus.textContent = 'Escribí algo antes de enviar.';
          feedbackStatus.style.color = '#ef4444';
          return;
        }

        feedbackBtn.disabled = true;
        feedbackStatus.textContent = 'Enviando…';
        feedbackStatus.style.color = 'rgba(229,231,235,.4)';

        try {
          const response = await fetch('/api/sophia/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              comentario,
              texto_evaluado: originalText,
              ird_global: evaluationData ? evaluationData.IRD_global : null,
              userId: localStorage.getItem('userId') || null,
              timestamp: new Date().toISOString()
            })
          });

          if (response.ok) {
            feedbackStatus.textContent = '¡Gracias! Tu comentario fue enviado.';
            feedbackStatus.style.color = '#22c55e';
            feedbackInput.value = '';
          } else {
            throw new Error(`El servidor respondió ${response.status}`);
          }
        } catch (err) {
          console.warn('⚠️ No se pudo enviar el feedback:', err.message);
          feedbackStatus.textContent = 'No se pudo enviar. Probá de nuevo más tarde.';
          feedbackStatus.style.color = '#ef4444';
        } finally {
          feedbackBtn.disabled = false;
        }
      };
    } catch (e) {
      showDebug(`❌ Error en _bindFeedback: ${e.message}`, true);
    }
  },

  _renderEvaluation(data, out) {
    try {
      if (!data) {
        out.innerHTML = `<p style="color:#ef4444;">No se pudo generar la evaluación.</p>`;
        return;
      }

      const irdGlobal = data.IRD_global !== undefined ? data.IRD_global : 0;
      const nivelRiesgo = data.riesgo || "Normal";

      const riesgoColor = {
        "Normal": "#22c55e",
        "Atención": "#eab308",
        "Alta Fragilidad": "#f97316",
        "Riesgo Extremo": "#ef4444"
      }[nivelRiesgo] || "#22c55e";

      const fases = data.fases || [];
      const evidencias = data.evidencias || [];
      const hayInfracciones = fases.some(f => (f.infracciones || []).length > 0);

      const NATURALEZA_LABEL = { SC: 'Científica', INF: 'Informativa', ARG: 'Argumentativa', POL: 'Política Deliberativa', NORM: 'Normativa/Propositiva' };
      const esV4 = !!data.naturaleza_documental;

      out.innerHTML = `
        ${esV4 ? `
        <div class="view-section">
          <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:uppercase; letter-spacing:.05em;">Naturaleza documental detectada</div>
              <div style="font-size:.95rem; color:var(--accent);">${NATURALEZA_LABEL[data.naturaleza_documental] || data.naturaleza_documental}${data.hibrido ? ' (híbrido)' : ''}</div>
            </div>
            <div style="font-size:.7rem; color:rgba(229,231,235,.4);">Confianza de clasificación: ${Math.round((data.confianza_clasificacion || 0) * 100)}%</div>
          </div>
        </div>` : ''}

        <div class="view-section">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; background:var(--s-panel); padding:16px; border:1px solid var(--s-border);">
            <div>
              <div style="font-size:.7rem; color:rgba(229,231,235,.4); text-transform:uppercase; letter-spacing:.05em;">Índice de Robustez Deliberativa</div>
              <div style="font-size:2.2rem; font-weight:600; color:var(--accent);">${irdGlobal}<span style="font-size:1rem; color:rgba(229,231,235,.4);">/100</span></div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:.7rem; color:rgba(229,231,235,.4); text-transform:uppercase; letter-spacing:.05em;">Nivel de riesgo</div>
              <div style="font-size:1.1rem; font-weight:600; color:${riesgoColor};">${nivelRiesgo}</div>
            </div>
          </div>
        </div>

        ${esV4 && data.rutas_evaluadas && data.rutas_evaluadas.saltos_detectados.length > 0 ? `
        <div class="view-section">
          <div class="view-section-title">Ruta inferencial: saltos detectados</div>
          <div style="font-size:.68rem; color:rgba(229,231,235,.35); margin-bottom:8px;">Ruta esperada: ${data.rutas_evaluadas.ruta_esperada.join(' → ')}</div>
          ${data.rutas_evaluadas.saltos_detectados.map(s => `
            <div style="background:var(--s-panel); border-left:2px solid #eab308; padding:10px 14px; margin-bottom:8px;">
              <div style="font-size:.8rem; color:#e5e7eb;">${s.descripcion}</div>
              <div style="font-size:.68rem; color:#eab308; margin-top:2px;">-${s.penalizacion} pts</div>
            </div>
          `).join('')}
        </div>` : ''}

        <div class="view-section">
          <div class="view-section-title">Puntaje por fase</div>
          ${fases.map(f => `
            <div style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; font-size:.8rem; margin-bottom:4px;">
                <span style="color:#e5e7eb;">${f.nombre || 'Fase'}</span>
                <span style="color:rgba(229,231,235,.5);">${f.puntaje !== undefined ? f.puntaje : 0}/100</span>
              </div>
              <div style="background:rgba(255,255,255,.06); height:6px; border-radius:3px; overflow:hidden;">
                <div class="score-bar" data-target="${f.puntaje !== undefined ? f.puntaje : 0}%" style="display:block; width:0%; height:100%; background:var(--accent); transition:width .6s ease;"></div>
              </div>
            </div>
          `).join('')}
        </div>

        ${hayInfracciones ? `
          <div class="view-section">
            <div class="view-section-title">Puntos de revisión detectados</div>
            ${fases.filter(f => (f.infracciones || []).length > 0).map(f => `
              <div style="margin-bottom:16px;">
                <div style="font-size:.75rem; color:var(--accent); margin-bottom:6px;">${f.nombre}</div>
                ${f.infracciones.map(inf => `
                  <div style="background:var(--s-panel); border-left:2px solid #ef4444; padding:10px 14px; margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; font-size:.8rem; gap:8px;">
                      <span style="color:#e5e7eb;">${inf.criterio || 'Criterio sin nombre'}</span>
                      <span style="color:#ef4444; white-space:nowrap;">-${Number(inf.penalizacion || 0).toFixed(1)} pts</span>
                    </div>
                    <div style="font-size:.7rem; color:rgba(229,231,235,.4); margin-top:4px;">Constructo: ${inf.constructo || 'N/A'}</div>
                    ${inf.meta_regla_aplicada ? `<div style="font-size:.65rem; color:#eab308; margin-top:4px;">⚠ ${inf.meta_regla_aplicada}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="view-section">
            <p style="color:#22c55e;">✅ No se detectaron áreas de revisión de acuerdo al protocolo.</p>
          </div>
        `}

        ${evidencias.length > 0 ? `
          <div class="view-section">
            <div class="view-section-title">Evidencias textuales</div>
            <div style="max-height:300px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
              ${evidencias.map(ev => `
                <div style="border-bottom:1px solid rgba(255,255,255,.05); padding:8px 0; font-size:.75rem;">
                  <span style="color:#d97706; font-weight:500;">${ev.atomo || 'átomo'}</span>
                  <span style="color:rgba(229,231,235,.3);"> (${ev.criterio || 'N/A'})</span>
                  <div style="color:rgba(229,231,235,.6); margin-top:2px;">"${ev.fragmento || ''}"</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${data.llm ? `
          <div class="view-section">
            <div class="view-section-title">Revisión semántica (Gemini)</div>
            <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px;">
              ${data.llm.overall_comment ? `<p style="font-size:.82rem; color:#e5e7eb; margin:0 0 12px 0; line-height:1.5;">${data.llm.overall_comment}</p>` : ''}
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px,1fr)); gap:10px; margin-bottom:12px;">
                ${data.llm.evidence_quality ? `
                  <div>
                    <div style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:uppercase;">Calidad de evidencia</div>
                    <div style="font-size:.85rem; color:var(--accent);">${data.llm.evidence_quality}</div>
                  </div>` : ''}
                ${data.llm.tone_proportionality ? `
                  <div>
                    <div style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:uppercase;">Proporcionalidad del tono</div>
                    <div style="font-size:.85rem; color:var(--accent);">${data.llm.tone_proportionality}</div>
                  </div>` : ''}
              </div>
              ${(data.llm.additional_fallacies && data.llm.additional_fallacies.length > 0) ? `
                <div style="margin-bottom:10px;">
                  <div style="font-size:.7rem; color:rgba(229,231,235,.4); text-transform:uppercase; margin-bottom:4px;">Falacias adicionales detectadas</div>
                  <ul style="margin:0; padding-left:18px; font-size:.78rem; color:rgba(229,231,235,.75); line-height:1.5;">
                    ${data.llm.additional_fallacies.map(f => `<li>${f}</li>`).join('')}
                  </ul>
                </div>` : ''}
              ${(data.llm.bias_detected && data.llm.bias_detected.length > 0) ? `
                <div style="margin-bottom:10px;">
                  <div style="font-size:.7rem; color:rgba(229,231,235,.4); text-transform:uppercase; margin-bottom:4px;">Sesgos detectados</div>
                  <ul style="margin:0; padding-left:18px; font-size:.78rem; color:rgba(229,231,235,.75); line-height:1.5;">
                    ${data.llm.bias_detected.map(b => `<li>${b}</li>`).join('')}
                  </ul>
                </div>` : ''}
              ${(data.llm.rhetorical_devices && data.llm.rhetorical_devices.length > 0) ? `
                <div>
                  <div style="font-size:.7rem; color:rgba(229,231,235,.4); text-transform:uppercase; margin-bottom:4px;">Recursos retóricos identificados</div>
                  <ul style="margin:0; padding-left:18px; font-size:.78rem; color:rgba(229,231,235,.75); line-height:1.5;">
                    ${data.llm.rhetorical_devices.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                </div>` : ''}
            </div>
          </div>
        ` : data.llmError ? `
          <div class="view-section">
            <p style="color:rgba(229,231,235,.4); font-size:.78rem;">⚠ Revisión semántica (Gemini) no disponible: ${data.llmError}</p>
          </div>
        ` : ''}

        ${data.confiabilidad_factual ? (() => {
          const cf = data.confiabilidad_factual;
          const claimText = (c) => {
            if (c === null || c === undefined) return '(afirmación sin texto)';
            if (typeof c === 'string') return c;
            if (typeof c === 'object') {
              return c.canonical_text
                || (Array.isArray(c.original_texts) ? c.original_texts.join(' / ') : null)
                || c.text
                || c.claim
                || '(afirmación sin texto)';
            }
            return String(c);
          };
          const claimSources = (c) => {
            if (!c || typeof c !== 'object') return [];
            const f = c.fuentes || c.sources || [];
            return Array.isArray(f) ? f.filter(Boolean) : [];
          };
          // Normaliza cada fuente a { texto, uri } sin importar si viene como
          // string simple (formato viejo) o como objeto {uri, title} (formato
          // nuevo de la búsqueda real con Vertex grounding).
          const sourceDisplay = (s) => {
            if (typeof s === 'string') return { texto: s, uri: null };
            if (s && typeof s === 'object') {
              const texto = s.title || s.uri || '(fuente sin nombre)';
              const uri = s.uri || null;
              return { texto, uri };
            }
            return { texto: String(s), uri: null };
          };
          const renderGroup = (titulo, claims, color) => {
            if (!Array.isArray(claims) || claims.length === 0) return '';
            return `
              <div style="margin-bottom:14px;">
                <div style="font-size:.75rem; color:${color}; text-transform:uppercase; margin-bottom:6px;">${titulo} (${claims.length})</div>
                ${claims.map(c => {
                  const fuentes = claimSources(c).map(sourceDisplay);
                  return `
                    <div style="background:rgba(255,255,255,.03); border-left:2px solid ${color}; padding:10px 14px; margin-bottom:8px;">
                      <div style="font-size:.78rem; color:#e5e7eb; line-height:1.4;">${claimText(c)}</div>
                      ${fuentes.length > 0
                        ? `<div style="font-size:.68rem; color:rgba(229,231,235,.45); margin-top:4px;">Fuentes: ${fuentes.map(f =>
                            f.uri
                              ? `<a href="${f.uri}" target="_blank" rel="noopener noreferrer" style="color:${color}; text-decoration:underline;">${f.texto}</a>`
                              : f.texto
                          ).join(', ')}</div>`
                        : `<div style="font-size:.68rem; color:rgba(229,231,235,.3); margin-top:4px;">Sin fuentes registradas</div>`}
                    </div>`;
                }).join('')}
              </div>`;
          };
          const verificados = cf.claims_verificados || [];
          const refutados = cf.claims_refutados || [];
          const enConflicto = cf.claims_en_conflicto || [];
          const insuficientes = cf.claims_evidencia_insuficiente || [];
          const noAplicables = cf.claims_no_aplicables || [];
          const total = verificados.length + refutados.length + enConflicto.length + insuficientes.length + noAplicables.length;

          return `
          <div class="view-section">
            <div class="view-section-title">Confiabilidad factual</div>
            <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px;">
              ${total === 0
                ? `<p style="font-size:.8rem; color:rgba(229,231,235,.5); margin:0;">No se identificaron afirmaciones verificables en el documento.</p>`
                : `
                  ${renderGroup('Verificadas', verificados, '#22c55e')}
                  ${renderGroup('Refutadas', refutados, '#ef4444')}
                  ${renderGroup('En conflicto', enConflicto, '#eab308')}
                  ${renderGroup('Evidencia insuficiente', insuficientes, '#f97316')}
                  ${renderGroup('No aplicables', noAplicables, 'rgba(229,231,235,.5)')}
                `}
            </div>
          </div>`;
        })() : ''}

        ${data.semantic_review ? (() => {
          const items = Array.isArray(data.semantic_review) ? data.semantic_review : [];
          const pick = (obj, keys, fallback) => {
            for (const k of keys) {
              if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
              if (obj && obj.revision_semantica && obj.revision_semantica[k] !== undefined && obj.revision_semantica[k] !== null && obj.revision_semantica[k] !== '') return obj.revision_semantica[k];
            }
            return fallback;
          };
          const cards = items.map(item => {
            if (item === null || typeof item !== 'object') {
              return `<div style="font-size:.78rem; color:rgba(229,231,235,.75); padding:8px 0;">${item}</div>`;
            }
            const atomo = pick(item, ['atomo', 'atom', 'ATOMO_CAUSALIDAD'], null);
            const criterio = pick(item, ['criterio', 'criterion'], null);
            const categoria = pick(item, ['categoria', 'category', 'tipo'], null);
            const confianza = pick(item, ['confianza', 'confidence'], null);
            const resultado = pick(item, ['resultado', 'result', 'veredicto'], null);
            const razon = pick(item, ['razon', 'reason', 'observacion', 'descripcion', 'explicacion'], null);

            const badgeColor = (resultado || '').toString().toLowerCase().includes('falso')
              ? '#ef4444'
              : (resultado || '').toString().toLowerCase().includes('correcto') || (resultado || '').toString().toLowerCase().includes('confirmado')
                ? '#22c55e'
                : 'var(--accent)';

            return `
              <div style="background:rgba(255,255,255,.03); border-left:2px solid ${badgeColor}; padding:10px 14px; margin-bottom:10px;">
                <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:6px; font-size:.68rem; color:rgba(229,231,235,.5); text-transform:uppercase;">
                  ${atomo ? `<span>Átomo: <strong style="color:#e5e7eb;">${atomo}</strong></span>` : ''}
                  ${criterio ? `<span>Criterio: <strong style="color:#e5e7eb;">${criterio}</strong></span>` : ''}
                  ${categoria ? `<span>Categoría: <strong style="color:#e5e7eb;">${categoria}</strong></span>` : ''}
                  ${confianza !== null ? `<span>Confianza: <strong style="color:#e5e7eb;">${confianza}</strong></span>` : ''}
                </div>
                ${resultado ? `<div style="font-size:.85rem; color:${badgeColor}; font-weight:500; margin-bottom:4px;">${resultado}</div>` : ''}
                ${razon ? `<div style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.5;">${razon}</div>` : ''}
                ${(!resultado && !razon) ? `<div style="font-size:.78rem; color:rgba(229,231,235,.5);">Sin detalle adicional disponible.</div>` : ''}
              </div>`;
          }).join('');

          return `
          <div class="view-section">
            <div class="view-section-title">Revisión semántica</div>
            <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px;">
              ${items.length > 0 ? cards : `<p style="font-size:.8rem; color:rgba(229,231,235,.5); margin:0;">No se detectaron observaciones semánticas — el motor determinista no presenta activaciones que requieran revisión.</p>`}
            </div>
          </div>`;
        })() : ''}

        ${data.gemini_review ? `
          <div class="view-section">
            <div class="view-section-title">Interpretación integral</div>
            <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px;">
              ${data.gemini_review.interpretacion ? `
                <div style="margin-bottom:12px;">
                  <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Interpretación</div>
                  <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">${data.gemini_review.interpretacion}</div>
                </div>` : ''}
              ${data.gemini_review.contexto ? `
                <div style="margin-bottom:12px;">
                  <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Contexto</div>
                  <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">${data.gemini_review.contexto}</div>
                </div>` : ''}
              ${data.gemini_review.observaciones ? `
                <div style="margin-bottom:12px;">
                  <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Observaciones</div>
                  <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">${data.gemini_review.observaciones}</div>
                </div>` : ''}
            </div>
          </div>
        ` : ''}
      `;
       
this._animateBars(out);
    } catch (e) {
      showDebug(`❌ Error en _renderEvaluation: ${e.message}`, true);
      out.innerHTML = `<p style="color:#ef4444;">Error al renderizar la evaluación: ${e.message}</p>`;
    }
  },

  init() {
    try {
      console.log('🚀 Inicializando SOPHIA...');
      const buttons = document.querySelectorAll('button.snav-item');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.navigate(e.currentTarget.dataset.view);
        });
      });
      this.navigate('inicio');
      console.log('✅ SOPHIA inicializada con éxito');
    } catch (e) {
      console.error(`❌ Error en init: ${e.message}`);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ El motor está encendido');
  SOPHIA.init();
});

// Exponer explícitamente para el consumo del Motor Cognitivo (Rey Filósofo)
window.SOPHIA = SOPHIA;
