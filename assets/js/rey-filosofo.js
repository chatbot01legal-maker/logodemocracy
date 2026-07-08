/* ═══════════════════════════════════════════════════════
   REY-FILOSOFO.JS — Arquitectura SPA y Gestión de Andamiaje
   ═══════════════════════════════════════════════════════ */

/* ─── BASE DE DATOS LOCAL / MOCK DE PROGRESO (ZPD) ──── */
const USER_PROGRESS_DB = {
  metadata: {
    levelName: "Zona de Desarrollo Próximo: Intermedio",
    syncStatus: "Sincronizado con Nodo Local"
  },
  curriculum: {
    logica:     { value: 75, status: 'active', label: 'Lógica Formal y Falacias', desc: 'Identificación de silogismos inválidos, sesgos cognitivos y manipulación retórica.' },
    estadistica: { value: 40, status: 'active', label: 'Estadística e Inferencia', desc: 'Comprensión de distribuciones, correlación vs causalidad y muestreos ponderados.' },
    entropia:    { value: 15, status: 'active', label: 'Sistemas Complejos y Entropía', desc: 'Estructuras dinámicas, bucles de retroalimentación y degradación informativa.' },
    filosofia:   { value: 100, status: 'mastered', label: 'Epistemología Cívica', desc: 'El costo epistémico del discurso y demarcación entre hechos e interpretaciones.' },
    economia:    { value: 0, status: 'locked', label: 'Economía Política Compleja', desc: 'Análisis sistémico de asignación de recursos y modelos de votación cuadrática.' }
  }
};

/* ═══════════════════════════════════════════════════════
   MICROTESTS — Perfil Pedagógico Inicial (10 instrumentos)
   Opcionales, sin puntuaciones visibles, sin comparaciones.
   ═══════════════════════════════════════════════════════ */

const MT_PROFILE_KEY = 'reyFilosofo_pedagogicalProfile';

/* ─── IDENTIDAD DEL USUARIO (para sincronizar con el backend) ───
   Mientras no exista login real conectado en este módulo, cada
   visitante recibe un sessionId anónimo persistente. Si más adelante
   se conecta un JWT/login real, basta con guardar 'userId' en
   localStorage y este helper lo tomará automáticamente. */
