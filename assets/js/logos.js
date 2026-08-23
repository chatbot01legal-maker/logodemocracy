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
    <div class="view-eyebrow">Gimnasio deliberativo</div>

    <h1 class="view-title">Comprende mejor un desacuerdo</h1>

    <div class="view-body">
      <p>
        <strong>Logos te ayuda a entender qué hay realmente detrás de dos posiciones diferentes.</strong>
      </p>

      <p>
        En lugar de decirte quién tiene razón, reconstruye los argumentos de cada lado,
        identifica en qué coinciden, en qué se diferencian y qué tipo de desacuerdo existe.
      </p>

      <p>
        También puede encontrar puntos de encuentro y explorar nuevas posibilidades
        que no aparecen cuando cada posición se defiende por separado.
      </p>

      <p style="font-size:.75rem; color:rgba(229,231,235,.45);">
        Logos no decide quién gana ni reemplaza tu juicio.
        <strong>Te entrega un mapa para que puedas pensar mejor el desacuerdo.</strong>
      </p>
    </div>

    <div class="view-section">
      <div class="view-section-title">Pruebalo con dos posiciones</div>

      <div class="view-body" style="margin-bottom:16px;">
        <p style="font-size:.82rem;">
          Pega dos textos que representen posiciones diferentes sobre un mismo tema.
          Pueden ser argumentos, publicaciones, artículos, declaraciones o cualquier
          material que quieras comparar.
        </p>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">

        <div>
          <div class="view-section-title" style="color:var(--accent);">
            Posición A
          </div>

          <textarea
            id="logos-posicion-a"
            placeholder="Pega acá el primer texto o posición..."
            style="width:100%; min-height:180px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px; color:#e5e7eb; font-size:.82rem; padding:10px; box-sizing:border-box; resize:vertical;"
          ></textarea>
        </div>

        <div>
          <div class="view-section-title" style="color:var(--accent);">
            Posición B
          </div>

          <textarea
            id="logos-posicion-b"
            placeholder="Pega acá el segundo texto o posición..."
            style="width:100%; min-height:180px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px; color:#e5e7eb; font-size:.82rem; padding:10px; box-sizing:border-box; resize:vertical;"
          ></textarea>
        </div>

      </div>

      <div style="margin-top:14px;">
        <button class="btn-primary" id="logosCompareBtn">
          Haz que las ideas se encuentren →
        </button>
      </div>
    </div>

    <div id="logos-output" style="margin-top:20px;"></div>
  `
},

    ejemplo: {
      title: 'Ejemplo',
      render: () => `
        <div class="view-eyebrow">Caso real · LOGOS en acción</div>

        <h1 class="view-title">
          Joy Behar, Vivek Ramaswamy y la riqueza de Elon Musk
        </h1>

        <div class="view-body">

          <p>
            <strong>
              Este es un ejemplo real de cómo LOGOS puede analizar un desacuerdo.
            </strong>
          </p>

          <p>
            El diálogo ocurrió en televisión entre
            <strong>Joy Behar</strong> y
            <strong>Vivek Ramaswamy</strong>,
            a propósito de la enorme riqueza de Elon Musk y la responsabilidad
            que deberían tener las personas extremadamente ricas frente a las
            necesidades de la sociedad.
          </p>

          <p>
            La conversación comienza con una crítica a la acumulación de riqueza
            de Musk, pero la respuesta desplaza el problema hacia la propia
            riqueza de Behar. A partir de ahí aparecen argumentos económicos,
            afirmaciones cuantitativas, juicios morales y diferentes ideas sobre
            qué significa que una fortuna tenga un impacto social.
          </p>

          <p style="font-size:.78rem; color:rgba(229,231,235,.55);">
            El análisis que aparece a continuación fue generado por LOGOS a partir
            del diálogo. Las afirmaciones factuales identificadas por el instrumento
            no deben interpretarse como hechos comprobados: algunas requieren
            verificación externa.
          </p>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Diálogo analizado</div>

            <h2 class="view-subtitle">Posición A · Joy Behar</h2>

            <blockquote>
              ¿Qué está haciendo Elon Musk con su dinero? Está a punto de convertirse
              en trillonario. ¿Dónde está ese dinero? Con ese dinero podría salvar a
              algunos países. Las personas que tienen tanto dinero… ¿qué creen?
              ¿Que van a vivir para siempre, Elon?
            </blockquote>

            <h2 class="view-subtitle">Posición B · Vivek Ramaswamy</h2>

            <blockquote>
              Sí, podría. ¿Lo va a hacer? No. Menos del 0,1 % del patrimonio neto
              total de Elon está realmente en efectivo depositado en el banco.
              Eso equivale, como máximo, a unos mil o dos mil millones de dólares.
              El resto está compuesto básicamente por acciones y participaciones
              en sus empresas, como SpaceX, Tesla y otras.
            </blockquote>

            <blockquote>
              Esas empresas han creado más de 160.000 empleos directos, más de
              600.000 empleos indirectos a través de sus cadenas de suministro y
              más de 500.000 empleos adicionales derivados de una actividad
              económica más amplia.
            </blockquote>

            <blockquote>
              Así que, si hacemos los cálculos, al menos un millón de personas
              en todo el mundo pueden llevar el pan a su mesa gracias a los
              empleos que han creado las empresas de Elon.
            </blockquote>

            <blockquote>
              Ahora bien, por otro lado, tú, Joy, tienes un patrimonio de 30
              millones de dólares. Y, a diferencia de Elon, tú no has creado
              ningún empleo. No eres fundadora ni propietaria de una empresa
              escalable.
            </blockquote>

            <blockquote>
              ¿Vas a vivir para siempre, Joy? ¿Por qué no estás regalando tu dinero?
              Con solo un tercio de tu patrimonio, probablemente podrías alimentar
              a 3.000 personas durante todo un año.
            </blockquote>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Síntesis descriptiva</div>

            <h2 class="view-subtitle">Posición A</h2>

            <p>
              Elon Musk, a punto de convertirse en trillonario, debería usar su
              dinero para salvar a algunos países.
            </p>

            <h2 class="view-subtitle">Posición B</h2>

            <p>
              Joy, con un patrimonio de 30 millones de dólares que no ha generado
              empleos, debería empezar a repartir su dinero.
            </p>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Reconstrucción</div>

            <h2 class="view-subtitle">Posición A · Argumentos</h2>

            <ul>
              <li>Elon Musk está a punto de convertirse en trillonario.</li>
              <li>Con su dinero se podría salvar a algunos países.</li>
              <li>
                Las personas que tienen tanta riqueza parecen actuar como si
                fueran a vivir para siempre.
              </li>
            </ul>

            <h2 class="view-subtitle">Supuestos inferidos</h2>

            <ul>
              <li>
                La posesión de una riqueza extrema implica una responsabilidad
                de usarla para el bien común.
              </li>
              <li>
                Una fortuna de esa magnitud puede utilizarse para producir
                beneficios sociales a gran escala.
              </li>
              <li>
                La acumulación extrema sin propósito altruista puede interpretarse
                como una actitud egocéntrica.
              </li>
            </ul>

            <h2 class="view-subtitle">Posición B · Argumentos</h2>

            <ul>
              <li>
                La mayor parte del patrimonio de Musk estaría invertida en
                acciones y participaciones empresariales.
              </li>
              <li>
                Sus empresas han generado una gran cantidad de empleos.
              </li>
              <li>
                El patrimonio de Joy sería mucho más líquido y no estaría
                vinculado a una empresa escalable.
              </li>
              <li>
                Una parte de esa riqueza podría utilizarse para aliviar
                necesidades inmediatas.
              </li>
            </ul>

            <h2 class="view-subtitle">Supuestos inferidos</h2>

            <ul>
              <li>
                Existe una obligación moral asociada a la posesión de una
                riqueza significativa y líquida.
              </li>
              <li>
                Aliviar directamente el sufrimiento puede ser una razón
                suficiente para distribuir riqueza.
              </li>
              <li>
                La riqueza que excede ampliamente las necesidades personales
                puede destinarse al beneficio de otros.
              </li>
            </ul>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Comprensión mutua</div>

            <h2 class="view-subtitle">Cómo entiende A a B</h2>

            <p>
              LOGOS interpreta que la Posición A podría entender la respuesta de B
              como una aplicación más específica del principio de responsabilidad
              de los ricos: alguien que posee una gran fortuna debería utilizarla
              para producir un beneficio social.
            </p>

            <h2 class="view-subtitle">Cómo entiende B a A</h2>

            <p>
              LOGOS interpreta que B reconoce la preocupación moral de A, pero
              considera que A caracteriza de manera incompleta la riqueza de Musk,
              porque gran parte de ella estaría vinculada a empresas y actividad
              económica.
            </p>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Steelman dialéctico</div>

            <h2 class="view-subtitle">La mejor versión de A</h2>

            <p>
              La acumulación de riqueza extrema puede imponer una responsabilidad
              moral especial de utilizarla para el bien común. La magnitud de una
              fortuna podría ser, por sí misma, un motivo para exigir una
              contribución proporcionalmente extraordinaria a la sociedad.
            </p>

            <h2 class="view-subtitle">La mejor versión de B</h2>

            <p>
              No toda riqueza tiene la misma naturaleza. Una fortuna invertida
              en empresas productivas puede estar generando empleo y actividad
              económica, mientras que una gran cantidad de riqueza líquida puede
              tener un potencial diferente para aliviar necesidades inmediatas.
              Por lo tanto, la responsabilidad moral debería considerar cómo está
              siendo utilizada la riqueza, no solamente cuánto vale.
            </p>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Acuerdos</div>

            <ul>
              <li>Existe una dimensión moral en la posesión de riqueza significativa.</li>
              <li>
                Las personas con gran riqueza pueden tener responsabilidades
                hacia otras personas y hacia la sociedad.
              </li>
              <li>
                La finitud de la vida humana es relevante para pensar sobre
                acumulación y distribución.
              </li>
              <li>
                La riqueza puede utilizarse para aliviar necesidades o producir
                beneficios sociales.
              </li>
            </ul>

            <div class="view-eyebrow" style="margin-top:24px;">Desacuerdos</div>

            <ul>
              <li>
                <strong>Factual:</strong> naturaleza y liquidez del patrimonio
                de Elon Musk.
              </li>
              <li>
                <strong>Normativo:</strong> cuál es la principal razón por la
                que una persona rica debería distribuir su riqueza.
              </li>
              <li>
                <strong>Conceptual:</strong> qué significa que una riqueza
                produzca impacto social.
              </li>
              <li>
                <strong>Causal:</strong> si la riqueza de Musk ya está generando
                un impacto social positivo mediante sus empresas.
              </li>
            </ul>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Supuestos compartidos</div>

            <ul>
              <li>
                Es posible acumular cantidades de riqueza que excedan ampliamente
                las necesidades personales.
              </li>
              <li>
                La acumulación de riqueza sin considerar su impacto social puede
                ser problemática.
              </li>
              <li>
                La riqueza tiene potencial para producir un impacto significativo
                en la sociedad.
              </li>
            </ul>

            <div class="view-eyebrow" style="margin-top:24px;">Convergencias</div>

            <p>
              Ambas posiciones podrían coincidir en que la riqueza que no está
              produciendo un beneficio social activo debería ser considerada para
              su distribución.
            </p>

            <p>
              También podrían coincidir en que la riqueza, especialmente en
              cantidades extraordinarias, implica algún grado de responsabilidad
              hacia la sociedad.
            </p>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Síntesis relacional</div>

            <p>
              Ambas posiciones convergen en la premisa de que la posesión de una
              riqueza significativa conlleva una responsabilidad moral hacia la
              sociedad y que la finitud de la vida humana debe influir en cómo
              se gestiona esa fortuna.
            </p>

            <p>
              Sin embargo, difieren en la caracterización de la riqueza y en el
              principal criterio para determinar su responsabilidad social.
              La Posición A enfatiza la magnitud de la riqueza extrema, mientras
              que la Posición B distingue entre riqueza vinculada a empresas
              productivas y riqueza líquida disponible para distribución directa.
            </p>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card">

            <div class="view-eyebrow">Síntesis generativa · propuesta</div>

            <h2 class="view-subtitle">Una posible solución</h2>

            <p>
              Desarrollar un marco que distinga entre riqueza productiva,
              aquella que genera empleo y actividad económica, y riqueza
              acumulada no productiva o líquida, para evaluar de manera más
              precisa la responsabilidad social asociada a cada una.
            </p>

            <h2 class="view-subtitle">Una nueva pregunta</h2>

            <p>
              ¿Cuál debería ser el criterio principal para determinar la
              responsabilidad social de una gran fortuna: su magnitud total,
              su liquidez o el impacto social que ya está produciendo?
            </p>

          </div>

        </div>

        <div class="view-section">

          <div class="s-card" style="border-left:3px solid var(--accent);">

            <div class="view-eyebrow">Lo que este ejemplo permite ver</div>

            <p>
              LOGOS no determina quién ganó la discusión.
            </p>

            <p>
              Tampoco convierte automáticamente las afirmaciones de los
              participantes en hechos verdaderos.
            </p>

            <p>
              Lo que hace es algo diferente:
              <strong>
                reconstruye el desacuerdo para que podamos ver qué se está
                discutiendo realmente.
              </strong>
            </p>

            <p>
              En este caso, una discusión aparentemente centrada en Elon Musk
              termina revelando una pregunta mucho más amplia:
              <strong>
                ¿qué hace que una riqueza tenga responsabilidad frente a la
                sociedad?
              </strong>
            </p>

          </div>

        </div>
      `
    },

    inicio: {
  title: 'Pensamiento Colectivo',
  render: () => `
    <div class="view-eyebrow">Infraestructura dialéctica</div>
    <h1 class="view-title">¿Qué es Logos?</h1>
    <div class="view-body">
      <p><strong>Logos ayuda a las personas a comprender mejor sus desacuerdos y encontrar puntos de encuentro sin borrar sus diferencias.</strong></p>
      <p>Reconstruye cada posición, permite comprobar si fue comprendida correctamente y hace visibles los acuerdos, desacuerdos y supuestos que suelen quedar ocultos en una discusión.</p>
      <p>Esto permite pasar de discutir para vencer a <strong>deliberar para comprender</strong>: descubrir qué nos separa, qué compartimos y qué nuevas posibilidades aparecen cuando somos capaces de entender realmente la posición del otro.</p>
      <p style="font-size:.75rem; color:rgba(229,231,235,.45);"><strong>Logos no decide quién tiene razón ni fabrica consenso.</strong> Propone mapas y posibles síntesis que las personas pueden examinar, aceptar, rechazar o modificar.</p>
    </div>
    <div class="view-section">
      <div class="view-section-title">Un mejor diálogo produce mejores decisiones</div>
      <p style="font-size:.85rem; color:rgba(229,231,235,.75); line-height:1.6;">Cuando podemos comprender con mayor precisión por qué pensamos distinto, el desacuerdo deja de ser solamente un obstáculo. Puede convertirse en una fuente de aprendizaje, cooperación y nuevas soluciones.</p>
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
  async function compareWithLogos(posicionA, posicionB, outEl) {
    const loadingPhrases = [
      "<b>¿Sabías que...?</b> Logos no decide quién tiene la razón, sino que cartografía la estructura del desacuerdo.",
      "<b>¿Sabías que...?</b> Un desacuerdo bien descrito es, muchas veces, un resultado más valioso que un consenso forzado.",
      "<b>¿Sabías que...?</b> La síntesis generativa ocurre cuando ambas partes descubren que el problema tenía dimensiones ocultas.",
      "<b>¿Sabías que...?</b> El 'Steelman' dialéctico consiste en reconstruir el argumento del otro en su versión más fuerte.",
      "<b>¿Sabías que...?</b> Identificar los supuestos que ambas posiciones comparten es el primer paso para destrabar el debate."
    ];
    let phraseIndex = 0;

    const renderLoading = () => `
      <div class="s-card" style="margin-top: 20px; border-left: 3px solid var(--accent);">
        <div style="color:var(--accent); font-size:.75rem; text-transform:uppercase; font-weight:600; letter-spacing:0.05em; margin-bottom:10px; display:flex; align-items:center;">
          PROCESANDO SÍNTESIS <span class="loading-dots" style="font-size:1.1rem; margin-left:4px; line-height:0;"><span>.</span><span>.</span><span>.</span></span>
        </div>
        <div style="color:#e5e7eb; font-size:.85rem; line-height:1.6;">
          ${loadingPhrases[phraseIndex]}
        </div>
      </div>
    `;

    outEl.innerHTML = renderLoading();
    
    // Rotar frase cada 20 segundos
    const loadingInterval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
      outEl.innerHTML = renderLoading();
    }, 20000);

    try {
      const res = await fetch('/api/logos/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posicionA, posicionB })
      });
      if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);
      const data = await res.json();
      // Se guardan los textos originales DENTRO de data (no solo en
      // LOGOS._lastComparison) para que la validación de reconstrucción
      // pueda reenviar una corrección sin depender de closures externos.
      data._posicionA_original = posicionA;
      data._posicionB_original = posicionB;
      LOGOS._lastComparison = { posicionA, posicionB, resultado: data, timestamp: new Date().toISOString() };
      renderComparison(data, outEl);
    } catch (err) {
      console.error('❌ Error en compareWithLogos:', err);
      outEl.innerHTML = `
        <div style="background:var(--s-panel); border:1px dashed rgba(255,255,255,.15); border-radius:4px; padding:16px; margin-top: 16px;">
          <p style="color:#eab308; font-size:.82rem; margin:0 0 6px 0;">El motor de comparación todavía no está disponible.</p>
          <p style="color:rgba(229,231,235,.5); font-size:.78rem; margin:0;">La interfaz está lista — falta construir <code>POST /api/logos/compare</code> en el backend, el que reconstruye, relaciona y sintetiza las dos posiciones. (Detalle técnico: ${err.message})</p>
        </div>`;
    } finally {
      clearInterval(loadingInterval);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderComparison(data, outEl) {
    // Etiqueta visual según el origen de cada argumento/evidencia:
    // explícito (dicho literalmente) vs inferido (Logos lo dedujo).
    const origenBadge = (origen) => origen === 'inferido'
      ? `<span style="font-size:.62rem; color:#eab308; border:1px solid #eab308; border-radius:3px; padding:1px 5px; margin-left:6px; white-space:nowrap;">🟡 Inferencia de Logos</span>`
      : `<span style="font-size:.62rem; color:#22c55e; border:1px solid #22c55e; border-radius:3px; padding:1px 5px; margin-left:6px; white-space:nowrap;">🟢 Explícito</span>`;

    const renderReconstruccionDetalle = (recon, etiqueta) => {
      if (!recon) return '';
      const argumentos = recon.argumentos || [];
      const evidencia = recon.evidencia || [];
      const supuestos = recon.supuestos || [];
      return `
        <div class="s-card">
          <div class="s-card-title">Posición ${etiqueta} — detalle</div>
          ${argumentos.length ? `
            <div style="font-size:.68rem; color:rgba(229,231,235,.45); text-transform:uppercase; margin:8px 0 4px 0;">Argumentos</div>
            <ul style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.6; padding-left:18px; margin:0;">
              ${argumentos.map(a => `<li>${escapeHtml(a.texto)}${origenBadge(a.origen)}</li>`).join('')}
            </ul>` : ''}
          ${evidencia.length ? `
            <div style="font-size:.68rem; color:rgba(229,231,235,.45); text-transform:uppercase; margin:10px 0 4px 0;">Evidencia citada</div>
            <ul style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.6; padding-left:18px; margin:0;">
              ${evidencia.map(e => `<li>${escapeHtml(e.texto)}${origenBadge(e.origen)}</li>`).join('')}
            </ul>` : ''}
          ${supuestos.length ? `
            <div style="font-size:.68rem; color:rgba(229,231,235,.45); text-transform:uppercase; margin:10px 0 4px 0;">Supuestos (siempre inferidos)</div>
            <ul style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.6; padding-left:18px; margin:0;">
              ${supuestos.map(s => `<li>${escapeHtml(s.texto)}</li>`).join('')}
            </ul>` : ''}
        </div>`;
    };

    // ═══ FASE 1 — Reconstrucción + Prueba de Reconstrucción ═══
    // Esto es TODO lo que se muestra al principio. El resto del análisis
    // (comprensión, steelman, acuerdos, desacuerdos, síntesis) depende
    // cognitivamente de que la reconstrucción haya sido revisada primero
    // (protocolo §6 y §13) — por eso NO se renderiza todavía, ni siquiera
    // oculto en el DOM: literalmente no se genera su HTML hasta la Fase 2.
    outEl.innerHTML = `
      ${data.sintesis_descriptiva ? `
        <div class="view-section">
          <div class="view-section-title">Síntesis descriptiva</div>
          <div class="card-grid">
            <div class="s-card"><div class="s-card-title">Posición A</div><div class="s-card-body">${data.sintesis_descriptiva.a || ''}</div></div>
            <div class="s-card"><div class="s-card-title">Posición B</div><div class="s-card-body">${data.sintesis_descriptiva.b || ''}</div></div>
          </div>
        </div>` : ''}

      ${data.reconstruccion_completa ? `
        <div class="view-section">
          <div class="view-section-title">Reconstrucción detallada <span style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:none;">(🟢 explícito en el material · 🟡 inferencia de Logos)</span></div>
          <div class="card-grid">
            ${renderReconstruccionDetalle(data.reconstruccion_completa.a, 'A')}
            ${renderReconstruccionDetalle(data.reconstruccion_completa.b, 'B')}
          </div>
        </div>` : ''}

      <!-- Prueba de Reconstrucción (protocolo §13): la persona confirma,
           rechaza o precisa la reconstrucción antes de seguir avanzando. -->
      <div class="view-section" id="logos-validacion-section">
        <div class="view-section-title">¿Logos entendió bien tu posición?</div>
        <p style="font-size:.75rem; color:rgba(229,231,235,.45); margin-bottom:12px;">El resto del análisis (comprensión mutua, acuerdos, desacuerdos, síntesis) todavía no se generó. Confirmá o corregí ambas reconstrucciones para continuar.</p>
        <div class="card-grid">
          ${['a', 'b'].map(lado => `
            <div class="s-card" id="logos-valid-${lado}">
              <div class="s-card-title">Posición ${lado.toUpperCase()}</div>
              <div style="display:flex; gap:8px; margin-top:8px;">
                <button class="btn-primary logos-valid-btn" data-lado="${lado}" data-valor="confirmada" style="font-size:.75rem; padding:5px 12px;">Sí, es fiel</button>
                <button class="logos-valid-btn" data-lado="${lado}" data-valor="rechazada" style="font-size:.75rem; padding:5px 12px; background:none; border:1px solid rgba(255,255,255,.2); color:#e5e7eb; border-radius:4px; cursor:pointer;">No, hay algo mal</button>
              </div>
              <div id="logos-valid-${lado}-nota" style="display:none; margin-top:8px;">
                <textarea placeholder="¿Qué está mal en la reconstrucción?" style="width:100%; min-height:50px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px; color:#e5e7eb; font-size:.78rem; padding:6px; box-sizing:border-box;"></textarea>
                <button class="btn-primary logos-resend-btn" data-lado="${lado}" style="font-size:.72rem; padding:5px 12px; margin-top:6px;">Volver a comparar con esta corrección →</button>
              </div>
              <div id="logos-valid-${lado}-status" style="font-size:.72rem; margin-top:6px; color:rgba(229,231,235,.4);"></div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:16px;">
          <button id="logos-continuar-btn" class="btn-primary" disabled style="opacity:.4; cursor:not-allowed;">Ver análisis completo → (confirmá ambas posiciones primero)</button>
        </div>
      </div>

      <div id="logos-fase2-container"></div>
    `;

    _bindValidationButtons(outEl, data);
  }

  // ═══ FASE 2 — Análisis completo ═══
  // Solo se genera y se inserta en el DOM cuando el usuario confirmó (o
  // rechazó explícitamente y decidió avanzar igual) ambas posiciones.
  function renderFullAnalysis(data, fase2El) {
    fase2El.innerHTML = `
      ${data.comprension_cruzada ? `
        <div class="view-section">
          <div class="view-section-title">Comprensión mutua</div>
          <div class="card-grid">
            <div class="s-card"><div class="s-card-title">Cómo entiende A a B</div><div class="s-card-body">${data.comprension_cruzada.a_sobre_b || ''}</div></div>
            <div class="s-card"><div class="s-card-title">Cómo entiende B a A</div><div class="s-card-body">${data.comprension_cruzada.b_sobre_a || ''}</div></div>
          </div>
        </div>` : ''}

      ${data.steelman ? `
        <div class="view-section">
          <div class="view-section-title">Steelman dialéctico <span style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:none;">(la mejor versión posible de cada posición)</span></div>
          <div class="card-grid">
            <div class="s-card"><div class="s-card-title">Mejor versión de A</div><div class="s-card-body">${data.steelman.a || ''}</div></div>
            <div class="s-card"><div class="s-card-title">Mejor versión de B</div><div class="s-card-body">${data.steelman.b || ''}</div></div>
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

      ${(data.supuestos_compartidos && data.supuestos_compartidos.length) ? `
        <div class="view-section">
          <div class="view-section-title">Supuestos compartidos</div>
          <ul style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${data.supuestos_compartidos.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>` : ''}

      ${(data.convergencias && data.convergencias.length) ? `
        <div class="view-section">
          <div class="view-section-title">Convergencias</div>
          ${data.convergencias.map(c => `
            <div style="background:var(--s-panel); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:8px;">
              <div style="font-size:.68rem; color:var(--accent); text-transform:uppercase;">${c.estado || ''}</div>
              <div style="font-size:.82rem; color:#e5e7eb;">${c.texto}</div>
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
    _bindLogosFeedback(fase2El, data);
  }

  // ─── Validación de reconstrucción (protocolo §13) ─────
  function _bindValidationButtons(outEl, data) {
    if (!data._validacion) data._validacion = { a: null, b: null };

    // Habilita "Ver análisis completo" solo cuando AMBAS posiciones
    // tienen una decisión tomada (confirmada o rechazada) — es el gate
    // real que faltaba: antes esto no bloqueaba nada, ahora sí.
    const actualizarBotonContinuar = () => {
      const continuarBtn = document.getElementById('logos-continuar-btn');
      if (!continuarBtn) return;
      const ambasDecididas = data._validacion.a && data._validacion.b;
      continuarBtn.disabled = !ambasDecididas;
      continuarBtn.style.opacity = ambasDecididas ? '1' : '.4';
      continuarBtn.style.cursor = ambasDecididas ? 'pointer' : 'not-allowed';
      continuarBtn.textContent = ambasDecididas
        ? 'Ver análisis completo →'
        : 'Ver análisis completo → (confirmá ambas posiciones primero)';
    };

    outEl.querySelectorAll('.logos-valid-btn').forEach(btn => {
      btn.onclick = () => {
        const lado = btn.dataset.lado;
        const valor = btn.dataset.valor;
        const notaEl = document.getElementById(`logos-valid-${lado}-nota`);
        const statusEl = document.getElementById(`logos-valid-${lado}-status`);

        if (valor === 'rechazada') {
          notaEl.style.display = 'block';
          const textarea = notaEl.querySelector('textarea');
          statusEl.textContent = 'Contanos qué está mal y tocá "Volver a comparar" para que Logos lo tenga en cuenta.';
          statusEl.style.color = '#eab308';
          textarea.oninput = () => {
            data._validacion[lado] = { estado: 'rechazada', nota: textarea.value.trim() };
          };
          data._validacion[lado] = { estado: 'rechazada', nota: '' };
        } else {
          notaEl.style.display = 'none';
          statusEl.textContent = '✓ Confirmada como fiel.';
          statusEl.style.color = '#22c55e';
          data._validacion[lado] = { estado: 'confirmada', nota: '' };
        }
        actualizarBotonContinuar();
      };
    });

    const continuarBtn = document.getElementById('logos-continuar-btn');
    if (continuarBtn) {
      continuarBtn.onclick = () => {
        if (continuarBtn.disabled) return;
        const fase2El = document.getElementById('logos-fase2-container');
        if (fase2El) renderFullAnalysis(data, fase2El);
        continuarBtn.style.display = 'none';
      };
    }

    // Botón "Volver a comparar con esta corrección →": funcional.
    // Reconstruye el texto de la posición corregida (original + nota del
    // usuario) y vuelve a correr TODO el pipeline de comparación — no
    // solo la reconstrucción de esa posición, porque comprensión cruzada,
    // mapeo relacional y síntesis dependen de ella y quedarían
    // desactualizados si solo se corrigiera un fragmento.
    outEl.querySelectorAll('.logos-resend-btn').forEach(btn => {
      btn.onclick = async () => {
        const lado = btn.dataset.lado;
        const notaEl = document.getElementById(`logos-valid-${lado}-nota`);
        const textarea = notaEl.querySelector('textarea');
        const nota = textarea.value.trim();

        if (!nota) {
          const statusEl = document.getElementById(`logos-valid-${lado}-status`);
          statusEl.textContent = 'Escribí qué está mal antes de reenviar.';
          statusEl.style.color = '#ef4444';
          return;
        }

        const textoOriginalA = data._posicionA_original || '';
        const textoOriginalB = data._posicionB_original || '';

        const correccion = `\n\n[Corrección del usuario tras revisar la reconstrucción anterior de Logos]: ${nota}`;
        const nuevaA = lado === 'a' ? textoOriginalA + correccion : textoOriginalA;
        const nuevaB = lado === 'b' ? textoOriginalB + correccion : textoOriginalB;

        btn.disabled = true;
        btn.textContent = 'Reenviando…';

        // outEl es el mismo contenedor de siempre — compareWithLogos lo
        // reemplaza por completo con el resultado corregido cuando termine.
        // Esto vuelve a arrancar en la Fase 1 (nueva reconstrucción, nueva
        // validación pendiente) — correcto: una reconstrucción corregida
        // también necesita su propia confirmación antes de avanzar.
        await compareWithLogos(nuevaA, nuevaB, outEl);
      };
    });
  }

  // ─── Feedback del usuario sobre el uso de Logos ────────
  function _bindLogosFeedback(outEl, data) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-top:20px; padding:16px; background:var(--s-panel); border:1px dashed rgba(255,255,255,.15); border-radius:4px;';
    wrapper.innerHTML = `
      <div style="font-size:.75rem; color:rgba(229,231,235,.5); text-transform:uppercase; margin-bottom:8px;">¿Qué te pareció esta comparación?</div>
      <p style="font-size:.72rem; color:rgba(229,231,235,.4); margin:0 0 10px 0;">Logos está en desarrollo activo — contanos qué te gustó, qué no, o qué mejorarías.</p>
      <textarea id="logosFeedbackInput" placeholder="Ej: el steelman de la Posición B no reflejaba bien el argumento principal..." style="width:100%; min-height:60px; background:#0a0a0a; border:1px solid rgba(255,255,255,.1); border-radius:4px; color:#e5e7eb; font-size:.78rem; padding:8px; box-sizing:border-box; resize:vertical;"></textarea>
      <div style="display:flex; justify-content:flex-end; align-items:center; gap:10px; margin-top:8px;">
        <span id="logosFeedbackStatus" style="font-size:.72rem; color:rgba(229,231,235,.4);"></span>
        <button id="logosFeedbackBtn" class="btn-primary" style="font-size:.78rem; padding:6px 14px;">Enviar comentario</button>
      </div>
    `;
    outEl.appendChild(wrapper);

    const feedbackBtn = wrapper.querySelector('#logosFeedbackBtn');
    const feedbackInput = wrapper.querySelector('#logosFeedbackInput');
    const feedbackStatus = wrapper.querySelector('#logosFeedbackStatus');

    feedbackBtn.onclick = async () => {
      const comentario = feedbackInput.value.trim();
      if (!comentario) {
        feedbackStatus.textContent = 'Escribí algo antes de enviar.';
        feedbackStatus.style.color = '#ef4444';
        return;
      }
      feedbackBtn.disabled = true;
      feedbackStatus.textContent = 'Enviando…';
      feedbackStatus.style.color = 'rgba(229,231,235,.4)';
      try {
        const response = await fetch('/api/logos/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comentario,
            validacion: data._validacion || null,
            timestamp: new Date().toISOString()
          })
        });
        if (response.ok) {
          feedbackStatus.textContent = '¡Gracias! Tu comentario fue enviado.';
          feedbackStatus.style.color = '#22c55e';
          feedbackInput.value = '';
        } else {
          throw new Error(`El servidor respondió ${response.status}`);
        }
      } catch (err) {
        console.warn('⚠️ No se pudo enviar el feedback de Logos:', err.message);
        feedbackStatus.textContent = 'No se pudo enviar. Probá de nuevo más tarde.';
        feedbackStatus.style.color = '#ef4444';
      } finally {
        feedbackBtn.disabled = false;
      }
    };
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
      // Inyectamos la clase en el body de manera determinista para asegurar que 
      // todo el marco del sistema (header, menú) absorba el color Logos.
      document.body.classList.add('logos-page');

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
