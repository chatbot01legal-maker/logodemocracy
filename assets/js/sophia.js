/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Protocolo Abierto de Comunicación Deliberativa
   v4.0 — Motor único: SophiaEngineV4 (20 átomos cognitivos)
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

// ─── METADATOS DE LAS 5 FASES Y 20 CRITERIOS ───────────
// Los nombres de fase/criterio son estables (parte del protocolo público),
// por eso se declaran aquí. Las DEFINICIONES de cada átomo, en cambio,
// NUNCA se copian a mano: se leen en vivo de window.SophiaEngineV4.ATOM_DICTIONARY
// más abajo (getSophiaGlosario), para que la documentación no pueda
// desincronizarse del motor real — que es justamente lo que pasó con el
// motor v3.0 legacy (48, luego 62 átomos, mientras producción usaba 20).
const FASE_NOMBRE = {
  fase1: 'Estructura Lógica', fase2: 'Inferencia', fase3: 'Calibración Epistémica',
  fase4: 'Transparencia Retórica', fase5: 'Pertinencia Deliberativa'
};
const FASE_DESCRIPCION = {
  fase1: 'Integridad de la arquitectura base del argumento: ¿las piezas del razonamiento son compatibles entre sí?',
  fase2: 'Ingeniería de la derivación argumentativa: ¿la conclusión se sigue realmente de las premisas, sin saltos ni atajos?',
  fase3: 'Relación con el conocimiento y la evidencia: ¿el nivel de certeza expresado es proporcional al respaldo presentado?',
  fase4: 'Limpieza y honestidad comunicativa: ¿el lenguaje persuade con razones o sustituye la razón por otra cosa?',
  fase5: 'Valor cívico y utilidad pública: ¿el texto aporta a una deliberación colectiva en vez de desviarla?'
};
const CRITERIO_NOMBRE = {
  '1.1': 'No Contradicción', '1.2': 'Continuidad Semántica', '1.3': 'Ausencia de Falsas Dicotomías', '1.4': 'Integridad de las Premisas',
  '2.1': 'Suficiencia Inferencial', '2.2': 'Causalidad Rigurosa', '2.3': 'Proporcionalidad Generalizadora', '2.4': 'Inmunidad a Petición de Principio',
  '3.1': 'Trazabilidad de la Evidencia', '3.2': 'Declaración de Incertidumbre', '3.3': 'Delimitación Hecho-Valor', '3.4': 'Completitud del Contexto',
  '4.1': 'Representación Justa (Steelman)', '4.2': 'Neutralidad Emocional', '4.3': 'Despersonalización del Debate', '4.4': 'Claridad Denotativa',
  '5.1': 'Focalización Temática', '5.2': 'Responsabilidad Constructiva', '5.3': 'Universalidad (Simetría)', '5.4': 'Falsabilidad'
};

// ─── GLOSARIO EN VIVO: los 20 átomos de SophiaEngineV4 ─
// Fuente única de verdad. Si SophiaEngineV4 no cargó, devuelve un
// glosario vacío (las vistas lo manejan mostrando un aviso, nunca
// datos inventados ni de un motor distinto).
function getSophiaGlosario() {
  const dict = (typeof window !== 'undefined' && window.SophiaEngineV4 && window.SophiaEngineV4.ATOM_DICTIONARY) || null;
  if (!dict) return [];
  return Object.keys(dict).map(id => {
    const a = dict[id];
    return {
      id,
      criterio: a.criterio,
      nombreCriterio: CRITERIO_NOMBRE[a.criterio] || a.criterio,
      fase: a.fase,
      nombreFase: FASE_NOMBRE[a.fase] || a.fase,
      definicion: a.definicion_base,
      perfiles: a.perfiles || {}
    };
  }).sort((x, y) => x.criterio.localeCompare(y.criterio));
}

// ─── BANNER BETA (reutilizable) ────────────────────────
// SOPHIA está en período de prueba: tanto el motor determinista como
// las capas semánticas se siguen calibrando. Se muestra en las vistas
// documentales para que nadie confunda "resultado actual" con "versión
// final del instrumento".
function renderBetaBanner() {
  return `
    <div style="display:flex; align-items:center; gap:8px; background:rgba(217,119,6,.08); border:1px solid rgba(217,119,6,.3); padding:8px 12px; border-radius:4px; margin-bottom:16px; font-size:.72rem; color:#d97706;">
      <strong>BETA</strong>
      <span style="color:rgba(229,231,235,.6);">SOPHIA está en período de prueba. El motor determinista y las capas semánticas se siguen calibrando — los criterios, severidades y ejemplos de esta página pueden cambiar.</span>
    </div>`;
}

// ─── MOTOR DETERMINISTA: SophiaEngineV4 (20 átomos, 1:1 por criterio) ──
// El motor v3.0 legacy (PROTOCOL, 62 átomos) fue retirado por completo.
// SOPHIA corre exclusivamente sobre SophiaEngineV4 — el único motor
// determinista soportado a partir de esta versión Beta.
// ─── ADAPTADOR DE MOTOR (solo SophiaEngineV4) ──
// Prioriza SophiaEngineV4 (clasificación documental + perfiles
// contextuales + rutas inferenciales). Si el script no cargó por
// El motor determinista de SOPHIA es exclusivamente SophiaEngineV4. Si no
// está cargado o falla, SOPHIA lo dice honestamente en vez de sustituirlo
// por un motor distinto y más pobre — eso fue justo lo que generaba
// resultados inconsistentes en versiones anteriores (48/62 átomos vs 20).
function evaluateWithBestAvailableEngine(text) {
  if (typeof window !== 'undefined' && window.SophiaEngineV4 && typeof window.SophiaEngineV4.evaluate === 'function') {
    try {
      const resultV4 = window.SophiaEngineV4.evaluate(text);
      if (resultV4) return resultV4;
    } catch (e) {
      console.warn('⚠️ SophiaEngineV4 falló:', e.message);
      return { motor_no_disponible: true, motivo: 'error', detalle: e.message, fases: [], evidencias: [], IRD_global: 0, riesgo: 'Desconocido' };
    }
  }
  console.warn('⚠️ SophiaEngineV4 no está cargado (falta <script src=".../sophiaEngineV4.js">).');
  return { motor_no_disponible: true, motivo: 'no_cargado', fases: [], evidencias: [], IRD_global: 0, riesgo: 'Desconocido' };
}

// No es una fórmula nueva: es una relectura de los mismos datos que ya
// produce la Capa 1 (fases[].infracciones). IRD_global seguía siendo el
// promedio de puntaje_fase; VPA cuenta cuántos hallazgos reales quedaron
// en pie después de aplicar mitigadores — no reemplaza el cálculo de
// severidad/mitigación, solo cambia cómo se presenta su resultado.
function computeVPA(fases) {
  const puntos = [];
  (fases || []).forEach(fase => {
    (fase.infracciones || []).forEach(inf => {
      puntos.push({
        fase: fase.nombre || fase.id,
        criterio: inf.criterio,
        constructo: inf.constructo,
        atomos: inf.atomos_activados || [],
        mitigado: !!inf.mitigado_parcialmente,
        severidad: inf.penalizacion
      });
    });
  });
  let categoria;
  if (puntos.length === 0) categoria = "Sin puntos de atención";
  else if (puntos.length <= 2) categoria = "Pocos puntos de atención";
  else if (puntos.length <= 5) categoria = "Varios puntos de atención";
  else categoria = "Múltiples puntos de atención";
  return { conteo: puntos.length, categoria, puntos };
}

// ─── PARCHE DE PRESENTACIÓN: lenguaje heredado en texto del LLM ──
// El backend (gemini_review) puede seguir generando narrativa con
// lenguaje de puntaje ("IRD 99", "Índice de Robustez Deliberativa",
// "máxima puntuación") si su prompt no fue actualizado. Esta función
// traduce esas menciones al VPA real ya calculado del lado del
// cliente, sin alterar el resto del texto. Es un parche temporal:
// lo correcto es actualizar el prompt en origen; ver limitaciones.
function sanitizeVPALanguage(texto, vpaConteo) {
  if (!texto || typeof texto !== 'string') return texto;
  const conteoTexto = vpaConteo === 0
    ? 'sin puntos de atención'
    : `${vpaConteo} punto${vpaConteo === 1 ? '' : 's'} de atención (VPA)`;
  return texto
    .replace(/\(?\bIRD\s*(de\s*|:\s*)?\d{1,3}\)?/gi, `(${conteoTexto})`)
    .replace(/Índice de Robustez Deliberativa \(IRD\)/gi, 'VPA (Vale la Pena Prestar Atención)')
    .replace(/Índice de Robustez Deliberativa/gi, 'VPA (Vale la Pena Prestar Atención)')
    .replace(/\b(la|una)\s+máxima puntuación\b/gi, 'el mínimo de puntos de atención posible')
    .replace(/\bmáxima puntuación\b/gi, 'el mínimo de puntos de atención posible')
    .replace(/\b(la|una)\s+alta puntuación\b/gi, 'pocos puntos de atención')
    .replace(/\balta puntuación\b/gi, 'pocos puntos de atención');
}