function reyFilosofoGetSessionId() {
  try {
    let sid = localStorage.getItem('reyFilosofo_sessionId');
    if (!sid) {
      sid = (crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem('reyFilosofo_sessionId', sid);
    }
    return sid;
  } catch (e) {
    return null;
  }
}

function reyFilosofoGetUserId() {
  try { return localStorage.getItem('userId') || null; } catch (e) { return null; }
}

function reyFilosofoIdentity() {
  const userId = reyFilosofoGetUserId();
  const sessionId = reyFilosofoGetSessionId();
  return userId ? { userId } : { sessionId };
}

function mtLoadProfile() {
  try {
    const raw = localStorage.getItem(MT_PROFILE_KEY);
    return raw ? JSON.parse(raw) : { completed: {}, variables: {} };
  } catch (e) {
    return { completed: {}, variables: {} };
  }
}

function mtSaveProfile(profile) {
  try { localStorage.setItem(MT_PROFILE_KEY, JSON.stringify(profile)); } catch (e) { /* silencioso */ }
}

const MICROTESTS = [
  {
    id: 'brujula',
    number: 1,
    title: 'Tu brújula explicativa',
    objective: 'Estilo explicativo preferente',
    intro: `<p>Cada persona entiende mejor cuando le explican las cosas de una manera particular. Esta actividad nos ayudará a descubrir qué tipo de explicación te resulta más clara e intuitiva.</p>`,
    questions: [
      {
        id: 'estilo',
        type: 'single',
        prompt: 'Imagina que estás empezando a aprender qué es el "efecto de arrastre" en el comportamiento social. ¿Cuál de estas explicaciones te ayudaría más a comprenderlo?',
        options: [
          { id: 'A', label: 'Es como cuando estás en un concierto y, aunque no sepas bien la canción, terminas aplaudiendo con los demás. El efecto de arrastre es esa tendencia a hacer lo que hace la mayoría.' },
          { id: 'B', label: 'Primero definamos el fenómeno: ocurre cuando una persona adopta una conducta o creencia solo porque muchos otros lo hacen. Después veremos cómo se ha estudiado en economía y psicología social, y terminaremos con ejemplos cotidianos.' },
          { id: 'C', label: 'Se trata de una forma de influencia social informativa y normativa en la que la persona utiliza las acciones de los demás como heurística para decidir, especialmente en situaciones ambiguas.' },
          { id: 'D', label: 'Te lo explicaré con pasos cortos: 1) Estás en una situación nueva. 2) No tienes claro qué hacer. 3) Observas a la gente a tu alrededor. 4) Haces lo mismo que ellos para no equivocarte o para encajar.' }
        ]
      }
    ],
    compute(a) {
      const map = { A: 'analogico', B: 'secuencial_estructurado', C: 'conceptual', D: 'paso_a_paso' };
      return { estilo_explicativo: map[a.estilo?.[0]] || null };
    }
  },
  {
    id: 'ejemplos',
    number: 2,
    title: 'El poder de los ejemplos',
    objective: 'Aprendizaje mediante ejemplos',
    intro: `<p>Un buen ejemplo puede iluminar una idea. Nos interesa conocer qué clase de situaciones te ayudan a conectar mejor con un concepto.</p>
            <p style="color:rgba(229,231,235,.55); font-size:.8rem;"><strong>Concepto: Sesgo de disponibilidad.</strong> Es la tendencia a sobrestimar la probabilidad de sucesos que recordamos con facilidad.</p>`,
    questions: [
      {
        id: 'ejemplos_elegidos',
        type: 'multi',
        min: 2, max: 2, ordered: false,
        prompt: 'De los siguientes ejemplos, escoge los dos que te resulten más ilustrativos.',
        options: [
          { id: '1', label: 'Después de ver muchas noticias sobre accidentes aéreos, una persona cree que volar es más peligroso que conducir, aunque las estadísticas muestran lo contrario.', tag: 'mediatico_social' },
          { id: '2', label: 'Como acabas de leer un libro sobre tiburones, al meterte al mar sientes más miedo del que realmente tiene sentido estadístico.', tag: 'cotidiano' },
          { id: '3', label: 'Un inversor sobrestima el éxito de una criptomoneda porque todos sus amigos hablan de ella en redes sociales, ignorando datos de mercado más amplios.', tag: 'mediatico_social' },
          { id: '4', label: 'Un médico, tras atender varios casos raros seguidos, empieza a diagnosticar esa enfermedad con más frecuencia de la real.', tag: 'profesional' }
        ]
      },
      {
        id: 'razon',
        type: 'single',
        prompt: '¿Qué hizo que esos ejemplos te resultaran más útiles?',
        options: [
          { id: 'A', label: 'Eran situaciones muy cotidianas en las que puedo imaginarme fácilmente.' },
          { id: 'B', label: 'Reflejaban contextos serios (salud, finanzas) que me interesan.' },
          { id: 'C', label: 'Mostraban cómo los medios o el entorno social influyen en el pensamiento.' }
        ]
      }
    ],
    compute(a) {
      const razonMap = { A: 'cercania', B: 'relevancia_tematica', C: 'impacto_social' };
      const tagById = { '1': 'mediatico_social', '2': 'cotidiano', '3': 'mediatico_social', '4': 'profesional' };
      const tags = [...new Set((a.ejemplos_elegidos || []).map(id => tagById[id]).filter(Boolean))];
      return {
        preferencia_ejemplos: (a.ejemplos_elegidos || []).length === 2 ? 'alta' : 'media',
        contexto_ejemplo: tags,
        razon_utilidad_ejemplo: razonMap[a.razon?.[0]] || null
      };
    }
  },
  {
    id: 'puentes',
    number: 3,
    title: 'Construyendo puentes',
    objective: 'Preferencia y tipo de analogías',
    intro: `<p>Las comparaciones inesperadas suelen ayudar a ver un tema desde otro ángulo. Queremos saber qué tipo de analogías te parecen más inspiradoras.</p>
            <p style="color:rgba(229,231,235,.55); font-size:.8rem;"><strong>Concepto: Democracia deliberativa.</strong> Un sistema donde las decisiones se toman mediante discusión razonada y abierta, no solo por votación.</p>`,
    questions: [
      {
        id: 'analogias',
        type: 'multi',
        min: 2, max: 2, ordered: true,
        prompt: 'Elige las dos analogías que creas que mejor representan la democracia deliberativa, en el orden en que las toques (1.ª la más potente).',
        options: [
          { id: 'taller', label: 'Es como un taller de cocina colectiva donde se discute la receta antes de cocinar.' },
          { id: 'ecosistema', label: 'Es como un ecosistema donde distintas especies (opiniones) interactúan y se regulan mutuamente.' },
          { id: 'jazz', label: 'Es como una partitura de jazz: hay estructura, pero cada músico improvisa escuchando a los demás.' },
          { id: 'andamio', label: 'Es como un andamio que se construye entre varias personas mientras lo usan para alcanzar un lugar más alto.' }
        ]
      },
      {
        id: 'razon_analogia',
        type: 'single',
        prompt: '¿Qué característica de la analogía que pusiste en primer lugar te resultó más reveladora?',
        options: [
          { id: 'A', label: 'La idea de construcción colectiva.' },
          { id: 'B', label: 'La noción de equilibrio o interdependencia.' },
          { id: 'C', label: 'La combinación de reglas y libertad.' },
          { id: 'D', label: 'La imagen de un proceso vivo y cambiante.' }
        ]
      }
    ],
    compute(a) {
      const domMap = { taller: 'colaborativa', ecosistema: 'sistemica', jazz: 'creativa', andamio: 'constructiva' };
      const razonMap = { A: 'construccion', B: 'equilibrio', C: 'armonia', D: 'proceso' };
      const primera = (a.analogias || [])[0];
      return {
        preferencia_analogias: 'alta',
        tipo_analogia_dominante: domMap[primera] || null,
        razon_analogica: razonMap[a.razon_analogia?.[0]] || null
      };
    }
  },
  {
    id: 'mapa_camino',
    number: 4,
    title: 'El mapa o el camino',
    objective: 'Orientación práctica vs. teórica',
    intro: `<p>Cuando te encuentras con un concepto nuevo, algunas personas se sienten atraídas por cómo aplicarlo, y otras prefieren explorar sus fundamentos. Esta actividad nos ayudará a ver cuál es tu inclinación natural.</p>
            <p style="color:rgba(229,231,235,.55); font-size:.8rem;">Acabas de leer: "El contrato social es la idea de que la legitimidad del Estado surge de un acuerdo hipotético entre los individuos para garantizar su seguridad y libertad."</p>`,
    questions: [
      {
        id: 'preguntas',
        type: 'multi',
        min: 2, max: 2, ordered: false,
        prompt: '¿Cuáles de estas preguntas te resultan más interesantes?',
        options: [
          { id: 'A', label: '¿Cómo se aplica esta idea en los debates actuales sobre impuestos y servicios públicos?' },
          { id: 'B', label: '¿Puede existir realmente un contrato social si nunca lo firmamos?' },
          { id: 'C', label: '¿Qué ejemplos históricos muestran la aplicación (o ruptura) de un contrato social?' },
          { id: 'D', label: '¿En qué se diferencia el contrato social de Hobbes, Locke y Rousseau?' }
        ]
      }
    ],
    compute(a) {
      const sel = a.preguntas || [];
      const practica = sel.filter(id => id === 'A' || id === 'C').length;
      const teorica = sel.filter(id => id === 'B' || id === 'D').length;
      let orientacion = 'mixta';
      if (practica > 0 && teorica === 0) orientacion = 'practica';
      if (teorica > 0 && practica === 0) orientacion = 'teorica';
      return { orientacion };
    }
  },
  {
    id: 'redes',
    number: 5,
    title: 'Tejiendo redes',
    objective: 'Pensamiento sistémico vs. lineal',
    intro: `<p>Muchos fenómenos sociales son como redes donde todo está conectado. Queremos conocer cómo percibes esas conexiones.</p>
            <p style="color:rgba(229,231,235,.55); font-size:.8rem;"><strong>Caso:</strong> En un país, la participación electoral ha caído diez puntos en una década. Se mencionan factores como desconfianza en políticos, falta de educación cívica, cobertura mediática negativa y diseño complicado del voto.</p>`,
    questions: [
      {
        id: 'modelo_causal',
        type: 'single',
        prompt: '¿Cuál de las siguientes imágenes causales se acerca más a tu forma de pensarlo?',
        options: [
          { id: 'A', label: 'La desconfianza es la causa principal; los demás factores son consecuencias de ella.' },
          { id: 'B', label: 'La falta de educación cívica y la desconfianza son causas independientes que suman su efecto.' },
          { id: 'C', label: 'La desconfianza, la educación cívica deficiente y la cobertura mediática se influyen mutuamente formando un ciclo que hace que la participación baje.' }
        ]
      },
      {
        id: 'retroalimentacion',
        type: 'single',
        prompt: '¿Crees que estos factores pueden reforzarse entre sí con el tiempo?',
        options: [
          { id: 'A', label: 'Sí, creo que se retroalimentan.' },
          { id: 'B', label: 'No necesariamente, cada uno actúa por su cuenta.' }
        ]
      }
    ],
    compute(a) {
      const modelo = a.modelo_causal?.[0];
      const refuerzo = a.retroalimentacion?.[0];
      let pensamiento_sistemico = 'bajo';
      if (modelo === 'C' && refuerzo === 'A') pensamiento_sistemico = 'alto';
      else if (modelo === 'C' && refuerzo === 'B') pensamiento_sistemico = 'medio';
      return { pensamiento_sistemico };
    }
  },
  {
    id: 'sentidos',
    number: 6,
    title: 'Los sentidos del aprendizaje',
    objective: 'Formato de presentación preferido',
    intro: `<p>La misma idea puede llegar por distintos canales. Queremos descubrir cuál te hace sentir más cómodo y atento.</p>
            <div style="display:grid; gap:10px; margin-top:12px;">
              <div style="background:var(--p-panel); border:1px solid var(--p-border); padding:10px; font-size:.78rem; color:rgba(229,231,235,.7);"><strong style="color:var(--accent);">Texto:</strong> "La posverdad describe situaciones donde las emociones y las creencias personales influyen más en la opinión pública que los hechos objetivos."</div>
              <div style="background:var(--p-panel); border:1px solid var(--p-border); padding:10px; font-size:.78rem; color:rgba(229,231,235,.7);"><strong style="color:var(--accent);">Visual:</strong> Imagina un gráfico con dos líneas: "hechos verificables" y "apelación emocional". En la posverdad, la línea emocional está muy por encima.</div>
              <div style="background:var(--p-panel); border:1px solid var(--p-border); padding:10px; font-size:.78rem; color:rgba(229,231,235,.7);"><strong style="color:var(--accent);">Conversacional:</strong> "—¿Has visto cómo a veces la gente comparte noticias falsas porque les hacen sentir indignación? —Sí, y aunque luego se desmientan, el daño ya está hecho. Eso es posverdad: ganan las emociones."</div>
            </div>`,
    questions: [
      {
        id: 'formato',
        type: 'single',
        prompt: '¿Con cuál de estos formatos te gustaría seguir explorando el tema?',
        options: [
          { id: 'A', label: 'Con el texto, leyendo más fragmentos similares.' },
          { id: 'B', label: 'Con el visual, mediante gráficos o esquemas.' },
          { id: 'C', label: 'Con la conversación, escuchando diálogos o debates.' }
        ]
      }
    ],
    compute(a) {
      const map = { A: 'textual', B: 'visual', C: 'auditivo_conversacional' };
      return { preferencia_formato: map[a.formato?.[0]] || null };
    }
  },
  {
    id: 'escalando',
    number: 7,
    title: 'Escalando conceptos',
    objective: 'Nivel de abstracción inicial',
    intro: `<p>Algunas personas prefieren empezar con lo concreto y cercano, otras con la idea general. Esta pequeña actividad nos ayuda a ver desde dónde te gusta arrancar.</p>`,
    questions: [
      {
        id: 'nivel',
        type: 'single',
        prompt: 'Aquí tienes tres formas de presentar el concepto de "libertad". ¿Cuál te resulta más clara?',
        options: [
          { id: 'A', label: 'Imagina que puedes decidir a qué hora volver a casa sin que nadie te lo imponga. Eso es libertad personal. Libertad política es poder elegir a tus gobernantes.' },
          { id: 'B', label: 'La libertad es la facultad de actuar según la propia voluntad, respetando la ley y los derechos de los demás. En política, se traduce en libertades civiles como expresión, reunión y voto.' },
          { id: 'C', label: 'La libertad negativa es la ausencia de coerción externa; la positiva es la capacidad de ser dueño de tu propio destino. Ambas se tensionan en las democracias modernas.' }
        ]
      },
      {
        id: 'secuencia',
        type: 'single',
        prompt: 'En general, ¿cómo prefieres empezar a aprender un concepto nuevo?',
        options: [
          { id: 'A', label: 'Con ejemplos concretos y luego ir hacia la definición.' },
          { id: 'B', label: 'Con una definición general y después ver ejemplos.' }
        ]
      }
    ],
    compute(a) {
      const nivelMap = { A: 'concreto', B: 'intermedio', C: 'abstracto' };
      const secMap = { A: 'ejemplos_primero', B: 'definicion_primero' };
      return {
        nivel_abstraccion_inicial: nivelMap[a.nivel?.[0]] || null,
        secuencia_preferida: secMap[a.secuencia?.[0]] || null
      };
    }
  },
  {
    id: 'andamio',
    number: 8,
    title: 'Tu andamio personal',
    objective: 'Necesidad y tipo de andamiaje',
    intro: `<p>Antes de sumergirnos en un tema, a veces viene bien tener ciertas ayudas. Esta actividad nos permite saber qué tipo de apoyo te facilita el aprendizaje.</p>
            <p style="color:rgba(229,231,235,.55); font-size:.8rem;">Vas a comenzar un módulo sobre <strong>criptografía básica</strong>.</p>`,
    questions: [
      {
        id: 'apoyos',
        type: 'multi',
        min: 2, max: 2, ordered: true,
        prompt: '¿Cuáles de estas herramientas introductorias te gustaría tener a mano? Elige dos y tócalas en orden de utilidad (primero la más útil).',
        options: [
          { id: 'resumen', label: 'Un resumen con las ideas principales y ejemplos cotidianos.' },
          { id: 'guia', label: 'Una guía paso a paso que construye los conceptos desde cero.' },
          { id: 'pregunta', label: 'Una pregunta intrigante que me haga pensar antes de leer.' },
          { id: 'analogia', label: 'Una analogía que relacione la criptografía con algo familiar, como los mensajes secretos entre amigos.' },
          { id: 'mapa', label: 'Un pequeño mapa conceptual visual con los temas que se van a tratar.' }
        ]
      }
    ],
    compute(a) {
      const sel = a.apoyos || [];
      const primero = sel[0];
      let necesidad_andamiaje = 'media';
      if (primero === 'guia') necesidad_andamiaje = 'alta';
      else if (primero === 'pregunta') necesidad_andamiaje = 'baja';
      else if (primero === 'resumen' || primero === 'mapa') necesidad_andamiaje = 'media';
      return { necesidad_andamiaje, tipo_andamiaje_preferido: sel };
    }
  },
  {
    id: 'reflexion',
    number: 9,
    title: 'Reflexionando sobre tu aprendizaje',
    objective: 'Estrategias metacognitivas',
    intro: `<p>Aprender no es solo recibir información, sino también cómo la procesas. Queremos saber qué estrategias usas de manera natural cuando quieres entender algo nuevo.</p>`,
    questions: [
      {
        id: 'estrategias',
        type: 'multi',
        min: 1, max: 3, ordered: false,
        prompt: 'Cuando te enfrentas a un tema que te interesa, ¿qué sueles hacer? (Selecciona hasta tres)',
        options: [
          { id: '1', label: 'Me pregunto qué sé ya sobre el tema antes de empezar.' },
          { id: '2', label: 'Busco ejemplos concretos para aterrizar las ideas.' },
          { id: '3', label: 'Intento explicármelo a mí mismo con mis propias palabras.' },
          { id: '4', label: 'Hago un pequeño esquema o resumen mental de lo que voy aprendiendo.' },
          { id: '5', label: 'Relaciono lo nuevo con experiencias personales o con otros temas que conozco.' },
          { id: '6', label: 'Me planteo preguntas mientras leo o escucho.' },
          { id: '7', label: 'Voy comprobando si realmente lo estoy entendiendo, y si no, vuelvo atrás.' },
          { id: '8', label: 'Imagino situaciones donde podría aplicar esa información.' }
        ]
      }
    ],
    compute(a) {
      const sel = a.estrategias || [];
      const groups = {
        planificacion: ['1'], elaboracion_ejemplos: ['2', '5', '8'],
        autoevaluacion: ['3', '7'], organizacion: ['4'], cuestionamiento: ['6']
      };
      const categorias = Object.keys(groups).filter(g => groups[g].some(id => sel.includes(id)));
      return { estrategias_metacognitivas: sel, categorias_metacognitivas: categorias };
    }
  },
  {
    id: 'navegando',
    number: 10,
    title: 'Navegando problemas',
    objective: 'Enfoque ante problemas complejos',
    intro: `<p>Cuando te encuentras con un problema social complejo, ¿por dónde te gusta empezar? Esta última actividad nos ayuda a entender tu manera de explorar soluciones.</p>
            <p style="color:rgba(229,231,235,.55); font-size:.8rem;"><strong>Dilema:</strong> En un país, menos del 30% de los jóvenes entre 18 y 25 años vota.</p>`,
    questions: [
      {
        id: 'enfoque',
        type: 'single',
        prompt: 'Como ciudadano interesado, ¿cómo te gustaría empezar a entender este problema?',
        options: [
          { id: 'A', label: 'Revisaría datos y estadísticas sobre participación por edades, nivel educativo y región, para identificar patrones.' },
          { id: 'B', label: 'Leería testimonios y entrevistas a jóvenes para comprender sus motivaciones y emociones.' },
          { id: 'C', label: 'Mapearía las causas interconectadas: desafección, falta de representación, dificultades logísticas, educación cívica, etc.' },
          { id: 'D', label: 'Imaginaría campañas o formatos nuevos que pudieran hacer más atractiva la participación, y después investigaría si algo así ya existe.' }
        ]
      }
    ],
    compute(a) {
      const map = { A: 'analitico', B: 'experiencial', C: 'sistemico', D: 'creativo' };
      return { enfoque_resolucion: map[a.enfoque?.[0]] || null };
    }
  }
];

const MT_FINAL_MESSAGE = `Gracias por dedicar este tiempo. Ahora Rey Filósofo conoce un poco mejor tu forma de aprender y podrá acompañarte con explicaciones, ejemplos y preguntas más afines a vos. Cada pequeño paso que diste aquí ayuda a que tu camino de formación cívica sea más personalizado. Podés continuar cuando quieras, retomar más adelante o simplemente dejarlo así; el tutor siempre estará listo para acompañarte.`;

/* ── Motor de interacción de microtests ─────────────── */
const MT_ENGINE = {
  profile: mtLoadProfile(),
  activeId: null,
  stepIndex: 0,
  answers: {},
  showFinalMessage: false,

  getTest(id) { return MICROTESTS.find(t => t.id === id); },

  isCompleted(id) { return !!this.profile.completed[id]; },

  allCompleted() { return MICROTESTS.every(t => this.isCompleted(t.id)); },

  openTest(id) {
    this.activeId = id;
    this.stepIndex = 0;
    this.answers = {};
    this.showFinalMessage = false;
    this.refresh();
  },

  backToList() {
    this.activeId = null;
    this.showFinalMessage = false;
    this.refresh();
  },

  toggleOption(qid, optId) {
    const test = this.getTest(this.activeId);
    const q = test.questions[this.stepIndex];
    let current = this.answers[qid] || [];

    if (q.type === 'single') {
      current = [optId];
    } else {
      const idx = current.indexOf(optId);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        if (current.length >= q.max) return; // ya alcanzó el máximo
        current.push(optId);
      }
    }
    this.answers[qid] = current;
    this.refresh();
  },

  canContinue() {
    const test = this.getTest(this.activeId);
    const q = test.questions[this.stepIndex];
    const sel = this.answers[q.id] || [];
    if (q.type === 'single') return sel.length === 1;
    return sel.length >= q.min;
  },

  nextStep() {
    const test = this.getTest(this.activeId);
    if (this.stepIndex < test.questions.length - 1) {
      this.stepIndex++;
      this.refresh();
    } else {
      this.finishTest();
    }
  },

  finishTest() {
    const test = this.getTest(this.activeId);
    const variables = test.compute(this.answers) || {};
    this.profile.completed[test.id] = true;
    this.profile.variables = { ...this.profile.variables, ...variables };
    mtSaveProfile(this.profile); // respaldo local inmediato (funciona incluso sin conexión)

    // Sincronización con el backend (Mongo + evento anonimizado para el
    // Laboratorio Cívico). Si falla, el perfil ya quedó a salvo localmente
    // y se reintentará en la próxima sincronización.
    fetch('/api/reyfilosofo/microtests/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reyFilosofoIdentity(),
        testId: test.id,
        answers: this.answers,
        variables
      })
    }).catch(err => console.warn('⚠️ No se pudo sincronizar el microtest con el servidor:', err.message));

    if (this.allCompleted()) {
      this.activeId = null;
      this.showFinalMessage = true;
    } else {
      this.activeId = '__done__' + test.id; // estado intermedio: mensaje de cierre de este test
    }
    this.refresh();
  },

  nextPendingTest() {
    return MICROTESTS.find(t => !this.isCompleted(t.id));
  },

  refresh() {
    const root = document.getElementById('mtRoot');
    if (!root) return;
    root.innerHTML = this.render();
    this.bind(root);
  },

  render() {
    if (this.showFinalMessage) return this.renderFinal();
    if (this.activeId && this.activeId.startsWith('__done__')) return this.renderStepDone();
    if (this.activeId) return this.renderQuestion();
    return this.renderList();
  },

  renderList() {
    const cards = MICROTESTS.map(t => {
      const done = this.isCompleted(t.id);
      return `
        <div class="mt-card ${done ? 'mt-card--done' : ''}" data-test-id="${t.id}">
          <div class="mt-card-num">${String(t.number).padStart(2, '0')}</div>
          <div class="mt-card-body">
            <div class="mt-card-title">${t.title}</div>
            <div class="mt-card-objective">${t.objective}</div>
          </div>
          <div class="mt-card-status ${done ? 'mt-status--done' : ''}">${done ? '✓ Completado' : 'Sin iniciar'}</div>
        </div>`;
    }).join('');

    return `
      <p class="mt-intro">Estas actividades cortas (4–5 minutos cada una) ayudan al Rey Filósofo a comprender cómo aprendés. Son completamente <strong>opcionales</strong>: podés hacer una, varias, todas, o ninguna. Nunca vas a ver puntuaciones ni comparaciones.</p>
      <div class="mt-list">${cards}</div>
    `;
  },

  renderQuestion() {
    const test = this.getTest(this.activeId);
    const q = test.questions[this.stepIndex];
    const sel = this.answers[q.id] || [];
    const isMulti = q.type === 'multi';

    const optionsHtml = q.options.map(opt => {
      const active = sel.includes(opt.id);
      const orderBadge = (isMulti && q.ordered && active) ? `<span class="mt-order-badge">${sel.indexOf(opt.id) + 1}</span>` : '';
      return `
        <button type="button" class="mt-option ${active ? 'mt-option--selected' : ''}" data-qid="${q.id}" data-opt="${opt.id}">
          ${orderBadge}<span>${opt.label}</span>
        </button>`;
    }).join('');

    const counterHint = isMulti
      ? (q.min === q.max
          ? `Selecciona ${q.min}${q.ordered ? ' (en orden de importancia)' : ''}.`
          : `Selecciona hasta ${q.max}.`)
      : '';

    return `
      <button type="button" class="mt-back" data-action="back-to-list">← Volver a Perfil de Aprendizaje</button>
      <div class="mt-eyebrow">Microtest ${String(test.number).padStart(2, '0')} · ${test.title}</div>
      ${this.stepIndex === 0 ? `<div class="mt-question-intro">${test.intro}</div>` : ''}
      <div class="mt-progress">Pregunta ${this.stepIndex + 1} de ${test.questions.length}</div>
      <div class="mt-prompt">${q.prompt}</div>
      ${counterHint ? `<div class="mt-hint">${counterHint}</div>` : ''}
      <div class="mt-options">${optionsHtml}</div>
      <div class="mt-actions">
        <button type="button" class="mt-btn-continue" data-action="continue" ${this.canContinue() ? '' : 'disabled'}>
          ${this.stepIndex < test.questions.length - 1 ? 'Continuar →' : 'Finalizar microtest →'}
        </button>
      </div>
    `;
  },

  renderStepDone() {
    const testId = this.activeId.replace('__done__', '');
    const test = this.getTest(testId);
    const next = this.nextPendingTest();
    return `
      <div class="mt-done-panel">
        <div class="mt-done-check">✓</div>
        <p class="mt-done-text">Listo. "${test.title}" quedó registrado — esto ayuda a que el Rey Filósofo afine tu acompañamiento.</p>
        <div class="mt-actions">
          <button type="button" class="mt-btn-continue" data-action="back-to-list">Volver a Perfil de Aprendizaje</button>
          ${next ? `<button type="button" class="mt-btn-secondary" data-action="open-test" data-test-id="${next.id}">Siguiente microtest →</button>` : ''}
        </div>
      </div>`;
  },

  renderFinal() {
    return `
      <div class="mt-done-panel">
        <div class="mt-done-check">🏛</div>
        <p class="mt-done-text">${MT_FINAL_MESSAGE}</p>
        <div class="mt-actions">
          <button type="button" class="mt-btn-continue" data-action="back-to-list">Ver Perfil de Aprendizaje</button>
        </div>
      </div>`;
  },

  bind(root) {
    root.querySelectorAll('.mt-card').forEach(card => {
      card.addEventListener('click', () => this.openTest(card.dataset.testId));
    });
    root.querySelectorAll('.mt-option').forEach(btn => {
      btn.addEventListener('click', () => this.toggleOption(btn.dataset.qid, btn.dataset.opt));
    });
    const backBtn = root.querySelector('[data-action="back-to-list"]');
    if (backBtn) backBtn.addEventListener('click', () => this.backToList());
    const continueBtn = root.querySelector('[data-action="continue"]');
    if (continueBtn) continueBtn.addEventListener('click', () => this.nextStep());
    const nextTestBtn = root.querySelector('[data-action="open-test"]');
    if (nextTestBtn) nextTestBtn.addEventListener('click', () => this.openTest(nextTestBtn.dataset.testId));
  }
};

