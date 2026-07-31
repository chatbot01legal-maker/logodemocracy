/* ═══════════════════════════════════════════════════════
REYFILOSOFOCHAT.JS — Motor Cognitivo v1.0
Rey Filósofo — Servicio Cognitivo Transversal
═══════════════════════════════════════════════════════

Esta implementación NO es la aplicación definitiva del Rey Filósofo.
Es el Motor Cognitivo v1.0: el núcleo mínimo y reutilizable que
cualquier módulo del ecosistema LogoDemocracy invocará.

Principios de diseño arquitectónico:

1. Agnosticismo de Infraestructura: Este motor NO conoce HTTP, 
   no tiene endpoints, ni dependencias de red. Toda comunicación 
   con el backend se delega al adaptador inyectado en `onSendMessage`.

2. Servicio cognitivo: El Rey Filósofo no pertenece a ningún módulo.
   Se alimenta de una Sesión Cognitiva (Cognitive Session) que incluye
   el activo, el objetivo pedagógico y sus políticas.

3. Frontend Anémico: Toda la inteligencia vive en el backend. 
   El motor jamás interpreta el activo, ni la policy, ni arma prompts.
   Solo recibe, muestra, envía y transporta.

═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Configuración ──────────────────────────────────
  const CONTRACT_VERSION = '1.0';
  const SESSION_STORAGE_KEY = 'reyFilosofoSessionId';

  // ─── Estado interno ─────────────────────────────────
  // Vive únicamente acá. Ningún módulo externo debe tocarlo directamente.
  const state = {
    sessionId: null,
    cognitiveSession: null, // Reemplaza al antiguo 'activeAsset'
    conversation: [],       // Historial de la sesión actual en memoria
    isOpen: false,
    isSending: false
  };

  let container = null; // Nodo DOM raíz del widget

  // ─── Contrato de entrada: normalización tolerante ───
  // Solo garantiza la forma mínima del contrato antes de transportarlo
  // intacto al backend. Incorpora "policy" para directrices pedagógicas.
  function normalizeCognitiveSession(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Se requiere una Sesión Cognitiva válida: { source, objective, asset, ... }');
    }
    if (!raw.source) {
      throw new Error('La Sesión Cognitiva requiere "source" (módulo de origen).');
    }
    return {
      source: raw.source,
      contractVersion: raw.contractVersion || CONTRACT_VERSION,
      objective: raw.objective || null,
      asset: raw.asset !== undefined ? raw.asset : null,
      policy: (raw.policy && typeof raw.policy === 'object') ? raw.policy : {},
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
  // El payload transporta la sesión completa al backend a través
  // del adaptador inyectado (onSendMessage).
  async function sendMessage(rawText) {
    const text = (rawText || '').trim();
    if (!text || state.isSending) return;

    if (!state.cognitiveSession) {
      console.error('❌ ReyFilosofoChat: no hay Sesión Cognitiva activa. Llamar a .open() primero.');
      return;
    }

    if (typeof ReyFilosofoChat.onSendMessage !== 'function') {
      console.error('❌ ReyFilosofoChat: Adaptador de red no configurado. Debes definir ReyFilosofoChat.onSendMessage.');
      return;
    }

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    state.conversation.push(userMessage);
    state.isSending = true;
    renderPanel();

    const payload = {
      sessionId: getSessionId(),
      content: userMessage.content,
      provider_module: state.cognitiveSession.source,
      cognitiveSession: state.cognitiveSession // Transporta activo, política, objetivo, etc.
    };

    try {
      // El motor delega la llamada HTTP/WebSocket al adaptador externo.
      // Espera que el adaptador devuelva un string con la respuesta.
      const reply = await ReyFilosofoChat.onSendMessage(payload);
      
      state.conversation.push({
        role: 'assistant',
        content: reply || 'No se recibió una respuesta legible del Rey Filósofo.',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ ReyFilosofoChat.sendMessage:', error.message);
      state.conversation.push({
        role: 'assistant',
        content: 'No pude conectar con el Rey Filósofo en este momento. Intentá nuevamente en unos segundos.',
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
    container.innerHTML = `<button id="rf-launcher-btn" title="Rey Filósofo" style="   position:fixed; bottom:24px; right:24px; z-index:9998;   width:56px; height:56px; border-radius:50%;   background:#111827; border:1px solid rgba(59,130,246,.4);   color:#e5e7eb; font-size:1.4rem; cursor:pointer;   box-shadow:0 4px 14px rgba(0,0,0,.4);   ">🏛</button>`;
    const btn = document.getElementById('rf-launcher-btn');
    if (btn) {
      btn.onclick = () => {
        if (!state.cognitiveSession) {
          console.warn('⚠️ Rey Filósofo no tiene una Sesión Cognitiva activa todavía.');
          return;
        }
        state.isOpen = true;
        renderPanel();
      };
    }
  }

  function renderPanel() {
    if (!container) return;
    if (!state.isOpen) {
      renderLauncher();
      return;
    }

    const messagesHtml = state.conversation.length > 0
      ? state.conversation.map(m => `
          <div style="margin-bottom:10px; display:flex; justify-content:${m.role === 'user' ? 'flex-end' : 'flex-start'};">
            <div style="
              max-width:80%; padding:8px 12px; border-radius:10px;
              font-size:.82rem; line-height:1.45; white-space:pre-wrap;
              background:${m.role === 'user' ? '#1d4ed8' : (m.isError ? '#3f1d1d' : '#1f2937')};
              color:#e5e7eb;
            ">${escapeHtml(m.content)}</div>
          </div>
        `).join('')
      : `<p style="color:rgba(229,231,235,.4); font-size:.8rem;">Contale al Rey Filósofo qué te gustaría entender mejor sobre esto.</p>`;

    container.innerHTML = `
      <div id="rf-panel" style="
        position:fixed; bottom:24px; right:24px; z-index:9999;
        width:340px; max-width:calc(100vw - 32px);
        height:460px; max-height:calc(100vh - 48px);
        background:#0a0a0a; border:1px solid rgba(59,130,246,.3);
        border-radius:10px; display:flex; flex-direction:column;
        box-shadow:0 8px 30px rgba(0,0,0,.5); overflow:hidden;
      ">
        <div style="padding:12px 14px; border-bottom:1px solid rgba(255,255,255,.08); display:flex; justify-content:space-between; align-items:center;">
          <span style="color:#e5e7eb; font-size:.85rem; font-weight:500;">🏛 Rey Filósofo</span>
          <button id="rf-close-btn" style="background:none; border:none; color:rgba(229,231,235,.5); cursor:pointer; font-size:1rem; line-height:1;">✕</button>
        </div>
        <div id="rf-messages" style="flex:1; overflow-y:auto; padding:14px;">${messagesHtml}</div>
        <div style="padding:10px; border-top:1px solid rgba(255,255,255,.08); display:flex; gap:8px;">
          <textarea id="rf-input"
            placeholder="${state.isSending ? 'Esperando respuesta...' : 'Escribí tu pregunta...'}"
            ${state.isSending ? 'disabled' : ''}
            style="flex:1; resize:none; height:38px; background:#111827; border:1px solid rgba(255,255,255,.1); border-radius:6px; color:#e5e7eb; font-size:.8rem; padding:8px 10px;"
          ></textarea>
          <button id="rf-send-btn" ${state.isSending ? 'disabled' : ''} style="background:#1d4ed8; border:none; border-radius:6px; color:#fff; padding:0 14px; cursor:pointer; font-size:.8rem;">${state.isSending ? '...' : 'Enviar'}</button>
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
    // ⚠️ IMPORTANTE: El módulo que integre este chat debe definir esta función
    // y devolver una Promesa que resuelva con el texto de la respuesta.
    onSendMessage: null, 

    init() {
      if (container) return;
      container = document.createElement('div');
      container.id = 'rey-filosofo-root';
      document.body.appendChild(container);
      renderLauncher();
    },

    open(sessionData) {
      let normalized;
      try {
        normalized = normalizeCognitiveSession(sessionData);
      } catch (e) {
        console.error('❌ ReyFilosofoChat.open():', e.message);
        return;
      }
      state.cognitiveSession = normalized;
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

    _getState() {
      return {
        sessionId: state.sessionId,
        cognitiveSession: state.cognitiveSession,
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
