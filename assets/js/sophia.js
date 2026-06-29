/* ═══════════════════════════════════════════════════════
   SOPHIA.JS — SPA view renderer + evaluation engine
   ═══════════════════════════════════════════════════════ */

/* ─── SCORE DATA ─────────────────────────────────────── */
const SCORES = {
  rigor:        { value: 96, label: 'Rigor epistémico',      desc: 'Solidez de los fundamentos teóricos y la base evidencial.' },
  claridad:     { value: 94, label: 'Claridad conceptual',    desc: 'Precisión y ausencia de ambigüedad en los términos usados.' },
  arquitectura: { value: 91, label: 'Arquitectura cognitiva', desc: 'Coherencia estructural del argumento y sus relaciones.' },
  carga:        { value: 93, label: 'Carga cognitiva',        desc: 'Eficiencia en la transmisión de información compleja.' },
  deliberativa: { value: 95, label: 'Calidad deliberativa',   desc: 'Apertura al diálogo, consideración de posiciones contrarias.' },
};

function scoreClass(v) {
  if (v >= 85) return 'high';
  if (v >= 60) return 'mid';
  return 'low';
}

function renderScores(data) {
  return `<div class="score-list">
    ${Object.values(data).map(s => {
      const cls = scoreClass(s.value);
      return `<div class="score-row">
        <span class="score-label">${s.label}</span>
        <div class="score-bar-wrap">
          <div class="score-bar score-bar--${cls}" style="width:0%" data-target="${s.value}%"></div>
        </div>
        <span class="score-value score-value--${cls}">${s.value}</span>
      </div>`;
    }).join('')}
  </div>`;
}