// ─── NORMALIZACIÓN DE RESPUESTAS SOPHIA ───────────────
// El backend híbrido (/api/sophia/evaluate) responde con la forma:
//   { local: {fases, evidencias, IRD_global, riesgo}, llm_review, ird, risk, ... }
// El motor local de respaldo (evaluateText) responde con la forma plana:
//   { fases, evidencias, IRD_global, riesgo }
// Esta función unifica ambas en un solo objeto para el render.
function normalizeSophiaResult(raw) {
  if (!raw) return null;

  // ─── Motor no disponible ─────────────────────────────
  // evaluateWithBestAvailableEngine puede devolver este estado si
  // SophiaEngineV4 no cargó o falló. Es distinto de "evaluó y no
  // encontró nada": VPA:0 real significa "sin puntos de atención",
  // esto significa "no se pudo evaluar". Nunca se deben mostrar igual.
  if (raw.motor_no_disponible) {
    return {
      motor_no_disponible: true,
      motivo: raw.motivo,
      detalle: raw.detalle,
      fases: [],
      evidencias: [],
      IRD_global: null,
      vpa: null,
      riesgo: null
    };
  }

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

      // IRD_global se conserva internamente por compatibilidad con
      // consumidores existentes (Ágora, telemetría, contrato API), pero
      // deja de ser la métrica principal para el usuario: ver vpa.
      IRD_global:
        raw.ird !== undefined
          ? raw.ird
          : local.IRD_global,

      vpa: computeVPA(local.fases || []),

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
    vpa: computeVPA(raw.fases || []),
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
// contra el backend. Si aún no hubo ninguna evaluación, cae a la versión
// que declara SophiaEngineV4. Nunca queda un número escrito a mano.
let SOPHIA_BACKEND_VERSION = null;
function getSophiaVersion() {
  const v4Version = (typeof window !== 'undefined' && window.SophiaEngineV4 && window.SophiaEngineV4.version) || null;
  return SOPHIA_BACKEND_VERSION || v4Version || '4.0';
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
    const glosario = getSophiaGlosario();
    if (glosario.length === 0) {
      return `
        <div class="view">
          <div class="view-eyebrow">${FASE_NOMBRE[faseId] || faseId}</div>
          <h1 class="view-title">Motor no disponible</h1>
          <div class="view-body">
            <p>Esta página describe los criterios de SophiaEngineV4, el motor determinista de SOPHIA. No se pudo cargar (<code>window.SophiaEngineV4</code> no está disponible), así que no hay datos reales que mostrar. Intenta recargar la página.</p>
          </div>
        </div>`;
    }
    const atomosDeFase = glosario.filter(a => a.fase === faseId).sort((x, y) => x.criterio.localeCompare(y.criterio));
    if (atomosDeFase.length === 0) return "<p>Fase no encontrada.</p>";

    const PERFIL_NOMBRE = { SC: 'Texto científico/técnico', ARG: 'Ensayo argumentativo', POL: 'Discurso político/deliberativo', INF: 'Texto informativo', NORM: 'Texto normativo/propositivo' };

    return `
      <div class="view">
        ${renderBetaBanner()}
        <div class="view-eyebrow">Fase ${faseId.charAt(faseId.length - 1)} del Protocolo · SophiaEngineV4</div>
        <h1 class="view-title">${FASE_NOMBRE[faseId]}</h1>
        <div class="view-body">
          <p>${FASE_DESCRIPCION[faseId]}</p>
          <p style="font-size:.78rem; color:rgba(229,231,235,.55);">Esta fase agrupa 4 criterios. Cada criterio corresponde a exactamente <strong>un átomo cognitivo</strong> — SOPHIA no le pone una nota a cada uno: los usa para identificar <strong>puntos de atención (VPA)</strong> que vale la pena que revises con más cuidado, no errores confirmados.</p>
        </div>
        <div class="view-section">
          <div class="view-section-title">Criterios y su átomo</div>
          ${atomosDeFase.map(a => {
            const perfiles = Object.keys(a.perfiles);
            return `
            <div style="margin-bottom: 20px; background: var(--s-panel); padding: 14px; border-left: 2px solid var(--accent);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 500; color: #e5e7eb;">${a.criterio} — ${a.nombreCriterio}</span>
                <span style="font-size: 0.7rem; color: rgba(229,231,235,.4); cursor:pointer;" data-atomo="${a.id}">${a.id}</span>
              </div>
              <div style="font-size: 0.8rem; color: rgba(229,231,235,.6); margin: 8px 0;">${a.definicion}</div>
              <div style="font-size: 0.72rem; color: rgba(229,231,235,.4); margin-bottom: 8px;">
                SOPHIA lee este átomo distinto según el tipo de documento (${perfiles.length} perfil${perfiles.length === 1 ? '' : 'es'} definido${perfiles.length === 1 ? '' : 's'}) — lo que cuenta como señal de riesgo en un texto científico no es lo mismo que en un discurso político.
              </div>
              ${perfiles.map(p => {
                const perfil = a.perfiles[p];
                return `
                <div style="background:rgba(255,255,255,.02); border:1px solid var(--s-border); padding:10px 12px; margin-bottom:8px; border-radius:4px;">
                  <div style="display:flex; justify-content:space-between; font-size:.68rem; color:var(--accent); margin-bottom:4px;">
                    <span><strong>${PERFIL_NOMBRE[p] || p}</strong></span>
                    <span style="color:rgba(229,231,235,.4);">severidad base: ${perfil.severidad_base}</span>
                  </div>
                  <div style="font-size:.75rem; color:rgba(229,231,235,.65); margin-bottom:6px;">${perfil.definicion_contextual}</div>
                  ${perfil.indicadores && perfil.indicadores.length ? `<div style="font-size:.68rem; margin-bottom:3px;"><span style="color:#ef4444;">Indicadores (riesgo):</span> <span style="color:rgba(229,231,235,.5);">${perfil.indicadores.map(i => `"${i}"`).join(', ')}</span></div>` : ''}
                  ${perfil.contraindicadores && perfil.contraindicadores.length ? `<div style="font-size:.68rem; margin-bottom:3px;"><span style="color:#22c55e;">Contraindicadores (mitigan):</span> <span style="color:rgba(229,231,235,.5);">${perfil.contraindicadores.map(i => `"${i}"`).join(', ')}</span></div>` : ''}
                  <div style="font-size:.65rem; color:rgba(229,231,235,.35);">Evidencia que lo resolvería: ${perfil.evidencia_esperada}</div>
                </div>`;
              }).join('')}
            </div>
          `;}).join('')}
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
  "¿Sabías que? SOPHIA no le pone una nota a tu texto. VPA — Vale la Pena prestar Atención — cuenta cuántas señales concretas encontró para revisar, no califica si el texto es bueno o malo.",
  "¿Sabías que? La Capa 1 de SOPHIA (el motor determinista) no usa IA — son reglas públicas y auditables, siempre las mismas para todos.",
  "¿Sabías que? Después del motor determinista, una IA revisa ese mismo resultado buscando falsos positivos: negaciones, ironía, citas o hipótesis mal interpretadas.",
  "¿Sabías que? SOPHIA distingue entre 'cómo' argumentás (los puntos de atención sobre la estructura) y 'qué' afirmás (la confiabilidad factual de tus datos) — son dos análisis independientes que nunca se mezclan.",
  "¿Sabías que? Para verificar hechos, SOPHIA hace búsquedas reales en internet y solo marca un dato como verificado si encuentra una fuente real que lo respalde.",
  "¿Sabías que? Si SOPHIA no encuentra evidencia suficiente sobre una afirmación, lo dice explícitamente — nunca inventa una fuente para parecer más segura.",
  "¿Sabías que? La fase de Estructura Lógica revisa si tu argumento se contradice a sí mismo o cae en falsas dicotomías (elegir solo entre dos opciones cuando hay más).",
  "¿Sabías que? La fase de Inferencia detecta si confundís correlación con causalidad, o si generalizás a partir de un solo ejemplo.",
  "¿Sabías que? La fase de Calibración Epistémica evalúa si tu nivel de certeza ('creo que' vs. 'es un hecho que') es proporcional a la evidencia que presentás.",
  "¿Sabías que? La fase de Transparencia Retórica busca lenguaje cargado emocionalmente que reemplace argumentos en vez de acompañarlos.",
  "¿Sabías que? La fase de Pertinencia Deliberativa mide si tu texto representa de forma justa a quienes piensan distinto (el llamado 'steelmaning').",
  "¿Sabías que? Todo el proceso de SOPHIA queda registrado por capas — podés ver exactamente qué detectó cada una, no solo el resultado final.",
  "¿Sabías que? Que SOPHIA no marque puntos de atención estructurales no garantiza que los datos citados sean ciertos — por eso SOPHIA siempre muestra ambas cosas por separado.",
  "¿Sabías que? La interpretación final que arma SOPHIA usa como contexto obligatorio los resultados de las tres capas anteriores, nunca analiza el texto desde cero.",
  "¿Sabías que? SOPHIA es parte de LogoDemocracy, un ecosistema que busca mejorar la calidad de la deliberación pública con herramientas abiertas.",
  "¿Sabías que? Las 'meta-reglas' de SOPHIA pueden mitigar una penalización si otra fase ya demostró suficiente rigor — el sistema no evalúa cada criterio de forma aislada.",
  "¿Sabías que? Cada punto de atención que detecta SOPHIA cita el fragmento exacto de tu texto que lo originó — nada queda sin evidencia mostrable.",
  "¿Sabías que? SOPHIA fue diseñada para señalar aspectos del razonamiento que vale la pena examinar, no para decirte si tu opinión es correcta o incorrecta.",
  "¿Sabías que? Un texto puede tener errores factuales y aun así una estructura argumentativa impecable — SOPHIA te muestra esa tensión en vez de esconderla.",
  "¿Sabías que? El protocolo de SOPHIA es público: cualquiera puede revisar exactamente qué reglas se aplican y por qué.",
  "¿Sabías que? SOPHIA busca ayudarte a pulir una idea antes de publicarla o defenderla, mostrándote qué examinar, no calificándola después de escrita.",
  "¿Sabías que? La ambigüedad léxica (usar palabras que admiten muchas interpretaciones, como 'bueno' o 'justo' sin definirlas) es una de las señales más comunes que detecta SOPHIA.",
  "¿Sabías que? SOPHIA revisa si tu conclusión es proporcional al tamaño real de tus premisas, o si estás sacando una conclusión más grande de lo que tu evidencia sostiene.",
  "¿Sabías que? El sistema de verificación de SOPHIA nunca decide si algo es verdadero basándose en su propio conocimiento — siempre busca una fuente externa primero.",
  "¿Sabías que? SOPHIA todavía está en etapa beta — cada evaluación que hacés ayuda a mejorar el instrumento.",
  "¿Sabías que? Podés ver el detalle completo de cada fase, no solo el puntaje total, para entender exactamente dónde mejorar tu argumento.",
  "¿Sabías que? La revisión de falsos positivos existe porque ninguna regla automática es perfecta — por eso una IA vuelve a mirar cada activación antes del resultado final.",
  "¿Sabías que? SOPHIA separa claramente sus observaciones: unas evalúan tu razonamiento, otras evalúan tus datos, y nunca se mezclan en un solo puntaje.",
  "¿Sabías que? El objetivo de SOPHIA no es que tu texto 'apruebe', sino que vos entiendas mejor cómo se construye un argumento sólido."
];

const VIEWS = {
ejemplo: {
  title: 'Ejemplo',
  render: () => `
    <div class="view-eyebrow">Caso real · SOPHIA en acción</div>

    <h1 class="view-title">
      ¿Es razonable poner un límite a la riqueza personal?
    </h1>

    <div class="view-body">
      <p>
        <strong>
          Este es un ejemplo real de cómo SOPHIA analiza un texto argumentativo.
        </strong>
      </p>
      <p>
        El texto corresponde a un ensayo breve que defiende la idea de establecer
        un límite a la acumulación de riqueza personal, usando el ejemplo
        provocador de <strong>“nadie podría tener más de 20 Ferraris”</strong>.
      </p>
      <p>
        El caso es especialmente útil para mostrar cómo SOPHIA distingue entre
        la <strong>solidez estructural</strong> de un razonamiento y la
        <strong>veracidad factual</strong> de las afirmaciones que lo sustentan.
        Aquí el argumento presenta varios puntos de atención en su lógica y
        en la cadena inferencial, mientras que algunos datos concretos
        son verificables.
      </p>
      <p style="font-size:.78rem; color:rgba(229,231,235,.55);">
        El resultado que aparece a continuación corresponde a una evaluación
        real realizada por SOPHIA. La verificación factual es una capa
        independiente de la evaluación de robustez deliberativa.
      </p>
    </div>

    <div class="view-section">
      <div class="s-card">
        <div class="view-eyebrow">Resultado de SOPHIA</div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-top:18px;">
          <div class="s-card" style="margin:0;">
            <div class="view-eyebrow">Naturaleza documental</div>
            <strong style="font-size:1.15rem;">Argumentativa</strong>
            <div style="font-size:.65rem; color:rgba(229,231,235,.4);">Confianza: 0%</div>
          </div>
          <div class="s-card" style="margin:0;">
            <div class="view-eyebrow">VPA</div>
            <strong style="font-size:1.5rem;">3 <span style="font-size:.7rem; font-weight:400; color:rgba(229,231,235,.5);">puntos de atención</span></strong>
            <div style="font-size:.65rem; color:rgba(229,231,235,.4);">Varios puntos de atención</div>
          </div>
          <div class="s-card" style="margin:0;">
            <div class="view-eyebrow">Riesgo</div>
            <strong style="font-size:1.15rem;">Normal</strong>
          </div>
          <div class="s-card" style="margin:0;">
            <div class="view-eyebrow">Revisión semántica</div>
            <strong style="font-size:1.15rem;">Con observaciones</strong>
          </div>
        </div>

        <div style="margin-top:24px;">
          <div class="view-eyebrow">¿Dónde encontró SOPHIA algo que examinar?</div>
          <ul>
            <li><strong>Estructura Lógica:</strong> 2 puntos de atención</li>
            <li><strong>Inferencia:</strong> 1 punto de atención</li>
            <li><strong>Calibración Epistémica:</strong> Sin puntos de atención</li>
            <li><strong>Transparencia Retórica:</strong> Sin puntos de atención</li>
            <li><strong>Pertinencia Deliberativa:</strong> Sin puntos de atención</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="view-section">
      <div class="s-card" style="border-left:3px solid var(--accent);">
        <div class="view-eyebrow">La observación central</div>
        <h2 class="view-subtitle">Estructura sólida, pero con saltos en la cadena inferencial</h2>
        <p>
          SOPHIA detectó <strong>tres puntos de atención</strong> en el razonamiento:
          dos relacionados con la <strong>Estructura Lógica</strong> (contradicción
          aparente y soporte de premisas) y uno en la <strong>Ruta Inferencial</strong>
          (generalización y causalidad sin datos explícitos).
        </p>
        <p>
          La revisión semántica, sin embargo, matiza algunos de estos hallazgos:
          señala que el autor utiliza la <strong>proslepsis</strong> (anticipar
          objeciones) para fortalecer su postura, y que el texto funciona como un
          <strong>experimento mental</strong> donde las generalizaciones se sostienen
          en principios lógicos y económicos, no en evidencia empírica. Esto no
          anula los puntos de atención, pero invita a interpretarlos en el contexto
          de un ensayo argumentativo, no de un estudio científico.
        </p>
        <p>
          Además, dos afirmaciones concretas del texto fueron <strong>verificadas
          factualmente</strong>, lo que muestra que el autor maneja datos precisos
          en algunos puntos, aunque la cadena causal global carece de respaldo
          explícito.
        </p>
        <p>
          <strong>
            Esta tensión entre forma y contenido es precisamente lo que SOPHIA
            busca hacer visible: un argumento puede estar bien construido
            retóricamente y, aun así, presentar debilidades en la conexión entre
            premisas y conclusiones.
          </strong>
        </p>
      </div>
    </div>

    <div class="view-section">
      <div class="view-section-title">Puntos de atención</div>

      <div style="margin-bottom:16px;">
        <div style="font-size:.75rem; color:var(--accent); margin-bottom:6px;">Estructura Lógica</div>
        <div style="background:var(--s-panel); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; font-size:.8rem; gap:8px;">
            <span style="color:#e5e7eb;">1.1 - No Contradicción</span>
            <span style="color:rgba(229,231,235,.5); white-space:nowrap;">vale la pena examinar</span>
          </div>
          <div style="font-size:.7rem; color:rgba(229,231,235,.4); margin-top:4px;">Átomo: <span style="cursor:pointer; text-decoration:underline dotted;" data-atomo="ATOMO_CONTRADICCION">ATOMO_CONTRADICCION</span></div>
        </div>
        <div style="background:var(--s-panel); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; font-size:.8rem; gap:8px;">
            <span style="color:#e5e7eb;">1.4 - Integridad de las Premisas</span>
            <span style="color:rgba(229,231,235,.5); white-space:nowrap;">vale la pena examinar</span>
          </div>
          <div style="font-size:.7rem; color:rgba(229,231,235,.4); margin-top:4px;">Átomo: <span style="cursor:pointer; text-decoration:underline dotted;" data-atomo="ATOMO_SOPORTE_LOGICO">ATOMO_SOPORTE_LOGICO</span></div>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:.75rem; color:var(--accent); margin-bottom:6px;">Inferencia</div>
        <div style="background:var(--s-panel); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; font-size:.8rem; gap:8px;">
            <span style="color:#e5e7eb;">RUTA-INF - Ruta Inferencial</span>
            <span style="color:rgba(229,231,235,.5); white-space:nowrap;">vale la pena examinar</span>
          </div>
          <div style="font-size:.7rem; color:rgba(229,231,235,.4); margin-top:4px;">Átomo: <span style="cursor:pointer; text-decoration:underline dotted;" data-atomo="Ruta Inferencial">Ruta Inferencial</span></div>
        </div>
      </div>
    </div>

    <div class="view-section">
      <div class="view-section-title">Evidencias textuales</div>
      <div style="max-height:300px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
        <div style="border-bottom:1px solid rgba(255,255,255,.05); padding:8px 0; font-size:.75rem;">
          <span style="color:#d97706; font-weight:500;">ATOMO_CONTRADICCION</span>
          <span style="color:rgba(229,231,235,.3);"> (1.1)</span>
          <div style="color:rgba(229,231,235,.6); margin-top:2px;">"La medida podría parecer exagerada, pero existe una razón sencilla para defenderla"</div>
        </div>
        <div style="border-bottom:1px solid rgba(255,255,255,.05); padding:8px 0; font-size:.75rem;">
          <span style="color:#d97706; font-weight:500;">ATOMO_CONTRADICCION</span>
          <span style="color:rgba(229,231,235,.3);"> (1.1)</span>
          <div style="color:rgba(229,231,235,.6); margin-top:2px;">"Pero una empresa crea empleo porque existe demanda por sus productos, no simplemente porque alguien tenga mucho dinero"</div>
        </div>
        <div style="border-bottom:1px solid rgba(255,255,255,.05); padding:8px 0; font-size:.75rem;">
          <span style="color:#d97706; font-weight:500;">ATOMO_SOPORTE_LOGICO</span>
          <span style="color:rgba(229,231,235,.3);"> (1.4)</span>
          <div style="color:rgba(229,231,235,.6); margin-top:2px;">"Algunos responderían que las grandes fortunas son necesarias porque los ricos invierten y crean empresas"</div>
        </div>
        <div style="border-bottom:1px solid rgba(255,255,255,.05); padding:8px 0; font-size:.75rem;">
          <span style="color:#d97706; font-weight:500;">ATOMO_SOPORTE_LOGICO</span>
          <span style="color:rgba(229,231,235,.3);"> (1.4)</span>
          <div style="color:rgba(229,231,235,.6); margin-top:2px;">"Pero una empresa crea empleo porque existe demanda por sus productos, no simplemente porque alguien tenga mucho dinero"</div>
        </div>
      </div>
    </div>

    <div class="view-section">
      <div class="view-section-title">Confiabilidad factual</div>
      <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px;">
        <div style="margin-bottom:14px;">
          <div style="font-size:.75rem; color:#22c55e; text-transform:uppercase; margin-bottom:6px;">Verificadas (2)</div>
          <div style="background:rgba(255,255,255,.03); border-left:2px solid #22c55e; padding:10px 14px; margin-bottom:8px;">
            <div style="font-size:.78rem; color:#e5e7eb; line-height:1.4;">Una persona puede conducir un solo automóvil a la vez y habitar una sola casa.</div>
            <div style="font-size:.68rem; color:rgba(229,231,235,.45); margin-top:4px;">Fuentes: elpais.com, quora.com, global-immo.net, kronoshomes.com, rocketmortgage.com, fincaseva.com, dfrealty.net, primeinvest.es</div>
          </div>
          <div style="background:rgba(255,255,255,.03); border-left:2px solid #22c55e; padding:10px 14px; margin-bottom:8px;">
            <div style="font-size:.78rem; color:#e5e7eb; line-height:1.4;">Quienes poseen menos recursos consumen una proporción mayor de sus ingresos</div>
            <div style="font-size:.68rem; color:rgba(229,231,235,.45); margin-top:4px;">Fuentes: gerencie.com, reddit.com, financialaha.com</div>
          </div>
        </div>
      </div>
    </div>

    <div class="view-section">
      <div class="view-section-title">Revisión semántica</div>
      <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px;">
        <div style="background:rgba(255,255,255,.03); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:6px; font-size:.68rem; color:rgba(229,231,235,.5); text-transform:uppercase;">
            <span>Átomo: <strong style="color:#e5e7eb;">ATOMO_CONTRADICCION</strong></span>
            <span>Criterio: <strong style="color:#e5e7eb;">1.1</strong></span>
            <span>Categoría: <strong style="color:#e5e7eb;">uso_legitimo</strong></span>
            <span>Confianza: <strong style="color:#e5e7eb;">0.95</strong></span>
          </div>
          <div style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.5;">El fragmento no presenta una contradicción. El autor utiliza una construcción retórica común para anticipar una objeción ('podría parecer exagerada') y acto seguido anuncia que presentará una justificación ('pero existe una razón sencilla para defenderla'), lo cual procede a hacer en los párrafos siguientes. Esto es un uso legítimo para introducir y argumentar una postura, no una infracción de contradicción.</div>
        </div>
        <div style="background:rgba(255,255,255,.03); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:6px; font-size:.68rem; color:rgba(229,231,235,.5); text-transform:uppercase;">
            <span>Átomo: <strong style="color:#e5e7eb;">ATOMO_CONTRADICCION</strong></span>
            <span>Criterio: <strong style="color:#e5e7eb;">1.1</strong></span>
            <span>Categoría: <strong style="color:#e5e7eb;">uso_critico</strong></span>
            <span>Confianza: <strong style="color:#e5e7eb;">0.95</strong></span>
          </div>
          <div style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.5;">El autor presenta una objeción común ('Algunos responderían que...') y luego refuta esa idea con el fragmento proporcionado ('Pero una empresa crea empleo porque existe demanda...'). No se trata de una contradicción interna del autor, sino de una crítica o refutación a una postura ajena, lo cual es un uso crítico del argumento.</div>
        </div>
        <div style="background:rgba(255,255,255,.03); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:6px; font-size:.68rem; color:rgba(229,231,235,.5); text-transform:uppercase;">
            <span>Átomo: <strong style="color:#e5e7eb;">ATOMO_SOPORTE_LOGICO</strong></span>
            <span>Criterio: <strong style="color:#e5e7eb;">1.4</strong></span>
            <span>Categoría: <strong style="color:#e5e7eb;">uso_critico</strong></span>
            <span>Confianza: <strong style="color:#e5e7eb;">0.95</strong></span>
          </div>
          <div style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.5;">El fragmento activado presenta la postura de 'Algunos' (terceros) sobre la necesidad de las grandes fortunas, inmediatamente antes de que el autor la critique y la refute con argumentos propios. La frase 'Pero una empresa crea empleo porque...' deja claro que el autor no comparte ni afirma la idea presentada, sino que la expone para refutarla.</div>
        </div>
        <div style="background:rgba(255,255,255,.03); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:6px; font-size:.68rem; color:rgba(229,231,235,.5); text-transform:uppercase;">
            <span>Átomo: <strong style="color:#e5e7eb;">ATOMO_SOPORTE_LOGICO</strong></span>
            <span>Criterio: <strong style="color:#e5e7eb;">1.4</strong></span>
            <span>Categoría: <strong style="color:#e5e7eb;">uso_legitimo</strong></span>
            <span>Confianza: <strong style="color:#e5e7eb;">0.95</strong></span>
          </div>
          <div style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.5;">El autor utiliza el fragmento para presentar una premisa lógica que refuta el argumento de que las grandes fortunas son necesarias para la creación de empleo. La afirmación de que 'una empresa crea empleo porque existe demanda por sus productos, no simplemente porque alguien tenga mucho dinero' es una pieza de soporte lógico para su postura sobre la redistribución de la riqueza.</div>
        </div>
        <div style="background:rgba(255,255,255,.03); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:6px; font-size:.68rem; color:rgba(229,231,235,.5); text-transform:uppercase;">
            <span>Criterio: <strong style="color:#e5e7eb;">RUTA-INF - Ruta Inferencial</strong></span>
            <span>Categoría: <strong style="color:#e5e7eb;">uso_legitimo</strong></span>
            <span>Confianza: <strong style="color:#e5e7eb;">0.85</strong></span>
          </div>
          <div style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.5;">El fragmento constituye un ensayo argumentativo que propone un escenario hipotético y lo defiende mediante razonamientos lógicos y principios económicos ampliamente discutidos (como la utilidad marginal decreciente, la propensión marginal al consumo o la naturaleza de la creación de empleo). Si bien las generalizaciones realizadas no están respaldadas por 'datos' empíricos explícitos dentro del texto (como estadísticas o estudios específicos), se utilizan de manera legítima para construir un argumento teórico y filosófico. En este contexto de ensayo, la fundamentación de las generalizaciones radica en la lógica del argumento y en la apelación a principios conceptuales, más que en la presentación de nueva evidencia empírica. Por lo tanto, la activación de 'generalizacion_sin_dato' por Capa 1 podría considerarse un falso positivo contextual.</div>
        </div>
        <div style="background:rgba(255,255,255,.03); border-left:2px solid #ef4444; padding:10px 14px; margin-bottom:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:6px; font-size:.68rem; color:rgba(229,231,235,.5); text-transform:uppercase;">
            <span>Criterio: <strong style="color:#e5e7eb;">RUTA-INF - Ruta Inferencial</strong></span>
            <span>Categoría: <strong style="color:#e5e7eb;">infraccion_confirmada</strong></span>
            <span>Confianza: <strong style="color:#e5e7eb;">0.9</strong></span>
          </div>
          <div style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.5;">El fragmento activado afirma relaciones de causalidad ('necesariamente queda menos dinero', 'aumentaría el consumo y haría más dinámica la economía') como justificación o explicación dentro de la argumentación del autor. Aunque el texto general plantea un escenario hipotético, las afirmaciones causales específicas dentro del fragmento no se presentan como meras posibilidades hipotéticas o subjetivas, sino como consecuencias lógicas o principios económicos. Sin embargo, el documento no proporciona segmentos de dato (estadísticas, estudios, hechos concretos) que sustenten explícitamente estas afirmaciones causales, confirmando la activación del indicador 'causalidad_sin_dato'.</div>
        </div>
      </div>
    </div>

    <div class="view-section">
      <div class="view-section-title">Interpretación integral</div>
      <div style="background:var(--s-panel); border:1px solid var(--s-border); padding:14px;">
        <div style="margin-bottom:12px;">
          <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Interpretación</div>
          <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">El texto explora la idea de establecer límites a la riqueza personal a través de un experimento mental, argumentando que la acumulación excesiva puede tener implicaciones sociales negativas. SOPHIA ha identificado tres puntos de atención que invitan a una revisión de la estructura del razonamiento y la conexión entre las afirmaciones. Específicamente, los puntos de atención se centran en cómo el autor maneja las ideas opuestas y el soporte para ciertas premisas y cadenas inferenciales. Si bien dos afirmaciones específicas del texto fueron verificadas como confiables a nivel factual, los puntos de atención estructurales sugieren examinar la completitud y el respaldo de la argumentación general, más que la veracidad de los hechos aislados.</div>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Contexto</div>
          <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">El motor ha detectado señales estructurales en el argumento que, desde una perspectiva semántica, tienen un uso particular por parte del autor. Los puntos de atención en 'No Contradicción' (segmentos 2 y 9) se refieren a momentos en que el autor introduce una idea que podría verse como opuesta a su tesis principal. Sin embargo, en el contexto, esto es una estrategia retórica (proslepsis o refutación de un contraargumento) para fortalecer su postura al abordar objeciones esperadas, no una contradicción interna. Por ejemplo, al decir 'La medida podría parecer exagerada, pero...', el autor anticipa una crítica para luego justificar su posición. De manera similar, en el segmento 9, el autor refuta la idea de que las grandes fortunas son necesarias para la creación de empleo. En cuanto a la 'Integridad de las Premisas' (segmentos 8 y 9), el motor señala que las afirmaciones 'Algunos responderían que...' y su refutación ('Pero una empresa crea empleo...') carecen de un soporte explícito en el texto. Esto es relevante porque, aunque el autor cita una objeción para refutarla, la fuerza de su refutación dependería de la evidencia subyacente que no se presenta aquí. Finalmente, el punto de atención en la 'Ruta Inferencial' sobre 'generalización_sin_dato' y 'causalidad_sin_dato' se debe a que el texto funciona como un ensayo conceptual o experimento mental, partiendo de premisas que el autor asume como dadas o lógicamente evidentes dentro de su marco de razonamiento, en lugar de presentar 'datos' empíricos específicos para cada afirmación causal o generalización.</div>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Observaciones</div>
          <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">
            <div style="margin-bottom: 6px;">Las detecciones del motor en 'No Contradicción' (segmentos 2 y 9) son estructuralmente correctas al señalar la yuxtaposición de ideas. No obstante, se contextualiza que el autor las utiliza como una estrategia retórica para anticipar y refutar objeciones, lo cual no constituye una contradicción lógica en su argumento, sino un recurso persuasivo.</div>
            <div style="margin-bottom: 6px;">En cuanto a la 'Integridad de las Premisas' (segmentos 8 y 9), la detección es precisa en que el texto presenta una premisa citada (segmento 8) y su refutación (segmento 9) sin un soporte detallado dentro del documento. Si bien el segmento 8 es una objeción externa, la refutación en el segmento 9 podría beneficiarse de un mayor desarrollo o evidencia explícita para fortalecer la solidez argumentativa.</div>
            <div style="margin-bottom: 6px;">La detección de saltos en la 'Ruta Inferencial' (generalización y causalidad sin dato) se confirma. Esto refleja la naturaleza del documento como un experimento mental y una reflexión conceptual que se basa en premisas que el autor considera razonables o de conocimiento general, en lugar de un análisis empírico exhaustivo con datos explícitos para cada inferencia. Esto no anula la validez del pensamiento, pero indica que las conexiones causales y generalizaciones se basan en un marco lógico o conceptual que el lector debe considerar, en lugar de en datos presentados directamente en el documento.</div>
          </div>
        </div>
        <div>
          <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Preguntas reflexivas</div>
          <ul style="margin:0; padding-left:18px; font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">
            <li>¿De qué manera el uso de un experimento mental, como el de los '20 Ferraris', busca generar comprensión y facilitar el debate sobre un tema complejo como la desigualdad de la riqueza?</li>
            <li>¿Qué tipo de evidencia o desarrollo adicional podría el autor haber incluido para fortalecer las premisas y las cadenas causales sin perder el formato de ensayo conceptual?</li>
            <li>Considerando la naturaleza conceptual del argumento, ¿es siempre necesario que cada afirmación de causalidad o generalización tenga un 'dato' explícito en el texto, o se asume un conocimiento compartido en el público al que se dirige?</li>
            <li>¿Cómo influye la estrategia del autor de anticipar y refutar contraargumentos en la percepción de la solidez y la honestidad intelectual de su propuesta?</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="view-section">
      <div class="s-card" style="border-left:3px solid var(--accent);">
        <div class="view-eyebrow">El texto original</div>
        <h2 class="view-subtitle">Argumento evaluado</h2>
        <blockquote>
          <strong>Si nadie pudiera tener más de 20 Ferraris</strong><br><br>
          Imaginemos que una sociedad decide establecer un límite a la riqueza personal: nadie puede poseer más de 20 Ferraris ni más de 10 casas frente al mar. Todo lo que exceda esos límites debe destinarse a fines de interés público.<br><br>
          La medida podría parecer exagerada, pero existe una razón sencilla para defenderla. Una persona puede conducir un solo automóvil a la vez y habitar una sola casa. Por lo tanto, cuando alguien acumula cientos de vehículos o decenas de propiedades, una parte de esos bienes deja de cumplir una función personal y permanece fuera del alcance de quienes podrían necesitarlos.<br><br>
          Lo mismo ocurre con el dinero. Si una pequeña parte de la población concentra cantidades enormes de riqueza, necesariamente queda menos dinero disponible para el resto. Quienes poseen menos recursos consumen una proporción mayor de sus ingresos, de modo que trasladar una parte de la riqueza hacia ellos aumentaría el consumo y haría más dinámica la economía.<br><br>
          Algunos responderían que las grandes fortunas son necesarias porque los ricos invierten y crean empresas. Pero una empresa crea empleo porque existe demanda por sus productos, no simplemente porque alguien tenga mucho dinero. Si desaparecieran las grandes fortunas, otras personas podrían invertir esos mismos recursos y satisfacer las mismas necesidades.<br><br>
          Además, existe un límite evidente a la utilidad personal de la riqueza. Después de cierto nivel, disponer de más dinero ya no permite satisfacer necesidades importantes adicionales. Nadie necesita una vigésima primera Ferrari para mejorar significativamente su vida, mientras que para otra persona una fracción de ese valor podría representar una vivienda, educación o alimentación durante años.<br><br>
          Por eso, establecer un límite razonable a la riqueza no significa defender que todos deban tener exactamente lo mismo. Significa reconocer que la propiedad privada cumple una función social y que, cuando la acumulación supera ampliamente cualquier necesidad personal razonable, existe una justificación para redistribuir el excedente.<br><br>
          La pregunta, entonces, no debería ser cuánto puede acumular legalmente una persona, sino cuánto puede acumular antes de que esa acumulación deje de beneficiar principalmente a quien posee la riqueza y comience a perjudicar al resto de la sociedad.
        </blockquote>
      </div>
    </div>
  `
},
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
            ${renderBetaBanner()}
            <div class="view-eyebrow">Instrumento de Pensamiento Crítico · v${getSophiaVersion()}</div>
            <h1 class="view-title">¿Qué es SOPHIA?</h1>
            <div class="view-body">
              <p>SOPHIA es una herramienta de inteligencia artificial diseñada para ayudarte a <strong>examinar tu propio razonamiento</strong>. No pretende decirte qué pensar ni decidir si tienes razón. Su propósito es hacer visible aquello que normalmente permanece oculto cuando razonamos: nuestras premisas, evidencias, inferencias, supuestos, niveles de confianza y posibles errores.</p>
              <p>SOPHIA reconstruye tu razonamiento y te permite recorrerlo paso a paso. Puedes ver qué detectó, qué evidencia utilizó, qué fue comprobado, qué permanece incierto y dónde podría incluso haberse equivocado el propio instrumento. Porque pensar críticamente no consiste solamente en encontrar errores en las ideas de los demás. También consiste en aprender a examinar las propias.</p>
              <p>Su salida no es un veredicto, sino un <strong>mapa de razonamiento</strong> que muestra caminos sólidos, caminos inciertos, saltos, supuestos y zonas que requieren revisión. <strong>SOPHIA no piensa por ti. Te ayuda a mirar cómo estás pensando.</strong> No usa una nota (VPA no es un porcentaje de calidad): cuenta cuántos puntos de atención concretos encontró para que examines.</p>
              <p><strong>Un instrumento abierto y auditable:</strong> SOPHIA no es una caja negra. Sus criterios, mecanismos de evaluación y límites están documentados y pueden ser examinados, discutidos y modificados. No tienes que creerle a SOPHIA; puedes examinar cómo llegó a lo que te está mostrando y cuestionar sus propias evaluaciones.</p>
            </div>
            <div class="view-section">
              <div class="view-section-title">Las 5 Fases del Protocolo (Capa 1 · Motor Determinista — SophiaEngineV4)</div>
              <div class="card-grid">
                ${Object.keys(FASE_NOMBRE).map(faseId => `
                  <div class="s-card">
                    <div class="s-card-title">${FASE_NOMBRE[faseId]}</div>
                    <div class="s-card-body">${FASE_DESCRIPCION[faseId]}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="view-section">
              <div class="view-section-title">Las 4 Capas del Pipeline SOPHIA</div>
              <p style="font-size:.82rem; color:rgba(229,231,235,.65); margin-bottom:14px; line-height:1.5;">
                El motor determinista de arriba es solo la primera de cuatro capas independientes.
                Cada una responde una pregunta distinta, y ninguna modifica el resultado de las demás
                — VPA (Vale la Pena Prestar Atención), el conteo de señales detectadas, siempre
                proviene únicamente de la Capa 1.
              </p>
              <div class="card-grid">
                <div class="s-card">
                  <div class="s-card-title">Capa 1 · Motor Determinista</div>
                  <div class="s-card-body">Aplica las 5 fases y sus criterios mediante reglas públicas, sin IA. Produce VPA (los puntos de atención detectados), el nivel de riesgo y las áreas de revisión. Es el único resultado que nunca se modifica.</div>
                </div>
                <div class="s-card">
                  <div class="s-card-title">Capa 2 · Auditoría Factual</div>
                  <div class="s-card-body">Extrae afirmaciones verificables del texto y clasifica cada una: verificada, refutada, en conflicto o con evidencia insuficiente. No altera VPA — evalúa la confiabilidad de los hechos citados, no la construcción del razonamiento.</div>
                </div>
                <div class="s-card">
                  <div class="s-card-title">Capa 3 · Revisión de Falsos Positivos</div>
                  <div class="s-card-body">Una IA revisa exclusivamente el resultado de la Capa 1 — no el documento desde cero — para detectar activaciones cuestionables: negaciones, ironía, citas, hipótesis o usos metalingüísticos que el motor determinista pudo malinterpretar. Solo produce observaciones; nunca elimina ni agrega puntos de atención.</div>
                </div>
                <div class="s-card">
                  <div class="s-card-title">Capa 4 · Interpretación Semántica Integral</div>
                  <div class="s-card-body">Con el resultado de las tres capas anteriores como contexto obligatorio, una IA construye una interpretación global: qué significan los puntos de atención detectados, cómo interactúan forma y contenido, y qué preguntas reflexivas propone. Es la única capa narrativa — el resto del pipeline es estructural.</div>
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
                  <div class="s-card-body">Cualquier ciudadano puede verificar por qué SOPHIA marcó — o no marcó — un punto de atención en un texto.</div>
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
            ${renderBetaBanner()}
            <div class="view-eyebrow">Transparencia Radical</div>
            <h1 class="view-title">Open Source Cognitivo</h1>
            <div class="view-body">
              <p>El <strong>Open Source Cognitivo</strong> es el principio fundacional de SOPHIA. Todo el conocimiento que utiliza el sistema para evaluar está documentado, es público y versionable — no hay una "caja negra" que decida en secreto qué vale la pena examinar en tu texto.</p>
              <p>Esto incluye:</p>
              <ul style="color:rgba(229,231,235,.6); margin-left:20px; line-height:1.8;">
                <li><strong>Las 5 fases</strong> y sus 20 criterios (ver <a data-view="fase1" style="color:var(--accent); cursor:pointer;">Estructura Lógica</a>, <a data-view="fase2" style="color:var(--accent); cursor:pointer;">Inferencia</a>, <a data-view="fase3" style="color:var(--accent); cursor:pointer;">Calibración Epistémica</a>, <a data-view="fase4" style="color:var(--accent); cursor:pointer;">Transparencia Retórica</a> y <a data-view="fase5" style="color:var(--accent); cursor:pointer;">Pertinencia Deliberativa</a>).</li>
                <li><strong>Los 20 átomos cognitivos</strong> del motor de producción (uno por criterio) con sus indicadores y contraindicadores, distintos según el tipo de documento — ver <a data-view="atomos" style="color:var(--accent); cursor:pointer;">Átomos Cognitivos</a>.</li>
                <li><strong>La mecánica de cálculo completa</strong> — severidad, relevancia, mitigación por contraindicador, ruta inferencial — en <a data-view="formula" style="color:var(--accent); cursor:pointer;">Fórmula de Cálculo</a>.</li>
              </ul>
              <p><strong>¿Y el algoritmo de IA?</strong> No podemos explicitar completamente la implementación concreta que utiliza el modelo de lenguaje para la interpretación semántica (Capas 3 y 4), porque depende de la arquitectura del modelo y de su entrenamiento. <strong>Pero sí podemos explicitar todo lo que el motor determinista busca</strong>: los indicadores, los contraindicadores, las severidades y las condiciones que activan cada átomo — nada de eso es secreto ni cambia sin que quede documentado.</p>
              <p>Esto garantiza que, aunque la capa semántica tenga cierta libertad en la interpretación del contexto, el <strong>significado de cada punto de atención detectado</strong> es fijo y reproducible. Cualquier persona, con cualquier herramienta, puede replicar el mismo resultado aplicando las mismas reglas.</p>
            </div>
            <div class="view-section">
              <div class="view-section-title">Ejemplo de transparencia: cómo se explica una activación</div>
              <div style="background:var(--s-panel); padding:14px; border:1px solid var(--s-border); font-size:.78rem; color:rgba(229,231,235,.7); line-height:1.6;">
                Texto: <em>"El consumo de helado causa ahogamientos."</em><br>
                → Átomo <strong>ATOMO_CAUSALIDAD</strong> (criterio 2.2), perfil científico: indicador <code>"causa"</code> detectado, sin contraindicador (<code>"correlación"</code>, <code>"asociado con"</code>) en el mismo segmento → severidad 25 × relevancia 1.0 = <strong>punto de atención</strong>.<br><br>
                Texto: <em>"Existe una correlación entre el consumo de helado y los ahogamientos."</em><br>
                → Mismo átomo, pero el segmento activa el contraindicador <code>"correlación"</code> → <strong>sin punto de atención</strong>: el autor ya está siendo preciso.<br><br>
                Nada de esto es una caja negra: cualquiera puede ver por qué una oración activó un punto de atención y la otra no.
              </div>
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
                  <div class="s-card-body">Cualquier persona puede verificar por qué SOPHIA identificó — o no — un punto de atención en un texto determinado.</div>
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
        const glosario = getSophiaGlosario();
        if (glosario.length === 0) {
          return `<div class="view">${renderBetaBanner()}<h1 class="view-title">Motor no disponible</h1><p>No se pudo cargar SophiaEngineV4, así que no hay átomos que listar. Intenta recargar la página.</p></div>`;
        }

        return `
          <div class="view">
            ${renderBetaBanner()}
            <div class="view-eyebrow">Unidades mínimas de significado compartido</div>
            <h1 class="view-title">Átomos Cognitivos</h1>
            <div class="view-body">
              <p>Un <strong>átomo cognitivo</strong> no es, en sí mismo, el fondo del instrumento — es el recurso que usa cada <strong>criterio de evaluación</strong> para poder funcionar. SOPHIA tiene <strong>20 criterios</strong> (4 por cada una de las 5 fases) y <strong>20 átomos</strong>, uno por criterio (cardinalidad 1:1). Cada átomo representa un concepto operacional que el motor determinista (<code>SophiaEngineV4</code>) busca en el texto.</p>
              <p>Ningún átomo es, por defecto, "un error". Cada uno se define con dos listas: <strong style="color:#ef4444;">indicadores</strong> (patrones que sugieren que vale la pena examinar ese punto) y <strong style="color:#22c55e;">contraindicadores</strong> (patrones que, si aparecen, matizan o anulan esa sospecha — por ejemplo, citar una fuente mitiga la falta de trazabilidad). Un átomo nunca resta puntos de un "puntaje" — contribuye a VPA: el conteo de puntos de atención reales que quedan en pie después de aplicar los contraindicadores.</p>
              <p>Además, SOPHIA clasifica cada documento por naturaleza (Científico, Argumentativo, Político, Informativo, Normativo) antes de evaluar — y cada átomo tiene una <strong>definición distinta por tipo de documento</strong>: lo que cuenta como falta de evidencia en un paper científico no es lo mismo que en un discurso político. Eso es lo que llamamos "perfiles contextuales".</p>
            </div>
            <div class="view-section">
              <div class="view-section-title">Los 20 átomos</div>
              <div style="max-height:480px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
                ${glosario.map(a => {
                  const perfiles = Object.keys(a.perfiles);
                  return `
                  <div style="border-bottom:1px solid rgba(255,255,255,.06); padding:10px 0;">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; flex-wrap:wrap;">
                      <span style="color:var(--accent); font-weight:500; cursor:pointer;" data-atomo="${a.id}">${a.id}</span>
                      <span style="font-size:.65rem; color:rgba(229,231,235,.35);">${a.criterio} · ${a.nombreFase}</span>
                    </div>
                    <div style="font-size:.75rem; color:rgba(229,231,235,.6); margin:4px 0;">${a.definicion}</div>
                    <div style="font-size:.62rem; color:rgba(229,231,235,.3);">Perfiles definidos: ${perfiles.join(', ')}</div>
                  </div>
                `;}).join('')}
              </div>
              <div style="margin-top:12px; font-size:.7rem; color:rgba(229,231,235,.3);">
                Total de átomos: ${glosario.length} (motor único: SophiaEngineV4). Toca cualquier ID para ver su definición completa.
              </div>
            </div>
            <div class="view-section">
              <div class="view-section-title">Ejemplo trabajado: ATOMO_CAUSALIDAD (criterio 2.2)</div>
              <div class="view-body">
                <p>Es el átomo más ilustrativo de por qué la polaridad importa. En un texto <strong>científico</strong>, sus indicadores son palabras como "hipótesis causal", "variable independiente", "causa", "provoca" — pero si en la misma oración aparece un contraindicador como "correlación" o "asociado con", la señal se atenúa: el propio autor está distinguiendo correlación de causalidad, que es justamente la buena práctica que este criterio busca.</p>
                <p>En un <strong>ensayo argumentativo</strong>, en cambio, la relevancia de este mismo átomo baja de 1.0 a 0.5 y su severidad de 25 a 5 puntos — porque una relación "conceptual" o explicativa entre ideas ("esto se deriva de", "fundamenta") no exige el mismo estándar de prueba que una afirmación empírica. Mismo átomo, mismo criterio, exigencia distinta según qué tipo de texto es.</p>
              </div>
            </div>
            <div class="view-section">
              <div class="view-section-title">Función dentro del instrumento</div>
              <div class="view-body">
                <p>Un átomo se activa cuando SOPHIA encuentra uno de sus indicadores en un segmento del texto. Si además encuentra un contraindicador en un segmento relacionado, la observación queda marcada como mitigada y no se cuenta como punto de atención. Lo que sí se activa queda registrado con severidad y relevancia — internas, para priorizar — pero lo que ves como VPA es el conteo de puntos de atención, no una nota.</p>
                <p>Esta arquitectura permite que la evaluación sea <strong>transparente y replicable</strong>: cualquier persona puede inspeccionar qué átomo se activó, con qué indicador, si fue mitigado, y por qué eso generó — o no — un punto de atención.</p>
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
            ${renderBetaBanner()}
            <div class="view-eyebrow">Mecánica de Detección · SophiaEngineV4</div>
            <h1 class="view-title">¿Cómo llega SOPHIA a un punto de atención?</h1>
            <div class="view-body">
              <p>SOPHIA no le pone una nota al texto. Por dentro calcula una severidad por cada señal — sirve para priorizar y mantener trazabilidad — pero lo único que se te muestra es <strong>VPA (Vale la Pena Prestar Atención)</strong>: cuántos puntos de atención reales quedan en pie después de aplicar los contraindicadores. VPA nunca es un porcentaje de calidad.</p>
            </div>

            <div class="view-section">
              <div class="view-section-title">Paso 1 — Clasificación documental</div>
              <div class="view-body">
                <p>Antes de evaluar nada, SOPHIA clasifica el texto en una de cinco naturalezas: <strong>Científica (SC)</strong>, <strong>Argumentativa (ARG)</strong>, <strong>Política/deliberativa (POL)</strong>, <strong>Informativa (INF)</strong> o <strong>Normativa (NORM)</strong> — puede ser híbrido, con una naturaleza secundaria. Esto importa porque cada átomo tiene una definición y una severidad distintas según el tipo de documento: exigirle a un ensayo filosófico el mismo estándar de evidencia empírica que a un paper científico sería un error de calibración, no de razonamiento.</p>
              </div>
            </div>

            <div class="view-section">
              <div class="view-section-title">Paso 2 — Segmentación y detección de átomos</div>
              <div class="view-body">
                <p>El texto se divide en segmentos (oraciones o cláusulas). Cada uno de los 20 átomos busca sus <strong style="color:#ef4444;">indicadores</strong> (patrones de riesgo) en cada segmento, usando el perfil que corresponde a la naturaleza documental detectada. Si un segmento activa un indicador, SOPHIA revisa si en ese mismo segmento — o uno cercano — también aparece un <strong style="color:#22c55e;">contraindicador</strong>. Si aparece, la observación queda marcada <code>mitigado_por_contraindicador: true</code> y <strong>no se convierte en un punto de atención</strong>.</p>
              </div>
            </div>

            <div class="view-section">
              <div class="view-section-title">Paso 3 — Severidad (uso interno, no se muestra como nota)</div>
              <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border); font-family:monospace; font-size:.85rem; color:#e5e7eb; margin-bottom:16px;">
                <div>severidad(observación) = severidad_base<sub>átomo,perfil</sub> × relevancia<sub>átomo,perfil</sub></div>
                <div style="margin-top:6px;">severidad(criterio) = min( ∑ severidad(observación), 25 )</div>
                <div style="margin-top:8px; color:rgba(229,231,235,.5); font-size:.7rem;">
                  • severidad_base: entre 5 y 25 según el átomo y el perfil documental (más alto en criterios como Causalidad Rigurosa o Falsabilidad en textos científicos)<br>
                  • relevancia: entre 0.5 y 1.0 — qué tan determinante es ese átomo para ese tipo de documento (ej: Causalidad tiene relevancia 1.0 en textos científicos, pero solo 0.5 en ensayos)<br>
                  • Un átomo con contraindicador activo nunca llega a sumar severidad — queda descartado antes de este cálculo, no después
                </div>
              </div>
            </div>

            <div class="view-section">
              <div class="view-section-title">Paso 4 — Ruta inferencial (exclusivo de Fase 2)</div>
              <div class="view-body">
                <p>Además de los 20 átomos, SOPHIA reconstruye la <strong>ruta inferencial</strong> del texto: Dato → Interpretación → Causalidad → Generalización → Propuesta. Cada segmento se etiqueta según qué función cumple. Si el texto afirma causalidad o generalización sin que haya segmentos de dato que las sustenten, o propone algo sin fundamento previo, SOPHIA lo marca como un <strong>salto</strong> — no como una mentira, sino como un tramo del razonamiento que conviene revisar.</p>
                <div style="background:var(--s-panel); padding:12px; border:1px solid var(--s-border); font-size:.72rem; color:rgba(229,231,235,.6);">
                  <strong>causalidad_sin_dato</strong> (10 pts) · <strong>generalizacion_sin_dato</strong> (10 pts) · <strong>propuesta_sin_fundamento</strong> (15 pts) — tope combinado: 25 pts, igual que cualquier criterio.
                </div>
              </div>
            </div>

            <div class="view-section">
              <div class="view-section-title">Ejemplo real: Causalidad Rigurosa (2.2) en un texto científico</div>
              <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border);">
                <div style="font-size:.78rem; color:rgba(229,231,235,.75); line-height:1.6;">
                  <strong>Átomo:</strong> ATOMO_CAUSALIDAD · <strong>Perfil:</strong> Científico (SC)<br>
                  <strong>Indicadores:</strong> "hipótesis causal", "variable independiente", "causa", "provoca", "genera"<br>
                  <strong>Contraindicadores:</strong> "correlación", "asociado con", "coincide con"<br>
                  <strong>severidad_base:</strong> 25 · <strong>relevancia:</strong> 1.0<br><br>
                  <em>"El consumo de helado causa ahogamientos."</em> → activa "causa" sin contraindicador cerca → severidad = 25 × 1.0 = 25 → <strong>punto de atención</strong>.<br><br>
                  <em>"Existe una correlación entre el consumo de helado y los ahogamientos."</em> → activa "correlación", que es justamente un contraindicador, no un indicador → <strong>sin punto de atención</strong>. El autor está siendo preciso, no impreciso.
                </div>
              </div>
            </div>

            <div class="view-section">
              <div class="view-section-title">Los 20 criterios (con severidad base y relevancia por perfil)</div>
              <p style="font-size:.72rem; color:rgba(229,231,235,.45); margin-bottom:8px;">
                Motor único: SophiaEngineV4. Ver la sección <strong>Átomos Cognitivos</strong> para el detalle completo de indicadores y contraindicadores de cada uno.
              </p>
              ${(() => {
                const glosario = getSophiaGlosario();
                if (glosario.length === 0) return `<p style="font-size:.75rem; color:rgba(229,231,235,.4);">Motor no disponible — no se pudo cargar SophiaEngineV4.</p>`;
                return `<div style="max-height:300px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
                  ${glosario.map(a => `
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,.05); padding:5px 0; gap:8px;">
                      <span style="color:var(--accent); font-weight:500; width:110px; flex-shrink:0;">${a.criterio}</span>
                      <span style="font-size:.72rem; color:rgba(229,231,235,.55); flex:1;">${a.nombreCriterio}</span>
                      <span style="font-size:.62rem; color:rgba(229,231,235,.35);">${Object.entries(a.perfiles).map(([p, v]) => `${p}:${v.severidad_base}`).join(' · ')}</span>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top:8px; font-size:.65rem; color:rgba(229,231,235,.3);">Total: ${glosario.length} criterios / átomos.</div>`;
              })()}
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
              <p>Antes de que un documento llegue a discutirse en el <strong>Ágora</strong>, SOPHIA lo examina como <strong>instrumento de pensamiento crítico</strong>: no decide si el argumento es correcto ni le pone una nota — identifica qué partes de su razonamiento vale la pena que la ciudadanía revise con más cuidado antes de deliberar sobre él.</p>
              <p>Los documentos con pocos puntos de atención sin mitigar pueden ser sometidos a discusión en el <strong>Ágora</strong>, donde la ciudadanía delibera y vota su inclusión en el repositorio académico. Internamente, este umbral de admisibilidad se calcula sobre el mismo campo <code>IRD_global</code> que ya usaba el sistema — se conserva por compatibilidad con Ágora y con la telemetría existente, pero es un mecanismo de filtrado entre módulos, no la métrica que SOPHIA le muestra a la persona que escribió el texto.</p>
            </div>
            <div class="view-section">
              <div class="view-section-title">Estándar Mínimo de Admisibilidad (uso interno)</div>
              <div class="score-list">
                <div class="score-row">
                  <span class="score-label">Umbral interno (Ágora)</span>
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
              <p>Ingresa un texto para que SOPHIA identifique <strong>puntos de atención (VPA)</strong> en su razonamiento. SOPHIA examina las 5 fases y 20 criterios del protocolo, con sus átomos cognitivos correspondientes.</p>
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

      // Enlaces cruzados dentro del contenido (ej: "ver Átomos Cognitivos" en
      // Open Source). Delegación de eventos: como el contenido se reemplaza
      // por completo en cada navigate(), un listener fijo en #viewContent
      // sigue funcionando para cualquier [data-view] que se inyecte después,
      // sin tener que volver a bindear cada vez.
      if (!contentArea.dataset.crossLinksBound) {
        contentArea.addEventListener('click', (e) => {
          const link = e.target.closest('[data-view]');
          if (link && contentArea.contains(link)) {
            e.preventDefault();
            this.navigate(link.dataset.view);
          }
        });
        contentArea.dataset.crossLinksBound = 'true';
      }

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
      root.querySelectorAll('[data-atomo]').forEach(el => {
        el.style.cursor = 'pointer';
        el.style.color = '#d97706';
        el.addEventListener('click', () => {
          const atomoId = el.dataset.atomo;
          const glosario = getSophiaGlosario();
          const atomo = glosario.find(a => a.id === atomoId);
          const def = atomo ? `${atomo.definicion} (criterio ${atomo.criterio} — ${atomo.nombreCriterio})` : 'Definición no disponible (el motor no está cargado o el átomo no existe en SophiaEngineV4).';
          showDefinitionPopup(`Átomo: ${atomoId}`, def);
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

if (text.length > 5000) {
  out.innerHTML = `
    <div style="margin-top:16px; padding:16px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px;">
      <p style="color:#ef4444; font-size:.82rem; margin:0 0 8px 0;">
        El texto supera el límite permitido.
      </p>
      <p style="color:rgba(229,231,235,.65); font-size:.78rem; line-height:1.5; margin:0;">
        SOPHIA permite analizar documentos de hasta 5.000 caracteres.
        Tu texto contiene ${text.length.toLocaleString('es-CL')} caracteres.
        Reduce el texto e inténtalo nuevamente.
      </p>
    </div>`;
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

  if (
    data &&
    data.metadata &&
    data.metadata.module_versions &&
    data.metadata.module_versions.protocol
  ) {
    SOPHIA_BACKEND_VERSION =
      data.metadata.module_versions.protocol;
  }

  console.log(
    "📥 Datos recibidos del servidor:",
    data
  );

} else {

  let errorData = null;

  try {
    errorData = await response.json();
  } catch (parseError) {
    console.warn(
      "⚠️ La respuesta de error no contiene JSON válido."
    );
  }

  /*
   * ==========================================================
   * LÍMITE DIARIO DE IA
   * ==========================================================
   *
   * IMPORTANTE:
   * Este caso NO debe activar el motor local.
   */

  if (
    response.status === 429 &&
    errorData &&
    errorData.code === "AI_DAILY_LIMIT_REACHED"
  ) {

    console.warn(
      "⚠️ Límite diario de IA alcanzado."
    );

    out.innerHTML = `
      <div style="
        margin-top:16px;
        padding:20px;
        background:var(--s-panel);
        border:1px solid var(--s-border);
        border-radius:4px;
        line-height:1.6;
      ">
        <p style="
          color:var(--accent);
          font-size:1rem;
          margin:0 0 14px 0;
          font-weight:600;
        ">
          LogoDemocracy está en etapa Beta.
        </p>

        <p style="
          color:rgba(229,231,235,.85);
          font-size:.9rem;
          margin:0 0 12px 0;
        ">
          Estamos desarrollando y calibrando nuestros instrumentos
          de inteligencia artificial con recursos propios. Para
          mantener controlado el uso mientras realizamos esta etapa
          de calibración, existe un límite diario de procesamiento.
        </p>

        <p style="
          color:rgba(229,231,235,.85);
          font-size:.9rem;
          margin:0 0 12px 0;
        ">
          El límite de hoy ya fue alcanzado.
        </p>

        <p style="
          color:rgba(229,231,235,.85);
          font-size:.9rem;
          margin:0 0 12px 0;
        ">
          Puedes volver a utilizar este instrumento a partir de las
          00:00 horas del próximo día.
        </p>

        <p style="
          color:rgba(229,231,235,.85);
          font-size:.9rem;
          margin:0;
        ">
          Gracias por ayudarnos a desarrollar y calibrar LogoDemocracy.
        </p>
      </div>
    `;

    /*
     * Salir inmediatamente del flujo interno.
     * Esto evita que data quede null y active
     * evaluateWithBestAvailableEngine().
     */
    return;
  }

  /*
   * Para otros errores HTTP se conserva el comportamiento anterior:
   * SOPHIA podrá utilizar el motor local.
   */

  console.warn(
    `⚠️ /api/sophia/evaluate respondió ${response.status}, usando motor local.`
  );
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
              vpa_conteo: evaluationData && evaluationData.vpa ? evaluationData.vpa.conteo : null,
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

      if (data.motor_no_disponible) {
        out.innerHTML = `
          <div class="view">
            ${renderBetaBanner()}
            <div style="background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.3); padding:16px; border-radius:4px;">
              <div style="font-weight:500; color:#ef4444; margin-bottom:6px;">El motor determinista no está disponible ahora mismo</div>
              <div style="font-size:.82rem; color:rgba(229,231,235,.7);">
                No pudimos evaluar este texto porque SophiaEngineV4 ${data.motivo === 'error' ? `falló (${data.detalle || 'error desconocido'})` : 'no se cargó correctamente'}. Esto <strong>no significa</strong> que el texto no tenga puntos de atención — significa que SOPHIA no pudo revisarlo. Intenta de nuevo en unos momentos.
              </div>
            </div>
          </div>`;
        return;
      }

      // El IRD_global sigue calculándose internamente (compatibilidad con
      // Ágora/telemetría vía data.IRD_global), pero ya no es lo que se
      // muestra como resultado principal. VPA es una relectura de los
      // mismos hallazgos: cuenta señales, no califica al texto.
      const vpa = data.vpa || computeVPA(data.fases || []);
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
              <div style="font-size:.7rem; color:rgba(229,231,235,.4); text-transform:uppercase; letter-spacing:.05em;">VPA — Vale la Pena Prestar Atención</div>
              <div style="font-size:1.9rem; font-weight:600; color:var(--accent);">${vpa.conteo} <span style="font-size:1rem; color:rgba(229,231,235,.6); font-weight:400;">${vpa.conteo === 1 ? 'punto de atención' : 'puntos de atención'}</span></div>
              <div style="font-size:.75rem; color:rgba(229,231,235,.45); margin-top:2px;">${vpa.categoria}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:.7rem; color:rgba(229,231,235,.4); text-transform:uppercase; letter-spacing:.05em;">Nivel de riesgo</div>
              <div style="font-size:1.1rem; font-weight:600; color:${riesgoColor};">${nivelRiesgo}</div>
            </div>
          </div>
          <div style="font-size:.75rem; color:rgba(229,231,235,.4); margin-top:8px;">SOPHIA no califica si este razonamiento es bueno o malo. Señala qué partes vale la pena examinar con más cuidado.</div>
        </div>

        ${esV4 && data.rutas_evaluadas && data.rutas_evaluadas.saltos_detectados.length > 0 ? `
        <div class="view-section">
          <div class="view-section-title">Ruta inferencial: saltos detectados</div>
          <div style="font-size:.68rem; color:rgba(229,231,235,.35); margin-bottom:8px;">Ruta esperada: ${data.rutas_evaluadas.ruta_esperada.join(' → ')}</div>
          ${data.rutas_evaluadas.saltos_detectados.map(s => `
            <div style="background:var(--s-panel); border-left:2px solid #eab308; padding:10px 14px; margin-bottom:8px;">
              <div style="font-size:.8rem; color:#e5e7eb;">${s.descripcion}</div>
              <div style="font-size:.68rem; color:#eab308; margin-top:2px;">señal de atención</div>
            </div>
          `).join('')}
        </div>` : ''}

        <div class="view-section">
          <div class="view-section-title">¿En qué dimensiones encontró SOPHIA algo que vale la pena examinar?</div>
          ${fases.map(f => {
            const n = (f.infracciones || []).length;
            return `
            <div style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; font-size:.8rem; margin-bottom:4px;">
                <span style="color:#e5e7eb;">${f.nombre || 'Fase'}</span>
                <span style="color:${n === 0 ? 'rgba(229,231,235,.4)' : 'var(--accent)'};">${n === 0 ? 'Sin puntos de atención' : (n === 1 ? '1 punto de atención' : n + ' puntos de atención')}</span>
              </div>
              <div style="background:rgba(255,255,255,.06); height:6px; border-radius:3px; overflow:hidden;">
                <div style="width:${n === 0 ? '0' : '100'}%; height:100%; background:${n === 0 ? 'transparent' : 'var(--accent)'};"></div>
              </div>
            </div>
          `;}).join('')}
        </div>

        ${hayInfracciones ? `
          <div class="view-section">
            <div class="view-section-title">Puntos de atención</div>
            ${fases.filter(f => (f.infracciones || []).length > 0).map(f => `
              <div style="margin-bottom:16px;">
                <div style="font-size:.75rem; color:var(--accent); margin-bottom:6px;">${f.nombre}</div>
                ${f.infracciones.map(inf => `
                  <div style="background:var(--s-panel); border-left:2px solid ${inf.mitigado_parcialmente ? '#eab308' : 'var(--accent)'}; padding:10px 14px; margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; font-size:.8rem; gap:8px;">
                      <span style="color:#e5e7eb;">${inf.criterio || 'Criterio sin nombre'}</span>
                      <span style="color:rgba(229,231,235,.5); white-space:nowrap;">${inf.mitigado_parcialmente ? 'señal contextualizada' : 'vale la pena examinar'}</span>
                    </div>
                    <div style="font-size:.7rem; color:rgba(229,231,235,.4); margin-top:4px;">Átomo: <span style="cursor:pointer; text-decoration:underline dotted;" data-atomo="${inf.constructo}">${inf.constructo || 'N/A'}</span></div>
                    ${inf.meta_regla_aplicada ? `<div style="font-size:.65rem; color:#eab308; margin-top:4px;">⚠ ${inf.meta_regla_aplicada}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="view-section">
            <p style="color:#22c55e;">✅ SOPHIA no identificó puntos de atención según el protocolo — no es un veredicto de que el razonamiento sea correcto, solo que no se detectaron las señales que este instrumento busca.</p>
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
          <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">${sanitizeVPALanguage(data.gemini_review.interpretacion, data.vpa ? data.vpa.conteo : undefined)}</div>
        </div>` : ''}
      ${data.gemini_review.contexto ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Contexto</div>
          <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">${sanitizeVPALanguage(data.gemini_review.contexto, data.vpa ? data.vpa.conteo : undefined)}</div>
        </div>` : ''}
      ${data.gemini_review.observaciones ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Observaciones</div>
          <div style="font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">
            ${Array.isArray(data.gemini_review.observaciones)
              ? data.gemini_review.observaciones.map(o => `<div style="margin-bottom: 6px;">${typeof o === 'string' ? sanitizeVPALanguage(o, data.vpa ? data.vpa.conteo : undefined) : `<strong style="color:#e5e7eb;">${o.tipo || ''}${o.tipo ? ':' : ''}</strong> ${sanitizeVPALanguage(o.detalle || o.texto || JSON.stringify(o), data.vpa ? data.vpa.conteo : undefined)}`}</div>`).join('')
               : sanitizeVPALanguage(data.gemini_review.observaciones, data.vpa ? data.vpa.conteo : undefined)}
          </div>
        </div>` : ''}
      ${(data.gemini_review.preguntas_reflexivas && Array.isArray(data.gemini_review.preguntas_reflexivas) && data.gemini_review.preguntas_reflexivas.length > 0) ? `
        <div>
          <div style="font-size:.75rem; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">Preguntas reflexivas</div>
          <ul style="margin:0; padding-left:18px; font-size:.8rem; color:rgba(229,231,235,.85); line-height:1.6;">
            ${data.gemini_review.preguntas_reflexivas.map(p => `<li>${p}</li>`).join('')}
          </ul>
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
      this.navigate('analisis');
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


