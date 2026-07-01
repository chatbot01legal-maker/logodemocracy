/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — Protocolo Abierto de Comunicación Deliberativa
   v0.92-beta — Ontología Pública de la Deliberación
   ═══════════════════════════════════════════════════════ */

// ─── AUDITORÍA ONTOLÓGICA (auto‑validación) ──────────
function auditOntology() {
  const stats = {
    criterios: 0,
    constructos: new Set(),
    atomos: 0,
    atomos_duplicados: [],
    constructos_huérfanos: [],
    atomos_huérfanos: [],
    versiones_faltantes: [],
    referencias_invalidas: []
  };

  const atomosSet = new Set();
  const constructosSet = new Set();

  PROTOCOL.fases.forEach(fase => {
    fase.criterios.forEach(c => {
      stats.criterios++;
      if (c.constructo) constructosSet.add(c.constructo);
      c.atomos.forEach(a => {
        stats.atomos++;
        const id = a.id;
        if (atomosSet.has(id)) {
          stats.atomos_duplicados.push(id);
        } else {
          atomosSet.add(id);
        }
        if (!a.version) stats.versiones_faltantes.push(id);
        // Verificar referencias a meta-reglas
        if (c.meta_reglas_aplicables) {
          c.meta_reglas_aplicables.forEach(mr => {
            if (!META_RULES[mr]) {
              stats.referencias_invalidas.push(`Criterio ${c.id} refiere a MR ${mr} inexistente`);
            }
          });
        }
      });
    });
  });

  // Verificar constructos sin átomos
  PROTOCOL.fases.forEach(fase => {
    fase.criterios.forEach(c => {
      if (c.atomos.length === 0) {
        stats.constructos_huérfanos.push(c.constructo);
      }
    });
  });

  console.log('🔍 AUDITORÍA ONTOLÓGICA SOPHIA');
  console.log(`📊 Criterios: ${stats.criterios}`);
  console.log(`📊 Constructos: ${constructosSet.size}`);
  console.log(`📊 Átomos: ${stats.atomos}`);
  console.log(`📊 Átomos duplicados: ${stats.atomos_duplicados.length > 0 ? stats.atomos_duplicados.join(', ') : '✅ Ninguno'}`);
  console.log(`📊 Constructos huérfanos: ${stats.constructos_huérfanos.length > 0 ? stats.constructos_huérfanos.join(', ') : '✅ Ninguno'}`);
  console.log(`📊 Versiones faltantes: ${stats.versiones_faltantes.length > 0 ? stats.versiones_faltantes.join(', ') : '✅ Todas completas'}`);
  console.log(`📊 Referencias inválidas: ${stats.referencias_invalidas.length > 0 ? stats.referencias_invalidas.join('; ') : '✅ Ninguna'}`);

  const score = 100 - (stats.atomos_duplicados.length * 5 + stats.constructos_huérfanos.length * 10 + stats.versiones_faltantes.length * 2 + stats.referencias_invalidas.length * 8);
  console.log(`✅ CONSISTENCY SCORE: ${Math.max(0, score)}/100`);
  return { stats, score: Math.max(0, score) };
}

// ─── META‑REGLAS ──────────────────────────────────────
const META_RULES = {
  "MR001": {
    nombre: "Mitigación por Incertidumbre",
    condicion: (resultados) => resultados.puntajes_fase["fase3"] && resultados.puntajes_fase["fase3"] > 80,
    efecto: { criterio_afectado: "4.2", modificador: 0.5, tipo: "multiplicativo" },
    justificacion: "Si el autor declara incertidumbre, su carga emocional se interpreta como énfasis legítimo."
  },
  "MR002": {
    nombre: "Refuerzo por Falta de Steelman",
    condicion: (resultados, infracciones) => {
      const steelman = infracciones.find(i => i.criterio.startsWith("4.1"));
      return steelman && steelman.penalizacion > 0;
    },
    efecto: { criterio_afectado: "5.3", modificador: 1.5, tipo: "multiplicativo" },
    justificacion: "La ausencia de representación justa agrava la asimetría deliberativa."
  },
  "MR003": {
    nombre: "Reducción por Evidencia Robusta",
    condicion: (resultados) => {
      const evidencia = resultados.puntajes_fase["fase3"];
      return evidencia && evidencia >= 85;
    },
    efecto: { criterio_afectado: "2.3", modificador: 0.7, tipo: "multiplicativo" },
    justificacion: "Si la evidencia es sólida, la generalización es menos riesgosa."
  },
  "MR004": {
    nombre: "Atenuación por Límites Explícitos",
    condicion: (resultados, infracciones) => {
      const incertidumbre = infracciones.find(i => i.criterio.startsWith("3.2"));
      return incertidumbre && incertidumbre.penalizacion < 10;
    },
    efecto: { criterio_afectado: "5.4", modificador: 0.6, tipo: "multiplicativo" },
    justificacion: "Si el autor explicita límites, la falsabilidad es menos exigible."
  },
  "MR005": {
    nombre: "Pluralidad Explícita",
    condicion: (resultados, infracciones) => {
      const plural = infracciones.find(i => i.criterio.startsWith("5.3") && i.atomos_activados.some(a => a.atomo === "pluralidad"));
      return plural && plural.penalizacion < 5;
    },
    efecto: { criterio_afectado: "5.1", modificador: 0.8, tipo: "multiplicativo" },
    justificacion: "El reconocimiento de pluralidad reduce penalizaciones por falta de foco."
  }
};