/* ─── VISTAS DE NAVEGACIÓN INTERNA ──────────────────── */
const FILOSOFO_VIEWS = {

  /* ── microtests: perfil de aprendizaje ────────────── */
  microtests: {
    title: 'Perfil de Aprendizaje',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Autoconocimiento Pedagógico</div>
        <h1 class="view-title">Microtests de Estilo de Aprendizaje</h1>
        <div id="mtRoot"></div>
      </div>`
  },

  /* ── tutoría principal ────────────────────────────── */
  inicio: {
    title: 'Tutoría Cognitiva y Andamiaje',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Acompañamiento Intelectual</div>
        <h1 class="view-title">El Rol del Rey Filósofo</h1>
        <div class="view-body">
          <p>Este módulo no funciona como una IA de respuestas automáticas o fácticas. Su propósito es actuar como un <strong>andamio cognitivo</strong> estructurado bajo la perspectiva de la Zona de Desarrollo Próximo (Vygotsky).</p>
          <p>El sistema detecta tu nivel de alfabetización epistemológica actual y te acompaña en la lectura crítica de la Academia, traduciendo las métricas de <strong>Sophia</strong>, las descomposiciones dialécticas de <strong>Logos</strong> y las alertas de manipulación de <strong>Aletheia</strong> en vectores pedagógicos.</p>
          <p>No se imponen dogmas ni visiones ideológicas: se entrena la <strong>metacognición</strong> para que reconozcas cómo estás procesando la complejidad estructural del mundo contemporáneo.</p>
        </div>

        <div style="margin-top: 24px; padding: 14px; border: 1px dashed rgba(217, 119, 6, 0.3); background: rgba(217,119,6,0.02); max-width: 580px;">
          <h3 style="margin: 0 0 8px 0; font-size: 0.8rem; color: var(--accent);">¿Cómo interactuar?</h3>
          <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.78rem; color: rgba(229,231,235,0.6); line-height: 1.5;">
            Puedes desplegar la interfaz de diálogo continuo del Rey Filósofo utilizando el botón inferior izquierdo de la barra lateral. Úsalo mientras analizas textos en Sophia o debates mociones en Logos para calibrar tu rigor deductivo.
          </p>
        </div>
      </div>`
  },

  /* ── trayectoria y zpd ────────────────────────────── */
  zdp: {
    title: 'Trayectoria Formativa y ZPD',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Métricas de Autonomía</div>
        <h1 class="view-title">Zona de Desarrollo Próximo (ZPD)</h1>
        <div class="view-body">
          <p>La plataforma evalúa de forma asíncrona la madurez del pensamiento crítico del usuario. La ZPD define el espacio intermedio entre los conceptos que ya dominas de manera autónoma y los tópicos de alta abstracción sistémica en los que requieres guía del tutor.</p>
          <p>A largo plazo, tu trayectoria registrada en la base de datos local cifrada puede operar como una <strong>certificación pública y transparente</strong> de formación ciudadana deliberativa.</p>
        </div>

        <div style="margin-top:20px; background:var(--p-panel); border:1px solid var(--p-border); padding:16px; max-width:540px;">
          <div style="font-size:0.7rem; color:rgba(229,231,235,0.4); margin-bottom:10px; text-transform:uppercase;">Estructura de Persistencia</div>
          <p style="font-family:'IBM Plex Sans', sans-serif; font-size:0.8rem; margin:0 0 12px 0;">Cada interacción alimenta el vector de pesos del modelo cognitivo. Los datos de asimilación no salen de la custodia del ciudadano sin autorización explícita.</p>
          <div style="font-size:0.72rem; color:var(--accent);">✓ Estado del pipeline: Listo para enganche con Endpoint de Base de Datos relacional / no-relacional.</div>
        </div>
      </div>`
  },

  /* ── currículum epistemológico ────────────────────── */
  curriculum: {
    title: 'Currículum Epistemológico Universal',
    render: () => {
      const cards = Object.keys(USER_PROGRESS_DB.curriculum).map(key => {
        const item = USER_PROGRESS_DB.curriculum[key];
        let badgeCls = 'curr-badge--active';
        let badgeText = 'En Progreso';
        if (item.status === 'mastered') { badgeCls = 'curr-badge--mastered'; badgeText = 'Asimilado'; }
        if (item.status === 'locked') { badgeCls = ''; badgeText = 'Bloqueado'; }

        return `
          <div class="curr-card">
            <div>
              <div class="curr-header">
                <span class="curr-topic">${item.label}</span>
                <span class="curr-badge ${badgeCls}">${badgeText}</span>
              </div>
              <div class="curr-desc">${item.desc}</div>
            </div>
            <div class="curr-progress-container">
              <div class="curr-progress-bar" style="width: 0%" data-target="${item.value}%"></div>
            </div>
          </div>`;
      }).join('');

      return `
        <div class="view">
          <div class="view-eyebrow">Todo Ciudadano Sabe</div>
          <h1 class="view-title">Currículum Universal</h1>
          <div class="view-body">
            <p>Inspirado en la máxima epistemológica de Gregory Bateson, planteamos un esqueleto mínimo de herramientas que toda persona requiere manejar con fluidez para no ser víctima de la manipulación y participar con honestidad intelectual en el debate público moderno.</p>
          </div>
          <div class="curriculum-grid">
            ${cards}
          </div>
        </div>`;
    }
  },

  /* ── bitácora metacognitiva ────────────────────────── */
  metacognicion: {
    title: 'Bitácora Metacognitiva',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Registro de Autoevaluación</div>
        <h1 class="view-title">Bitácora Cognitiva</h1>
        <div class="view-body">
          <p>La bitácora almacena los quiebres lógicos detectados en tus propios discursos o análisis guardados. Mapea la distancia entre lo que creías saber y la fundamentación evidencial subyacente.</p>
          <p style="color: rgba(229,231,235,0.4); font-size:0.75rem;">[Esqueleto del Backend listo: Pendiente de vinculación con colecciones MongoDB o almacenamiento local en indexedDB].</p>
        </div>
      </div>`
  }
};