/* ─── VIEWS ──────────────────────────────────────────── */
const VIEWS = {

  /* ── INICIO ───────────────────────────────────────── */
  inicio: {
    title: 'Sophia — Sistema Abierto de Evaluación Epistémica',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Sistema de Evaluación · v2.1</div>
        <h1 class="view-title">¿Qué es Sophia?</h1>
        <div class="view-body">
          <p>Sophia es un <strong>protocolo de comunicación epistémica</strong>. No un algoritmo de scoring arbitrario. Cada dimensión de evaluación tiene un fundamento conceptual explícito, auditable y debatible por la comunidad.</p>
          <p>Cuando Sophia evalúa un documento, no emite un juicio definitivo. Ofrece una <strong>hipótesis epistémica</strong>: una lectura estructurada de la calidad argumentativa del texto, fundamentada en criterios abiertos y versionados.</p>
          <p>La transparencia no es un valor decorativo aquí. Es la condición de posibilidad de la confianza democrática en un sistema de evaluación colectiva.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Principios fundacionales</div>
          <div class="principle-list">
            <div class="principle-item">
              <span class="principle-num">01</span>
              <div class="principle-text"><strong>Explicabilidad total.</strong> Ninguna métrica sin definición pública accesible. El ciudadano puede conocer exactamente por qué un texto obtuvo el puntaje que obtuvo.</div>
            </div>
            <div class="principle-item">
              <span class="principle-num">02</span>
              <div class="principle-text"><strong>Versionado comunitario.</strong> Los criterios de evaluación evolucionan con la comunidad. Cada versión de un átomo cognitivo es rastreable.</div>
            </div>
            <div class="principle-item">
              <span class="principle-num">03</span>
              <div class="principle-text"><strong>No sustitución del juicio.</strong> Sophia asiste, no reemplaza. El juicio final sobre la publicación de un documento corresponde a la deliberación comunitaria.</div>
            </div>
            <div class="principle-item">
              <span class="principle-num">04</span>
              <div class="principle-text"><strong>Sesgo explicitado.</strong> Todo sistema de evaluación tiene sesgo. En Sophia, ese sesgo es nombrado, documentado y sometido a revisión periódica.</div>
            </div>
          </div>
        </div>

        <div class="view-section">
          <div class="view-section-title">Evaluación de demostración</div>
          <div class="report-card">
            <div class="report-card-header">
              <span class="report-card-title">Informe de ejemplo</span>
              <span class="report-stamp">DEMO · 2025-01-15</span>
            </div>
            <div class="report-card-body">
              <div class="report-meta">
                <div class="report-meta-item">
                  <div class="meta-value">93.8</div>
                  <div class="meta-label">Score global</div>
                </div>
                <div class="report-meta-item">
                  <div class="meta-value">96%</div>
                  <div class="meta-label">Confianza</div>
                </div>
                <div class="report-meta-item">
                  <div class="meta-value">~8'</div>
                  <div class="meta-label">Lectura est.</div>
                </div>
              </div>
              ${renderScores(SCORES)}
              <div class="confidence-bar-wrap"><div class="confidence-bar"></div></div>
              <div class="confidence-label"><span>Confianza del sistema</span><span>93%</span></div>
            </div>
            <div class="report-card-footer">
              <button class="btn-primary" onclick="SOPHIA.navigate('informe')">Ver evaluación completa →</button>
            </div>
          </div>
        </div>
      </div>`
  },

  /* ── OPEN SOURCE COGNITIVO ────────────────────────── */
  opensource: {
    title: 'Open Source Cognitivo',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Transparencia epistémica</div>
        <h1 class="view-title">Open Source Cognitivo</h1>
        <div class="view-body">
          <p>La epistemología no puede ser propietaria. Si los criterios con los que se evalúa el conocimiento colectivo son opacos, el sistema reproduce el mismo problema de autoridad que intenta superar.</p>
          <p><strong>Open Source Cognitivo</strong> es el principio que rige a Sophia: todos los criterios de evaluación, todos los átomos cognitivos, todas las versiones históricas de las métricas, son públicos, descargables y debatibles.</p>
          <p>Esto no es solo transparencia técnica. Es una posición filosófica: el conocimiento democrático requiere que los instrumentos de su evaluación sean también democráticos.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Acceso a los criterios</div>
          <div class="card-grid">
            <div class="s-card">
              <div class="s-card-title">Repositorio de Átomos</div>
              <div class="s-card-body">1,204 átomos cognitivos publicados. Cada uno con historial de versiones y discusión comunitaria.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Changelog epistémico</div>
              <div class="s-card-body">Registro completo de cambios en los criterios de evaluación, con justificación filosófica de cada modificación.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">API de evaluación</div>
              <div class="s-card-body">Los mismos criterios que usa Sophia internamente son accesibles vía API para auditoría externa.</div>
            </div>
            <div class="s-card">
              <div class="s-card-title">Propuesta de criterios</div>
              <div class="s-card-body">Cualquier ciudadano puede proponer nuevos átomos o modificaciones. El filtro de publicación usa el mismo proceso que la Academia.</div>
            </div>
          </div>
        </div>

        <div class="view-section">
          <div class="view-section-title">Proceso de actualización de criterios</div>
          <div class="flow-steps">
            <div class="flow-step">
              <div class="flow-dot">01</div>
              <div class="flow-body">
                <div class="flow-title">Propuesta ciudadana</div>
                <div class="flow-desc">Un miembro de la comunidad propone un nuevo átomo cognitivo o la modificación de uno existente.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">02</div>
              <div class="flow-body">
                <div class="flow-title">Deliberación con Logos</div>
                <div class="flow-desc">Logos facilita el debate sobre la propuesta. Se identifican argumentos a favor, en contra y zonas de consenso.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">03</div>
              <div class="flow-body">
                <div class="flow-title">Filtro Sophia</div>
                <div class="flow-desc">La propuesta misma es evaluada epistemológicamente. No puede ser autocontradictoria con los criterios que busca modificar.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">04</div>
              <div class="flow-body">
                <div class="flow-title">Votación cuadrática</div>
                <div class="flow-desc">La comunidad prioriza la adopción mediante votación cuadrática. Se registra la intensidad del apoyo.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">05</div>
              <div class="flow-body">
                <div class="flow-title">Publicación versionada</div>
                <div class="flow-desc">El nuevo átomo se publica como v(n+1), manteniendo acceso a todas las versiones anteriores.</div>
              </div>
            </div>
          </div>
        </div>
      </div>`
  },

  /* ── ÁTOMOS COGNITIVOS ────────────────────────────── */
  atomos: {
    title: 'Átomos Cognitivos',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Repositorio epistémico</div>
        <h1 class="view-title">Átomos Cognitivos</h1>
        <div class="view-body">
          <p>Un <strong>átomo cognitivo</strong> es la unidad mínima de evaluación epistémica en Sophia. Es un concepto bien definido, con criterios de aplicación explícitos, ejemplos positivos y negativos verificables, y un historial de versiones trazable.</p>
          <p>Los átomos no son verdades absolutas. Son hipótesis de trabajo comunitariamente validadas sobre qué constituye una buena argumentación en un contexto democrático.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Muestra del repositorio</div>
          <div class="atom-grid">

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">Coherencia interna</span>
                <span class="atom-version">v3</span>
              </div>
              <div class="atom-def">Las premisas del argumento no se contradicen entre sí. Las conclusiones se derivan lógicamente de las premisas declaradas.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "Todas las políticas ambientales tienen costo económico, por tanto esta propuesta también lo tiene."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "El mercado siempre se autorregula, pero necesitamos esta regulación de mercado."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">Carga evidencial</span>
                <span class="atom-version">v2</span>
              </div>
              <div class="atom-def">Las afirmaciones empíricas del argumento están respaldadas por evidencia verificable, citada y accesible al lector.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "Según el INE 2024, el 34% de los hogares rurales carece de acceso a agua potable."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "Todo el mundo sabe que los impuestos frenan la inversión."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">Generalización controlada</span>
                <span class="atom-version">v1</span>
              </div>
              <div class="atom-def">El argumento no extrapola conclusiones universales a partir de muestras limitadas sin reconocer las limitaciones de la generalización.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "En los 3 municipios estudiados, la participación aumentó. Esto podría indicar una tendencia."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "En Santiago funcionó, por tanto funcionará en todo Chile."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">Honestidad sobre incertidumbre</span>
                <span class="atom-version">v2</span>
              </div>
              <div class="atom-def">El texto reconoce explícitamente las zonas de incertidumbre de su propio argumento, sin fingir certeza donde no la hay.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "No contamos aún con suficiente evidencia para afirmar que X cause Y."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "Está científicamente probado que este plan reducirá la pobreza en un 30%."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">Consideración de contraargumentos</span>
                <span class="atom-version">v4</span>
              </div>
              <div class="atom-def">El argumento reconoce y aborda las objeciones más fuertes a su posición, sin construir hombres de paja.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "Quienes se oponen a esta medida argumentan X, y tienen razón en que Y. Sin embargo..."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  "Los que se oponen simplemente no entienden el problema."
                </div>
              </div>
            </div>

            <div class="atom-card">
              <div class="atom-header">
                <span class="atom-name">Precisión terminológica</span>
                <span class="atom-version">v1</span>
              </div>
              <div class="atom-def">Los términos clave del argumento son usados de forma consistente y con una definición implícita o explícita clara a lo largo del texto.</div>
              <div class="atom-examples">
                <div class="atom-ex atom-ex--pos">
                  <span class="atom-ex-label">Positivo</span>
                  "Entendemos por 'participación ciudadana' la intervención activa en procesos de decisión pública."
                </div>
                <div class="atom-ex atom-ex--neg">
                  <span class="atom-ex-label">Negativo</span>
                  Usar "democracia" para significar alternativamente el sistema de votación, el valor moral y el tipo de gobierno.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>`
  },

  /* ── DIMENSIONES ──────────────────────────────────── */
  'dim-rigor': {
    title: 'Dimensión: Rigor Epistémico',
    render: () => renderDimension({
      key: 'rigor', score: 96,
      filosofia: `El rigor epistémico mide la solidez de los fundamentos sobre los que descansa un argumento. No es sinónimo de complejidad ni de erudición. Un argumento riguroso puede ser simple; lo que no puede es ser arbitrario.`,
      segundo: `Sophia evalúa el rigor verificando si las premisas son identificables, si la evidencia citada existe y es relevante, y si las inferencias lógicas son válidas. Un texto con rigor alto no necesita autoridad; puede sostenerse solo.`,
      atomos: ['Carga evidencial', 'Coherencia interna', 'Honestidad sobre incertidumbre'],
    })
  },

  'dim-claridad': {
    title: 'Dimensión: Claridad Conceptual',
    render: () => renderDimension({
      key: 'claridad', score: 94,
      filosofia: `La claridad conceptual no es simplificación. Es la ausencia de ambigüedad evitable. Un texto puede ser complejo y claro al mismo tiempo; lo que no puede es usar la complejidad como pantalla para ocultar imprecisiones.`,
      segundo: `Sophia evalúa si los términos clave son consistentes, si el argumento principal puede ser parafraseado sin distorsionarlo, y si la estructura del texto ayuda o dificulta la comprensión de su contenido.`,
      atomos: ['Precisión terminológica', 'Coherencia interna', 'Generalización controlada'],
    })
  },

  'dim-arquitectura': {
    title: 'Dimensión: Arquitectura Cognitiva',
    render: () => renderDimension({
      key: 'arquitectura', score: 91,
      filosofia: `La arquitectura cognitiva mide la coherencia estructural del argumento: cómo se relacionan sus partes, si hay una progresión lógica identificable, y si la conclusión surge de las premisas o aparece como un salto injustificado.`,
      segundo: `Un argumento con buena arquitectura cognitiva puede ser mapeado: tiene una estructura que puede dibujarse. Sophia busca esa estructura y evalúa si es sólida o si contiene saltos, circularidades o ramas que no se conectan con el cuerpo principal.`,
      atomos: ['Coherencia interna', 'Consideración de contraargumentos', 'Generalización controlada'],
    })
  },

  'dim-carga': {
    title: 'Dimensión: Carga Cognitiva',
    render: () => renderDimension({
      key: 'carga', score: 93,
      filosofia: `La carga cognitiva mide cuánto esfuerzo innecesario impone un texto a su lector. Un texto con alta carga cognitiva puede ser difícil de leer no por su contenido sino por su forma: jerga innecesaria, estructura confusa, repetición excesiva.`,
      segundo: `Sophia no penaliza la complejidad legítima. Penaliza la complejidad artificial: el uso de tecnicismos donde un término simple funcionaría igual, la reiteración sin progresión, la estructura de párrafo que no ayuda al lector a seguir el hilo.`,
      atomos: ['Claridad conceptual', 'Precisión terminológica'],
    })
  },

  'dim-deliberativa': {
    title: 'Dimensión: Calidad Deliberativa',
    render: () => renderDimension({
      key: 'deliberativa', score: 95,
      filosofia: `La calidad deliberativa mide si un texto está escrito para convencer o para dialogar. No es un juicio sobre las conclusiones del autor, sino sobre su disposición epistémica: ¿el texto deja espacio para el desacuerdo racional?`,
      segundo: `Un texto con alta calidad deliberativa no necesita estar escrito en tono neutral. Puede ser apasionado y persuasivo. Lo que no puede es cerrar el espacio del debate: descalificar al interlocutor, presentar su posición como la única posible, o ignorar sistemáticamente las objeciones más serias.`,
      atomos: ['Consideración de contraargumentos', 'Honestidad sobre incertidumbre', 'Carga evidencial'],
    })
  },

  /* ── INFORME COMPLETO ─────────────────────────────── */
  informe: {
    title: 'Informe de Evaluación',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Evaluación epistémica</div>
        <h1 class="view-title">Informe de Evaluación</h1>
        <div class="view-body">
          <p>Ingresa un texto para recibir una evaluación estructurada según las cinco dimensiones de Sophia. El informe muestra scores por dimensión, átomos cognitivos activados, y una hipótesis de fortalezas y áreas de desarrollo.</p>
        </div>

        <div class="eval-tool">
          <textarea class="sophia-input" id="evalInput" placeholder="Pega aquí el texto a evaluar. Sophia analizará su rigor epistémico, claridad conceptual, arquitectura cognitiva, carga cognitiva y calidad deliberativa..."></textarea>
          <div class="eval-actions">
            <button class="btn-primary" id="evalBtn">Evaluar texto →</button>
            <span class="eval-note">El informe refleja una evaluación de demostración.</span>
          </div>
        </div>

        <div id="evalResult"></div>
      </div>`
  },

  /* ── ACADEMIA Y VOTACIÓN ──────────────────────────── */
  academia: {
    title: 'Academia y Votación Cuadrática',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Integración sistémica</div>
        <h1 class="view-title">Academia y Votación</h1>
        <div class="view-body">
          <p>Sophia es el filtro epistémico que regula el ingreso de documentos ciudadanos a la Academia de LogoDemocracy. No todo texto que supera el filtro será publicado; pero ningún texto que no lo supere podrá ser sometido a votación cuadrática.</p>
          <p>Este principio garantiza que la agenda democrática colectiva se construya sobre una base de calidad epistémica mínima verificable.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Criterios de publicación en la Academia</div>
          <div class="score-list">
            <div class="score-row">
              <span class="score-label">Score mínimo global</span>
              <div class="score-bar-wrap">
                <div class="score-bar score-bar--mid" style="width:0%" data-target="65%"></div>
              </div>
              <span class="score-value score-value--mid">65</span>
            </div>
            <div class="score-row">
              <span class="score-label">Rigor epistémico</span>
              <div class="score-bar-wrap">
                <div class="score-bar score-bar--mid" style="width:0%" data-target="60%"></div>
              </div>
              <span class="score-value score-value--mid">60</span>
            </div>
            <div class="score-row">
              <span class="score-label">Claridad conceptual</span>
              <div class="score-bar-wrap">
                <div class="score-bar score-bar--mid" style="width:0%" data-target="55%"></div>
              </div>
              <span class="score-value score-value--mid">55</span>
            </div>
            <div class="score-row">
              <span class="score-label">Calidad deliberativa</span>
              <div class="score-bar-wrap">
                <div class="score-bar score-bar--mid" style="width:0%" data-target="70%"></div>
              </div>
              <span class="score-value score-value--mid">70</span>
            </div>
          </div>
        </div>

        <div class="view-section">
          <div class="view-section-title">Relación con la votación cuadrática</div>
          <div class="view-body">
            <p>El score Sophia de un documento no afecta su probabilidad de ser votado favorablemente. Sí garantiza que todos los documentos que ingresan al proceso de votación tienen una calidad epistémica suficiente para merecer deliberación.</p>
            <p>La comunidad puede votar en contra de un documento de alta calidad epistémica, y eso es democráticamente legítimo. Lo que no es legítimo es que documentos con argumentación deficiente contaminen la agenda colectiva.</p>
          </div>
        </div>
      </div>`
  },

  /* ── RELACIONES SISTÉMICAS ────────────────────────── */
  relaciones: {
    title: 'Relaciones Sistémicas',
    render: () => `
      <div class="view">
        <div class="view-eyebrow">Ecosistema LogoDemocracy</div>
        <h1 class="view-title">Relaciones sistémicas</h1>
        <div class="view-body">
          <p>Sophia no opera de forma aislada. Es un nodo dentro de una red de agentes cognitivos que se potencian mutuamente. Comprender estas relaciones es comprender la arquitectura epistémica de LogoDemocracy.</p>
        </div>

        <div class="view-section">
          <div class="view-section-title">Agentes del ecosistema</div>
          <div class="relation-grid">
            <div class="relation-card relation-card--academia">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Academia</span>
              </div>
              <div class="relation-desc">Sophia es el filtro de ingreso a la Academia. Todo documento que entra al repositorio de conocimiento colectivo ha pasado previamente por evaluación epistémica.</div>
            </div>
            <div class="relation-card relation-card--rey">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Rey Filósofo</span>
              </div>
              <div class="relation-desc">Rey Filósofo traduce los informes de Sophia en oportunidades pedagógicas. Cuando un texto recibe un score bajo, Rey Filósofo acompaña al autor para comprender por qué y cómo mejorar.</div>
            </div>
            <div class="relation-card relation-card--logos">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Logos</span>
              </div>
              <div class="relation-desc">Logos utiliza los scores de Sophia para facilitar deliberaciones. Un debate entre dos posiciones con alto score de calidad deliberativa merece un espacio de diálogo diferente a uno donde una de las partes tiene baja calidad argumentativa.</div>
            </div>
            <div class="relation-card relation-card--aletheia">
              <div class="relation-header">
                <div class="relation-dot"></div>
                <span class="relation-name">Aletheia</span>
              </div>
              <div class="relation-desc">Aletheia complementa a Sophia analizando el discurso desde la perspectiva del poder y la manipulación. Un texto puede tener alto rigor epistémico y aun así contener patrones retóricos de manipulación identificables por Aletheia.</div>
            </div>
          </div>
        </div>

        <div class="view-section">
          <div class="view-section-title">Flujo de integración</div>
          <div class="flow-steps">
            <div class="flow-step">
              <div class="flow-dot">↓</div>
              <div class="flow-body">
                <div class="flow-title">Documento ciudadano ingresa</div>
                <div class="flow-desc">Un ciudadano sube un texto a LogoDemocracy para que sea considerado por la comunidad.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">↓</div>
              <div class="flow-body">
                <div class="flow-title">Sophia evalúa (filtro)</div>
                <div class="flow-desc">El texto es evaluado en las cinco dimensiones. Se genera un informe público y trazable.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">↓</div>
              <div class="flow-body">
                <div class="flow-title">Rey Filósofo acompaña (si es necesario)</div>
                <div class="flow-desc">Si el score es insuficiente, Rey Filósofo sugiere mejoras específicas vinculadas a los átomos cognitivos débiles.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">↓</div>
              <div class="flow-body">
                <div class="flow-title">Logos facilita la deliberación</div>
                <div class="flow-desc">Los textos aprobados entran al espacio deliberativo de Logos, donde la comunidad debate su contenido.</div>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-dot">↓</div>
              <div class="flow-body">
                <div class="flow-title">Academia integra el conocimiento</div>
                <div class="flow-desc">Los textos validados deliberativamente ingresan a la Academia como conocimiento colectivo.</div>
              </div>
            </div>
          </div>
        </div>
      </div>`
  },

};

/* ─── DIMENSION RENDERER ─────────────────────────────── */
function renderDimension({ key, score, filosofia, segundo, atomos }) {
  const cls = scoreClass(score);
  const s = SCORES[key];
  return `
    <div class="view">
      <div class="view-eyebrow">Dimensión de Evaluación</div>
      <h1 class="view-title">${s.label}</h1>
      <div class="dim-hero">
        <div class="dim-score-big">${score}<span>/100</span></div>
        <div>
          <div class="dim-meta-label">Dimensión activa</div>
          <div class="dim-meta-title">${s.label}</div>
          <div class="dim-meta-desc">${s.desc}</div>
        </div>
      </div>
      <div class="view-body">
        <p>${filosofia}</p>
        <p>${segundo}</p>
      </div>
      <div class="view-section">
        <div class="view-section-title">Átomos cognitivos relacionados</div>
        <div class="card-grid">
          ${atomos.map(a => `
            <div class="s-card">
              <div class="s-card-title">${a}</div>
              <div class="s-card-body">Átomo activo en la evaluación de esta dimensión. Ver repositorio completo en Átomos Cognitivos.</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ─── SPA ROUTER ─────────────────────────────────────── */
const SOPHIA = {
  current: 'inicio',

  navigate(id) {
    const view = VIEWS[id];
    if (!view) return;
    this.current = id;

    // Update header
    document.getElementById('viewTitle').textContent = view.title;

    // Render content
    const content = document.getElementById('viewContent');
    content.innerHTML = view.render();

    // Animate bars
    this._animateBars(content);

    // Bind eval button if on informe view
    if (id === 'informe') this._bindEval();

    // Update nav active state
    document.querySelectorAll('.snav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === id);
    });

    // Scroll to top
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

  _bindEval() {
    const btn = document.getElementById('evalBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const input = document.getElementById('evalInput').value.trim();
      const out = document.getElementById('evalResult');

      if (!input) {
        out.innerHTML = `<p style="color:rgba(239,68,68,.7);font-size:.78rem;margin-top:12px;">Ingresa un texto para evaluar.</p>`;
        return;
      }

      out.innerHTML = `<p style="color:rgba(229,231,235,.35);font-size:.72rem;margin-top:12px;">Evaluando...</p>`;

      setTimeout(() => {
        // Simulate slight variation
        const vary = k => Math.min(100, Math.max(40, SCORES[k].value + Math.round((Math.random()-0.5)*10)));
        const live = {
          rigor:        { ...SCORES.rigor,        value: vary('rigor') },
          claridad:     { ...SCORES.claridad,      value: vary('claridad') },
          arquitectura: { ...SCORES.arquitectura,  value: vary('arquitectura') },
          carga:        { ...SCORES.carga,         value: vary('carga') },
          deliberativa: { ...SCORES.deliberativa,  value: vary('deliberativa') },
        };
        const global = (Object.values(live).reduce((a,b) => a+b.value, 0) / 5).toFixed(1);

        out.innerHTML = `
          <div class="report-card" style="margin-top:20px;">
            <div class="report-card-header">
              <span class="report-card-title">Informe generado</span>
              <span class="report-stamp">${new Date().toLocaleDateString('es-CL')}</span>
            </div>
            <div class="report-card-body">
              <div class="report-meta">
                <div class="report-meta-item">
                  <div class="meta-value">${global}</div>
                  <div class="meta-label">Score global</div>
                </div>
                <div class="report-meta-item">
                  <div class="meta-value">${global >= 65 ? '✓' : '✗'}</div>
                  <div class="meta-label">${global >= 65 ? 'Aprobado' : 'Insuficiente'}</div>
                </div>
                <div class="report-meta-item">
                  <div class="meta-value">~${Math.ceil(input.split(' ').length / 200)}'</div>
                  <div class="meta-label">Lectura est.</div>
                </div>
              </div>
              ${renderScores(live)}
              <div class="confidence-bar-wrap" style="margin-top:16px;"><div class="confidence-bar" style="width:${global}%"></div></div>
              <div class="confidence-label"><span>Confianza del sistema</span><span>${global}%</span></div>
            </div>
          </div>`;

        SOPHIA._animateBars(out);
      }, 900);
    });
  },

  init() {
    // Bind sidebar nav
    document.querySelectorAll('.snav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.view));
    });
    // Render initial view
    this.navigate('inicio');
  }
};

document.addEventListener('DOMContentLoaded', () => SOPHIA.init());
