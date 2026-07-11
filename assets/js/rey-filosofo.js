// assets/js/rey-filosofo.js
// Controlador principal del Rey Filósofo.
// Coordina ApiClient y ChatUI, gestiona la sesión y el flujo de mensajes.
// No contiene lógica de razonamiento, ZDP, Sophia, ni evaluación.

(function() {
  'use strict';

  // --- Estado ---
  var sessionId = null;
  var isLoading = false;
  
  // --- Hito 5.3: Contexto Cognitivo Centralizado ---
  function getCognitiveContext() {
    if (
      typeof CognitiveRuntime !== 'undefined' &&
      typeof CognitiveRuntime.getUserContext === 'function'
    ) {
      return CognitiveRuntime.getUserContext();
    }
    return null;
  }
  
  // --- Funciones de sesión ---

  function getOrCreateSessionId() {
    var stored = localStorage.getItem(CONFIG.SESSION_STORAGE_KEY);
    if (stored) {
      return stored;
    }
    var newId;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      newId = crypto.randomUUID();
    } else {
      newId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    localStorage.setItem(CONFIG.SESSION_STORAGE_KEY, newId);
    return newId;
  }

  // --- Vistas SPA ---

  var views = {
    inicio: {
      title: 'Rey Filósofo — Tutoría Cognitiva Personalizada',
      render: function() {
        return `
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
          </div>
        `;
      }
    },

    microtests: {
      title: 'Perfil de Aprendizaje',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Autoconocimiento Pedagógico</div>
            <h1 class="view-title">Microtests de Estilo de Aprendizaje</h1>
            <p style="font-family:'IBM Plex Sans',sans-serif; color:rgba(229,231,235,.6); max-width:620px; line-height:1.6;">
              Esta funcionalidad está en proceso de migración al backend. Pronto podrás completar los microtests y el Rey Filósofo ajustará su acompañamiento automáticamente.
            </p>
            <div style="margin-top: 20px; padding: 20px; border: 1px solid rgba(217,119,6,0.2); background: rgba(217,119,6,0.03); max-width: 500px;">
              <p style="font-size:0.8rem; color:rgba(229,231,235,.5);">Mientras tanto, puedes usar el chat para explorar cualquier tema.</p>
            </div>
          </div>
        `;
      }
    },

    zdp: {
      title: 'Trayectoria Formativa y ZPD',
      render: function() {
        return `
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
              <div style="font-size:0.72rem; color:var(--accent);">✓ Estado del pipeline: Listo para enganche con Endpoint de Base de Datos.</div>
            </div>
          </div>
        `;
      }
    },

    curriculum: {
      title: 'Currículum Epistemológico Universal',
      render: function() {
        // Mock de currículum (solo visual, sin lógica)
        var items = [
          { label: 'Lógica Formal y Falacias', desc: 'Identificación de silogismos inválidos, sesgos cognitivos y manipulación retórica.', status: 'active', value: 75 },
          { label: 'Estadística e Inferencia', desc: 'Comprensión de distribuciones, correlación vs causalidad y muestreos ponderados.', status: 'active', value: 40 },
          { label: 'Sistemas Complejos y Entropía', desc: 'Estructuras dinámicas, bucles de retroalimentación y degradación informativa.', status: 'active', value: 15 },
          { label: 'Epistemología Cívica', desc: 'El costo epistémico del discurso y demarcación entre hechos e interpretaciones.', status: 'mastered', value: 100 },
          { label: 'Economía Política Compleja', desc: 'Análisis sistémico de asignación de recursos y modelos de votación cuadrática.', status: 'locked', value: 0 }
        ];

        var cards = items.map(function(item) {
          var badgeCls = 'curr-badge--active';
          var badgeText = 'En Progreso';
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
                <div class="curr-progress-bar" style="width: ${item.value}%"></div>
              </div>
            </div>
          `;
        }).join('');

        return `
          <div class="view">
            <div class="view-eyebrow">Todo Ciudadano Sabe</div>
            <h1 class="view-title">Currículum Universal</h1>
            <div class="view-body">
              <p>Inspirado en la máxima epistemológica de Gregory Bateson, planteamos un esqueleto mínimo de herramientas que toda persona requiere manejar con fluidez para no ser víctima de la manipulación y participar con honestidad intelectual en el debate público moderno.</p>
            </div>
            <div class="curriculum-grid">${cards}</div>
          </div>
        `;
      }
    },

    metacognicion: {
      title: 'Bitácora Metacognitiva',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Registro de Autoevaluación</div>
            <h1 class="view-title">Bitácora Cognitiva</h1>
            <div class="view-body">
              <p>La bitácora almacena los quiebres lógicos detectados en tus propios discursos o análisis guardados. Mapea la distancia entre lo que creías saber y la fundamentación evidencial subyacente.</p>
              <p style="color: rgba(229,231,235,0.4); font-size:0.75rem;">[Esqueleto del Backend listo: Pendiente de vinculación con colecciones MongoDB o almacenamiento local en indexedDB].</p>
            </div>
          </div>
        `;
      }
    }
  };

  // --- Navegación SPA ---

  function navigate(viewId) {
    var view = views[viewId];
    if (!view) return;

    // Actualizar título
    var titleEl = document.getElementById('viewTitle');
    if (titleEl) titleEl.textContent = view.title;

    // Renderizar contenido
    var contentEl = document.getElementById('viewContent');
    if (contentEl) {
      contentEl.innerHTML = view.render();
      // Animar barras de progreso (si existen)
      contentEl.querySelectorAll('.curr-progress-bar').forEach(function(bar) {
        var target = bar.style.width;
        bar.style.width = '0%';
        setTimeout(function() {
          bar.style.width = target;
        }, 50);
      });
    }

    // Resaltar botón activo en sidebar
    document.querySelectorAll('.pnav-item[data-view]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Scroll al inicio
    if (contentEl) contentEl.scrollTop = 0;
  }

  // --- Envío de mensaje ---

  async function sendMessage() {
    if (isLoading) return;

    var text = ChatUI.getAndClearInput();
    if (!text) {
      ChatUI.focusInput();
      return;
    }

    // Mostrar mensaje del usuario
    ChatUI.showMessage('<strong>[Tú]</strong>: ' + text, 'user');

    // Estado de carga
    isLoading = true;
    ChatUI.setLoading(true);

    // Mensaje "pensando"
    var thinkingEl = document.createElement('div');
    thinkingEl.className = 'chat-msg system';
    thinkingEl.innerHTML = '<strong>[Tutor]</strong>: <em>reflexionando...</em>';
    var container = document.getElementById('chatMessages');
    container.appendChild(thinkingEl);
    container.scrollTop = container.scrollHeight;

    try {
      var payload = {
        sessionId: sessionId,
        content: text,
        provider_module: CONFIG.DEFAULT_PROVIDER
      };

      var response = await ApiClient.process(payload);

      // Eliminar mensaje de "pensando"
      thinkingEl.remove();

      // Extraer respuesta según contrato
      var reply = response.adapted_content;
      if (reply) {
        ChatUI.showMessage('<strong>[Tutor]</strong>: ' + reply, 'system');
      } else {
        // Fallback: mostrar JSON completo
        ChatUI.showMessage('<strong>[Tutor]</strong>: Respuesta recibida (sin contenido adaptado).<br><span style="font-size:0.7rem;opacity:0.6;">' + JSON.stringify(response) + '</span>', 'system');
      }
    } catch (error) {
      thinkingEl.remove();
      ChatUI.showError('Error: ' + error.message);
    } finally {
      isLoading = false;
      ChatUI.setLoading(false);
      ChatUI.focusInput();
    }
  }

  // --- Inicialización ---

  function init() {
    // Obtener o crear sessionId
    sessionId = getOrCreateSessionId();
    var cognitiveContext = getCognitiveContext();

    console.log(
      "[Rey Filósofo] Contexto cognitivo:",
      cognitiveContext
    );
    
    // Configurar eventos del chat
    ChatUI.onSendClick(sendMessage);
    ChatUI.onInputEnter(sendMessage);

    // Abrir/cerrar popup
    ChatUI.onOpenPopup(function(e) {
      e.preventDefault();
      ChatUI.openPopup();
    });
    ChatUI.onClosePopup(function(e) {
      e.preventDefault();
      ChatUI.closePopup();
    });

    // Navegación por sidebar
    document.querySelectorAll('.pnav-item[data-view]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        navigate(this.dataset.view);
      });
    });

    // Vista inicial
    navigate('inicio');

    // Mensaje de bienvenida en el chat (solo si está vacío)
    var messages = document.getElementById('chatMessages');
    if (messages && messages.children.length === 0) {
      ChatUI.showMessage('<strong>[Tutor]</strong>: Saludos, ciudadano. Soy tu acompañante cognitivo. No te daré respuestas empaquetadas; examinaré tus premisas y andamiaré tu comprensión de los módulos (Sophia, Logos, Aletheia o la Academia). ¿Qué idea deseas desglosar hoy?', 'system');
    }

    // --- Hito 5.3: Sincronización UI defensiva (Estricta al contrato) ---
    var lblSync = document.getElementById('lblUserSync');
    var lblZdp = document.getElementById('lblZdpLevel');
    var userLabel = document.getElementById('userLabel');

    if (cognitiveContext) {
      // Contrato validado: solo sabemos que existe 'identity' y 'strategy'
      if (lblSync && cognitiveContext.identity) {
        lblSync.textContent = 'Usuario: Sincronizado (Runtime)';
      }
      if (lblZdp && cognitiveContext.strategy) {
        lblZdp.textContent = 'ZPD: Estrategia Vinculada';
      }
    } else {
      // Fallback estricto si no hay Runtime
      if (userLabel && lblSync) {
        var isLoggedIn = !userLabel.textContent.includes('Invitado');
        lblSync.textContent = isLoggedIn ? 'Usuario: Autenticado (Local)' : 'Usuario: Invitado (Local)';
      }
    }
  } // <-- Lllave de cierre de init() que faltaba
    
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
