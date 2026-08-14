/* ═══════════════════════════════════════════════════════
   LOGOS.JS — Frontend del instrumento Logos v0.1.1
   Ecosistema LogoDemocracy

   Sigue el mismo patrón arquitectónico que sophia.js:
   - Un objeto VIEWS con render() por sección, renderizado dentro de
     #viewContent (mismo contenedor, mismas clases CSS que SOPHIA).
   - Un objeto LOGOS que expone navigate(), init() y la lógica de la
     herramienta de Comparar Posiciones.

   IMPORTANTE — alcance de este archivo:
   Este archivo implementa el FRONTEND completo: navegación, contenido
   explicativo del protocolo, y la interfaz de "Comparar Posiciones"
   (columnas A/B, envío al backend, render de resultados).

   NO implementa el motor cognitivo de Logos (reconstrucción, prueba de
   reconstrucción, steelman, síntesis, etc.) — eso vive en el backend,
   en un endpoint todavía por construir: POST /api/logos/compare.
   Ver el contrato exacto de entrada/salida esperado más abajo, junto
   a la función compareWithLogos().
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Contenido de referencia del protocolo (para las vistas explicativas) ──
  const SINTESIS_TIPOS = [
    { nombre: 'Síntesis descriptiva', pregunta: '¿Qué están diciendo realmente A y B?', detalle: 'Reconstrucción fiel de cada posición en sus propios términos. Es prerrequisito de las otras dos.' },
    { nombre: 'Síntesis relacional', pregunta: '¿Cómo se relacionan realmente A y B?', detalle: 'Mapa de acuerdos, desacuerdos, supuestos compartidos y diferencias clasificadas por tipo.' },
    { nombre: 'Síntesis generativa — de solución', pregunta: '¿Qué nueva propuesta responde a la pregunta tal como estaba formulada?', detalle: 'A + B → una propuesta nueva que ninguna posición contenía por separado.' },
    { nombre: 'Síntesis generativa — de problema', pregunta: '¿Estábamos formulando mal la pregunta?', detalle: 'A + B → se descubre que el problema tiene una dimensión que ninguna posición consideraba. Suele ser el resultado más valioso.' }
  ];

  const DESACUERDO_TIPOS = [
    { tipo: 'Factual', desc: 'Las posiciones discrepan respecto de hechos.' },
    { tipo: 'Causal', desc: 'Discrepan respecto de qué causa qué.' },
    { tipo: 'Conceptual', desc: 'Usan o entienden de manera diferente un mismo concepto.' },
    { tipo: 'Normativo', desc: 'Discrepan respecto de valores, principios o criterios de deseabilidad.' },
    { tipo: 'Metodológico', desc: 'Discrepan respecto de cómo debe conocerse o evaluarse el problema.' },
    { tipo: 'Estratégico', desc: 'Comparten objetivos, discrepan sobre el mecanismo para alcanzarlos.' }
  ];

  const FASES = [
    { id: 'fase1', nombre: 'Reconstrucción', desc: 'Logos reconstruye cada posición por separado (síntesis descriptiva) y la somete a la Prueba de Reconstrucción: "¿Reconocés esto como una representación fiel?" — la persona confirma, rechaza o precisa.' },
    { id: 'fase2', nombre: 'Comprensión Mutua', desc: 'Cómo entiende A la posición de B, y cómo entiende B la posición de A. Aquí puede aplicarse el Steelman dialéctico: la mejor versión posible de la posición contraria, validada por su propio autor.' },
    { id: 'fase3', nombre: 'Acuerdos y Diferencias', desc: 'Primer mapeo relacional: puntos de acuerdo explícito, supuestos compartidos, y diferencias clasificadas por tipo.' },
    { id: 'fase4', nombre: 'Convergencias', desc: 'Puntos donde ambas posiciones podrían encontrarse — distinguiendo convergencias ya encontradas de convergencias posibles bajo cierta condición.' },
    { id: 'fase5', nombre: 'Síntesis', desc: 'Síntesis relacional completa y, si corresponde, síntesis generativa (de solución o de problema) — siempre presentada como propuesta, nunca como conclusión.' }
  ];

  const INDICADORES = [
    { nombre: 'Comprensión de A / B', detalle: 'No es un puntaje calculado — es el resultado de la Prueba de Reconstrucción validada por la propia parte (confirmada / rechazada / precisada).' },
    { nombre: 'Simetría de comprensión', detalle: 'Si ambas posiciones fueron reconstruidas y validadas con igual profundidad.' },
    { nombre: 'Coincidencias y Desacuerdos', detalle: 'Cantidad y naturaleza de puntos de acuerdo y desacuerdo explícito.' },
    { nombre: 'Naturaleza de los desacuerdos', detalle: 'Distribución por tipo (factual, causal, conceptual, normativo, metodológico, estratégico). Categórico, no numérico.' },
    { nombre: 'Puntos de convergencia', detalle: 'Zonas donde una síntesis relacional o generativa parece más alcanzable.' },
    { nombre: 'Preguntas abiertas', detalle: 'Preguntas deliberativas generadas y todavía no resueltas.' }
  ];

  // ─── VISTAS ──────────────────────────────────────────
  const VIEWS = {

    comparar: {
      title: 'Comparar Posiciones',
      render: () => `
        <div class="view-eyebrow">Modalidad A</div>
        <h1 class="view-title">Comparar Posiciones</h1>
        <div class="view-body">
          <p>Cargá los materiales de dos posiciones — documentos, argumentos, extractos — y Logos las reconstruye, las relaciona y explora posibles síntesis. Ninguna síntesis se presenta como conclusión: siempre queda sujeta a tu evaluación.</p>
        </div>

        <div class="view-section" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div>
            <div class="view-section-title" style="color:var(--accent);">Posición A</div>
            <textarea id="logos-posicion-a" placeholder="Pegá acá los materiales que representan la Posición A..." style="width:100%; min-height:180px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px; color:#e5e7eb; font-size:.82rem; padding:10px; box-sizing:border-box; resize:vertical;"></textarea>
          </div>
          <div>
            <div class="view-section-title" style="color:var(--accent);">Posición B</div>
            <textarea id="logos-posicion-b" placeholder="Pegá acá los materiales que representan la Posición B..." style="width:100%; min-height:180px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px; color:#e5e7eb; font-size:.82rem; padding:10px; box-sizing:border-box; resize:vertical;"></textarea>
          </div>
        </div>

        <div style="margin-top:14px;">
          <button class="btn-primary" id="logosCompareBtn">Comparar con Logos →</button>
        </div>

        <div id="logos-output" style="margin-top:20px;"></div>
      `
    },

    inicio: {
      title: 'Protocolo Logos',
      render: () => `
        <div class="view-eyebrow">Infraestructura dialéctica</div>
        <h1 class="view-title">¿Qué es Logos?</h1>
        <div class="view-body">
          <p><strong>SOPHIA aumenta la robustez de una posición. Logos aumenta la calidad del encuentro entre posiciones.</strong></p>
          <p>Logos no decide quién tiene razón, no vota ni fabrica consenso. Es un gimnasio deliberativo: reconstruye cada posición, valida esa reconstrucción con la propia persona, mapea acuerdos y desacuerdos, y explora — sin imponer — posibles síntesis.</p>
          <p style="font-size:.75rem; color:rgba(229,231,235,.45);">"La síntesis pertenece a las personas": Logos propone, las personas examinan, aceptan, rechazan o modifican. Ese ciclo es lo que distingue a un instrumento deliberativo de un oráculo.</p>
        </div>
        <div class="view-section">
          <div class="view-section-title">Un desacuerdo bien descrito es un éxito</div>
          <p style="font-size:.85rem; color:rgba(229,231,235,.75); line-height:1.6;">Logos puede — y debe, cuando corresponda — concluir que "existe un desacuerdo legítimo que permanece". Eso no es una falla del instrumento: es, muchas veces, el resultado más honesto posible.</p>
        </div>
      `
    },

    sintesis: {
      title: 'Tipos de Síntesis',
      render: () => `
        <div class="view-eyebrow">Concepto central</div>
        <h1 class="view-title">Tipos de Síntesis</h1>
        <div class="view-body"><p>La síntesis no es un punto intermedio entre A y B. Logos distingue cuatro formas distintas:</p></div>
        <div class="card-grid">
          ${SINTESIS_TIPOS.map(s => `
            <div class="s-card">
              <div class="s-card-title">${s.nombre}</div>
              <div style="font-size:.78rem; color:var(--accent); margin-bottom:6px;">${s.pregunta}</div>
              <div class="s-card-body">${s.detalle}</div>
            </div>
          `).join('')}
        </div>
      `
    },

    desacuerdos: {
      title: 'Naturaleza del Desacuerdo',
      render: () => `
        <div class="view-eyebrow">Diagnóstico relacional</div>
        <h1 class="view-title">Naturaleza del Desacuerdo</h1>
        <div class="view-body"><p>Logos no se detiene en detectar que existe un desacuerdo — intenta determinar su naturaleza. Un mismo desacuerdo puede pertenecer a más de una categoría.</p></div>
        <div class="card-grid">
          ${DESACUERDO_TIPOS.map(d => `
            <div class="s-card">
              <div class="s-card-title">${d.tipo}</div>
              <div class="s-card-body">${d.desc}</div>
            </div>
          `).join('')}
        </div>
      `
    },

    indicadores: {
      title: 'Indicadores',
      render: () => `
        <div class="view-eyebrow">Propiedades del proceso, no veredictos</div>
        <h1 class="view-title">Indicadores</h1>
        <div class="view-body"><p>Ningún indicador de Logos dice quién "ganó". Todos describen propiedades del proceso deliberativo.</p></div>
        <div class="card-grid">
          ${INDICADORES.map(i => `
            <div class="s-card">
              <div class="s-card-title">${i.nombre}</div>
              <div class="s-card-body">${i.detalle}</div>
            </div>
          `).join('')}
        </div>
      `
    },

    relaciones: {
      title: 'Ecosistema Deliberativo',
      render: () => `
        <div class="view-eyebrow">Arquitectura conceptual</div>
        <h1 class="view-title">Ecosistema Deliberativo</h1>
        <div class="view-body">
          <p>Academia → infraestructura de conocimiento.</p>
          <p>Rey Filósofo → aprendizaje y transformación cognitiva individual.</p>
          <p>SOPHIA → evaluación y responsabilidad epistemológica de una posición.</p>
          <p><strong>Logos → encuentro dialéctico, deliberación y síntesis entre posiciones.</strong></p>
          <p>Aletheia → resistencia cognitiva frente a manipulación (próximamente).</p>
          <p>Ágora → experiencia institucional de ciudadanía deliberativa (próximamente).</p>
        </div>
      `
    }
  };

  // Vistas de fase, generadas a partir de FASES para no repetir markup
  FASES.forEach(f => {
    VIEWS[f.id] = {
      title: f.nombre,
      render: () => `
        <div class="view-eyebrow">Fase ${f.id.slice(-1)} del Protocolo</div>
        <h1 class="view-title">${f.nombre}</h1>
        <div class="view-body"><p>${f.desc}</p></div>
      `
    };
  });

  // ─── Envío al backend (Modalidad A: Comparar) ─────────
  // Contrato esperado del endpoint (todavía no implementado en el backend):
  //
  // POST /api/logos/compare
  // body: { posicionA: string, posicionB: string }
  //
  // response esperada (form a definir junto al equipo de backend, alineada
  // a la Especificación Funcional §5 "Entidades funcionales" y al output
  // mínimo del Protocolo §24):
  // {
  //   sintesis_descriptiva: { a: string, b: string },
  //   comprension_cruzada: { a_sobre_b: string, b_sobre_a: string },
  //   acuerdos: string[],
  //   desacuerdos: [{ texto: string, tipo: string[] }],
  //   supuestos_compartidos: string[],
  //   convergencias: [{ texto: string, estado: "encontrada"|"posible" }],
  //   sintesis_relacional: string,
  //   sintesis_generativa: [{ tipo: "solucion"|"problema", texto: string }],
  //   preguntas_deliberativas: string[]
  // }
  async function compareWithLogos(posicionA, posicionB, outEl) {
    outEl.innerHTML = `<p style="color:rgba(229,231,235,.5); font-size:.82rem;">Reconstruyendo y relacionando ambas posiciones…</p>`;
    try {
      const res = await fetch('/api/logos/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posicionA, posicionB })
      });
      if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);
      const data = await res.json();
      LOGOS._lastComparison = { posicionA, posicionB, resultado: data, timestamp: new Date().toISOString() };
      renderComparison(data, outEl);
    } catch (err) {
      console.error('❌ Error en compareWithLogos:', err);
      outEl.innerHTML = `
        <div style="background:var(--s-panel); border:1px dashed rgba(255,255,255,.15); border-radius:4px; padding:16px;">
          <p style="color:#eab308; font-size:.82rem; margin:0 0 6px 0;">El motor de comparación todavía no está disponible.</p>
          <p style="color:rgba(229,231,235,.5); font-size:.78rem; margin:0;">La interfaz está lista — falta construir <code>POST /api/logos/compare</code> en el backend, el que reconstruye, relaciona y sintetiza las dos posiciones. (Detalle técnico: ${err.message})</p>
        </div>`;
    }
  }

  function renderComparison(data, outEl) {
    outEl.innerHTML = `
      ${data.sintesis_descriptiva ? `
        <div class="view-section">
          <div class="view-section-title">Síntesis descriptiva</div>
          <div class="card-grid">
            <div class="s-card"><div class="s-card-title">Posición A</div><div class="s-card-body">${data.sintesis_descriptiva.a || ''}</div></div>
            <div class="s-card"><div class="s-card-title">Posición B</div><div class="s-card-body">${data.sintesis_descriptiva.b || ''}</div></div>
          </div>
        </div>` : ''}

      ${(data.acuerdos && data.acuerdos.length) ? `
        <div class="view-section">
          <div class="view-section-title">Acuerdos</div>
          <ul style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${data.acuerdos.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>` : ''}

      ${(data.desacuerdos && data.desacuerdos.length) ? `
        <div class="view-section">
          <div class="view-section-title">Desacuerdos</div>
          ${data.desacuerdos.map(d => `
            <div style="background:var(--s-panel); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:8px;">
              <div style="font-size:.68rem; color:var(--accent); text-transform:uppercase;">${(d.tipo || []).join(', ')}</div>
              <div style="font-size:.82rem; color:#e5e7eb;">${d.texto}</div>
            </div>`).join('')}
        </div>` : ''}

      ${data.sintesis_relacional ? `
        <div class="view-section">
          <div class="view-section-title">Síntesis relacional</div>
          <p style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${data.sintesis_relacional}</p>
        </div>` : ''}

      ${(data.sintesis_generativa && data.sintesis_generativa.length) ? `
        <div class="view-section">
          <div class="view-section-title">Síntesis generativa <span style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:none;">(propuesta, no conclusión)</span></div>
          ${data.sintesis_generativa.map(s => `
            <div class="s-card">
              <div class="s-card-title">${s.tipo === 'problema' ? 'Reformulación del problema' : 'Propuesta de solución'}</div>
              <div class="s-card-body">${s.texto}</div>
            </div>`).join('')}
        </div>` : ''}

      ${(data.preguntas_deliberativas && data.preguntas_deliberativas.length) ? `
        <div class="view-section">
          <div class="view-section-title">Preguntas deliberativas</div>
          <ul style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${data.preguntas_deliberativas.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>` : ''}
    `;
  }

  // ─── SPA router (mismo patrón que SOPHIA) ──────────────
  const LOGOS = {
    current: 'comparar',
    _lastComparison: null,

    getLastComparison() {
      return this._lastComparison;
    },

    openReyFilosofo() {
      const comparison = this.getLastComparison();
      if (!comparison) {
        alert('Primero hacé una comparación en Logos para que el Rey Filósofo tenga algo sobre qué conversar.');
        return;
      }
      if (typeof CognitiveSessionFactory === 'undefined' || typeof CognitiveSessionFactory.fromLogos !== 'function') {
        console.error('CognitiveSessionFactory.fromLogos() no está definida todavía — agregar siguiendo el mismo patrón que fromSophia()/fromAcademy().');
        return;
      }
      if (typeof ReyFilosofoChat === 'undefined' || typeof ReyFilosofoChat.open !== 'function') {
        console.error('ReyFilosofoChat no está disponible.');
        return;
      }
      ReyFilosofoChat.open(CognitiveSessionFactory.fromLogos(comparison));
    },

    navigate(viewId) {
      const contentArea = document.getElementById('viewContent');
      if (!contentArea) return;
      const view = VIEWS[viewId];
      if (!view) {
        contentArea.innerHTML = `<h1>404</h1><p>Vista no encontrada: ${viewId}</p>`;
        return;
      }
      const titleEl = document.getElementById('viewTitle');
      if (titleEl) titleEl.textContent = view.title;
      contentArea.innerHTML = view.render();

      document.querySelectorAll('.snav-item').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.querySelector(`.snav-item[data-view="${viewId}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      if (viewId === 'comparar') this._bindCompareButton();
      this.current = viewId;
    },

    _bindCompareButton() {
      const btn = document.getElementById('logosCompareBtn');
      const inputA = document.getElementById('logos-posicion-a');
      const inputB = document.getElementById('logos-posicion-b');
      const out = document.getElementById('logos-output');
      if (!btn || !inputA || !inputB || !out) return;

      btn.onclick = async () => {
        if (btn.disabled) return;
        const a = inputA.value.trim();
        const b = inputB.value.trim();
        if (!a || !b) {
          out.innerHTML = `<p style="color:#ef4444; font-size:.82rem;">Necesitás cargar materiales en ambas posiciones antes de comparar.</p>`;
          return;
        }
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = 'Comparando…';
        try {
          await compareWithLogos(a, b, out);
        } finally {
          btn.disabled = false;
          btn.textContent = original;
        }
      };
    },

    init() {
      document.querySelectorAll('.snav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => this.navigate(btn.dataset.view));
      });
      this.navigate('comparar');
    }
  };

  window.LOGOS = LOGOS;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LOGOS.init());
  } else {
    LOGOS.init();
  }

})();
         
