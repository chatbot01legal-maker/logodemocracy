/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Protocolo Abierto de Comunicación Deliberativa
   v3.0 — Ontología Pública de la Deliberación
   ═══════════════════════════════════════════════════════ */

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

// ─── MECÁNICA DE CÁLCULO ──────────────────────────────

function evaluateText(text) {
  if (!text || text.trim().length === 0) return null;

  const oraciones = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const palabras = text.toLowerCase().split(/\s+/);

  const resultados = {
    fases: [],
    infracciones: [],
    evidencias: [],
    puntajes_fase: {},
    IRD_global: 0,
    riesgo: "Normal"
  };

  let penalizacion_total = 0;
  let total_criterios = 0;
  let nivel3_count = 0;

  // Recorrer cada fase y criterio
  PROTOCOL.fases.forEach(fase => {
    let penalizacion_fase = 0;
    let criterios_evaluados = 0;
    let infracciones_fase = [];

    fase.criterios.forEach(criterio => {
      let penalizacion_criterio = 0;
      let atomos_activados = [];

      // Para cada átomo, buscar patrones en el texto
      criterio.atomos.forEach(atom => {
        if (atom.patrones && atom.patrones.length > 0) {
          let frecuencia = 0;
          const patrones_unicos = [...new Set(atom.patrones)];
          patrones_unicos.forEach(p => {
            const regex = new RegExp(`\\b${p}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) frecuencia += matches.length;
          });
          if (frecuencia > 0) {
            // Contar en cuántas oraciones aparece al menos una vez
            let oraciones_con_atomo = 0;
            oraciones.forEach(ora => {
              const lower = ora.toLowerCase();
              if (patrones_unicos.some(p => lower.includes(p))) {
                oraciones_con_atomo++;
              }
            });
            // Frecuencia = número de oraciones donde aparece (unidad argumentativa)
            const freq = oraciones_con_atomo;
            if (freq > 0) {
              const penalizacion_atomo = criterio.severidad * freq;
              penalizacion_criterio += penalizacion_atomo;
              atomos_activados.push({ atomo: atom.id, frecuencia: freq, severidad: criterio.severidad });
              // Guardar evidencia textual (primeras 3 ocurrencias)
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
        }
      });

      // Aplicar tope de 25 por criterio
      penalizacion_criterio = Math.min(penalizacion_criterio, 25);

      if (penalizacion_criterio > 0) {
        infracciones_fase.push({
          criterio: `${criterio.id} - ${criterio.nombre}`,
          constructo: criterio.constructo,
          penalizacion: penalizacion_criterio,
          atomos_activados: atomos_activados
        });
        penalizacion_fase += penalizacion_criterio;
        if (penalizacion_criterio === 25) nivel3_count++;
      }

      criterios_evaluados++;
    });

    // Aplicar meta-reglas (ej. mitigación por incertidumbre)
    // Simulación: si fase3.criterio 3.2 tiene penalización baja, mitigamos fase4.criterio 4.2
    if (fase.id === "fase4" && resultados.puntajes_fase["fase3"] && resultados.puntajes_fase["fase3"] > 80) {
      // Buscar infracción de 4.2 y reducir a la mitad
      const infra42 = infracciones_fase.find(inf => inf.criterio.startsWith("4.2"));
      if (infra42) {
        infra42.penalizacion = infra42.penalizacion * 0.5;
        infra42.meta_regla_aplicada = "MR-001 (Mitigación por Incertidumbre)";
        // Recalcular penalización fase
        penalizacion_fase = infracciones_fase.reduce((acc, inf) => acc + inf.penalizacion, 0);
      }
    }

    // Puntaje de fase: 100 - penalización_fase (con mínimo 0)
    let puntaje_fase = Math.max(0, 100 - penalizacion_fase);
    // Si no hay infracciones, puntaje = 100
    if (infracciones_fase.length === 0) puntaje_fase = 100;
    resultados.puntajes_fase[fase.id] = Math.round(puntaje_fase);
    resultados.fases.push({
      id: fase.id,
      nombre: fase.nombre,
      puntaje: Math.round(puntaje_fase),
      infracciones: infracciones_fase
    });
    penalizacion_total += penalizacion_fase;
    total_criterios += criterios_evaluados;
  });

  // IRD global: promedio de puntajes de fase
  const puntajes = Object.values(resultados.puntajes_fase);
  const ird = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
  resultados.IRD_global = Math.round(ird);

  // Etiqueta de riesgo
  if (nivel3_count >= 4) resultados.riesgo = "Riesgo Extremo";
  else if (nivel3_count >= 3) resultados.riesgo = "Alta Fragilidad";
  else if (nivel3_count >= 2) resultados.riesgo = "Atención";
  else resultados.riesgo = "Normal";

  return resultados;
}


// ─── VISTAS ────────────────────────────────────────────

function renderFase(faseId) {
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
              Constructo: <strong style="color: var(--accent);">${c.constructo}</strong>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              ${c.atomos.map(a => `<span style="background: rgba(59,130,246,.12); padding: 2px 8px; border-radius: 12px; font-size: 0.6rem; color: var(--accent);">${a.id}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── VISTAS PREEXISTENTES (actualizadas) ──────────────

const VIEWS = {

  inicio: {
    title: 'Sophia — Protocolo Abierto de Comunicación Deliberativa',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Marco de Evaluación Deliberativa · v3.0</div>
        <h1 class="view-title">¿Qué es SOPHIA?</h1>
        <div class="view-body">
          <p>SOPHIA es un <strong>protocolo abierto de comunicación deliberativa</strong> (RFC de la racionalidad pública). No evalúa la verdad del contenido, sino la <strong>legitimidad del proceso argumentativo</strong>.</p>
          <p>Se fundamenta en una <strong>gramática formal de la deliberación</strong>: un sistema de reglas, átomos semánticos y meta-reglas que cualquier ciudadano puede auditar, debatir y versionar.</p>
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
      </div>`
  },

  opensource: {
    title: 'Open Source Cognitivo',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Infraestructura Transparente</div>
        <h1 class="view-title">Open Source Cognitivo</h1>
        <div class="view-body">
          <p>Todo criterio, regla o átomo semántico utilizado por SOPHIA es <strong>público, versionable y auditable</strong>.</p>
          <p>La ciudadanía puede inspeccionar cada fase, cada constructo y cada definición operacional. Puede proponer modificaciones, debatir mejoras y observar el historial de cambios.</p>
          <p>SOPHIA misma es deliberable: sus reglas pueden ser enmendadas mediante los mecanismos de la <strong>Academia</strong> y el <strong>Ágora</strong>.</p>
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

      // Tomamos una muestra representativa (los primeros 8)
      const muestra = todosAtomos.slice(0, 8);

      return `
        <div class="view">
          <div class="view-eyebrow">El Glosario Constitucional</div>
          <h1 class="view-title">Átomos Semánticos</h1>
          <div class="view-body">
            <p>Los <strong>átomos cognitivos</strong> son las unidades mínimas de significado del protocolo. Cada uno tiene una definición operacional y, para la evaluación automática, un conjunto de patrones lingüísticos.</p>
            <p>Se organizan en 20 criterios distribuidos en 5 fases. A continuación se muestra una selección representativa.</p>
          </div>
          <div class="view-section">
            <div class="view-section-title">Muestra del Repositorio de Átomos</div>
            <div class="atom-grid">
              ${muestra.map(a => `
                <div class="atom-card">
                  <div class="atom-header">
                    <span class="atom-name">${a.id.toUpperCase()}</span>
                    <span class="atom-version">v1.0</span>
                  </div>
                  <div class="atom-def">${a.definicion}</div>
                  <div style="font-size:0.6rem; color: rgba(229,231,235,.3); margin-top:6px;">
                    <span>Fase: ${a.fase}</span> • <span>Criterio: ${a.criterio}</span>
                  </div>
                  ${a.patrones && a.patrones.length > 0 ? `
                    <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px;">
                      ${a.patrones.map(p => `<span style="background: rgba(59,130,246,.08); padding: 1px 6px; border-radius: 10px; font-size: 0.55rem; color: var(--accent);">${p}</span>`).join('')}
                    </div>
                  ` : `<div style="margin-top: 8px; font-size:0.55rem; color: rgba(229,231,235,.2);">(sin patrones definidos)</div>`}
                </div>
              `).join('')}
            </div>
            <div style="margin-top: 12px; font-size: 0.7rem; color: rgba(229,231,235,.3);">
              Total de átomos en el protocolo: ${todosAtomos.length}
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
  },

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
  }
};

// ─── SPA ROUTER ────────────────────────────────────────

const SOPHIA = {
  current: 'inicio',

  navigate(id) {
    const view = VIEWS[id];
    if (!view) return;
    this.current = id;

    document.getElementById('viewTitle').textContent = view.title;
    const content = document.getElementById('viewContent');
    content.innerHTML = view.render();

    this._animateBars(content);

    if (id === 'informe') this._bindEval();

    document.querySelectorAll('.snav-item[data-view]').forEach(el => {
      el.classList.toggle('active', el.dataset.view === id);
    });

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

      out.innerHTML = `<p style="color:rgba(229,231,235,.35);font-size:.72rem;margin-top:12px;">Analizando adherencia al protocolo...</p>`;

      setTimeout(() => {
        const resultado = evaluateText(input);
        if (!resultado) {
          out.innerHTML = `<p style="color:rgba(239,68,68,.7);font-size:.78rem;">Error al evaluar el texto.</p>`;
          return;
        }

        // Construir el acta de infracción
        const fasesHTML = resultado.fases.map(f => `
          <div style="margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,.04); border-left: 2px solid ${f.puntaje >= 80 ? 'var(--q-high)' : 'var(--q-mid)'};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 500; color: #e5e7eb;">${f.nombre}</span>
              <span style="font-size: 0.9rem; color: ${f.puntaje >= 80 ? 'var(--q-high)' : 'var(--q-mid)'};">${f.puntaje}%</span>
            </div>
            ${f.infracciones.length > 0 ? `
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

        const evidenciasHTML = resultado.evidencias.slice(0, 5).map(e => `
          <div style="font-size: 0.7rem; color: rgba(229,231,235,.5); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.04);">
            <span style="color: var(--accent);">${e.atomo}</span> — “${e.fragmento}”
          </div>
        `).join('');

        out.innerHTML = `
          <div class="report-card" style="margin-top:20px;">
            <div class="report-card-header">
              <span class="report-card-title">Acta de Infracción</span>
              <span class="report-stamp">PROTOCOLO SOPHIA v3.0</span>
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

              <div style="margin: 16px 0;">
                ${fasesHTML}
              </div>

              ${resultado.evidencias.length > 0 ? `
                <div style="margin-top: 20px; padding: 14px; background: rgba(59,130,246,.05); border-left: 2px solid var(--accent);">
                  <div style="font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px;">Evidencias Textuales (muestra)</div>
                  ${evidenciasHTML}
                </div>
              ` : ''}

              <div style="font-size: 0.6rem; color: rgba(229,231,235,.2); margin-top: 12px;">
                * Evaluación determinista basada en 48 átomos y 20 criterios públicos.
              </div>
            </div>
          </div>
        `;

        SOPHIA._animateBars(out);
      }, 600);
    });
  },

  init() {
    document.querySelectorAll('.snav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.view));
    });
    this.navigate('inicio');
  }
};

document.addEventListener('DOMContentLoaded', () => SOPHIA.init());

                   
