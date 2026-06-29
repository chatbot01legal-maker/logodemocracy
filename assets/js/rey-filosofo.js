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

/* ─── VISTAS DE NAVEGACIÓN INTERNA ──────────────────── */
const FILOSOFO_VIEWS = {

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

  handleUserMessage() {
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

    // Respuesta simulada del tutor cognitivo enfocado en andamiaje
    setTimeout(() => {
      const tutorMsgDiv = document.createElement('div');
      tutorMsgDiv.className = 'chat-msg system';
      tutorMsgDiv.innerHTML = `<strong>[Tutor]</strong>: Has propuesto una premisa interesante. En lugar de validar si es correcta o incorrecta, examinemos: ¿qué supuestos empíricos sostienen esa afirmación y cómo altera la carga evidencial del argumento?`;
      container.appendChild(tutorMsgDiv);
      container.scrollTop = container.scrollHeight;
    }, 750);
  }
};

document.addEventListener('DOMContentLoaded', () => REY_FILOSOFO.init());