// ─── PROTOCOLO SOPHIA v0.92-beta ─────────────────────
const PROTOCOL = {
  version: "0.92-beta",
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
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "discurso", version: "1.0", definicion: "El flujo total de enunciados emitidos por el autor.", patrones: [] },
            { id: "proposiciones", version: "1.0", definicion: "Enunciados declarativos que afirman o niegan un estado de cosas.", patrones: [] },
            { id: "excluyentes", version: "1.0", definicion: "Propiedad de dos enunciados que no pueden ser ambos verdaderos simultáneamente.", patrones: ["pero", "sin embargo", "no obstante", "aunque"] },
            { id: "resolucion", version: "1.0", definicion: "Explicación lógica que reconcilia dos elementos aparentemente opuestos.", patrones: ["por lo tanto", "en consecuencia", "de modo que"] }
          ],
          severidad: 12.5
        },
        {
          id: "1.2",
          nombre: "Continuidad Semántica",
          constructo: "Estabilidad Conceptual",
          definicion: "Evaluar la estabilidad del significado de los conceptos a lo largo del argumento.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "estabilidad", version: "1.0", definicion: "Propiedad de mantener una definición constante sin fluctuaciones.", patrones: [] },
            { id: "significado", version: "1.0", definicion: "La definición operativa asignada a un término en la primera instancia de uso.", patrones: [] },
            { id: "conceptos", version: "1.0", definicion: "Unidades léxicas que portan el peso del contenido temático.", patrones: [] },
            { id: "argumento", version: "1.0", definicion: "La serie encadenada de enunciados que buscan probar una tesis.", patrones: [] }
          ],
          severidad: 12.5
        },
        {
          id: "1.3",
          nombre: "Ausencia de Falsas Dicotomías",
          constructo: "Reducción de Complejidad",
          definicion: "Verificar si se fuerza una elección binaria ante un problema multidimensional.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "eleccion", version: "1.0", definicion: "Proceso de selección entre opciones presentadas.", patrones: ["o", "o bien", "alternativa"] },
            { id: "binaria", version: "1.0", definicion: "Estructura que reduce el espectro a solo dos posibilidades.", patrones: ["dos opciones", "dos caminos", "dos posibilidades"] },
            { id: "problema", version: "1.0", definicion: "El fenómeno central objeto de análisis.", patrones: [] },
            { id: "multidimensional", version: "1.0", definicion: "Fenómeno que requiere más de dos variables para ser comprendido.", patrones: ["complejo", "múltiples factores", "diversos aspectos"] }
          ],
          severidad: 12.5
        },
        {
          id: "1.4",
          nombre: "Integridad de las Premisas",
          constructo: "Anclaje Inferencial",
          definicion: "Asegurar que cada enunciado declarativo tenga un soporte lógico.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "enunciado", version: "1.0", definicion: "Unidad mínima de sentido completo.", patrones: [] },
            { id: "declarativo", version: "1.0", definicion: "Que afirma la existencia o realidad de algo.", patrones: [] },
            { id: "soporte", version: "1.0", definicion: "Elemento (dato, premisa, inferencia) que justifica la validez de otro.", patrones: ["porque", "ya que", "dado que"] },
            { id: "logico", version: "1.0", definicion: "Relación de necesidad entre una base y su consecuencia.", patrones: ["si... entonces", "implica", "conlleva"] }
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
          definicion: "Medir si la conclusión es proporcional a la magnitud y representatividad de las premisas.",
          peso: 25,
          meta_reglas_aplicables: ["MR003"],
          atomos: [
            { id: "conclusion", version: "1.0", definicion: "Resultado final derivado de un proceso de razonamiento.", patrones: ["en conclusión", "por lo tanto", "así pues"] },
            { id: "magnitud", version: "1.0", definicion: "Alcance cuantitativo o cualitativo de la afirmación (particular vs. universal).", patrones: ["todos", "siempre", "nunca", "nadie"] },
            { id: "premisas", version: "1.0", definicion: "Enunciados base tomados como ciertos para derivar la conclusión.", patrones: [] },
            { id: "universalizacion", version: "1.0", definicion: "Extensión de una afirmación a todo un conjunto.", patrones: ["todos", "siempre", "nunca", "nadie"] },
            { id: "extrapolacion", version: "1.0", definicion: "Inferencia más allá del dominio empírico observado.", patrones: ["extrapolando", "más allá", "fuera de"] },
            { id: "representatividad", version: "1.0", definicion: "Propiedad de una muestra que permite extender inferencias con validez.", patrones: ["representativo", "muestra", "estadísticamente"] }
          ],
          severidad: 12.5
        },
        {
          id: "2.2",
          nombre: "Causalidad Rigurosa",
          constructo: "Nexo Causal",
          definicion: "Diferenciar la correlación estadística de la causalidad demostrada.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "correlacion", version: "1.0", definicion: "Observación de dos variables que fluctúan simultáneamente.", patrones: ["correlación", "asociación", "relación"] },
            { id: "causalidad", version: "1.0", definicion: "Nexo necesario donde un evento (causa) produce mecánicamente otro (efecto).", patrones: ["causa", "provoca", "genera", "desencadena"] }
          ],
          severidad: 12.5
        },
        {
          id: "2.3",
          nombre: "Proporcionalidad Generalizadora",
          constructo: "Generalización Justificada",
          definicion: "Evitar que una anécdota se convierta en una regla universal sin respaldo.",
          peso: 25,
          meta_reglas_aplicables: ["MR003"],
          atomos: [
            { id: "anecdota", version: "1.0", definicion: "Registro de un caso singular o no representativo.", patrones: ["por ejemplo", "como en el caso de", "una vez"] },
            { id: "regla", version: "1.0", definicion: "Afirmación que pretende validez para todos los casos de un conjunto.", patrones: ["siempre", "nunca", "todos", "ninguno"] }
          ],
          severidad: 12.5
        },
        {
          id: "2.4",
          nombre: "Inmunidad a Petición de Principio",
          constructo: "Circularidad Lógica",
          definicion: "Detectar la circularidad cuando la asunción es la misma conclusión.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "circularidad", version: "1.0", definicion: "Estructura donde el final del argumento repite el inicio sin avanzar.", patrones: ["porque", "ya que", "dado que"] },
            { id: "asuncion", version: "1.0", definicion: "Premisa no demostrada que se introduce como base del razonamiento.", patrones: ["asumiendo", "suponiendo", "dando por sentado"] }
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
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "origen", version: "1.0", definicion: "Fuente documental o empírica de la información.", patrones: ["según", "fuente", "estudio", "informe"] },
            { id: "verificabilidad", version: "1.0", definicion: "Capacidad de comprobar la información mediante una fuente externa.", patrones: ["verificable", "comprobable", "contrastable"] },
            { id: "datos", version: "1.0", definicion: "Cifras, hechos o registros utilizados como evidencia.", patrones: ["%", "dato", "cifra", "número"] }
          ],
          severidad: 12.5
        },
        {
          id: "3.2",
          nombre: "Declaración de Incertidumbre",
          constructo: "Honestidad Epistémica",
          definicion: "Evaluar la honestidad en la expresión de la incertidumbre mediante modalidad epistémica, grados de confianza, alcance predictivo y condicionalidad.",
          peso: 25,
          meta_reglas_aplicables: ["MR001", "MR004"],
          atomos: [
            { id: "matiz", version: "1.0", definicion: "Modificador probabilístico (probablemente, posiblemente).", patrones: ["probablemente", "posiblemente", "quizás", "tal vez"] },
            { id: "lenguaje", version: "1.0", definicion: "El conjunto de palabras elegidas para expresar la postura.", patrones: [] },
            { id: "certeza", version: "1.0", definicion: "Ausencia de duda expresada en una predicción o hecho futuro.", patrones: ["es seguro", "indudablemente", "sin duda", "claramente"] },
            { id: "modalidad_epistemica", version: "1.0", definicion: "Expresión de posibilidad, probabilidad o necesidad (podría, es posible, sugiere).", patrones: ["podría", "es posible", "sugiere"] },
            { id: "grado_confianza", version: "1.0", definicion: "Indicación del nivel de seguridad en la afirmación (bajo, medio, alto).", patrones: ["confianza", "seguridad", "certeza"] },
            { id: "alcance_predictivo", version: "1.0", definicion: "Limitación temporal o contextual de la predicción.", patrones: ["a corto plazo", "en el futuro", "si se mantiene"] },
            { id: "condicionalidad", version: "1.0", definicion: "Expresión de dependencia de condiciones para que se cumpla la afirmación.", patrones: ["si", "en caso de", "depende de"] }
          ],
          severidad: 12.5
        },
        {
          id: "3.3",
          nombre: "Delimitación Hecho-Valor",
          constructo: "Distinción Epistémica",
          definicion: "Distinguir claramente el hecho empírico del juicio moral.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "hecho", version: "1.0", definicion: "Afirmación sobre un estado de cosas objetivo.", patrones: ["es", "está", "existe"] },
            { id: "juicio", version: "1.0", definicion: "Valoración subjetiva sobre la bondad o maldad de un hecho.", patrones: ["bueno", "malo", "justo", "injusto", "debería"] }
          ],
          severidad: 12.5
        },
        {
          id: "3.4",
          nombre: "Completitud del Contexto",
          constructo: "Integridad Contextual",
          definicion: "Auditar la omisión de variables críticas en el entorno del dato.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "variables", version: "1.0", definicion: "Elementos que afectan el comportamiento o lectura de un dato.", patrones: ["variable", "factor", "condición"] },
            { id: "entorno", version: "1.0", definicion: "Situación, época o circunstancias que rodean al dato.", patrones: ["contexto", "entorno", "circunstancia"] }
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
          peso: 25,
          meta_reglas_aplicables: ["MR002"],
          atomos: [
            { id: "argumento", version: "1.0", definicion: "Exposición de razones en contra o a favor.", patrones: ["argumento", "razón", "tesis"] },
            { id: "contrario", version: "1.0", definicion: "Postura disidente a la del emisor.", patrones: ["contrario", "opositor", "crítico", "disidente"] },
            { id: "robusta", version: "1.0", definicion: "Versión que conserva toda la fuerza lógica de la postura opuesta.", patrones: ["fortaleza", "sólido", "robusto"] }
          ],
          severidad: 12.5
        },
        {
          id: "4.2",
          nombre: "Proporcionalidad Retórica",
          constructo: "Sustitución Argumental por Activación Emocional",
          definicion: "Evaluar si la intensidad emocional del lenguaje es proporcional a la solidez de la evidencia presentada.",
          peso: 25,
          meta_reglas_aplicables: ["MR001"],
          atomos: [
            { id: "adjetivos", version: "1.0", definicion: "Modificadores que cualifican sustantivos con carga subjetiva.", patrones: ["terrible", "maravilloso", "horrible", "excelente", "lamentable"] },
            { id: "intencion", version: "1.0", definicion: "Propósito subyacente de manipular la reacción del lector.", patrones: ["manipulación", "engaño", "sesgo"] },
            { id: "hiperbole", version: "1.0", definicion: "Exageración deliberada de la magnitud de un fenómeno.", patrones: ["exagerado", "enorme", "infinito", "nunca", "siempre"] },
            { id: "dramatizacion", version: "1.0", definicion: "Uso de recursos narrativos que apelan a la emoción extrema.", patrones: ["catástrofe", "tragedia", "colapso"] },
            { id: "apelacion_moral", version: "1.0", definicion: "Invocación a principios morales como sustituto de evidencia.", patrones: ["deber", "justicia", "bien común"] },
            { id: "carga_afectiva", version: "1.0", definicion: "Intensidad emocional transmitida por el lenguaje.", patrones: ["indignante", "esperanzador", "temible"] },
            { id: "catastrofizacion", version: "1.0", definicion: "Presentación de escenarios apocalípticos sin evidencia.", patrones: ["catástrofe", "desastre", "apocalipsis"] },
            { id: "absolutizacion", version: "1.0", definicion: "Uso de términos que niegan la complejidad o la excepción.", patrones: ["siempre", "nunca", "todos", "ninguno"] }
          ],
          severidad: 12.5
        },
        {
          id: "4.3",
          nombre: "Despersonalización del Debate",
          constructo: "Separación Identidad-Argumento",
          definicion: "Separar la identidad del emisor del argumento presentado.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "identidad", version: "1.0", definicion: "Rasgos, afiliaciones o carácter del sujeto que emite el discurso.", patrones: ["yo", "mi", "nuestro", "ellos"] },
            { id: "argumento", version: "1.0", definicion: "Estructura racional que debe sostenerse por sí misma.", patrones: [] }
          ],
          severidad: 12.5
        },
        {
          id: "4.4",
          nombre: "Claridad Denotativa",
          constructo: "Precisión Léxica",
          definicion: "Evaluar la definibilidad, operacionalización, ambigüedad, vaguedad y referencialidad del lenguaje.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "palabras", version: "1.0", definicion: "Unidades léxicas usadas para transmitir conceptos.", patrones: [] },
            { id: "ambiguas", version: "1.0", definicion: "Términos que admiten múltiples interpretaciones sin definición operacional.", patrones: ["justo", "bueno", "libertad", "democracia", "igualdad"] },
            { id: "definibilidad", version: "1.0", definicion: "Capacidad de definir claramente un término dentro del discurso.", patrones: ["definimos", "entendemos por"] },
            { id: "operacionalizacion", version: "1.0", definicion: "Grado en que un concepto se traduce en criterios observables.", patrones: ["medible", "cuantificable", "indicador"] },
            { id: "vaguedad", version: "1.0", definicion: "Uso de términos imprecisos que dificultan la comprensión.", patrones: ["más o menos", "aproximadamente", "cierto"] },
            { id: "referencialidad", version: "1.0", definicion: "Capacidad de referirse a entidades o hechos concretos.", patrones: [] }
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
          peso: 25,
          meta_reglas_aplicables: ["MR005"],
          atomos: [
            { id: "tangente", version: "1.0", definicion: "Tema introducido que no altera lógicamente la conclusión del núcleo.", patrones: ["digresión", "tangente", "fuera de tema"] },
            { id: "nucleo", version: "1.0", definicion: "El problema central definido explícitamente en el inicio del intercambio.", patrones: ["objeto", "propósito", "tema central"] }
          ],
          severidad: 12.5
        },
        {
          id: "5.2",
          nombre: "Contribución Deliberativa",
          constructo: "Aportación Propositiva",
          definicion: "Capacidad del discurso para aportar información, preguntas relevantes, hipótesis, alternativas o clarificaciones que permitan avanzar en la comprensión colectiva del problema.",
          peso: 25,
          meta_reglas_aplicables: [],
          atomos: [
            { id: "critica", version: "1.0", definicion: "Señalamiento de un error o falla en el argumento ajeno.", patrones: ["crítica", "objeción", "pero"] },
            { id: "propuesta", version: "1.0", definicion: "Aporte de una visión, solución o vía de acción nueva.", patrones: ["propongo", "sugiero", "alternativa", "solución"] },
            { id: "pregunta_relevante", version: "1.0", definicion: "Planteamiento de una interrogante que ilumina el problema.", patrones: ["¿", "qué pasaría si", "cómo"] },
            { id: "hipotesis", version: "1.0", definicion: "Formulación de una suposición que puede ser contrastada.", patrones: ["hipótesis", "supongo", "podría ser"] },
            { id: "reencuadre", version: "1.0", definicion: "Reformulación del problema que abre nuevas perspectivas.", patrones: ["desde otra óptica", "reformulando"] }
          ],
          severidad: 12.5
        },
        {
          id: "5.3",
          nombre: "Universalidad (Simetría)",
          constructo: "Equidad Epistémica",
          definicion: "Aplicar el mismo estándar de prueba para ambos lados, reconociendo la pluralidad de enfoques.",
          peso: 25,
          meta_reglas_aplicables: ["MR002"],
          atomos: [
            { id: "estandar", version: "1.0", definicion: "Nivel de exigencia requerido para aceptar una evidencia.", patrones: ["estándar", "criterio", "exigencia"] },
            { id: "prueba", version: "1.0", definicion: "Elemento de juicio que sostiene una afirmación.", patrones: ["prueba", "evidencia", "demostración"] },
            { id: "pluralidad", version: "1.0", definicion: "Reconocimiento de la diversidad de enfoques metodológicos legítimos.", patrones: ["pluralidad", "diversidad", "múltiples perspectivas"] }
          ],
          severidad: 12.5
        },
        {
          id: "5.4",
          nombre: "Falsabilidad",
          constructo: "Refutabilidad",
          definicion: "Exponer el argumento a la evidencia refutadora, mostrando disposición a ser corregido.",
          peso: 25,
          meta_reglas_aplicables: ["MR004"],
          atomos: [
            { id: "evidencia", version: "1.0", definicion: "Información que entra en conflicto directo con la tesis.", patrones: ["contraejemplo", "refutación", "objeción"] },
            { id: "refutadora", version: "1.0", definicion: "Capaz de demostrar la falsedad del argumento.", patrones: ["refutar", "falsear", "desmentir"] },
            { id: "apertura_critica", version: "1.0", definicion: "Disposición explícita a recibir correcciones.", patrones: ["estoy abierto", "corrijan", "puedo estar equivocado"] }
          ],
          severidad: 25.0
        }
      ]
    }
  ]
};

