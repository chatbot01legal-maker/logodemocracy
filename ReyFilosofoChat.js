/* ═══════════════════════════════════════════════════════
   REYFILOSOFOCHAT.JS — Motor Cognitivo v1.0
   Rey Filósofo — Servicio Cognitivo Transversal
   ═══════════════════════════════════════════════════════

   Esta implementación NO es la aplicación definitiva del Rey Filósofo.
   Es el Motor Cognitivo v1.0: el núcleo mínimo y reutilizable que
   cualquier módulo del ecosistema LogoDemocracy (SOPHIA, Academia, y
   los que vengan después) puede invocar para que el Rey Filósofo
   acompañe al usuario sobre un Activo Cognitivo.

   Principios de diseño (no negociables en esta versión):
   1. Servicio cognitivo: el Rey Filósofo no pertenece a ningún módulo.
   2. Desacoplamiento: este archivo nunca debe conocer la lógica
      interna de SOPHIA, Academia, ni de ningún módulo futuro.
      Solo conoce el contrato de datos definido más abajo.
   3. Toda la inteligencia pedagógica vive en el backend. Este archivo
      no interpreta el activo, no arma prompts, no aplica reglas
      pedagógicas — solo recibe, muestra, envía y transporta.

   La arquitectura de estado/API está separada de la de render
   deliberadamente, para que la futura aplicación completa (con
   autenticación, ZDP, perfil de aprendizaje, memoria pedagógica,
   etc.) pueda añadirse como capas nuevas sobre este mismo núcleo,
   sin reescribirlo.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Configuración ──────────────────────────────────
  const CONTRACT_VERSION = '1.0';

  // Endpoint de mensajería del Motor Cognitivo v1.0
  const ENDPOINT = '/api/reyfilosofo/message';

  const SESSION_STORAGE_KEY = 'reyFilosofoSessionId';

  // ─── Estado interno ─────────────────────────────────
  const state = {
    sessionId: null,
    activeAsset: null,   // el Activo Cognitivo recibido del módulo origen
    conversation: [],    // historial de la sesión actual (en memoria)
    isOpen: false,
    isSending: false
  };

  let container = null; // nodo DOM raíz del widget (botón + panel)

  // Función opcional que cada página puede registrar con
  // setDefaultSessionProvider(). El motor la llama únicamente cuando el
  // botón flotante se toca sin que haya una sesión activa todavía — el
  // motor sigue sin saber nada de Academia, SOPHIA ni ningún módulo
  // específico, solo invoca lo que la página le haya registrado.
  let defaultSessionProvider = null;

  // ─── Contrato de entrada: normalización tolerante ───
  function normalizeCognitiveAsset(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Se requiere un Activo Cognitivo válido: { source, objective, asset, ... }');
    }
    
    // Soporta 'source' directo o 'metadata.originModule' generado por CognitiveSessionFactory
    const source = raw.source || (raw.metadata && raw.metadata.originModule);
    if (!source) {
      throw new Error('El Activo Cognitivo requiere "source" o "metadata.originModule" (módulo de origen).');
    }

    return {
      source: source,
      contractVersion: raw.contractVersion || CONTRACT_VERSION,
      objective: raw.objective || null,
      asset: raw.asset !== undefined ? raw.asset : null,
      conversation: Array.isArray(raw.conversation) ? raw.conversation.slice() : [],
      metadata: (raw.metadata && typeof raw.metadata === 'object') ? raw.metadata : {}
    };
  }

  function getSessionId() {
    if (state.sessionId) return state.sessionId;
    let sid = null;
    try {
      sid = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sid) {
        sid = (window.crypto && window.crypto.randomUUID)
          ? window.crypto.randomUUID()
          : ('rf-' + Date.now() + '-' + Math.random().toString(16).slice(2));
        localStorage.setItem(SESSION_STORAGE_KEY, sid);
      }
    } catch (e) {
      sid = 'rf-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    }
    state.sessionId = sid;
    return sid;
  }

  // ─── Envío de mensajes ──────────────────────────────
  async function sendMessage(rawText) {
    const text = (rawText || '').trim();
    if (!text || state.isSending) return;

    if (!state.activeAsset) {
      console.error('❌ ReyFilosofoChat: no hay Activo Cognitivo activo. Llamar a .open() primero.');
      return;
    }

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    state.conversation.push(userMessage);
    state.isSending = true;
    renderPanel();

    const payload = {
      sessionId: getSessionId(),
      content: userMessage.content,
      provider_module: state.activeAsset.source,
      activeAsset: state.activeAsset
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`El servidor respondió ${response.status}`);
      }

      const data = await response.json();
      const reply = (data && (data.content || data.reply || data.message)) || null;

      state.conversation.push({
        role: 'assistant',
        content: reply || 'No se recibió una respuesta legible del Rey Filósofo.',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ ReyFilosofoChat.sendMessage:', error.message);
      state.conversation.push({
        role: 'assistant',
        content: 'No pude conectar con el Rey Filósofo en este momento. Intenta nuevamente en unos segundos.',
        timestamp: new Date().toISOString(),
        isError: true
      });
    } finally {
      state.isSending = false;
      renderPanel();
    }
  }

  // ─── Render ──────────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderLauncher() {
    if (!container) return;
    container.innerHTML = `
      <button id="rf-launcher-btn" title="Rey Filósofo" style="
        position:fixed; bottom:24px; right:24px; z-index:9998;
        width:56px; height:56px; border-radius:50%;
        background:var(--c-bg-raised, #111827); border:1px solid var(--c-rey-border, rgba(59,130,246,.4));
        color:var(--c-text, #e5e7eb); font-size:1.4rem; cursor:pointer;
        box-shadow:0 4px 14px rgba(0,0,0,.4);
      ">🏛</button>
    `;
    const btn = document.getElementById('rf-launcher-btn');
    if (btn) {
      btn.onclick = () => {
        if (state.activeAsset) {
          state.isOpen = true;
          renderPanel();
          return;
        }
        // Todavía no hay sesión abierta (nadie tocó "Profundizar" antes).
        // Si la página registró un proveedor por defecto, lo usamos para
        // construir la sesión al vuelo con el contexto actual — así el
        // botón flotante también funciona como primer punto de entrada,
        // no solo como reabridor de una sesión ya iniciada.
        if (typeof defaultSessionProvider === 'function') {
          const autoSession = defaultSessionProvider();
          if (autoSession) {
            ReyFilosofoChat.open(autoSession);
            return;
          }
        }
        console.warn('⚠️ Rey Filósofo no tiene un Activo Cognitivo activo todavía.');
      };
    }
  }

  function renderPanel() {
    if (!container) return;
    if (!state.isOpen) {
      renderLauncher();
      return;
    }

    let messagesHtml = state.conversation.length > 0
      ? state.conversation.map(m => `
          <div style="margin-bottom:10px; display:flex; justify-content:${m.role === 'user' ? 'flex-end' : 'flex-start'};">
            <div style="
              max-width:80%; padding:8px 12px; border-radius:10px;
              font-size:.82rem; line-height:1.45; white-space:pre-wrap;
              background:${m.role === 'user' ? 'var(--c-rey, #1d4ed8)' : (m.isError ? 'var(--c-error-bg, #3f1d1d)' : 'var(--c-bg-raised, #1f2937)')};
              color:${m.role === 'user' ? 'var(--c-on-accent, #fff)' : 'var(--c-text, #e5e7eb)'};
            ">${escapeHtml(m.content)}</div>
          </div>
        `).join('')
      : `<p style="color:var(--c-faint, rgba(229,231,235,.4)); font-size:.8rem;">Cuéntale al Rey Filósofo qué te gustaría entender mejor sobre este documento.</p>`;

    // === CAMBIO MÍNIMO: INDICADOR DE PENSANDO ===
    if (state.isSending) {
      messagesHtml += `
        <div style="margin-bottom:10px; display:flex; justify-content:flex-start; animation: pulse 1.5s infinite;">
          <div style="
            max-width:80%; padding:8px 12px; border-radius:10px;
            font-size:.82rem; background:var(--c-bg-raised, #1f2937); color:var(--c-muted, #9ca3af); font-style:italic; display:flex; gap:4px; align-items:center;
          ">
            <span>Reflexionando...</span>
          </div>
        </div>
        <style>
          @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        </style>
      `;
    }

    container.innerHTML = `
      <div id="rf-panel" style="
        position:fixed; bottom:24px; right:24px; z-index:9999;
        width:340px; max-width:calc(100vw - 32px);
        height:460px; max-height:calc(100vh - 48px);
        background:var(--c-bg, #0a0a0a); border:1px solid var(--c-rey-border, rgba(59,130,246,.3));
        border-radius:10px; display:flex; flex-direction:column;
        box-shadow:0 8px 30px rgba(0,0,0,.5); overflow:hidden;
      ">
        <div style="padding:12px 14px; border-bottom:1px solid var(--c-border, rgba(255,255,255,.08)); display:flex; justify-content:space-between; align-items:center;">
          <span style="color:var(--c-text, #e5e7eb); font-size:.85rem; font-weight:500;">🏛 Rey Filósofo</span>
          <button id="rf-close-btn" style="background:none; border:none; color:var(--c-muted, rgba(229,231,235,.5)); cursor:pointer; font-size:1rem; line-height:1;">✕</button>
        </div>
        <div id="rf-messages" style="flex:1; overflow-y:auto; padding:14px;">${messagesHtml}</div>
        <div style="padding:10px; border-top:1px solid var(--c-border, rgba(255,255,255,.08)); display:flex; gap:8px;">
          <textarea id="rf-input"
            placeholder="${state.isSending ? 'Esperando respuesta...' : 'Escribe tu pregunta...'}"
            ${state.isSending ? 'disabled' : ''}
            style="flex:1; resize:none; height:38px; background:var(--c-bg-raised, #111827); border:1px solid var(--c-border, rgba(255,255,255,.1)); border-radius:6px; color:var(--c-text, #e5e7eb); font-size:.8rem; padding:8px 10px;"
          ></textarea>
          <button id="rf-send-btn" ${state.isSending ? 'disabled' : ''} style="background:var(--c-rey, #1d4ed8); border:none; border-radius:6px; color:var(--c-on-accent, #fff); padding:0 14px; cursor:pointer; font-size:.8rem;">${state.isSending ? '...' : 'Enviar'}</button>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('rf-close-btn');
    if (closeBtn) closeBtn.onclick = () => ReyFilosofoChat.close();

    const sendBtn = document.getElementById('rf-send-btn');
    const input = document.getElementById('rf-input');
    if (sendBtn && input && !state.isSending) {
      sendBtn.onclick = () => {
        const text = input.value;
        input.value = '';
        sendMessage(text);
      };
      input.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendBtn.click();
        }
      };
      input.focus();
    }

    const messagesEl = document.getElementById('rf-messages');
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ─── API pública ─────────────────────────────────────
  const ReyFilosofoChat = {

    init() {
      if (container) return;
      container = document.createElement('div');
      container.id = 'rey-filosofo-root';
      document.body.appendChild(container);
      renderLauncher();
    },

    open(cognitiveAsset) {
      let normalized;
      try {
        normalized = normalizeCognitiveAsset(cognitiveAsset);
      } catch (e) {
        console.error('❌ ReyFilosofoChat.open():', e.message);
        return;
      }
      state.activeAsset = normalized;
      state.conversation = normalized.conversation.slice();
      state.isOpen = true;
      getSessionId();
      if (!container) this.init();
      renderPanel();
    },

    close() {
      state.isOpen = false;
      renderLauncher();
    },

    // Cada página llama a esto UNA VEZ al cargar, para decirle al motor
    // cómo construir una sesión "de emergencia" si el usuario toca el
    // botón flotante sin haber abierto ninguna sesión todavía.
    // fn debe ser una función sin argumentos que devuelva una
    // CognitiveSession (por ejemplo, vía CognitiveSessionFactory) o null
    // si en este momento no hay nada disponible para mostrar.
    setDefaultSessionProvider(fn) {
      if (typeof fn === 'function') {
        defaultSessionProvider = fn;
      }
    },

    _getState() {
      return {
        sessionId: state.sessionId,
        activeAsset: state.activeAsset,
        conversation: state.conversation.slice(),
        isOpen: state.isOpen,
        isSending: state.isSending
      };
    }
  };

  window.ReyFilosofoChat = ReyFilosofoChat;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ReyFilosofoChat.init());
  } else {
    ReyFilosofoChat.init();
  }

})();
         