/* ─── ENRUTADOR Y CONTROLADOR CENTRAL ───────────────── */
const REY_FILOSOFO = {
  currentView: 'inicio',

  init() {
    // 1. Vincular los clicks de la navegación lateral del módulo
    document.querySelectorAll('.pnav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.view));
    });

    // 2. Controladores para la ventana emergente de chat (Pop-up Widget)
    const btnOpen = document.getElementById('btnOpenChat');
    const btnClose = document.getElementById('btnCloseChat');
    const chatPopup = document.getElementById('chatPopup');
    const btnSend = document.getElementById('btnSendChat');
    const chatInput = document.getElementById('chatInput');

    if (btnOpen && chatPopup) {
      btnOpen.addEventListener('click', () => {
        chatPopup.classList.add('open');
        if(window.innerWidth > 1024) chatInput.focus();
      });
    }

    if (btnClose && chatPopup) {
      btnClose.addEventListener('click', () => {
        chatPopup.classList.remove('open');
      });
    }

    if (btnSend && chatInput) {
      btnSend.addEventListener('click', () => this.handleUserMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserMessage();
      });
    }

    // Renderizar la vista inicial predeterminada
    this.navigate('inicio');
    this.syncSidebarLabels();
  },

  navigate(viewId) {
    const view = FILOSOFO_VIEWS[viewId];
    if (!view) return;
    this.currentView = viewId;

    // Actualizar encabezado central
    document.getElementById('viewTitle').textContent = view.title;

    // Renderizar la plantilla HTML
    const contentArea = document.getElementById('viewContent');
    contentArea.innerHTML = view.render();

    // Lanzar animaciones de barras de progreso
    this.animateProgressBars(contentArea);

    // Vincular eventos específicos de la vista de microtests
    if (viewId === 'microtests') {
      const mtRoot = document.getElementById('mtRoot');
      if (mtRoot) {
        mtRoot.innerHTML = MT_ENGINE.render();
        MT_ENGINE.bind(mtRoot);
      }
    }

    // Sincronizar estado visual de los botones de la barra lateral
    document.querySelectorAll('.pnav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewId);
    });

    contentArea.scrollTop = 0;
  },

  animateProgressBars(root) {
    requestAnimationFrame(() => {
      root.querySelectorAll('.curr-progress-bar[data-target]').forEach(bar => {
        requestAnimationFrame(() => {
          bar.style.width = bar.dataset.target;
        });
      });
    });
  },

  syncSidebarLabels() {
    // Vinculación simple simulando lectura de la sesión de base de datos
    const userLabel = document.getElementById('userLabel');
    const lblSync = document.getElementById('lblUserSync');
    if(userLabel && lblSync) {
      // Monitorear mutación de login/logout simulado en layout.js
      const observer = new MutationObserver(() => {
         if (userLabel.textContent.includes('Invitado')) {
           lblSync.textContent = "Usuario: Invitado (Local)";
         } else {
           lblSync.textContent = "Usuario: Rodrigo (Sincronizado)";
         }
      });
      observer.observe(userLabel, { childList: true });
    }
  },

  chatHistory: [],

  async handleUserMessage() {
    const input = document.getElementById('chatInput');
    const container = document.getElementById('chatMessages');
    if (!input || !input.value.trim() || !container) return;

    const userText = input.value.trim();
    input.value = '';

    // Insertar burbuja de usuario
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-msg user';
    userMsgDiv.innerHTML = `<strong>[Tú]</strong>: ${userText}`;
    container.appendChild(userMsgDiv);
    container.scrollTop = container.scrollHeight;
    this.chatHistory.push({ role: 'user', text: userText });

    // Indicador de "escribiendo..."
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg system';
    typingDiv.innerHTML = `<strong>[Tutor]</strong>: <em>reflexionando...</em>`;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    let tutorReply = null;
    let diagInfo = null; // guarda status + cuerpo crudo para mostrarlo si algo falla
    try {
      const response = await fetch('http://localhost:5000/api/reyfilosofo/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reyFilosofoIdentity(),
          message: userText,
          history: this.chatHistory.slice(-12)
        })
      });

      const rawText = await response.text(); // leemos como texto SIEMPRE, incluso si no es JSON válido
      diagInfo = `HTTP ${response.status} — ${rawText.slice(0, 400)}`;

      if (response.ok) {
        let data;
        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          diagInfo = `HTTP ${response.status} (respuesta no era JSON) — ${rawText.slice(0, 400)}`;
          data = null;
        }
        if (data) {
          tutorReply = data.reply || data.debug?.advice || data.debug || null;
        }
      }
    } catch (networkError) {
      diagInfo = `Error de red: ${networkError.message}`;
    }

    if (!tutorReply) {
      tutorReply = `[Error: no se recibió respuesta del tutor cognitivo]<br><span style="font-size:0.7rem; opacity:0.6;">Diagnóstico: ${diagInfo || 'sin datos'}</span>`;
    }

    typingDiv.innerHTML = `<strong>[Tutor]</strong>: ${tutorReply}`;
    container.scrollTop = container.scrollHeight;
    this.chatHistory.push({ role: 'tutor', text: tutorReply });
  }
};

document.addEventListener('DOMContentLoaded', () => REY_FILOSOFO.init());