// ─── MECÁNICA DE CÁLCULO (con penalización latente) ──
function evaluateText(text) {
  if (!text || text.trim().length === 0) return null;

  const oraciones = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const resultados = {
    fases: [],
    evidencias: [],
    puntajes_fase: {},
    IRD_global: 0,
    riesgo: "Normal",
    meta_reglas_aplicadas: []
  };

  let nivel3_count = 0;
  let todas_infracciones = [];

  PROTOCOL.fases.forEach(fase => {
    let penalizacion_fase = 0;
    let penalizacion_fase_latente = 0;
    let infracciones_fase = [];

    fase.criterios.forEach(criterio => {
      let penalizacion_criterio = 0;
      let penalizacion_latente = 0;
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
            penalizacion_latente += penalizacion_atomo;
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

      // Guardar penalización latente antes del tope
      const penalizacion_latente_final = penalizacion_latente;
      penalizacion_criterio = Math.min(penalizacion_criterio, 25);

      let saturacion = 0;
      if (penalizacion_criterio > 0) {
        saturacion = (penalizacion_latente_final / 25) * 100;
      }

      if (penalizacion_criterio > 0) {
        const infra = {
          criterio: `${criterio.id} - ${criterio.nombre}`,
          constructo: criterio.constructo,
          penalizacion: penalizacion_criterio,
          penalizacion_latente: penalizacion_latente_final,
          saturacion: Math.round(saturacion),
          atomos_activados,
          meta_reglas_aplicadas: []
        };
        infracciones_fase.push(infra);
        todas_infracciones.push(infra);
        penalizacion_fase += penalizacion_criterio;
        penalizacion_fase_latente += penalizacion_latente_final;
        if (penalizacion_criterio === 25) nivel3_count++;
      }
    });

    // Aplicar meta-reglas a esta fase
    Object.keys(META_RULES).forEach(mrId => {
      const rule = META_RULES[mrId];
      try {
        if (rule.condicion(resultados, infracciones_fase)) {
          const efecto = rule.efecto;
          const infraAfectada = infracciones_fase.find(inf => inf.criterio.startsWith(efecto.criterio_afectado));
          if (infraAfectada) {
            const nuevoValor = efecto.tipo === 'multiplicativo' 
              ? infraAfectada.penalizacion * efecto.modificador
              : infraAfectada.penalizacion + efecto.modificador;
            const delta = nuevoValor - infraAfectada.penalizacion;
            infraAfectada.penalizacion = Math.min(Math.max(nuevoValor, 0), 25);
            infraAfectada.meta_reglas_aplicadas.push(mrId);
            penalizacion_fase += delta;
            // Recalcular penalización fase para que sea consistente
            penalizacion_fase = infracciones_fase.reduce((acc, inf) => acc + inf.penalizacion, 0);
            // Registrar meta-regla aplicada global
            if (!resultados.meta_reglas_aplicadas.includes(mrId)) {
              resultados.meta_reglas_aplicadas.push(mrId);
            }
          }
        }
      } catch (e) { /* falla silenciosa */ }
    });

    let puntaje_fase = Math.max(0, 100 - penalizacion_fase);
    if (infracciones_fase.length === 0) puntaje_fase = 100;
    resultados.puntajes_fase[fase.id] = Math.round(puntaje_fase);
    resultados.fases.push({
      id: fase.id,
      nombre: fase.nombre,
      puntaje: Math.round(puntaje_fase),
      penalizacion_fase_latente: Math.round(penalizacion_fase_latente),
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
}

// ─── SISTEMA DE POPUPS ─────────────────────────────────
function showDefinitionPopup(title, definition) {
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
                  ${a.id}${a.version ? ` (${a.version})` : ''}
                </span>
              `).join('')}
            </div>
            ${c.meta_reglas_aplicables && c.meta_reglas_aplicables.length > 0 ? `
              <div style="margin-top: 6px; font-size: 0.6rem; color: rgba(229,231,235,.3);">
                Meta-reglas: ${c.meta_reglas_aplicables.join(', ')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── VISTAS ────────────────────────────────────────────
const VIEWS = {
  analisis: {
    title: 'Análisis Sophia',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Motor de Evaluación · v0.92-beta</div>
        <h1 class="view-title">Análisis Sophia</h1>
        <div class="view-body">
          <p>Carga un documento para estimar su <strong>Índice de Robustez Deliberativa (IRD)</strong> según el protocolo SOPHIA v0.92-beta.</p>
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
        <div class="view-eyebrow">Marco de Evaluación Deliberativa · v0.92-beta</div>
        <h1 class="view-title">¿Qué es SOPHIA?</h1>
        <div class="view-body">
          <p>SOPHIA es un <strong>protocolo abierto de comunicación deliberativa</strong> (RFC de la racionalidad pública). No evalúa la verdad del contenido, sino la <strong>legitimidad del proceso argumentativo</strong>.</p>
          <p>Se fundamenta en una <strong>ontología pública versionada</strong> de las condiciones de legitimidad de los artefactos deliberativos.</p>
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
            <li><strong>Todos los átomos cognitivos</strong> con sus definiciones operacionales y versiones.</li>
            <li><strong>Las reglas de interpretación</strong> que determinan las penalizaciones.</li>
            <li><strong>Las meta‑reglas</strong> (MR001 a MR005) que contextualizan la evaluación.</li>
          </ul>
          <p><strong>¿Y el algoritmo de IA?</strong> No podemos explicitar la implementación concreta del modelo de lenguaje, <strong>pero sí explicitamos todo lo que el modelo debe buscar</strong>: patrones lingüísticos, umbrales, relaciones lógicas y condiciones que activan cada átomo.</p>
          <p>Esto garantiza que <strong>el significado de cada evaluación es fijo y reproducible</strong>. El protocolo es determinista en su definición, aunque la implementación técnica pueda variar.</p>
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
              version: a.version || '1.0',
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
            <p>Los <strong>átomos cognitivos</strong> son las unidades semánticas fundamentales del protocolo SOPHIA. Cada uno tiene una definición operacional y una versión.</p>
            <p>Se organizan en 20 criterios distribuidos en 5 fases. A continuación se muestra el listado completo.</p>
          </div>
          <div class="view-section">
            <div class="view-section-title">Repositorio completo de átomos</div>
            <div style="max-height:400px; overflow-y:auto; background:var(--s-panel); padding:12px; border:1px solid var(--s-border);">
              ${todosAtomos.map(a => `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.05); padding:6px 0;">
                  <span style="color:var(--accent); font-weight:500; width:140px;">${a.id}</span>
                  <span style="font-size:.75rem; color:rgba(229,231,235,.6); flex:1; padding:0 10px;">${a.definicion}</span>
                  <span style="font-size:.6rem; color:rgba(229,231,235,.3); width:120px; text-align:right;">v${a.version}</span>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:12px; font-size:.7rem; color:rgba(229,231,235,.3);">
              Total de átomos: ${todosAtomos.length}
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
              criterio: `${c.id} - ${c.nombre}`
            });
          });
        });
      });

      return `
        <div class="view">
          <div class="view-eyebrow">Mecánica del Puntaje</div>
          <h1 class="view-title">¿Cómo se calcula el IRD?</h1>
          <div class="view-body">
            <p>El <strong>Índice de Robustez Deliberativa (IRD)</strong> es un número entre 0 y 100 que refleja la adherencia de un texto al protocolo SOPHIA.</p>
            <p>Cada <strong>dimensión</strong> (fase) contiene 4 <strong>criterios</strong> con peso de 25 puntos. Cada criterio se evalúa a través de <strong>átomos cognitivos</strong>.</p>
          </div>

          <div class="view-section">
            <div class="view-section-title">Estructura de evaluación</div>
            <div class="flow-steps">
              <div class="flow-step"><div class="flow-dot">1</div><div class="flow-body"><div class="flow-title">Dimensión</div><div class="flow-desc">Ej: Fase II — Inferencia</div></div></div>
              <div class="flow-step"><div class="flow-dot">2</div><div class="flow-body"><div class="flow-title">Criterio</div><div class="flow-desc">Ej: 2.1 Suficiencia Inferencial</div></div></div>
              <div class="flow-step"><div class="flow-dot">3</div><div class="flow-body"><div class="flow-title">Constructo</div><div class="flow-desc">Entidad teórica que agrupa átomos</div></div></div>
              <div class="flow-step"><div class="flow-dot">4</div><div class="flow-body"><div class="flow-title">Átomos</div><div class="flow-desc">Unidades operacionales con patrones lingüísticos</div></div></div>
              <div class="flow-step"><div class="flow-dot">5</div><div class="flow-body"><div class="flow-title">Meta‑reglas</div><div class="flow-desc">Contexto (MR001–MR005) que modifica penalizaciones</div></div></div>
            </div>
          </div>

          <div class="view-section">
            <div class="view-section-title">Fórmula de agregación</div>
            <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border); font-family:monospace; font-size:.85rem; color:#e5e7eb; margin-bottom:16px;">
              <div>Penalización<sub>visible</sub> = min( ∑( Severidad<sub>átomo</sub> × Frecuencia<sub>átomo</sub> ), 25 )</div>
              <div style="margin-top:4px; color:rgba(229,231,235,.4); font-size:.7rem;">
                Penalización<sub>latente</sub> = ∑( Severidad × Frecuencia ) <span style="color:var(--accent);">← se registra como saturación</span>
              </div>
              <div style="margin-top:8px; color:rgba(229,231,235,.5); font-size:.7rem;">
                • Severidad: Nivel 1 (5 pts), Nivel 2 (12.5 pts), Nivel 3 (25 pts)<br>
                • Frecuencia: número de oraciones donde el átomo se activa<br>
                • Tope: 25 pts por criterio<br>
                • Saturación: (penalización latente / 25) × 100%
              </div>
            </div>
          </div>

          <div class="view-section">
            <div class="view-section-title">Meta‑reglas activas</div>
            <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border);">
              <div style="font-size:.8rem; color:rgba(229,231,235,.6);">
                <strong>MR001</strong> — Incertidumbre modera emocionalidad (x0.5)<br>
                <strong>MR002</strong> — Falta de Steelman agrava simetría (x1.5)<br>
                <strong>MR003</strong> — Evidencia robusta reduce generalización (x0.7)<br>
                <strong>MR004</strong> — Límites explícitos atenúan falsabilidad (x0.6)<br>
                <strong>MR005</strong> — Pluralidad explícita reduce penalización por foco (x0.8)
              </div>
            </div>
          </div>

          <div class="view-section">
            <div class="view-section-title">Ejemplo: Suficiencia Inferencial (2.1)</div>
            <div style="background:var(--s-panel); padding:16px; border:1px solid var(--s-border);">
              <div style="font-size:.75rem; color:rgba(229,231,235,.7);">
                <strong>Constructo:</strong> Escalamiento Inferencial<br>
                <strong>Átomos:</strong> conclusión, magnitud, premisas, universalización, extrapolación, representatividad<br>
                <strong>Regla:</strong> Si se detecta "todos" sin evidencia representativa → penalización<br>
                <strong>Salida:</strong> { "criterio":"2.1", "penalizacion":12.5, "saturacion":"175%", "atomos_activados":["universalizacion"] }
              </div>
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
              <div class="relation-desc">SOPHIA asegura que los documentos que ingresan a la Academia posean trazabilidad argumentativa mínima.</div>
            </div>
            <div class="relation-card relation-card--rey">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Rey Filósofo</span>
              </div>
              <div class="relation-desc">Cuando un texto presenta baja adherencia, Rey Filósofo actúa como tutor.</div>
            </div>
            <div class="relation-card relation-card--logos">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Logos</span>
              </div>
              <div class="relation-desc">Logos audita la matriz estructural del código; SOPHIA audita la honestidad retórica.</div>
            </div>
            <div class="relation-card relation-card--aletheia">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Aletheia</span>
              </div>
              <div class="relation-desc">SOPHIA fiscaliza el rigor formal; Aletheia mapea la veracidad empírica.</div>
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
          <p>Ingresa un texto para estimar su <strong>Índice de Robustez Deliberativa (IRD)</strong>.</p>
        </div>
        <div class="eval-tool">
          <textarea class="sophia-input" id="evalInput" placeholder="Pega aquí el documento a auditar..."></textarea>
          <div class="eval-actions">
            <button class="btn-primary" id="evalBtn">Auditar Documento →</button>
          </div>
        </div>
        <div id="evalResult"></div>
      </div>`
  }
};

// ─── SPA ROUTER ────────────────────────────────────────
const SOPHIA = {
  current: 'analisis',

  navigate(id) {
    const view = VIEWS[id];
    if (!view) return;
    this.current = id;

    document.getElementById('viewTitle').textContent = view.title;
    const content = document.getElementById('viewContent');
    content.innerHTML = view.render();

    this._animateBars(content);

    if (id === 'analisis') {
      this._bindFileUpload();
      this._bindEval('analisis');
    } else if (id === 'informe') {
      this._bindEval('informe');
    }

    if (id.startsWith('fase')) {
      this._bindPopups(content);
    }

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

  _bindPopups(root) {
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
        const atomo = el.dataset.atomo.split(' ')[0];
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
        };
        reader.readAsText(file);
      } else if (ext === 'pdf') {
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
    const btn = document.getElementById('evalBtn');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      const input = document.getElementById('evalInput');
      if (!input) return;
      const text = input.value.trim();
      const out = document.getElementById('evalResult');

      if (!text) {
        out.innerHTML = '<p style="color:rgba(239,68,68,.7);font-size:.78rem;margin-top:12px;">Ingresa o carga un texto para estimar su calidad deliberativa.</p>';
        return;
      }

      out.innerHTML = '<p style="color:rgba(229,231,235,.35);font-size:.72rem;margin-top:12px;">Analizando adherencia al protocolo...</p>';

      setTimeout(() => {
        const resultado = evaluateText(text);
        if (!resultado) {
          out.innerHTML = '<p style="color:rgba(239,68,68,.7);font-size:.78rem;">Error al evaluar el texto.</p>';
          return;
        }

        const fasesHTML = resultado.fases.map(f => {
          const color = f.puntaje >= 80 ? 'var(--q-high)' : 'var(--q-mid)';
          let infraccionesTexto = '';
          if (f.infracciones.length > 0) {
            infraccionesTexto = f.infracciones.map(inf => {
              let texto = `${inf.criterio} (${inf.penalizacion} pts, saturación ${inf.saturacion}%)`;
              if (inf.meta_reglas_aplicadas && inf.meta_reglas_aplicadas.length > 0) {
                texto += ` • MR: ${inf.meta_reglas_aplicadas.join(',')}`;
              }
              return texto;
            }).join('; ');
          } else {
            infraccionesTexto = 'Sin infracciones detectadas';
          }
          return `
            <div style="margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,.04); border-left: 2px solid ${color};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 500; color: #e5e7eb;">${f.nombre}</span>
                <span style="font-size: 0.9rem; color: ${color};">${f.puntaje}%</span>
              </div>
              <div style="font-size: 0.7rem; color: rgba(229,231,235,.5); margin-top: 6px;">
                Infracciones: ${infraccionesTexto}
              </div>
            </div>
          `;
        }).join('');

        const evidenciasHTML = resultado.evidencias.slice(0, 5).map(e => `
          <div style="font-size: 0.7rem; color: rgba(229,231,235,.5); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.04);">
            <span style="color: var(--accent);">${e.atomo}</span> — “${e.fragmento}”
          </div>
        `).join('');

        const metaReglasHTML = resultado.meta_reglas_aplicadas && resultado.meta_reglas_aplicadas.length > 0
          ? `<div style="margin-top:8px; font-size:0.65rem; color:rgba(229,231,235,.4);">Meta-reglas aplicadas: ${resultado.meta_reglas_aplicadas.join(', ')}</div>`
          : '';

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
              ${metaReglasHTML}
              ${resultado.evidencias.length > 0 ? `
                <div style="margin-top: 20px; padding: 14px; background: rgba(59,130,246,.05); border-left: 2px solid var(--accent);">
                  <div style="font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px;">Evidencias Textuales (muestra)</div>
                  ${evidenciasHTML}
                </div>
              ` : ''}
              <div style="font-size: 0.6rem; color: rgba(229,231,235,.2); margin-top: 12px;">
                * Evaluación determinista con métricas de saturación.
              </div>
            </div>
          </div>
        `;
        this._animateBars(out);
      }, 600);
    });
  },


  // ─── INICIALIZACIÓN DEFINITIVA ──
  init() {
    console.log('🚀 SOPHIA inicializado.');
    this.navigate('analisis');
  }
}; // <--- Este cierra tu objeto SOPHIA

// SOLO un bloque para iniciar todo
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.snav-item[data-view]');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      navButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      SOPHIA.navigate(e.currentTarget.dataset.view);
    });
  });

  SOPHIA.init();
});
