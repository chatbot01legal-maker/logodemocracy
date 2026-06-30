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
      <div class="vie
