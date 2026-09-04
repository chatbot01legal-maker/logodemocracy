/* ═══════════════════════════════════════════════════════
   LOGOS.JS — Frontend del instrumento Logos v0.2.3
   Ecosistema LogoDemocracy

   Sigue el mismo patrón arquitectónico que sophia.js:
   - Un objeto VIEWS con render() por sección, renderizado dentro de
     #viewContent (mismo contenedor, mismas clases CSS que SOPHIA).
   - Un objeto LOGOS que expone navigate(), init() y la lógica de la
     herramienta de Comparar Posiciones.

   IMPORTANTE — alcance de este archivo:
   Implementa el FRONTEND completo hablando el contrato REAL que expone
   LogosEngine v0.2.1 en POST /api/logos/compare (reconstructions,
   mutualUnderstanding, agreements, sharedAssumptions, disagreements,
   convergences, synthesisEligibility, synthesis, openQuestions,
   uncertainties — ver LogosEngine.js).

   La Prueba de Reconstrucción es una etapa cognitiva real: el estado de
   validación humana (reconstructionValidation, por posición: status /
   correction / iteration / history) vive en una sesión de comparación
   independiente del objeto `data` que devuelve el backend en cada
   llamada, precisamente porque el backend no tiene memoria de sesión.
   El botón "Ver análisis completo" está deshabilitado hasta que AMBAS
   posiciones estén confirmadas. Ver la explicación de cambios entregada
   junto a este archivo para el detalle de qué se corrigió, cómo, y qué
   depende de un cambio de contrato en el backend que no fue posible
   implementar solo desde este archivo.
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
      <section class="logos-example">

        <div class="logos-eyebrow">Caso real · LOGOS en acción</div>

        <h2>Joy Behar, Vivek Ramaswamy y la riqueza de Elon Musk</h2>

        <p class="logos-lead">
          Este ejemplo muestra el análisis completo de un encuentro entre dos
          posiciones. LOGOS no determina quién tiene razón: reconstruye las
          posiciones, examina cómo se relacionan y hace visibles los acuerdos,
          desacuerdos, supuestos y posibles puntos de convergencia.
        </p>

        <div class="logos-example-note">
          <strong>Importante:</strong>
          Las afirmaciones fácticas que aparecen en el diálogo pertenecen al
          material analizado. Su presencia en este ejemplo no significa que
          hayan sido verificadas como verdaderas por LOGOS.
        </div>

        <!-- DIÁLOGO -->

        <div class="logos-section">
          <div class="logos-section-label">Diálogo analizado</div>

          <div class="logos-position">
            <div class="logos-position-title">Posición A · Joy Behar</div>

            <p>
              Joy cuestiona qué está haciendo Elon Musk con una cantidad
              extraordinaria de dinero y plantea qué ocurre con la mentalidad
              de las personas que concentran fortunas extremas.
            </p>
          </div>

          <div class="logos-position">
            <div class="logos-position-title">Posición B · Vivek Ramaswamy</div>

            <p>
              Vivek responde cuestionando la situación patrimonial de Joy y
              distingue entre riqueza personal disponible para gastar y riqueza
              vinculada a empresas que generan actividad económica y empleo.
            </p>
          </div>
        </div>

        <!-- RECONSTRUCCIÓN -->

        <div class="logos-section">
          <div class="logos-section-label">1 · Reconstrucción</div>

          <p>
            LOGOS separa lo que aparece explícitamente en el material de las
            interpretaciones que infiere a partir de él.
          </p>

          <div class="logos-position">
            <div class="logos-position-title">Posición A</div>

            <h4>Resumen</h4>
            <p>
              Cuestiona qué está haciendo Elon Musk con su enorme riqueza,
              señalando que una cantidad de dinero de esa magnitud podría
              utilizarse para resolver problemas sociales de gran escala.
              También cuestiona la mentalidad de quienes acumulan fortunas
              extremas.
            </p>

            <h4>🟢 Explícito en el material</h4>
            <ul>
              <li>Musk está cerca de convertirse en trillionaire.</li>
              <li>El dinero de Musk podría salvar a algunos países.</li>
              <li>Se pregunta si las personas con tanto dinero creen que vivirán para siempre.</li>
            </ul>

            <h4>🟡 Inferencias de LOGOS</h4>
            <ul>
              <li>Existe una expectativa de que las grandes fortunas sean utilizadas para producir beneficio social.</li>
              <li>La posición cuestiona que la riqueza de Musk esté siendo utilizada de una manera suficientemente beneficiosa para la sociedad.</li>
              <li>La acumulación extrema de riqueza es presentada como problemática cuando existen necesidades sociales importantes.</li>
              <li>La posición sugiere una posible desconexión o egocentrismo asociado a la mentalidad de algunas personas extremadamente ricas.</li>
            </ul>
          </div>

          <div class="logos-position">
            <div class="logos-position-title">Posición B</div>

            <h4>Resumen</h4>
            <p>
              Responde señalando que Joy posee una fortuna considerable y
              pregunta cuándo comenzará a distribuirla. Introduce además una
              distinción entre la riqueza personal disponible y la riqueza
              vinculada a empresas que han generado empleo.
            </p>

            <h4>🟢 Explícito en el material</h4>
            <ul>
              <li>Joy tiene una riqueza estimada en 30 millones de dólares.</li>
              <li>Se presenta esa riqueza como dinero real disponible para gastar y como riqueza generacional.</li>
              <li>Joy no habría creado empleos de la misma manera que un fundador o propietario de una empresa escalable.</li>
              <li>Un tercio de la riqueza de Joy podría alimentar a 3.000 personas durante un año.</li>
              <li>La riqueza de Musk está mayoritariamente vinculada a acciones de empresas.</li>
              <li>Se afirma que las empresas asociadas a Musk han generado más de un millón de empleos directa e indirectamente.</li>
              <li>Se afirma que menos del 0,1 % de la riqueza de Musk estaría en efectivo, aproximadamente entre 1.000 y 2.000 millones de dólares.</li>
            </ul>

            <h4>🟡 Inferencias de LOGOS</h4>
            <ul>
              <li>La riqueza personal que no está asociada a creación de empleo es presentada como portadora de una mayor obligación de redistribución.</li>
              <li>La creación de empleo mediante empresas es considerada una forma socialmente valiosa de generar y mantener riqueza.</li>
              <li>La capacidad de alimentar a 3.000 personas con una parte de una fortuna es utilizada como argumento para considerar posible una redistribución directa.</li>
              <li>La riqueza vinculada a acciones empresariales no es presentada como equivalente a dinero líquido inmediatamente disponible para donar.</li>
            </ul>
          </div>
        </div>

        <!-- VALIDACIÓN -->

        <div class="logos-section">
          <div class="logos-section-label">2 · Prueba de Reconstrucción</div>

          <div class="logos-validation">
            <div class="logos-validation-item">
              <span>Posición A</span>
              <strong>✓ La persona confirmó que LOGOS entendió correctamente su posición.</strong>
            </div>

            <div class="logos-validation-item">
              <span>Posición B</span>
              <strong>✓ La persona confirmó que LOGOS entendió correctamente su posición.</strong>
            </div>
          </div>

          <p>
            Esta validación es importante porque una reconstrucción que su
            propio autor no reconoce como fiel no debería convertirse sin más
            en la base del análisis posterior.
          </p>
        </div>

        <!-- COMPRENSIÓN MUTUA -->

        <div class="logos-section">
          <div class="logos-section-label">3 · Comprensión mutua</div>

          <div class="logos-position">
            <div class="logos-position-title">Cómo A comprende a B</div>
            <p>
              A reconoce que B comparte una crítica general a la acumulación
              extrema de riqueza, aunque la formula desde otra perspectiva.
              B introduce una distinción basada en el origen y la utilización
              de la riqueza, especialmente en relación con la creación de
              empleo.
            </p>
          </div>

          <div class="logos-position">
            <div class="logos-position-title">Cómo B comprende a A</div>
            <p>
              B reconoce que A formula una crítica moral válida sobre la
              concentración de riqueza, pero considera que esa crítica es
              incompleta o está parcialmente dirigida al objetivo equivocado
              porque no distingue entre riqueza personal disponible y riqueza
              vinculada a empresas.
            </p>
          </div>
        </div>

        <!-- STEELMAN -->

        <div class="logos-section">
          <div class="logos-section-label">4 · Steelman dialéctico</div>

          <p>
            Antes de evaluar o confrontar las posiciones, LOGOS intenta
            representarlas de una manera que preserve su lógica interna y
            presente su versión más sólida y caritativa.
          </p>

          <div class="logos-position">
            <div class="logos-position-title">Steelman de A</div>
            <p>
              La preocupación central de A puede entenderse como una pregunta
              sobre la responsabilidad social asociada a la concentración
              extraordinaria de recursos. Desde esta perspectiva, el problema
              no es solamente cuánto dinero posee una persona, sino qué
              significa acumular una cantidad capaz de afectar de manera
              significativa el bienestar de otras personas.
            </p>
          </div>

          <div class="logos-position">
            <div class="logos-position-title">Steelman de B</div>
            <p>
              La preocupación central de B puede entenderse como una objeción
              a tratar toda riqueza como si tuviera la misma naturaleza. Una
              parte importante de la riqueza de Musk está vinculada a
              participaciones empresariales y, según esta posición, esas
              empresas producen valor y empleo. Por lo tanto, la obligación
              social de redistribuir riqueza debería considerar también cómo
              fue generada y qué efectos produce.
            </p>
          </div>
        </div>

        <!-- ACUERDOS -->

        <div class="logos-section">
          <div class="logos-section-label">5 · Acuerdos</div>

          <ul>
            <li>Musk es una persona con una riqueza extraordinariamente grande.</li>
            <li>La manera en que las personas extremadamente ricas utilizan o distribuyen su riqueza puede ser objeto de debate social.</li>
          </ul>
        </div>

        <!-- SUPUESTOS -->

        <div class="logos-section">
          <div class="logos-section-label">6 · Supuestos compartidos</div>

          <ul>
            <li>Las grandes fortunas individuales plantean preguntas sobre su utilización y su impacto social.</li>
            <li>Existe algún valor en utilizar la riqueza para producir beneficios sociales.</li>
            <li>Las decisiones económicas de personas extremadamente ricas pueden influir significativamente en el bienestar de otras personas.</li>
          </ul>
        </div>

        <!-- DESACUERDOS -->

        <div class="logos-section">
          <div class="logos-section-label">7 · Naturaleza de los desacuerdos</div>

          <div class="logos-disagreement">
            <h4>Factual + normativo</h4>
            <p>
              El desacuerdo combina afirmaciones sobre la naturaleza y el
              origen de la riqueza de Musk con distintas implicaciones sobre
              qué obligación social debería derivarse de ella.
            </p>
          </div>

          <div class="logos-disagreement">
            <h4>Conceptual + normativo</h4>
            <p>
              Las posiciones utilizan criterios diferentes para determinar
              cuándo una persona extremadamente rica debería redistribuir
              parte de su riqueza.
            </p>
          </div>

          <div class="logos-disagreement">
            <h4>Conceptual + estratégico</h4>
            <p>
              Existe una diferencia respecto de qué tipo de riqueza debería
              considerarse especialmente problemática o estar sometida a
              mayor escrutinio social.
            </p>
          </div>
        </div>

        <!-- CONVERGENCIAS -->

        <div class="logos-section">
          <div class="logos-section-label">8 · Convergencias</div>

          <div class="logos-convergence">
            <h4>Convergencia encontrada</h4>
            <p>
              La magnitud de la riqueza individual es relevante para debatir
              cómo debería utilizarse y qué responsabilidad social puede
              asociarse a ella.
            </p>
          </div>

          <div class="logos-convergence">
            <h4>Convergencia posible</h4>
            <p>
              Las grandes cantidades de riqueza podrían implicar algún grado
              de responsabilidad social, aunque las posiciones difieren sobre
              los criterios y las personas a las que debería aplicarse.
            </p>
          </div>

          <div class="logos-convergence">
            <h4>Convergencia posible</h4>
            <p>
              La composición de una fortuna —por ejemplo, acciones de empresas
              frente a dinero líquido— puede ser relevante para evaluar sus
              posibilidades de redistribución directa y su impacto social.
            </p>
          </div>
        </div>

        <!-- ELEGIBILIDAD -->

        <div class="logos-section">
          <div class="logos-section-label">9 · Condiciones para la síntesis</div>

          <p>
            LOGOS evalúa si existen condiciones suficientes para intentar una
            síntesis. En este caso, el motor considera satisfechas las
            condiciones necesarias.
          </p>

          <ul>
            <li><strong>Alineación con la pregunta:</strong> OK</li>
            <li><strong>Suficiencia de información:</strong> OK</li>
            <li><strong>Claridad conceptual:</strong> OK</li>
            <li><strong>Suficiencia de evidencia:</strong> OK</li>
          </ul>
        </div>

        <!-- SÍNTESIS RELACIONAL -->

        <div class="logos-section">
          <div class="logos-section-label">10 · Síntesis relacional</div>

          <p>
            Ambas posiciones abordan la responsabilidad asociada a la riqueza
            extrema, pero utilizan criterios diferentes.
          </p>

          <p>
            A cuestiona la magnitud de la fortuna de Musk y plantea una
            responsabilidad moral de utilizarla para producir beneficio
            social. B introduce una distinción entre riqueza personal
            disponible y riqueza vinculada a empresas, y sostiene que la
            actividad empresarial puede generar beneficios sociales de manera
            indirecta.
          </p>

          <p>
            El desacuerdo, por tanto, no se limita a cuánto dinero posee Musk.
            También involucra qué características de una fortuna deberían
            determinar la responsabilidad social asociada a ella.
          </p>
        </div>

        <!-- SÍNTESIS GENERATIVA -->

        <div class="logos-section">
          <div class="logos-section-label">11 · Síntesis generativa · propuesta</div>

          <div class="logos-position">
            <div class="logos-position-title">Reformulación del problema</div>
            <p>
              La pregunta original puede estar planteada de manera demasiado
              amplia si trata toda riqueza como si fuera equivalente. El
              análisis sugiere distinguir entre tipos, formas y orígenes de
              riqueza antes de evaluar sus responsabilidades sociales.
            </p>
          </div>

          <div class="logos-position">
            <div class="logos-position-title">Una posible propuesta</div>
            <p>
              Considerar un marco diferenciado que evalúe simultáneamente la
              posibilidad de donación directa de capital líquido y el impacto
              indirecto producido mediante la inversión y la actividad de las
              empresas.
            </p>
          </div>

          <div class="logos-example-note">
            <strong>Esto es una propuesta, no una conclusión.</strong>
            LOGOS no determina que esta síntesis sea correcta ni que las
            posiciones hayan llegado a un consenso.
          </div>
        </div>

        <!-- PREGUNTAS ABIERTAS -->

        <div class="logos-section">
          <div class="logos-section-label">12 · Preguntas deliberativas abiertas</div>

          <ol>
            <li>
              ¿Cómo debería la creación de empleo o de valor económico
              modificar o redefinir una eventual obligación de donación directa?
            </li>
            <li>
              ¿Qué criterios éticos deberían utilizarse para diferenciar la
              responsabilidad social según el origen, la forma y el impacto
              indirecto de una fortuna?
            </li>
            <li>
              ¿Cómo podemos comparar el beneficio social de una donación
              directa con el beneficio social producido mediante una empresa
              o una inversión?
            </li>
          </ol>
        </div>

        <!-- CIERRE -->

        <div class="logos-section logos-example-conclusion">
          <div class="logos-section-label">Lo que este ejemplo permite ver</div>

          <p>
            LOGOS no determina quién ganó la discusión.
          </p>

          <p>
            Tampoco convierte automáticamente las afirmaciones del diálogo
            en hechos verdaderos.
          </p>

          <p>
            Su función es hacer visible la estructura del encuentro:
            reconstruir las posiciones, distinguir lo explícito de lo
            inferido, comprobar si las personas reconocen su propia
            reconstrucción, mostrar cómo se comprenden mutuamente, identificar
            acuerdos, supuestos compartidos y desacuerdos, y explorar
            convergencias y nuevas formas de plantear el problema.
          </p>

          <p>
            El resultado no cierra la deliberación. La hace más visible para
            que las personas puedan continuarla con mayor claridad.
          </p>
        </div>

      </section>
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

  // ═══════════════════════════════════════════════════════
  // A PARTIR DE ACÁ: lógica de comparación real.
  //
  // Esta sección fue reescrita para hablar el contrato REAL que expone
  // LogosEngine v0.2.1 (reconstructions / mutualUnderstanding / agreements /
  // sharedAssumptions / disagreements / convergences / synthesisEligibility /
  // synthesis / openQuestions / uncertainties), y para que la validación
  // humana de la reconstrucción sea una etapa cognitiva real, no un adorno
  // visual. Ver la explicación de cambios entregada junto a este archivo
  // para el detalle completo de qué se corrigió y por qué.
  // ═══════════════════════════════════════════════════════

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  // ─── Estado de sesión de Comparar Posiciones ──────────
  // Vive FUERA del objeto `data` que devuelve el backend, porque cada
  // llamada a /api/logos/compare devuelve un objeto `data` enteramente
  // nuevo (el backend no tiene memoria de sesión). Si guardáramos el
  // estado de validación humana dentro de `data`, se perdería cada vez
  // que Logos recalcula tras una corrección — exactamente el problema
  // que el punto 6 del encargo pide evitar.
  function nuevaSesion() {
    return {
      data: null,
      reconstructionValidation: {
        a: { status: 'PENDING', correction: null, iteration: 1, lastChangeDetected: null, history: [] },
        b: { status: 'PENDING', correction: null, iteration: 1, lastChangeDetected: null, history: [] }
      }
    };
  }

  // ─── Comparación estructural entre dos reconstrucciones ──
  // Punto 21: nunca decir "corrección incorporada" si no hubo un cambio
  // real. Comparamos texto, estado epistémico y evidencia de cada claim,
  // no el objeto completo (que puede diferir en formato sin diferir en
  // contenido).
  function reconstruccionesDifierenSustancialmente(prevClaims, nuevosClaims) {
    if (!prevClaims) return null; // no hay línea de base todavía (primera vez)
    const normalizar = (claims) => (claims || [])
      .filter(Boolean) // descarta entradas nulas/corruptas sin romper la comparación
      .map(c => JSON.stringify({
        texto: (c.text || '').trim(),
        estado: (c.epistemicStatus || c.status || '').toString().toUpperCase(),
        evidencia: (c.evidence || []).filter(Boolean).map(e => (e.quote || '').trim()).sort()
      }))
      .sort();
    const a = normalizar(prevClaims);
    const b = normalizar(nuevosClaims);
    if (a.length !== b.length) return true;
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  // ─── Envío al backend (Modalidad A: Comparar) ─────────
  // sesion: objeto de nuevaSesion(). ladoCorregido ('a' | 'b' | null): si
  // esta llamada es consecuencia de una corrección, indica qué lado se
  // corrigió, para poder comparar su reconstrucción anterior vs la nueva.
  async function compareWithLogos(posicionA, posicionB, outEl, sesion, ladoCorregido) {
    const loadingPhrases = [
      "¿Sabías que...? LOGOS no intenta decidir quién tiene razón. Reconstruye las posiciones para que podamos comprender mejor qué está realmente en juego.",
      "¿Sabías que...? Antes de comparar dos posiciones, LOGOS reconstruye cada una por separado. Comprender primero es una condición para deliberar después.",
      "¿Sabías que...? La Prueba de Reconstrucción permite que la propia persona confirme, rechace o precise la representación que LOGOS hizo de su posición.",
      "¿Sabías que...? Una reconstrucción que la persona no reconoce como fiel no debería convertirse en la base de todo el análisis posterior.",
      "¿Sabías que...? Comprender una posición contraria no significa estar de acuerdo con ella. Significa poder representarla de una manera que su propio autor pueda reconocer.",
      "¿Sabías que...? El steelman dialéctico busca presentar la versión más sólida y caritativa de una posición antes de evaluarla o compararla.",
      "¿Sabías que...? LOGOS distingue entre comprender lo que alguien dice y determinar si estamos de acuerdo con lo que dice. Son operaciones diferentes.",
      "¿Sabías que...? Dos personas pueden discrepar en una conclusión y, sin embargo, compartir algunos de los supuestos que utilizan para llegar a ella.",
      "¿Sabías que...? LOGOS distingue seis naturalezas posibles del desacuerdo: factual, causal, conceptual, normativo, metodológico y estratégico.",
      "¿Sabías que...? Un desacuerdo factual pregunta por los hechos; uno normativo pregunta por valores o criterios de deseabilidad. Confundirlos puede hacer que una discusión avance en círculos.",
      "¿Sabías que...? Un desacuerdo conceptual puede parecer factual cuando, en realidad, las personas están utilizando de manera diferente una misma palabra o concepto.",
      "¿Sabías que...? Encontrar un punto de acuerdo no significa que el desacuerdo haya desaparecido. El mapa relacional permite mostrar ambas cosas al mismo tiempo.",
      "¿Sabías que...? Una convergencia no siempre existe desde el principio. A veces aparece cuando comprendemos mejor qué condiciones permitirían acercar las dos posiciones.",
      "¿Sabías que...? La síntesis descriptiva pregunta qué están diciendo realmente A y B. No intenta conciliarlos: intenta representarlos fielmente.",
      "¿Sabías que...? La síntesis relacional pregunta cómo se relacionan las posiciones: qué comparten, dónde difieren y qué tipo de desacuerdo existe.",
      "¿Sabías que...? Una síntesis generativa de solución propone una alternativa que responde al problema incorporando elementos que ninguna de las posiciones contenía por separado.",
      "¿Sabías que...? Una síntesis generativa de problema puede revelar que la pregunta original estaba incompleta o planteada de una manera demasiado estrecha.",
      "¿Sabías que...? Una síntesis no tiene que ser un punto medio entre A y B. Puede ser una nueva forma de comprender el problema.",
      "¿Sabías que...? LOGOS no fabrica consenso. Una buena deliberación también puede terminar mostrando con mayor precisión por qué las personas siguen en desacuerdo.",
      "¿Sabías que...? El objetivo de LOGOS no es cerrar una discusión, sino hacer visible su estructura para que las personas puedan examinarla y encontrar nuevas posibilidades."
    ];

    // Selección aleatoria de la frase inicial.
    let phraseIndex = Math.floor(Math.random() * loadingPhrases.length);

    const renderLoading = () => {
      const loader = document.getElementById('logos-loader');
      const fact = document.getElementById('logos-loader-fact');

      if (!loader || !fact) return;

      fact.textContent = loadingPhrases[phraseIndex];
    };

    renderLoading();

    // Cambiar la frase cada 10 segundos sin repetir inmediatamente la anterior.
    const loadingInterval = setInterval(() => {
      let nextIndex;

      do {
        nextIndex = Math.floor(Math.random() * loadingPhrases.length);
      } while (nextIndex === phraseIndex && loadingPhrases.length > 1);

      phraseIndex = nextIndex;
      renderLoading();
    }, 10000);

    // Pipelines de varias llamadas a Gemini en serie (reconstrucción A,
    // reconstrucción B, análisis relacional, síntesis) pueden tardar más de
    // lo que tolera un proxy intermedio. Sin límite propio, un fetch()
    // colgado deja al usuario mirando la animación de carga para siempre,
    // que es indistinguible de "no aparece resultado". 170s da margen a
    // 4 llamadas secuenciales a Gemini incluso con cold start de Cloud Run.
    const controlador = new AbortController();
    const timeoutId = setTimeout(() => controlador.abort(), 170000);

    try {
      const res = await fetch('/api/logos/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posicionA, posicionB }),
        signal: controlador.signal
      });
      if (!res.ok) {
  let errorData = null;

  try {
    errorData = await res.json();
  } catch (_) {
    // Si la respuesta no es JSON, se mantiene el manejo genérico.
  }

  if (
    res.status === 429 &&
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

  throw new Error(`El servidor respondió ${res.status}`);
      }

      let cuerpo;
      try {
        cuerpo = await res.json();
      } catch (parseErr) {
        throw new Error(`La respuesta del backend no es JSON válido (${parseErr.message}).`);
      }

      const data = desenvolverRespuesta(cuerpo);
      console.log('[LOGOS DEBUG] Respuesta recibida. Claves de nivel superior:', cuerpo && typeof cuerpo === 'object' ? Object.keys(cuerpo) : typeof cuerpo);
      if (data !== cuerpo) {
        console.log('[LOGOS DEBUG] La respuesta venía envuelta en un contenedor — se desenvolvió automáticamente. Claves usadas:', Object.keys(data));
      }

      if (!data || typeof data !== 'object') {
        throw new Error('El backend respondió 200 pero el cuerpo estaba vacío o no era un objeto utilizable.');
      }
      if (!data.reconstructions) {
        console.warn('[LOGOS DEBUG] La respuesta no trae "reconstructions". Se mostrará igual todo lo que sí venga presente.');
      }

      const prevData = sesion.data;
      sesion.data = data;
      sesion.posicionA_original = posicionA;
      sesion.posicionB_original = posicionB;

      // Si esta llamada viene de una corrección, comparamos ESTRUCTURALMENTE
      // la reconstrucción anterior del lado corregido contra la nueva, y
      // dejamos el veredicto (huboCambio: true/false/null) guardado — nunca
      // inventado en el render.
      if (ladoCorregido && prevData && prevData.reconstructions && data.reconstructions) {
        const prevClaims = (prevData.reconstructions[ladoCorregido] || {}).coreClaims;
        const nuevosClaims = (data.reconstructions[ladoCorregido] || {}).coreClaims;
        const huboCambio = reconstruccionesDifierenSustancialmente(prevClaims, nuevosClaims);
        const rv = sesion.reconstructionValidation[ladoCorregido];
        rv.lastChangeDetected = huboCambio;
        rv.history.push({ iteration: rv.iteration, claims: prevClaims || [] });
        rv.iteration += 1;
        rv.status = 'PENDING'; // una reconstrucción corregida vuelve a necesitar su propia confirmación
      }

      LOGOS._lastComparison = { posicionA, posicionB, resultado: data, timestamp: new Date().toISOString() };

      // Nunca escribir sobre un #logos-output que ya no está en el DOM
      // (p. ej. si el usuario navegó y volvió mientras la respuesta viajaba).
      renderComparison(data, elementoDestino(outEl), sesion);
} catch (err) {

  if (err?.code === 'AI_DAILY_LIMIT_REACHED') {
    const destino = elementoDestino(outEl);

    destino.innerHTML = `
      <div style="background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px; padding:16px; margin-top:16px;">
        <p style="color:var(--accent); font-size:.85rem; margin:0 0 10px 0;">
          LogoDemocracy está en etapa Beta.
        </p>

        <p style="color:rgba(229,231,235,.75); font-size:.78rem; line-height:1.55; margin:0 0 10px 0;">
          Estamos desarrollando y calibrando nuestros instrumentos de inteligencia artificial con recursos propios. Para mantener controlado el uso mientras realizamos esta etapa de calibración, existe un límite diario de procesamiento.
        </p>

        <p style="color:rgba(229,231,235,.75); font-size:.78rem; line-height:1.55; margin:0 0 10px 0;">
          El límite de hoy ya fue alcanzado.
        </p>

        <p style="color:rgba(229,231,235,.75); font-size:.78rem; line-height:1.55; margin:0 0 10px 0;">
          Puedes volver a utilizar este instrumento a partir de las 00:00 horas del próximo día.
        </p>

        <p style="color:rgba(229,231,235,.75); font-size:.78rem; line-height:1.55; margin:0;">
          Gracias por ayudarnos a desarrollar y calibrar LogoDemocracy.
        </p>
      </div>`;

    return;
  }

  const motivo = err.name === 'AbortError'
    ? 'El backend tardó demasiado en responder (más de 170 segundos) y se canceló la espera.'
    : err.message;

  console.error('❌ Error en compareWithLogos:', err);

  if (ladoCorregido) {
    sesion.reconstructionValidation[ladoCorregido].status = 'PENDING';
  }

  const destino = elementoDestino(outEl);

  destino.innerHTML = `
    <div style="background:var(--s-panel); border:1px dashed rgba(255,255,255,.15); border-radius:4px; padding:16px; margin-top:16px;">
      <p style="color:#eab308; font-size:.82rem; margin:0 0 6px 0;">
        No fue posible generar ${ladoCorregido ? 'la reconstrucción revisada' : 'la comparación'}.
      </p>

      <p style="color:rgba(229,231,235,.5); font-size:.78rem; margin:0;">
        ${ladoCorregido ? 'Tu validación sigue pendiente — no se dio por confirmada ninguna reconstrucción a partir de este error.' : 'El motor de comparación no respondió correctamente.'}
        (Detalle técnico: ${escapeHtml(motivo)})
      </p>

      <div style="margin-top:10px;">
        <button class="btn-primary logos-retry-btn" style="font-size:.75rem; padding:5px 12px;">
          Reintentar →
        </button>
      </div>
    </div>`;

  const retryBtn = destino.querySelector('.logos-retry-btn');

  if (retryBtn) {
    retryBtn.onclick = () =>
      compareWithLogos(
        posicionA,
        posicionB,
        outEl,
        sesion,
        ladoCorregido
      );
  }
    } finally {
      clearTimeout(timeoutId);
      clearInterval(loadingInterval);
    }
  }

  // ─── Reintenta ubicar el contenedor real en el DOM ────
  // Si #logos-output todavía existe y sigue conectado, se usa tal cual.
  // Si no, se vuelve a buscar por id (por si la vista se re-renderizó
  // durante la espera) y, en último caso, se cae de vuelta al nodo
  // original para no lanzar una excepción.
  function elementoDestino(outEl) {
    if (outEl && typeof outEl.isConnected === 'boolean' && outEl.isConnected) return outEl;
    const fresco = document.getElementById('logos-output');
    return fresco || outEl;
  }

/**
 * Normalización de respuesta para Logos 10 (v0.2.3)
 * Mapea propiedades y asegura valores string para evitar bloques vacíos.
 */
