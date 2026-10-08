/* =========================================================
   REY FILÓSOFO · CREA TU PROPIA LIBRERÍA
   Onboarding de 9 pantallas para configurar un curso personal.
   Frontend puro. Sin backend todavía (loader mockeado).
   ========================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'rf-libreria-draft-v1';

  // Total de pantallas reales de configuración (excluyendo intro, resumen y loader)
  var CONFIG_STEPS = 8;

  var STYLES_DEMO = [
    {
      id: 'neutro',
      label: 'Neutro',
      text: 'La biblioteca estaba cerrada. Las luces se habían apagado hacía horas. En los estantes, miles de libros esperaban en silencio.'
    },
    {
      id: 'bolano',
      label: 'Bolaño',
      text: 'Y entonces, cuando ya nadie lo esperaba, apareció el poeta en la puerta de la biblioteca, con la misma cara de siempre, la de un tipo que no había dormido, y me dijo: "vamos, hay cosas que tienes que leer antes de que se haga de día".'
    },
    {
      id: 'borges',
      label: 'Borges',
      text: 'La biblioteca, según la tradición que recogió el cronista John Wilkins en el siglo XVII, es infinita y periódica. En sus anaqueles no se guardan los libros que fueron escritos, sino todos los que podrían haber sido escritos.'
    },
    {
      id: 'vargas',
      label: 'Vargas Llosa',
      text: 'La biblioteca ocupaba el ala norte del caserón, y en las noches de verano el olor a papel viejo se mezclaba con el jazmín del jardín. Don Rigoberto solía sentarse allí después de la cena, no para leer sino para hojear.'
    },
    {
      id: 'saramago',
      label: 'Saramago',
      text: 'Los libros, en la biblioteca, están quietos, pero no callados, y si alguien dijera que están quietos y callados a la vez sería porque no ha escuchado, con la paciencia que requiere, el murmullo que sale de las páginas cuando nadie las lee.'
    },
    {
      id: 'foucault',
      label: 'Foucault',
      text: 'La biblioteca, más que un depósito de textos, es un dispositivo de saber. En su arquitectura se inscriben las relaciones de poder que definen qué se conserva, qué se clasifica y qué se descarta.'
    }
  ];

  var state = {
    step: 0, // 0=intro, 1..8=config, 9=resumen, 10=loader
    answers: {
      tema: '',
      proposito: '',
      dificultad: '',
      conocimiento: '',
      atraccion: '',
      tecnico: '',
      estilo: '',
      referencias: '',
      titulo: ''
    }
  };

  // ─── Persistencia ──────────────────────────────────

  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && data.answers) {
        state.answers = Object.assign(state.answers, data.answers);
        state.step = typeof data.step === 'number' ? data.step : 0;
      }
    } catch (e) {}
  }

  function clearDraft() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function resetAll() {
    state.step = 0;
    state.answers = {
      tema: '', proposito: '', dificultad: '', conocimiento: '',
      atraccion: '', tecnico: '', estilo: '', referencias: '', titulo: ''
    };
    clearDraft();
    render();
  }

  // ─── Helpers ───────────────────────────────────────

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function getRoot() {
    return document.getElementById('rf-libreria-root');
  }

  function progressPct() {
    if (state.step <= 0) return 0;
    if (state.step >= 9) return 100;
    return Math.round((state.step / CONFIG_STEPS) * 100);
  }

  // ─── Pantallas ─────────────────────────────────────

  function screenIntro() {
    return '' +
      '<div class="rfl-screen rfl-screen--intro">' +
        '<div class="rfl-intro-mark">🏛</div>' +
        '<h2 class="rfl-h2">Vamos a prepararte un curso.</h2>' +
        '<p class="rfl-p">Vas a elegir el tema y algunas cosas más. Después, Rey Filósofo se lo encarga a su bibliotecario, que te va a armar <strong>cinco documentos cortos</strong> para leer.</p>' +
        '<p class="rfl-p rfl-p--muted">Tarda unos 2 minutos.</p>' +
        '<div class="rfl-actions">' +
          '<button class="rfl-btn rfl-btn--primary" data-action="start">Empezar →</button>' +
        '</div>' +
      '</div>';
  }

  function screenTema() {
    var chips = ['Fórmula 1', 'Vikingos', 'Historia del fútbol', 'Alien', 'Cocina japonesa', 'Inteligencia artificial'];
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 1 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Sobre qué quieres aprender?</h2>' +
        '<p class="rfl-p">Un tema, una pregunta, algo que te intrigue.</p>' +
        '<input type="text" class="rfl-input" id="rfl-tema" placeholder="Ej: Fórmula 1" value="' + esc(state.answers.tema) + '">' +
        '<div class="rfl-hint">Algunas ideas:</div>' +
        '<div class="rfl-chips">' +
          chips.map(function(c){ return '<button class="rfl-chip" data-fill="tema" data-value="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') +
        '</div>' +
      '</div>';
  }

  function screenProposito() {
    var opts = [
      { id: 'desde_cero', title: '🎓 Aprender desde cero', sub: '"Nunca escuché hablar del tema y quiero entender de qué se trata."' },
      { id: 'profundizar', title: '🔍 Profundizar lo que ya sé', sub: '"Conozco lo básico y quiero ir más adentro."' },
      { id: 'curiosidad', title: '🎈 Curiosidad / entretenerme', sub: '"Me llamó la atención y quiero saber un poco más."' },
      { id: 'aplicar', title: '🛠 Aplicarlo a algo concreto', sub: '"Lo necesito para un proyecto, trabajo o decisión."' }
    ];
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 2 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Para qué quieres este curso?</h2>' +
        '<p class="rfl-p">Elige lo que más se parezca a lo que buscas.</p>' +
        '<div class="rfl-cards">' +
          opts.map(function(o){
            var sel = state.answers.proposito === o.id ? ' rfl-card--selected' : '';
            return '<button class="rfl-card' + sel + '" data-answer="proposito" data-value="' + o.id + '">' +
                     '<div class="rfl-card-title">' + o.title + '</div>' +
                     '<div class="rfl-card-sub">' + o.sub + '</div>' +
                   '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function screenDificultad() {
    var opts = [
      { id: 'principiante', title: 'Principiante', sub: 'Una función es como una máquina: metes un número, sale otro. Si metes 3, quizás sale 6.' },
      { id: 'intermedio', title: 'Intermedio', sub: 'Una función asocia a cada valor de entrada un único valor de salida. Por ejemplo, f(x) = 2x duplica lo que le des.' },
      { id: 'avanzado', title: 'Avanzado', sub: 'Una función f: A → B es una relación que asigna a cada elemento de A exactamente un elemento de B.' }
    ];
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 3 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Qué tan profundo quieres ir?</h2>' +
        '<p class="rfl-p">Mira la misma idea explicada de tres maneras y elige la que más te resuene.</p>' +
        '<div class="rfl-cards rfl-cards--stack">' +
          opts.map(function(o){
            var sel = state.answers.dificultad === o.id ? ' rfl-card--selected' : '';
            return '<button class="rfl-card' + sel + '" data-answer="dificultad" data-value="' + o.id + '">' +
                     '<div class="rfl-card-title">' + esc(o.title) + '</div>' +
                     '<div class="rfl-card-sub rfl-card-sub--example">' + esc(o.sub) + '</div>' +
                   '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function screenConocimiento() {
    var opts = ['Nada', 'Poco', 'Bastante', 'Soy del tema'];
    var ids = ['nada', 'poco', 'bastante', 'del_tema'];
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 4 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Cuánto conocés del tema hoy?</h2>' +
        '<p class="rfl-p">Sin exagerar ni achicar. Esto ayuda a calibrar el punto de partida.</p>' +
        '<div class="rfl-row">' +
          opts.map(function(label, i){
            var sel = state.answers.conocimiento === ids[i] ? ' rfl-pill--selected' : '';
            return '<button class="rfl-pill' + sel + '" data-answer="conocimiento" data-value="' + ids[i] + '">' + esc(label) + '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function screenAtraccion() {
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 5 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Qué te llamó la atención del tema?</h2>' +
        '<p class="rfl-p">Cuéntame en una o dos líneas. Cuanto más concreto, mejor te va a hablar el curso.</p>' +
        '<textarea class="rfl-input rfl-textarea" id="rfl-atraccion" placeholder="Ej: Me gusta cómo los equipos diseñan estrategias distintas cada temporada.">' + esc(state.answers.atraccion) + '</textarea>' +
      '</div>';
  }

  function screenTecnico() {
    var opts = [
      { id: 'divulgativo', title: 'Divulgativo', sub: 'Un agujero negro es una región del espacio donde la gravedad es tan fuerte que ni la luz puede escapar.' },
      { id: 'tecnico', title: 'Técnico', sub: 'Un agujero negro es una solución de las ecuaciones de campo de Einstein con horizonte de sucesos y singularidad central.' }
    ];
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 6 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Cómo quieres que te expliquen?</h2>' +
        '<p class="rfl-p">Misma idea, dos registros distintos.</p>' +
        '<div class="rfl-cards rfl-cards--stack">' +
          opts.map(function(o){
            var sel = state.answers.tecnico === o.id ? ' rfl-card--selected' : '';
            return '<button class="rfl-card' + sel + '" data-answer="tecnico" data-value="' + o.id + '">' +
                     '<div class="rfl-card-title">' + esc(o.title) + '</div>' +
                     '<div class="rfl-card-sub rfl-card-sub--example">' + esc(o.sub) + '</div>' +
                   '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function screenEstilo() {
    /* Los textos de STYLES_DEMO son placeholders.
       PLACEHOLDER: reemplazar párrafos por versiones definitivas. */
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 7 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Cómo te gustaría leerlo?</h2>' +
        '<p class="rfl-p">Lee estos párrafos sobre un mismo tema y elige el estilo que más te guste.</p>' +
        '<div class="rfl-styles">' +
          STYLES_DEMO.map(function(s){
            var sel = state.answers.estilo === s.id ? ' rfl-style--selected' : '';
            return '<button class="rfl-style' + sel + '" data-answer="estilo" data-value="' + s.id + '">' +
                     '<div class="rfl-style-label">' + esc(s.label) + '</div>' +
                     '<div class="rfl-style-text">' + esc(s.text) + '</div>' +
                   '</button>';
          }).join('') +
        '</div>' +
        '<div class="rfl-hint rfl-hint--action"><button class="rfl-link" data-answer="estilo" data-value="neutro">Me da igual, usa neutro →</button></div>' +
      '</div>';
  }

  function screenReferencias() {
    var opts = [
      { id: 'si', title: 'Sí, con referencias', sub: 'Al final de cada documento vas a ver libros, autores y años.' },
      { id: 'no', title: 'No, lectura limpia', sub: 'Sin notas al pie ni bibliografía. Solo el texto.' }
    ];
    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Paso 8 de ' + CONFIG_STEPS + '</div>' +
        '<h2 class="rfl-h2">¿Querés que incluya referencias bibliográficas?</h2>' +
        '<p class="rfl-p">Por si después quieres profundizar por tu cuenta.</p>' +
        '<div class="rfl-cards rfl-cards--stack">' +
          opts.map(function(o){
            var sel = state.answers.referencias === o.id ? ' rfl-card--selected' : '';
            return '<button class="rfl-card' + sel + '" data-answer="referencias" data-value="' + o.id + '">' +
                     '<div class="rfl-card-title">' + esc(o.title) + '</div>' +
                     '<div class="rfl-card-sub">' + esc(o.sub) + '</div>' +
                   '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function screenResumen() {
    var a = state.answers;
    var labelMap = {
      proposito: { desde_cero:'Aprender desde cero', profundizar:'Profundizar', curiosidad:'Curiosidad', aplicar:'Aplicarlo a algo concreto' },
      dificultad: { principiante:'Principiante', intermedio:'Intermedio', avanzado:'Avanzado' },
      conocimiento: { nada:'Nada', poco:'Poco', bastante:'Bastante', del_tema:'Soy del tema' },
      tecnico: { divulgativo:'Divulgativo', tecnico:'Técnico' },
      referencias: { si:'Sí', no:'No' }
    };
    var auto = a.tema ? (a.tema + ': una introducción') : 'Mi curso';
    var titulo = a.titulo || auto;

    var rows = [
      ['Tema', esc(a.tema || '—')],
      ['Propósito', esc(labelMap.proposito[a.proposito] || '—')],
      ['Dificultad', esc(labelMap.dificultad[a.dificultad] || '—')],
      ['Lo que ya sabes', esc(labelMap.conocimiento[a.conocimiento] || '—')],
      ['Te atrae', esc(a.atraccion || '—')],
      ['Nivel', esc(labelMap.tecnico[a.tecnico] || '—')],
      ['Estilo', esc(a.estilo || '—')],
      ['Referencias', esc(labelMap.referencias[a.referencias] || '—')]
    ];

    return '' +
      '<div class="rfl-screen">' +
        '<div class="rfl-eyebrow">Antes de generar</div>' +
        '<h2 class="rfl-h2">Mira lo que elegiste</h2>' +
        '<label class="rfl-label" for="rfl-titulo">Título del curso</label>' +
        '<input type="text" class="rfl-input" id="rfl-titulo" value="' + esc(titulo) + '">' +
        '<div class="rfl-summary">' +
          rows.map(function(r){
            return '<div class="rfl-summary-row"><span class="rfl-summary-key">' + r[0] + '</span><span class="rfl-summary-val">' + r[1] + '</span></div>';
          }).join('') +
        '</div>' +
        '<div class="rfl-actions rfl-actions--split">' +
          '<button class="rfl-btn rfl-btn--ghost" data-action="restart">Empezar de nuevo</button>' +
          '<button class="rfl-btn rfl-btn--primary" data-action="generate">Generar mi curso →</button>' +
        '</div>' +
      '</div>';
  }

  function screenLoader() {
    return '' +
      '<div class="rfl-screen rfl-screen--loader">' +
        '<div class="rfl-loader-mark">⌛</div>' +
        '<h2 class="rfl-h2">Estamos preparando tu curso.</h2>' +
        '<p class="rfl-p">Rey Filósofo le pidió al bibliotecario cinco documentos sobre <strong>' + esc(state.answers.tema || 'tu tema') + '</strong>. Vas a poder leerlos en unos segundos.</p>' +
        '<p class="rfl-p rfl-p--muted" id="rfl-loader-note">Conectando con el bibliotecario…</p>' +
        '<div class="rfl-loader-actions" style="display:none" id="rfl-loader-done">' +
          '<button class="rfl-btn rfl-btn--ghost" data-action="back-to-inicio">Volver al inicio de Rey Filósofo</button>' +
        '</div>' +
      '</div>';
  }

  // ─── Render ────────────────────────────────────────

  function renderProgress() {
    if (state.step <= 0 || state.step >= 9) return '';
    var pct = progressPct();
    return '' +
      '<div class="rfl-progress">' +
        '<div class="rfl-progress-bar" style="width:' + pct + '%"></div>' +
      '</div>';
  }

  function renderNavButtons() {
    if (state.step <= 0) return '';
    if (state.step >= 9) return '';
    var back = state.step > 1 ? '<button class="rfl-btn rfl-btn--ghost" data-action="back">← Atrás</button>' : '<span></span>';
    var next = '<button class="rfl-btn rfl-btn--primary" data-action="next">Continuar →</button>';
    return '<div class="rfl-actions rfl-actions--split">' + back + next + '</div>';
  }

  function currentScreen() {
    switch (state.step) {
      case 0: return screenIntro();
      case 1: return screenTema();
      case 2: return screenProposito();
      case 3: return screenDificultad();
      case 4: return screenConocimiento();
      case 5: return screenAtraccion();
      case 6: return screenTecnico();
      case 7: return screenEstilo();
      case 8: return screenReferencias();
      case 9: return screenResumen();
      case 10: return screenLoader();
      default: return screenIntro();
    }
  }

  function render() {
    var root = getRoot();
    if (!root) return;
    root.innerHTML = '' +
      '<div class="rfl-wrap">' +
        renderProgress() +
        '<div class="rfl-body" id="rfl-body">' +
          currentScreen() +
        '</div>' +
        renderNavButtons() +
      '</div>';
    // Si estamos en el loader, simular el proceso
    if (state.step === 10) {
      simulateLoader();
    }
  }

  function simulateLoader() {
    var note = document.getElementById('rfl-loader-note');
    if (!note) return;
    var phases = [
      'Consultando al bibliotecario…',
      'Diseñando los cinco documentos…',
      'Escribiendo el primero…',
      'Escribiendo el segundo…',
      'Escribiendo el tercero…',
      'Escribiendo el cuarto…',
      'Escribiendo el quinto…',
      'Revisando el conjunto…'
    ];
    var i = 0;
    var timer = setInterval(function () {
      if (i >= phases.length) {
        clearInterval(timer);
        note.textContent = 'Esto es una demostración. Cuando el bibliotecario esté listo, tu curso va a aparecer aquí y en la Academia.';
        var done = document.getElementById('rfl-loader-done');
        if (done) done.style.display = 'block';
        return;
      }
      note.textContent = phases[i];
      i++;
    }, 900);
  }

  // ─── Input handling ────────────────────────────────

  function readField(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function saveCurrentField() {
    switch (state.step) {
      case 1: state.answers.tema = readField('rfl-tema'); break;
      case 5: state.answers.atraccion = readField('rfl-atraccion'); break;
      case 9: state.answers.titulo = readField('rfl-titulo'); break;
    }
  }

  function validStep() {
    // Devuelve null si está OK, o un mensaje de error
    switch (state.step) {
      case 1: return state.answers.tema ? null : 'Escribe un tema para continuar.';
      case 2: return state.answers.proposito ? null : 'Elige una opción.';
      case 3: return state.answers.dificultad ? null : 'Elige un nivel.';
      case 4: return state.answers.conocimiento ? null : 'Elige una opción.';
      case 6: return state.answers.tecnico ? null : 'Elige un nivel técnico.';
      case 7: return state.answers.estilo ? null : 'Elige un estilo (o "me da igual").';
      case 8: return state.answers.referencias ? null : 'Elige una opción.';
    }
    return null;
  }

  function showError(msg) {
    var body = document.getElementById('rfl-body');
    if (!body) return;
    var existing = body.querySelector('.rfl-error');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'rfl-error';
    div.textContent = msg;
    body.appendChild(div);
  }

  function onNext() {
    saveCurrentField();
    var err = validStep();
    if (err) { showError(err); return; }
    if (state.step < 9) {
      state.step++;
      saveDraft();
      render();
    }
  }

  function onBack() {
    saveCurrentField();
    if (state.step > 1) {
      state.step--;
      saveDraft();
      render();
    }
  }

  function onStart() {
    state.step = 1;
    saveDraft();
    render();
  }

  function onAnswer(field, value) {
    state.answers[field] = value;
    saveDraft();
    render();
  }

  function onFillTema(value) {
    state.answers.tema = value;
    saveDraft();
    render();
  }

  function onGenerate() {
    saveCurrentField();
    if (!state.answers.titulo) {
      state.answers.titulo = state.answers.tema + ': una introducción';
    }
    state.step = 10;
    saveDraft();
    render();
  }

  function onRestart() {
    if (!confirm('¿Empezar de nuevo? Se van a borrar tus respuestas.')) return;
    resetAll();
  }

  function onBackToInicio() {
    if (window.ReyFilosofo && typeof window.ReyFilosofo.navigateTo === 'function') {
      window.ReyFilosofo.navigateTo('inicio');
    }
  }

  // ─── Delegación de eventos ─────────────────────────

  function bindEvents() {
    var root = getRoot();
    if (!root || root._rflBound) return;
    root._rflBound = true;

    root.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-action],[data-answer],[data-fill]');
      if (!t) return;

      if (t.dataset.action === 'start') { onStart(); return; }
      if (t.dataset.action === 'next') { onNext(); return; }
      if (t.dataset.action === 'back') { onBack(); return; }
      if (t.dataset.action === 'generate') { onGenerate(); return; }
      if (t.dataset.action === 'restart') { onRestart(); return; }
      if (t.dataset.action === 'back-to-inicio') { onBackToInicio(); return; }

      if (t.dataset.fill === 'tema') { onFillTema(t.dataset.value); return; }
      if (t.dataset.answer) { onAnswer(t.dataset.answer, t.dataset.value); return; }
    });

    root.addEventListener('input', function (ev) {
      if (ev.target.id === 'rfl-tema') { state.answers.tema = ev.target.value; saveDraft(); }
      if (ev.target.id === 'rfl-atraccion') { state.answers.atraccion = ev.target.value; saveDraft(); }
      if (ev.target.id === 'rfl-titulo') { state.answers.titulo = ev.target.value; saveDraft(); }
    });
  }

  // ─── Ciclo de vida ─────────────────────────────────

  function mount() {
    loadDraft();
    render();
    bindEvents();
  }

  function unmount() {
    // No hacemos nada por ahora; el draft persiste en localStorage.
  }

  window.ReyFilosofoLibreria = {
    mount: mount,
    unmount: unmount,
    reset: resetAll,
    getState: function () { return JSON.parse(JSON.stringify(state)); }
  };
})();
