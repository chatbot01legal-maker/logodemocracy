/* ═══════════════════════════════════════════════════════
   REYFILOSOFOCHAT.JS — Motor Cognitivo v1.1
   Rey Filósofo — Servicio Cognitivo Transversal
   ═══════════════════════════════════════════════════════

   v1.1
   ───────────────────────────────────────────────────────
   Se incorpora una capa de accesibilidad / presentación
   mediante SpeechSynthesis del navegador.

   Esta capa:
   - NO modifica el backend.
   - NO modifica el contrato cognitivo.
   - NO modifica la inteligencia pedagógica.
   - NO genera llamadas adicionales a Gemini.
   - NO requiere un servicio TTS externo.

   Funciones:
   - ▶ Escuchar
   - ⏸ Pausar
   - ▶ Continuar
   - ⏹ Detener
   - Resaltado de la frase actualmente reproducida.

   La síntesis de voz es ejecutada localmente por el navegador /
   dispositivo mediante Web Speech API.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Configuración ──────────────────────────────────
  const CONTRACT_VERSION = '1.0';

  // Endpoint de mensajería del Motor Cognitivo v1.0
  const ENDPOINT = '/api/reyfilosofo/message';

  const SESSION_STORAGE_KEY = 'reyFilosofoSessionId';

  // Configuración de voz
  const SPEECH_LANG = 'es-CL';
  const SPEECH_RATE = 1.0;
  const SPEECH_PITCH = 1.0;
  const SPEECH_VOLUME = 1.0;

  // ─── Estado interno ─────────────────────────────────
  const state = {
    sessionId: null,
    activeAsset: null,
    conversation: [],
    isOpen: false,
    isSending: false
  };

  // ─── Estado independiente de lectura ────────────────
  const speechState = {
    supported: 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    messageIndex: null,
    chunks: [],
    chunkIndex: 0,
    isSpeaking: false,
    isPaused: false,
    utterance: null,
    voices: []
  };

  let container = null;

  let defaultSessionProvider = null;


  // ═════════════════════════════════════════════════════
  // NORMALIZACIÓN DEL ACTIVO COGNITIVO
  // ═════════════════════════════════════════════════════

  function normalizeCognitiveAsset(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error(
        'Se requiere un Activo Cognitivo válido: { source, objective, asset, ... }'
      );
    }

    const source = raw.source || (raw.metadata && raw.metadata.originModule);

    if (!source) {
      throw new Error(
        'El Activo Cognitivo requiere "source" o "metadata.originModule" (módulo de origen).'
      );
    }

    return {
      source: source,
      contractVersion: raw.contractVersion || CONTRACT_VERSION,
      objective: raw.objective || null,
      asset: raw.asset !== undefined ? raw.asset : null,
      conversation: Array.isArray(raw.conversation)
        ? raw.conversation.slice()
        : [],
      metadata:
        raw.metadata && typeof raw.metadata === 'object'
          ? raw.metadata
          : {}
    };
  }


  // ═════════════════════════════════════════════════════
  // SESIÓN
  // ═════════════════════════════════════════════════════

  function getSessionId() {
    if (state.sessionId) return state.sessionId;

    let sid = null;

    try {
      sid = localStorage.getItem(SESSION_STORAGE_KEY);

      if (!sid) {
        sid =
          window.crypto && window.crypto.randomUUID
            ? window.crypto.randomUUID()
            : 'rf-' +
              Date.now() +
              '-' +
              Math.random().toString(16).slice(2);

        localStorage.setItem(SESSION_STORAGE_KEY, sid);
      }
    } catch (e) {
      sid =
        'rf-' +
        Date.now() +
        '-' +
        Math.random().toString(16).slice(2);
    }

    state.sessionId = sid;

    return sid;
  }


  // ═════════════════════════════════════════════════════
  // ENVÍO DE MENSAJES
  // ═════════════════════════════════════════════════════

  async function sendMessage(rawText) {
    const text = (rawText || '').trim();

    if (!text || state.isSending) return;

    if (!state.activeAsset) {
      console.error(
        '❌ ReyFilosofoChat: no hay Activo Cognitivo activo. Llamar a .open() primero.'
      );
      return;
    }

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
  let errorData = null;

  try {
    errorData = await response.json();
  } catch (_) {
    // Si la respuesta no es JSON, se mantiene el manejo genérico.
  }

  if (
    response.status === 429 &&
    errorData &&
    errorData.code === 'AI_DAILY_LIMIT_REACHED'
  ) {
    const limitError = new Error(
      'Límite diario de procesamiento alcanzado.'
    );

    limitError.code = 'AI_DAILY_LIMIT_REACHED';
    limitError.resetAt = errorData.resetAt;

    throw limitError;
  }

  throw new Error(`El servidor respondió ${response.status}`);
      }

      const data = await response.json();

      const reply =
        (data && (data.content || data.reply || data.message)) || null;

      state.conversation.push({
        role: 'assistant',
        content:
          reply ||
          'No se recibió una respuesta legible del Rey Filósofo.',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(
        '❌ ReyFilosofoChat.sendMessage:',
        error.message
      );

      state.conversation.push({
        role: 'assistant',
        content:
          'No pude conectar con el Rey Filósofo en este momento. Intenta nuevamente en unos segundos.',
        timestamp: new Date().toISOString(),
        isError: true
      });

    } finally {
      state.isSending = false;
      renderPanel();
    }
  }


  // ═════════════════════════════════════════════════════
  // UTILIDADES HTML
  // ═════════════════════════════════════════════════════

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }


  // ═════════════════════════════════════════════════════
  // SISTEMA DE VOZ
  // ═════════════════════════════════════════════════════

  function loadSpeechVoices() {
    if (!speechState.supported) return;

    speechState.voices = window.speechSynthesis.getVoices() || [];
  }

  if (speechState.supported) {
    loadSpeechVoices();

    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
    }
  }


  // ─── Divide una respuesta en fragmentos razonables ──
  function splitTextForSpeech(text) {
    const clean = String(text || '').trim();

    if (!clean) return [];

    /*
     * Primero intentamos separar por frases.
     * Esto permite que el resaltado sea natural.
     */
    const sentenceParts = clean.match(
      /[^.!?…。！？]+[.!?…。！？]+|[^.!?…。！？]+$/g
    );

    if (!sentenceParts) {
      return [clean];
    }

    const chunks = [];

    sentenceParts.forEach(part => {
      const sentence = part.trim();

      if (!sentence) return;

      /*
       * Si una frase es excesivamente larga,
       * la dividimos aproximadamente por palabras.
       */
      if (sentence.length <= 220) {
        chunks.push(sentence);
        return;
      }

      const words = sentence.split(/\s+/);
      let current = '';

      words.forEach(word => {
        const candidate = current
          ? current + ' ' + word
          : word;

        if (candidate.length > 180 && current) {
          chunks.push(current);
          current = word;
        } else {
          current = candidate;
        }
      });

      if (current) {
        chunks.push(current);
      }
    });

    return chunks;
  }


  // ─── Obtiene una voz española disponible ─────────────
  function getPreferredVoice() {
    const voices = speechState.voices || [];

    if (!voices.length) return null;

    const preferredLanguages = [
      'es-CL',
      'es_CL',
      'es',
      'es-ES',
      'es-MX',
      'es-US'
    ];

    for (const language of preferredLanguages) {
      const exact = voices.find(
        voice =>
          voice.lang &&
          voice.lang.toLowerCase() === language.toLowerCase()
      );

      if (exact) return exact;
    }

    const spanish = voices.find(
      voice =>
        voice.lang &&
        voice.lang.toLowerCase().startsWith('es')
    );

    return spanish || null;
  }


  // ─── Actualiza visualmente el fragmento activo ───────
  function updateSpeechHighlight() {
    if (!container) return;

    const allChunks = container.querySelectorAll(
      '[data-rf-speech-chunk]'
    );

    allChunks.forEach(chunk => {
      const messageIndex = Number(
        chunk.getAttribute('data-message-index')
      );

      const chunkIndex = Number(
        chunk.getAttribute('data-chunk-index')
      );

      const active =
        speechState.isSpeaking &&
        messageIndex === speechState.messageIndex &&
        chunkIndex === speechState.chunkIndex;

      if (active) {
        chunk.style.background =
          'var(--rf-speech-highlight, rgba(59,130,246,.28))';

        chunk.style.borderRadius = '4px';
        chunk.style.padding = '1px 2px';
        chunk.style.boxShadow =
          '0 0 0 1px rgba(59,130,246,.18)';

      } else {
        chunk.style.background = '';
        chunk.style.borderRadius = '';
        chunk.style.padding = '';
        chunk.style.boxShadow = '';
      }
    });
  }


  // ─── Detener completamente la reproducción ──────────
  function stopSpeech() {
    if (!speechState.supported) return;

    window.speechSynthesis.cancel();

    speechState.messageIndex = null;
    speechState.chunks = [];
    speechState.chunkIndex = 0;
    speechState.isSpeaking = false;
    speechState.isPaused = false;
    speechState.utterance = null;

    renderPanel();
  }


  // ─── Reproduce el fragmento actual ──────────────────
  function speakCurrentChunk() {
    if (!speechState.supported) return;

    if (!speechState.chunks.length) {
      stopSpeech();
      return;
    }

    const chunk = speechState.chunks[speechState.chunkIndex];

    if (!chunk) {
      stopSpeech();
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(chunk);

    utterance.lang = SPEECH_LANG;
    utterance.rate = SPEECH_RATE;
    utterance.pitch = SPEECH_PITCH;
    utterance.volume = SPEECH_VOLUME;

    const preferredVoice = getPreferredVoice();

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechState.utterance = utterance;
    speechState.isSpeaking = true;
    speechState.isPaused = false;

    updateSpeechHighlight();

    utterance.onend = function () {
      /*
       * Si el usuario detuvo la reproducción,
       * no continuamos automáticamente.
       */
      if (!speechState.isSpeaking) return;

      speechState.chunkIndex += 1;

      if (
        speechState.chunkIndex >=
        speechState.chunks.length
      ) {
        speechState.messageIndex = null;
        speechState.chunks = [];
        speechState.chunkIndex = 0;
        speechState.isSpeaking = false;
        speechState.isPaused = false;
        speechState.utterance = null;

        renderPanel();
        return;
      }

      speakCurrentChunk();
    };

    utterance.onerror = function (event) {
      /*
       * "interrupted" ocurre normalmente cuando se llama
       * speechSynthesis.cancel(). No lo tratamos como un
       * error visible para el usuario.
       */
      if (event && event.error === 'interrupted') {
        return;
      }

      console.warn(
        '⚠️ ReyFilosofoChat: error de síntesis de voz:',
        event && event.error
      );

      speechState.isSpeaking = false;
      speechState.isPaused = false;
      speechState.utterance = null;

      renderPanel();
    };

    window.speechSynthesis.speak(utterance);
  }


  // ─── Comenzar lectura de una respuesta ───────────────
  function startSpeech(messageIndex) {
    if (!speechState.supported) {
      console.warn(
        '⚠️ Este navegador no soporta SpeechSynthesis.'
      );
      return;
    }

    const message = state.conversation[messageIndex];

    if (
      !message ||
      message.role !== 'assistant' ||
      message.isError
    ) {
      return;
    }

    const text = String(message.content || '').trim();

    if (!text) return;

    /*
     * Si ya estamos leyendo otra respuesta,
     * la detenemos antes de comenzar la nueva.
     */
    window.speechSynthesis.cancel();

    speechState.messageIndex = messageIndex;
    speechState.chunks = splitTextForSpeech(text);
    speechState.chunkIndex = 0;
    speechState.isSpeaking = true;
    speechState.isPaused = false;
    speechState.utterance = null;

    renderPanel();

    /*
     * Pequeño retraso para permitir que el navegador
     * procese el cambio de estado antes de hablar.
     */
    setTimeout(() => {
      if (
        speechState.isSpeaking &&
        speechState.messageIndex === messageIndex
      ) {
        speakCurrentChunk();
      }
    }, 30);
  }


  // ─── Pausar / continuar ─────────────────────────────
  function toggleSpeechPause() {
    if (!speechState.supported) return;

    if (!speechState.isSpeaking) return;

    if (speechState.isPaused) {
      window.speechSynthesis.resume();
      speechState.isPaused = false;
    } else {
      window.speechSynthesis.pause();
      speechState.isPaused = true;
    }

    renderPanel();
  }

   // ═════════════════════════════════════════════════════
// NORMALIZACIÓN VISUAL DE RESPUESTAS DEL REY FILÓSOFO
// ═════════════════════════════════════════════════════

function normalizeAssistantText(text) {
  let value = String(text || '');

  // Normalizar finales de línea
  value = value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  /*
   * Los modelos pueden insertar saltos de línea dentro
   * de un mismo párrafo. Los convertimos en espacios.
   *
   * Se mantienen los saltos dobles como separación
   * entre párrafos.
   */
  value = value
    .replace(/\n[ \t]*\n+/g, '\n\n')
    .replace(/[ \t]*\n[ \t]*/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return value;
}


function renderAssistantContent(text) {
  let value = normalizeAssistantText(text);

  /*
   * Primero escapamos HTML para que el contenido
   * generado por el modelo nunca pueda interpretarse
   * como HTML arbitrario.
   */
  value = escapeHtml(value);

  /*
   * Markdown básico: negrita.
   * **texto** → texto en negrita.
   */
  value = value.replace(
    /\*\*(.+?)\*\*/g,
    '<strong>$1</strong>'
  );

  /*
   * Markdown básico: cursiva.
   * *texto* → texto en cursiva.
   */
  value = value.replace(
    /(^|[^\*])\*([^*\n]+)\*(?!\*)/g,
    '$1<em>$2</em>'
  );

  /*
   * Los saltos dobles representan separación entre
   * párrafos.
   */
  value = value.replace(
    /\n\n/g,
    '<br><br>'
  );

  return value;
}

  // ─── Construye el texto de una respuesta con resaltado

function renderSpeechText(content, messageIndex) {
  const normalizedText =
    normalizeAssistantText(content);

  const chunks =
    splitTextForSpeech(normalizedText);

  if (!chunks.length) {
    return renderAssistantContent(
      normalizedText
    );
  }

  return chunks
    .map((chunk, index) => {
      const active =
        speechState.isSpeaking &&
        speechState.messageIndex === messageIndex &&
        speechState.chunkIndex === index;

      const activeStyle = active
        ? `
            background:var(--rf-speech-highlight, rgba(59,130,246,.28));
            border-radius:4px;
            padding:1px 2px;
            box-shadow:0 0 0 1px rgba(59,130,246,.18);
          `
        : '';

      return `
        <span
          data-rf-speech-chunk="true"
          data-message-index="${messageIndex}"
          data-chunk-index="${index}"
          style="${activeStyle}"
        >${renderAssistantContent(chunk)}</span>
      `;
    })
    .join(' ');
}

  // ─── Botones de voz de cada respuesta ───────────────
  function renderSpeechControls(messageIndex, message) {
    if (
      !speechState.supported ||
      message.isError ||
      !message.content
    ) {
      return '';
    }

    const isCurrent =
      speechState.messageIndex === messageIndex;

    const isSpeaking =
      isCurrent && speechState.isSpeaking;

    const isPaused =
      isCurrent && speechState.isPaused;

    if (!isSpeaking) {
      return `
        <div style="
          display:flex;
          align-items:center;
          gap:6px;
          margin-top:7px;
        ">
          <button
            data-rf-speech-action="play"
            data-message-index="${messageIndex}"
            title="Escuchar respuesta"
            style="
              background:transparent;
              border:1px solid var(--rf-border, rgba(255,255,255,.12));
              color:var(--rf-muted, rgba(229,231,235,.7));
              border-radius:6px;
              padding:4px 8px;
              cursor:pointer;
              font-size:.72rem;
            "
          >▶ Escuchar</button>
        </div>
      `;
    }

    return `
      <div style="
        display:flex;
        align-items:center;
        gap:6px;
        margin-top:7px;
      ">
        <button
          data-rf-speech-action="pause"
          data-message-index="${messageIndex}"
          title="${isPaused ? 'Continuar' : 'Pausar'}"
          style="
            background:transparent;
            border:1px solid var(--rf-border, rgba(255,255,255,.12));
            color:var(--rf-muted, rgba(229,231,235,.7));
            border-radius:6px;
            padding:4px 8px;
            cursor:pointer;
            font-size:.72rem;
          "
        >${isPaused ? '▶ Continuar' : '⏸ Pausar'}</button>

        <button
          data-rf-speech-action="stop"
          data-message-index="${messageIndex}"
          title="Detener lectura"
          style="
            background:transparent;
            border:1px solid var(--rf-border, rgba(255,255,255,.12));
            color:var(--rf-muted, rgba(229,231,235,.7));
            border-radius:6px;
            padding:4px 8px;
            cursor:pointer;
            font-size:.72rem;
          "
        >⏹ Detener</button>
      </div>
    `;
  }


  // ═════════════════════════════════════════════════════
  // RENDER DEL LAUNCHER
  // ═════════════════════════════════════════════════════

  function renderLauncher() {
    if (!container) return;

    container.innerHTML = `
      <button id="rf-launcher-btn" title="Rey Filósofo" style="
        position:fixed;
        bottom:24px;
        right:24px;
        z-index:9998;
        width:56px;
        height:56px;
        border-radius:50%;
        background:var(--rf-bg, #111827);
        border:1px solid var(--rf-accent-border, rgba(59,130,246,.4));
        color:var(--rf-text, #e5e7eb);
        font-size:1.4rem;
        cursor:pointer;
        box-shadow:0 4px 14px rgba(0,0,0,.4);
      ">🏛</button>
    `;

    const btn =
      document.getElementById('rf-launcher-btn');

    if (btn) {
      btn.onclick = () => {
        if (state.activeAsset) {
          state.isOpen = true;
          renderPanel();
          return;
        }

        if (typeof defaultSessionProvider === 'function') {
          const autoSession =
            defaultSessionProvider();

          if (autoSession) {
            ReyFilosofoChat.open(autoSession);
            return;
          }
        }

        console.warn(
          '⚠️ Rey Filósofo no tiene un Activo Cognitivo activo todavía.'
        );
      };
    }
  }


  // ═════════════════════════════════════════════════════
  // RENDER DEL PANEL
  // ═════════════════════════════════════════════════════

  function renderPanel() {
    if (!container) return;

    if (!state.isOpen) {
      renderLauncher();
      return;
    }

    let messagesHtml =
      state.conversation.length > 0
        ? state.conversation
            .map((m, messageIndex) => {
              const isAssistant =
                m.role === 'assistant';

              const messageContent =
                isAssistant
                  ? renderSpeechText(
                      m.content,
                      messageIndex
                    )
                  : escapeHtml(m.content);

              const speechControls =
                isAssistant
                  ? renderSpeechControls(
                      messageIndex,
                      m
                    )
                  : '';

              return `
                <div style="
                  margin-bottom:10px;
                  display:flex;
                  justify-content:${
                    m.role === 'user'
                      ? 'flex-end'
                      : 'flex-start'
                  };
                ">
                  <div style="
                    max-width:80%;
                    padding:8px 12px;
                    border-radius:10px;
                    font-size:.82rem;
                    line-height:1.45;
                    white-space: normal;
                    background:${
                      m.role === 'user'
                        ? 'var(--rf-user-bg, #1d4ed8)'
                        : (
                            m.isError
                              ? 'var(--rf-error-bg, #3f1d1d)'
                              : 'var(--rf-assistant-bg, #1f2937)'
                          )
                    };
                    color:${
                      m.role === 'user'
                        ? 'var(--rf-user-text, #ffffff)'
                        : (
                            m.isError
                              ? 'var(--rf-error-text, #fecaca)'
                              : 'var(--rf-assistant-text, #ffffff)'
                          )
                    } !important;
                  ">
                    <div>${messageContent}</div>
                    ${speechControls}
                  </div>
                </div>
              `;
            })
            .join('')
        : `
          <p style="
            color:var(--rf-faint, rgba(229,231,235,.4));
            font-size:.8rem;
          ">
            Cuéntale al Rey Filósofo qué te gustaría entender mejor sobre este documento.
          </p>
        `;


    // ─── Indicador de pensamiento ──────────────────────
    if (state.isSending) {
      messagesHtml += `
        <div style="
          margin-bottom:10px;
          display:flex;
          justify-content:flex-start;
          animation:rfPulse 1.5s infinite;
        ">
          <div style="
            max-width:80%;
            padding:8px 12px;
            border-radius:10px;
            font-size:.82rem;
            background:var(--rf-assistant-bg, #1f2937);
            color:var(--rf-assistant-text, #ffffff) !important;
            font-style:italic;
            display:flex;
            gap:4px;
            align-items:center;
          ">
            <span>Reflexionando...</span>
          </div>
        </div>

        <style>
          @keyframes rfPulse {
            0% { opacity:.5; }
            50% { opacity:1; }
            100% { opacity:.5; }
          }
        </style>
      `;
    }


    // ═══════════════════════════════════════════════════
    // PANEL
    // ═══════════════════════════════════════════════════

    container.innerHTML = `
      <div id="rf-panel" style="
        position:fixed;
        bottom:24px;
        right:24px;
        z-index:9999;
        width:340px;
        max-width:calc(100vw - 32px);
        height:460px;
        max-height:calc(100vh - 48px);
        background:var(--rf-bg, #0a0a0a);
        border:1px solid var(--rf-accent-border, rgba(59,130,246,.3));
        border-radius:10px;
        display:flex;
        flex-direction:column;
        box-shadow:0 8px 30px rgba(0,0,0,.5);
        overflow:hidden;
      ">

        <div style="
          padding:12px 14px;
          border-bottom:1px solid var(--rf-border, rgba(255,255,255,.08));
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <span style="
            color:var(--rf-text, #e5e7eb);
            font-size:.85rem;
            font-weight:500;
          ">
            🏛 Rey Filósofo
          </span>

          <button
            id="rf-close-btn"
            style="
              background:none;
              border:none;
              color:var(--rf-muted, rgba(229,231,235,.5));
              cursor:pointer;
              font-size:1rem;
              line-height:1;
            "
          >✕</button>
        </div>


        <div
          id="rf-messages"
          style="
            flex:1;
            overflow-y:auto;
            padding:14px;
          "
        >
          ${messagesHtml}
        </div>


        <div style="
          padding:10px;
          border-top:1px solid var(--rf-border, rgba(255,255,255,.08));
          display:flex;
          gap:8px;
        ">
          <textarea
            id="rf-input"
            placeholder="${
              state.isSending
                ? 'Esperando respuesta...'
                : 'Escribe tu pregunta...'
            }"
            ${state.isSending ? 'disabled' : ''}
            style="
              flex:1;
              resize:none;
              height:38px;
              background:var(--rf-input-bg, #111827);
              border:1px solid var(--rf-border, rgba(255,255,255,.1));
              border-radius:6px;
              color:var(--rf-text, #e5e7eb);
              font-size:.8rem;
              padding:8px 10px;
            "
          ></textarea>

          <button
            id="rf-send-btn"
            ${state.isSending ? 'disabled' : ''}
            style="
              background:var(--rf-accent, #1d4ed8);
              border:none;
              border-radius:6px;
              color:var(--rf-user-text, #fff);
              padding:0 14px;
              cursor:pointer;
              font-size:.8rem;
            "
          >
            ${state.isSending ? '...' : 'Enviar'}
          </button>
        </div>

      </div>
    `;


    // ═══════════════════════════════════════════════════
    // EVENTOS DEL PANEL
    // ═══════════════════════════════════════════════════

    const closeBtn =
      document.getElementById('rf-close-btn');

    if (closeBtn) {
      closeBtn.onclick = () =>
        ReyFilosofoChat.close();
    }


    const sendBtn =
      document.getElementById('rf-send-btn');

    const input =
      document.getElementById('rf-input');

    if (
      sendBtn &&
      input &&
      !state.isSending
    ) {
      sendBtn.onclick = () => {
        const text = input.value;

        input.value = '';

        sendMessage(text);
      };

      input.onkeydown = e => {
        if (
          e.key === 'Enter' &&
          !e.shiftKey
        ) {
          e.preventDefault();
          sendBtn.click();
        }
      };

      input.focus();
    }


    // ═══════════════════════════════════════════════════
    // EVENTOS DE LOS BOTONES DE VOZ
    // ═══════════════════════════════════════════════════

    const speechButtons =
      container.querySelectorAll(
        '[data-rf-speech-action]'
      );

    speechButtons.forEach(button => {
      button.onclick = () => {
        const action =
          button.getAttribute(
            'data-rf-speech-action'
          );

        const messageIndex = Number(
          button.getAttribute(
            'data-message-index'
          )
        );

        if (action === 'play') {
          startSpeech(messageIndex);
        }

        if (action === 'pause') {
          toggleSpeechPause();
        }

        if (action === 'stop') {
          stopSpeech();
        }
      };
    });


    // ─── Scroll automático ─────────────────────────────
    const messagesEl =
      document.getElementById('rf-messages');

    if (messagesEl) {
      messagesEl.scrollTop =
        messagesEl.scrollHeight;
    }

    updateSpeechHighlight();
  }


  // ═════════════════════════════════════════════════════
  // API PÚBLICA
  // ═════════════════════════════════════════════════════

  const ReyFilosofoChat = {

    init() {
      if (container) return;

      container =
        document.createElement('div');

      container.id =
        'rey-filosofo-root';

      document.body.appendChild(container);

      renderLauncher();
    },

    setActiveAsset(cognitiveAsset) {
      let normalized;

      try {
        normalized =
          normalizeCognitiveAsset(
            cognitiveAsset
          );
      } catch (e) {
        console.error(
          '❌ ReyFilosofoChat.setActiveAsset():',
          e.message
        );
        return false;
      }

      /*
       * Actualizamos únicamente el contexto documental.
       *
       * IMPORTANTE:
       * - No reemplazamos la conversación.
       * - No generamos una nueva sesión.
       * - No abrimos ni cerramos el chat.
       * - No modificamos el estado de voz.
       *
       * El siguiente mensaje enviado al backend utilizará
       * este nuevo activeAsset.
       */
      state.activeAsset = normalized;

      /*
       * Si el panel está abierto, lo redibujamos para que
       * el estado interno quede sincronizado inmediatamente.
       */
      if (state.isOpen) {
        renderPanel();
      }

      return true;
    },

    open(cognitiveAsset) {
      let normalized;

      try {
        normalized =
          normalizeCognitiveAsset(
            cognitiveAsset
          );
      } catch (e) {
        console.error(
          '❌ ReyFilosofoChat.open():',
          e.message
        );

        return;
      }

      state.activeAsset = normalized;

      state.conversation =
        normalized.conversation.slice();

      state.isOpen = true;

      getSessionId();

      if (!container) {
        this.init();
      }

      renderPanel();
    },


    close() {
      state.isOpen = false;

      /*
       * Cerramos el panel, pero NO detenemos automáticamente
       * la voz. Esto permite que el usuario pueda cerrar el
       * panel sin interrumpir la lectura si el navegador lo
       * permite.
       *
       * Si posteriormente prefieres que cerrar el panel
       * detenga la voz, basta con cambiar esta decisión.
       */
      renderLauncher();
    },


    setDefaultSessionProvider(fn) {
      if (typeof fn === 'function') {
        defaultSessionProvider = fn;
      }
    },


    _getState() {
      return {
        sessionId: state.sessionId,
        activeAsset: state.activeAsset,
        conversation:
          state.conversation.slice(),
        isOpen: state.isOpen,
        isSending: state.isSending,
        speech: {
          supported:
            speechState.supported,
          messageIndex:
            speechState.messageIndex,
          isSpeaking:
            speechState.isSpeaking,
          isPaused:
            speechState.isPaused,
          chunkIndex:
            speechState.chunkIndex
        }
      };
    }
  };


  // ─── Exposición global ──────────────────────────────
  window.ReyFilosofoChat =
    ReyFilosofoChat;


  // ─── Inicialización ─────────────────────────────────
  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      () =>
        ReyFilosofoChat.init()
    );
  } else {
    ReyFilosofoChat.init();
  }

})();