function desenvolverRespuesta(cuerpo) {
  if (!cuerpo) return null;

  let d = cuerpo;
  while (d && (d.data || d.result || d.payload)) {
    d = d.data || d.result || d.payload;
  }

  // --- 1. Reconstrucciones (mapeo desde reconstruccion_completa) ---
  const recs = d.reconstruccion_completa || d.reconstructions || {};
  const reconstructions = { a: null, b: null };

  // Función auxiliar para convertir argumentos/evidencia/supuestos a coreClaims
  function buildClaims(items, defaultStatus = 'EXPLICIT') {
    if (!Array.isArray(items)) return [];
    return items
      .filter(item => item && typeof item === 'object' && item.texto)
      .map(item => ({
        id: item.id || null,
        text: item.texto || '',
        epistemicStatus: (item.origen && item.origen.toLowerCase().includes('inferido'))
          ? 'INFERRED'
          : defaultStatus,
        evidence: item.evidencia
          ? item.evidencia.map(e => ({ quote: e.texto || e, source: e.fuente || null }))
          : []
      }));
  }

  if (recs.a && typeof recs.a === 'object') {
    reconstructions.a = {
      summary: d.sintesis_descriptiva?.a || '',
      coreClaims: [
        ...buildClaims(recs.a.argumentos || [], 'EXPLICIT'),
        ...buildClaims(recs.a.evidencia || [], 'EXPLICIT'),
        ...buildClaims(recs.a.supuestos || [], 'INFERRED')
      ]
    };
  }
  if (recs.b && typeof recs.b === 'object') {
    reconstructions.b = {
      summary: d.sintesis_descriptiva?.b || '',
      coreClaims: [
        ...buildClaims(recs.b.argumentos || [], 'EXPLICIT'),
        ...buildClaims(recs.b.evidencia || [], 'EXPLICIT'),
        ...buildClaims(recs.b.supuestos || [], 'INFERRED')
      ]
    };
  }

  // --- 2. Comprensión mutua ---
  const mu = d.comprension_cruzada || d.mutualUnderstanding || {};
  const mutualUnderstanding = {
    a_understands_b: mu.a_sobre_b || mu.a_understands_b || '',
    b_understands_a: mu.b_sobre_a || mu.b_understands_a || ''
  };

  // --- 3. Acuerdos, desacuerdos, supuestos compartidos ---
  const agreements = Array.isArray(d.acuerdos) ? d.acuerdos : [];
  const sharedAssumptions = Array.isArray(d.supuestos_compartidos) ? d.supuestos_compartidos : [];

  const disagreements = Array.isArray(d.desacuerdos)
    ? d.desacuerdos.map(item => ({
        primaryType: item.tipo || 'Sin clasificar',
        secondaryTypes: [],
        text: item.texto || item.desc || '',
        basis: { positionAClaims: [], positionBClaims: [] }
      }))
    : [];

  // --- 4. Convergencias ---
  const convergences = Array.isArray(d.convergencias)
    ? d.convergencias.map(item => ({
        status: item.estado || 'Posible',
        text: item.texto || '',
        condition: item.condicion || null
      }))
    : [];

  // --- 5. Síntesis ---
  const synthesis = {
    relational: d.sintesis_relacional || '',
    generative: Array.isArray(d.sintesis_generativa)
      ? d.sintesis_generativa.map(item => ({
          type: item.tipo === 'problema' ? 'problema' : 'solucion',
          title: null,
          text: item.texto || '',
          derivedFrom: { positionAClaims: [], positionBClaims: [], newElements: [] }
        }))
      : []
  };

  // --- 6. Preguntas abiertas e incertidumbres ---
  const openQuestions = Array.isArray(d.preguntas_deliberativas) ? d.preguntas_deliberativas : [];
  const uncertainties = []; // no existe en el formato antiguo

  // --- 7. Elegibilidad (valor por defecto para que no bloquee) ---
  const synthesisEligibility = {
    eligible: true,
    summary: d.sintesis_descriptiva ? 'Síntesis descriptiva disponible' : '',
    eligibilityReason: 'Se asume elegibilidad por compatibilidad con versión anterior.',
    criteria: {
      questionAlignment: { status: 'OK', reason: 'Asumido' },
      informationSufficiency: { status: 'OK', reason: 'Asumido' },
      conceptualClarity: { status: 'OK', reason: 'Asumido' },
      evidenceSufficiency: { status: 'OK', reason: 'Asumido' }
    }
  };

  // --- 8. Forzar visibilidad de contenedores (ya existente) ---
  const contenedores = ['resultados', 'resultadoContainer', 'fase1Container', 'output', 'app'];
  contenedores.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden', 'd-none');
      el.style.display = 'block';
    }
  });

  // --- 9. Devolver el objeto completo con todas las propiedades nuevas ---
  return {
    ...d,
    reconstructions,
    mutualUnderstanding,
    agreements,
    sharedAssumptions,
    disagreements,
    convergences,
    synthesis,
    openQuestions,
    uncertainties,
    synthesisEligibility,
    // además, para mantener compatibilidad con otras partes, conservamos las originales
    protocolVersion: d.protocolVersion || '0.1.1 (mapeado)',
    sessionId: d.sessionId || null,
    lastCompletedPhase: d.lastCompletedPhase || 'FASE1'
  };
     }
   
   
   

  // ─── Badges de estado epistémico (punto 8) ────────────
  // EXPLICIT: la afirmación aparece efectivamente en el material.
  // INFERRED: es una reconstrucción/inferencia de Logos a partir del material.
  // "Explícito" no significa "verdadero" — esa verificación no es tarea de
  // Logos (punto 24), es tarea de Sophia.
  function epistemicBadge(claim) {
    const raw = (claim.epistemicStatus || claim.status || '').toString().toUpperCase();
    if (raw.includes('EXPLIC')) {
      return `<span title="Aparece efectivamente en el material analizado." style="font-size:.62rem; color:#22c55e; border:1px solid #22c55e; border-radius:3px; padding:1px 5px; margin-left:6px; white-space:nowrap;">🟢 Explícito</span>`;
    }
    if (raw.includes('INFER')) {
      const desde = (claim.inferredFrom && claim.inferredFrom.length) ? ` desde ${claim.inferredFrom.map(escapeHtml).join(', ')}` : '';
      return `<span title="Inferencia de Logos a partir del material${desde}." style="font-size:.62rem; color:#eab308; border:1px solid #eab308; border-radius:3px; padding:1px 5px; margin-left:6px; white-space:nowrap;">🟡 Inferencia de Logos${desde}</span>`;
    }
    // El backend todavía no siempre declara epistemicStatus para cada claim.
    // No lo inventamos: lo marcamos como no clasificado en vez de adivinar.
    return `<span title="El backend no declaró un estado epistémico estructural para esta afirmación." style="font-size:.62rem; color:rgba(229,231,235,.4); border:1px solid rgba(229,231,235,.25); border-radius:3px; padding:1px 5px; margin-left:6px; white-space:nowrap;">· no clasificado</span>`;
  }

  function renderClaimId(id) {
    return id ? `<span style="font-size:.62rem; color:rgba(229,231,235,.35); font-family:monospace; margin-right:6px;">${escapeHtml(id)}</span>` : '';
  }

  function renderReconstruccionDetalle(recon, etiqueta) {
    if (!recon) return `<div class="s-card"><div class="s-card-title">Posición ${etiqueta} — reconstrucción</div><div class="s-card-body" style="opacity:.5;">El backend no devolvió una reconstrucción para esta posición.</div></div>`;
    // .filter(Boolean): una entrada nula o corrupta en el array no puede
    // tumbar toda la reconstrucción de la posición.
    const claims = (recon.coreClaims || []).filter(Boolean);
    return `
      <div class="s-card">
        <div class="s-card-title">Posición ${etiqueta} — reconstrucción</div>
        ${recon.summary ? `<div class="s-card-body" style="margin-bottom:10px;">${escapeHtml(recon.summary)}</div>` : ''}
        ${claims.length ? `
          <div style="font-size:.68rem; color:rgba(229,231,235,.45); text-transform:uppercase; margin:8px 0 4px 0;">Claims reconstruidos</div>
          <ul style="font-size:.78rem; color:rgba(229,231,235,.8); line-height:1.7; padding-left:4px; margin:0; list-style:none;">
            ${claims.map(c => `
              <li style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px dashed rgba(255,255,255,.06);">
                ${renderClaimId(c.id)}${escapeHtml(c.text)}${epistemicBadge(c)}
                ${(c.evidence && c.evidence.filter(Boolean).length) ? `
                  <div style="margin-top:4px; padding-left:14px; font-size:.72rem; color:rgba(229,231,235,.5);">
                    ${c.evidence.filter(Boolean).map(e => `<div>· "${escapeHtml(e.quote || '')}"${e.source ? ` <span style="opacity:.6;">— ${escapeHtml(e.source)}</span>` : ''}</div>`).join('')}
                  </div>` : ''}
              </li>
            `).join('')}
          </ul>` : '<div class="s-card-body" style="opacity:.5;">Sin claims reconstruidos.</div>'}
      </div>`;
  }

  // ─── Aísla cada sección: si UNA falla, las demás igual se muestran ──
  // Punto 6/17 del encargo: nunca un try/catch vacío que esconda el
  // error, y nunca dejar que una sección secundaria tumbe todo el
  // resultado. Acá se loguea el error real y se deja una marca visible
  // y honesta de qué sección no pudo mostrarse.
  function seccionSegura(nombre, fn) {
    try {
      return fn();
    } catch (err) {
      console.error(`[LOGOS] Error renderizando la sección "${nombre}":`, err);
      return `<div class="view-section"><div class="s-card" style="border-left:3px solid #ef4444;"><div class="s-card-body" style="color:#ef4444; font-size:.78rem;">No se pudo mostrar "${escapeHtml(nombre)}" (ver consola del navegador para el detalle técnico).</div></div></div>`;
    }
  }

  // ═══ FASE 1 — Reconstrucción + Prueba de Reconstrucción real ═══
  function renderComparison(data, outEl, sesion) {
    if (!outEl) {
      console.error('[LOGOS] renderComparison: no hay contenedor de salida — no se puede mostrar el resultado.');
      return;
    }
    // Defensa de última línea: data ya fue validada como objeto en
    // compareWithLogos, pero si esta función se llama desde otro lugar
    // (o con datos corruptos) igual mostramos algo en vez de romper.
    const datosSeguros = (data && typeof data === 'object') ? data : {};
    const recA = (datosSeguros.reconstructions || {}).a || null;
    const recB = (datosSeguros.reconstructions || {}).b || null;

    const htmlReconstruccion = seccionSegura('Reconstrucción', () => `
      <div class="view-section">
        <div class="view-section-title">Reconstrucción <span style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:none;">(🟢 explícito en el material · 🟡 inferencia de Logos)</span></div>
        <div class="card-grid">
          ${renderReconstruccionDetalle(recA, 'A')}
          ${renderReconstruccionDetalle(recB, 'B')}
        </div>
      </div>
    `);

    const htmlValidacion = seccionSegura('Validación de la reconstrucción', () => `
      <!-- Prueba de Reconstrucción real: la persona confirma, rechaza o
           corrige, y esa decisión bloquea de verdad el resto del análisis
           (protocolo, sección "Comprensión Mutua" en adelante). -->
      <div class="view-section" id="logos-validacion-section">
        <div class="view-section-title">¿Logos entendió bien tu posición?</div>
        <p style="font-size:.75rem; color:rgba(229,231,235,.45); margin-bottom:12px;">
          El resto del análisis (comprensión mutua, acuerdos, desacuerdos, síntesis) todavía no se generó en pantalla.
          Confirmá o corregí ambas reconstrucciones para continuar.
        </p>
        <div class="card-grid">
          ${['a', 'b'].map(lado => renderTarjetaValidacion(lado, sesion)).join('')}
        </div>
        <div style="margin-top:16px;">
          <button id="logos-continuar-btn" class="btn-primary" disabled style="opacity:.4; cursor:not-allowed;">Ver análisis completo → (confirmá ambas posiciones primero)</button>
        </div>
      </div>
    `);

    const avisoContratoIncompleto = (!datosSeguros.reconstructions)
      ? `<div class="view-section"><p style="font-size:.75rem; color:#eab308;">El backend respondió correctamente pero esta respuesta no trae reconstrucciones (ver consola: "[LOGOS DEBUG]"). Se muestra igual lo que sí llegó.</p></div>`
      : '';

    outEl.innerHTML = `
      ${avisoContratoIncompleto}
      ${htmlReconstruccion}
      ${htmlValidacion}
      <div id="logos-fase2-container"></div>
    `;

    _bindValidationButtons(outEl, datosSeguros, sesion);
  }

  function renderTarjetaValidacion(lado, sesion) {
    const rv = sesion.reconstructionValidation[lado];
    const etiqueta = lado.toUpperCase();

    let bannerCambio = '';
    if (rv.iteration > 1 && rv.lastChangeDetected !== null) {
      bannerCambio = rv.lastChangeDetected
        ? `<div style="font-size:.72rem; color:#22c55e; margin-top:6px;">↻ Tu corrección modificó esta reconstrucción. (Iteración ${rv.iteration})</div>`
        : `<div style="font-size:.72rem; color:#eab308; margin-top:6px;">Logos no detectó un cambio sustancial en la reconstrucción. Revisá si esta versión representa realmente tu posición. (Iteración ${rv.iteration})</div>`;
    }

    return `
      <div class="s-card" id="logos-valid-${lado}">
        <div class="s-card-title">Posición ${etiqueta}</div>
        ${bannerCambio}
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn-primary logos-valid-btn" data-lado="${lado}" data-valor="confirmada" style="font-size:.75rem; padding:5px 12px;">✓ Sí, es fiel</button>
          <button class="logos-valid-btn" data-lado="${lado}" data-valor="rechazada" style="font-size:.75rem; padding:5px 12px; background:none; border:1px solid rgba(255,255,255,.2); color:#e5e7eb; border-radius:4px; cursor:pointer;">✕ No, hay algo mal</button>
        </div>
        <div id="logos-valid-${lado}-nota" style="display:none; margin-top:8px;">
          <textarea placeholder="¿Qué está mal o qué falta en la reconstrucción?" style="width:100%; min-height:56px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px; color:#e5e7eb; font-size:.78rem; padding:6px; box-sizing:border-box;"></textarea>
          <button class="btn-primary logos-resend-btn" data-lado="${lado}" style="font-size:.72rem; padding:5px 12px; margin-top:6px;">Corregir reconstrucción →</button>
        </div>
        <div id="logos-valid-${lado}-status" style="font-size:.72rem; margin-top:6px; color:rgba(229,231,235,.4);"></div>
      </div>
    `;
  }

  // ─── Validación de reconstrucción (protocolo, prueba de reconstrucción) ──
  function _bindValidationButtons(outEl, data, sesion) {
    if (!outEl) return;
    const actualizarBotonContinuar = () => {
      const continuarBtn = document.getElementById('logos-continuar-btn');
      if (!continuarBtn) return;
      const ambasConfirmadas = sesion.reconstructionValidation.a.status === 'CONFIRMED' && sesion.reconstructionValidation.b.status === 'CONFIRMED';
      continuarBtn.disabled = !ambasConfirmadas;
      continuarBtn.style.opacity = ambasConfirmadas ? '1' : '.4';
      continuarBtn.style.cursor = ambasConfirmadas ? 'pointer' : 'not-allowed';
      continuarBtn.textContent = ambasConfirmadas
        ? 'Ver análisis completo →'
        : 'Ver análisis completo → (confirmá ambas posiciones primero)';
    };

    outEl.querySelectorAll('.logos-valid-btn').forEach(btn => {
      btn.onclick = () => {
        const lado = btn.dataset.lado;
        const valor = btn.dataset.valor;
        const notaEl = document.getElementById(`logos-valid-${lado}-nota`);
        const statusEl = document.getElementById(`logos-valid-${lado}-status`);
        const rv = sesion.reconstructionValidation[lado];

        if (valor === 'rechazada') {
          rv.status = 'REJECTED';
          notaEl.style.display = 'block';
          statusEl.textContent = 'Contanos qué está mal y tocá "Corregir reconstrucción" para que Logos lo tenga en cuenta.';
          statusEl.style.color = '#eab308';
        } else {
          rv.status = 'CONFIRMED';
          rv.correction = null;
          notaEl.style.display = 'none';
          statusEl.textContent = '✓ Confirmada como fiel.';
          statusEl.style.color = '#22c55e';
        }
        actualizarBotonContinuar();
      };
    });

    const continuarBtn = document.getElementById('logos-continuar-btn');
    if (continuarBtn) {
      continuarBtn.onclick = () => {
        if (continuarBtn.disabled) return;
        const fase2El = document.getElementById('logos-fase2-container');
        if (fase2El) renderFullAnalysis(data, fase2El, sesion);
        continuarBtn.style.display = 'none';
      };
    }

    // "Corregir reconstrucción →": esto SÍ vuelve a llamar al backend (no
    // hay endpoint de revisión incremental — ver nota de compatibilidad).
    // Reconstruye el texto de la posición corregida (original + corrección
    // explícita del usuario) y reprocesa TODO el pipeline, porque
    // comprensión cruzada, mapeo relacional y síntesis dependen de la
    // reconstrucción y quedarían construidos sobre una versión que el
    // usuario acaba de invalidar (protocolo, propagación de cambios).
    outEl.querySelectorAll('.logos-resend-btn').forEach(btn => {
      btn.onclick = async () => {
        const lado = btn.dataset.lado;
        const notaEl = document.getElementById(`logos-valid-${lado}-nota`);
        const textarea = notaEl.querySelector('textarea');
        const nota = textarea.value.trim();
        const statusEl = document.getElementById(`logos-valid-${lado}-status`);

        if (!nota) {
          statusEl.textContent = 'Escribí qué está mal antes de corregir.';
          statusEl.style.color = '#ef4444';
          return;
        }

        const rv = sesion.reconstructionValidation[lado];
        rv.correction = nota;

        const textoOriginalA = sesion.posicionA_original || '';
        const textoOriginalB = sesion.posicionB_original || '';

        // El bloque de corrección queda etiquetado como observación del
        // participante sobre su propia intención — no como un hecho nuevo.
        // Esto es lo más cerca que se puede llegar de "incorporar la
        // corrección" sin un endpoint de revisión incremental en el
        // backend (ver nota de compatibilidad D en la explicación).
        const correccion = `\n\n[El participante de la Posición ${lado.toUpperCase()} revisó la reconstrucción anterior de Logos y aclaró lo siguiente sobre lo que efectivamente está queriendo decir — esta aclaración describe su intención, no un hecho verificado]: ${nota}`;
        const nuevaA = lado === 'a' ? textoOriginalA + correccion : textoOriginalA;
        const nuevaB = lado === 'b' ? textoOriginalB + correccion : textoOriginalB;

        btn.disabled = true;
        btn.textContent = 'Reprocesando…';

        await compareWithLogos(nuevaA, nuevaB, outEl, sesion, lado);
      };
    });

    actualizarBotonContinuar();
  }

  // ─── Convergencias: encontrada vs. posible (punto 15) ─
  function convergenciaEtiqueta(status) {
    const raw = (status || '').toString().toLowerCase();
    if (raw.includes('encontr') || raw.includes('found')) return { texto: 'Convergencia encontrada', color: '#22c55e' };
    if (raw.includes('posible') || raw.includes('possible')) return { texto: 'Convergencia posible', color: '#eab308' };
    return { texto: status ? escapeHtml(status) : 'Estado no especificado', color: 'rgba(229,231,235,.5)' };
  }

  // ═══ FASE 2 — Comprensión mutua, mapeo relacional y síntesis ═══
  // Solo se genera cuando ambas reconstrucciones fueron confirmadas — el
  // gate real vive en _bindValidationButtons/actualizarBotonContinuar, acá
  // solo se pinta lo que el backend ya calculó. Cada bloque pasa por
  // seccionSegura(): si UNO falla (p. ej. una forma de dato inesperada),
  // el resto del análisis igual se muestra.
  function renderFullAnalysis(data, fase2El, sesion) {
    if (!fase2El) {
      console.error('[LOGOS] renderFullAnalysis: no hay contenedor de salida.');
      return;
    }
    const datosSeguros = (data && typeof data === 'object') ? data : {};
    const elegibilidad = datosSeguros.synthesisEligibility || {};
    const abstuvo = datosSeguros.state === 'ABSTAINED' || datosSeguros.status === 'abstained';

    const bloques = [];

    bloques.push(seccionSegura('Comprensión mutua', () => !datosSeguros.mutualUnderstanding ? '' : `
      <div class="view-section">
        <div class="view-section-title">Comprensión mutua</div>
        <div class="card-grid">
          <div class="s-card"><div class="s-card-title">Cómo entiende A a B</div><div class="s-card-body">${escapeHtml(datosSeguros.mutualUnderstanding.a_understands_b || '')}</div></div>
          <div class="s-card"><div class="s-card-title">Cómo entiende B a A</div><div class="s-card-body">${escapeHtml(datosSeguros.mutualUnderstanding.b_understands_a || '')}</div></div>
        </div>
      </div>`));

    bloques.push(seccionSegura('Acuerdos', () => {
      const items = (datosSeguros.agreements || []).filter(Boolean);
      return !items.length ? '' : `
      <div class="view-section">
        <div class="view-section-title">Acuerdos</div>
        <ul style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${items.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
      </div>`;
    }));

    bloques.push(seccionSegura('Supuestos compartidos', () => {
      const items = (datosSeguros.sharedAssumptions || []).filter(Boolean);
      return !items.length ? '' : `
      <div class="view-section">
        <div class="view-section-title">Supuestos compartidos</div>
        <ul style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${items.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
      </div>`;
    }));

    bloques.push(seccionSegura('Desacuerdos', () => {
      const items = (datosSeguros.disagreements || []).filter(Boolean);
      return !items.length ? '' : `
      <div class="view-section">
        <div class="view-section-title">Desacuerdos <span style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:none;">(naturaleza del desacuerdo, no un puntaje)</span></div>
        ${items.map(d => `
          <div style="background:var(--s-panel); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:8px;">
            <div style="font-size:.68rem; color:var(--accent); text-transform:uppercase;">
              ${escapeHtml(d.primaryType || '')}${(d.secondaryTypes && d.secondaryTypes.filter(Boolean).length) ? ` · ${d.secondaryTypes.filter(Boolean).map(escapeHtml).join(', ')}` : ''}
            </div>
            <div style="font-size:.82rem; color:#e5e7eb;">${escapeHtml(d.text || '')}</div>
            ${(d.basis && (((d.basis.positionAClaims || []).filter(Boolean).length) || ((d.basis.positionBClaims || []).filter(Boolean).length))) ? `
              <div style="font-size:.68rem; color:rgba(229,231,235,.4); margin-top:4px; font-family:monospace;">
                Basado en: ${[...(d.basis.positionAClaims || []).filter(Boolean), ...(d.basis.positionBClaims || []).filter(Boolean)].map(escapeHtml).join(', ')}
              </div>` : ''}
          </div>`).join('')}
      </div>`;
    }));

    bloques.push(seccionSegura('Convergencias', () => {
      const items = (datosSeguros.convergences || []).filter(Boolean);
      return !items.length ? '' : `
      <div class="view-section">
        <div class="view-section-title">Convergencias</div>
        ${items.map(c => {
          const et = convergenciaEtiqueta(c.status);
          return `
          <div style="background:var(--s-panel); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:8px;">
            <div style="font-size:.68rem; color:${et.color}; text-transform:uppercase;">${et.texto}</div>
            <div style="font-size:.82rem; color:#e5e7eb;">${escapeHtml(c.text || '')}</div>
            ${c.condition ? `<div style="font-size:.72rem; color:rgba(229,231,235,.5); margin-top:4px;">Condición: ${escapeHtml(c.condition)}</div>` : ''}
          </div>`;
        }).join('')}
      </div>`;
    }));

    bloques.push(seccionSegura('Elegibilidad para síntesis', () => `
      <div class="view-section">
        <div class="view-section-title">Elegibilidad para síntesis</div>
        <p style="font-size:.75rem; color:rgba(229,231,235,.5); margin-bottom:10px;">Estas son condiciones que el motor evaluó de forma determinista — no un puntaje de calidad del diálogo.</p>
        <div class="card-grid">
          ${['questionAlignment', 'informationSufficiency', 'conceptualClarity', 'evidenceSufficiency'].map(k => {
            const c = (elegibilidad.criteria || {})[k];
            if (!c) return '';
            return `<div class="s-card"><div class="s-card-title" style="font-size:.72rem;">${k}</div><div class="s-card-body" style="font-size:.78rem;">${escapeHtml(c.status || '')}${c.reason ? ` — ${escapeHtml(c.reason)}` : ''}</div></div>`;
          }).join('')}
        </div>
      </div>`));

    if (abstuvo) {
      bloques.push(seccionSegura('Abstención de síntesis', () => `
        <div class="view-section">
          <div class="s-card" style="border-left:3px solid #eab308;">
            <div class="view-eyebrow">Logos se abstuvo de generar síntesis</div>
            <p style="font-size:.82rem; color:#e5e7eb;">${escapeHtml(elegibilidad.reason || 'El motor determinó que no se cumplen las condiciones epistémicas para sintetizar todavía.')}</p>
            <p style="font-size:.75rem; color:rgba(229,231,235,.5);">Esto no es un error — es el motor no inventando una síntesis cuando la base documental no la sostiene.</p>
          </div>
        </div>`));
    } else {
      bloques.push(seccionSegura('Síntesis relacional', () => (!datosSeguros.synthesis || !datosSeguros.synthesis.relational) ? '' : `
        <div class="view-section">
          <div class="view-section-title">Síntesis relacional</div>
          <p style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${escapeHtml(datosSeguros.synthesis.relational)}</p>
        </div>`));

      bloques.push(seccionSegura('Síntesis generativa', () => {
        const items = (datosSeguros.synthesis && datosSeguros.synthesis.generative || []).filter(Boolean);
        return !items.length ? '' : `
        <div class="view-section">
          <div class="view-section-title">Síntesis generativa <span style="font-size:.65rem; color:rgba(229,231,235,.4); text-transform:none;">(propuesta, no conclusión)</span></div>
          ${items.map(s => `
            <div class="s-card">
              <div class="s-card-title">${s.type === 'problema' ? 'Reformulación del problema' : 'Propuesta de solución'}${s.title ? ` — ${escapeHtml(s.title)}` : ''}</div>
              <div class="s-card-body">${escapeHtml(s.text || '')}</div>
              ${s.derivedFrom ? `
                <div style="margin-top:8px; font-size:.72rem; color:rgba(229,231,235,.5); font-family:monospace;">
                  ${((s.derivedFrom.positionAClaims || []).filter(Boolean).length || (s.derivedFrom.positionBClaims || []).filter(Boolean).length) ? `Surge de: ${[...(s.derivedFrom.positionAClaims || []).filter(Boolean), ...(s.derivedFrom.positionBClaims || []).filter(Boolean)].map(escapeHtml).join(', ')}<br>` : ''}
                  ${(s.derivedFrom.newElements || []).filter(Boolean).length ? `Nuevos elementos introducidos por Logos: ${s.derivedFrom.newElements.filter(Boolean).map(escapeHtml).join(', ')}` : ''}
                </div>` : ''}
            </div>`).join('')}
        </div>`;
      }));
    }

    bloques.push(seccionSegura('Preguntas abiertas', () => {
      const items = (datosSeguros.openQuestions || []).filter(Boolean);
      return !items.length ? '' : `
      <div class="view-section">
        <div class="view-section-title">Preguntas deliberativas abiertas</div>
        <ul style="font-size:.82rem; color:rgba(229,231,235,.8); line-height:1.6;">${items.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
      </div>`;
    }));

    bloques.push(seccionSegura('Incertidumbres', () => {
      const items = (datosSeguros.uncertainties || []).filter(Boolean);
      return !items.length ? '' : `
      <div class="view-section">
        <div class="view-section-title">Incertidumbres declaradas</div>
        <ul style="font-size:.82rem; color:rgba(229,231,235,.6); line-height:1.6;">${items.map(u => `<li>${escapeHtml(u)}</li>`).join('')}</ul>
      </div>`;
    }));

    bloques.push(seccionSegura('Detalle técnico', () => `
      <div class="view-section">
        <details style="font-size:.72rem; color:rgba(229,231,235,.4);">
          <summary style="cursor:pointer;">Detalle técnico (trazabilidad)</summary>
          <div style="margin-top:8px; font-family:monospace; line-height:1.7;">
            protocolVersion: ${escapeHtml(datosSeguros.protocolVersion || '')}<br>
            sessionId: ${escapeHtml(datosSeguros.sessionId || '')}<br>
            lastCompletedPhase: ${escapeHtml(datosSeguros.lastCompletedPhase || '')}<br>
            reconstructionValidation.a: ${escapeHtml(JSON.stringify({status: sesion.reconstructionValidation.a.status, iteration: sesion.reconstructionValidation.a.iteration}))}<br>
            reconstructionValidation.b: ${escapeHtml(JSON.stringify({status: sesion.reconstructionValidation.b.status, iteration: sesion.reconstructionValidation.b.iteration}))}
          </div>
        </details>
      </div>`));

    fase2El.innerHTML = bloques.join('');
    _bindLogosFeedback(fase2El, datosSeguros, sesion);
  }

  // ─── Feedback del usuario sobre el uso de Logos ────────
  function _bindLogosFeedback(outEl, data, sesion) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-top:20px; padding:16px; background:var(--s-panel); border:1px dashed rgba(255,255,255,.15); border-radius:4px;';
    wrapper.innerHTML = `
      <div style="font-size:.75rem; color:rgba(229,231,235,.5); text-transform:uppercase; margin-bottom:8px;">¿Qué te pareció esta comparación?</div>
      <p style="font-size:.72rem; color:rgba(229,231,235,.4); margin:0 0 10px 0;">Logos está en desarrollo activo — contanos qué te gustó, qué no, o qué mejorarías.</p>
      <textarea id="logosFeedbackInput" placeholder="Ej: la reconstrucción de la Posición B no reflejaba bien el argumento principal..." style="width:100%; min-height:60px; background:#0a0a0a; border:1px solid rgba(255,255,255,.1); border-radius:4px; color:#e5e7eb; font-size:.78rem; padding:8px; box-sizing:border-box; resize:vertical;"></textarea>
      <div style="display:flex; justify-content:flex-end; align-items:center; gap:10px; margin-top:8px;">
        <span id="logosFeedbackStatus" style="font-size:.72rem; color:rgba(229,231,235,.4);"></span>
        <button id="logosFeedbackBtn" class="btn-primary" style="font-size:.78rem; padding:6px 14px;">Enviar comentario</button>
      </div>
    `;
    outEl.appendChild(wrapper);

    const feedbackBtn = wrapper.querySelector('#logosFeedbackBtn');
    const feedbackInput = wrapper.querySelector('#logosFeedbackInput');
    const feedbackStatus = wrapper.querySelector('#logosFeedbackStatus');
    // Este bloque es secundario (feedback opcional) — si por lo que sea
    // no se encuentran los nodos recién insertados, no debe tumbar el
    // resto del análisis que ya se mostró arriba.
    if (!feedbackBtn || !feedbackInput || !feedbackStatus) {
      console.error('[LOGOS] _bindLogosFeedback: no se encontraron los controles de feedback recién insertados.');
      return;
    }

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
            reconstructionValidation: {
              a: { status: sesion.reconstructionValidation.a.status, iteration: sesion.reconstructionValidation.a.iteration },
              b: { status: sesion.reconstructionValidation.b.status, iteration: sesion.reconstructionValidation.b.iteration }
            },
            sessionId: data.sessionId || null,
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
    _sesionComparar: null,

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
// Validación de longitud máxima por posición
if (a.length > 5000 || b.length > 5000) {
  let mensaje = '';
  if (a.length > 5000 && b.length > 5000) {
    mensaje = 'Ambas posiciones superan el límite de 5.000 caracteres.';
  } else if (a.length > 5000) {
    mensaje = 'La Posición A supera el límite de 5.000 caracteres.';
  } else {
    mensaje = 'La Posición B supera el límite de 5.000 caracteres.';
  }

  out.innerHTML = `
    <div style="margin-top:16px; padding:16px; background:var(--s-panel); border:1px solid var(--s-border); border-radius:4px;">
      <p style="color:#ef4444; font-size:.82rem; margin:0 0 8px 0;">
        ${mensaje}
      </p>
      <p style="color:rgba(229,231,235,.65); font-size:.78rem; line-height:1.5; margin:0;">
        Cada posición puede tener hasta 5.000 caracteres.
        La Posición A tiene ${a.length.toLocaleString('es-CL')} caracteres y la Posición B tiene ${b.length.toLocaleString('es-CL')} caracteres.
        Reduce los textos e inténtalo nuevamente.
      </p>
    </div>`;
  return;
}
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = 'Comparando…';
        try {
          // Cada clic en "comparar" desde cero arranca una sesión de
          // validación nueva — no hereda iteraciones ni correcciones de
          // una comparación anterior con otro material.
          this._sesionComparar = nuevaSesion();
          await compareWithLogos(a, b, out, this._sesionComparar, null);
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
