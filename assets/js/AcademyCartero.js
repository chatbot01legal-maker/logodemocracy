(function () {
  'use strict';

  var state = {
    selection: '',
    question: '',
    open: false
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getAsset() {
    return window.Academy &&
      typeof window.Academy.getCurrentCognitiveAsset === 'function'
      ? window.Academy.getCurrentCognitiveAsset()
      : null;
  }

  function getSelectedText() {
    var selection = window.getSelection ? window.getSelection() : null;
    if (!selection || selection.rangeCount === 0) return '';

    var text = String(selection.toString() || '').trim();
    if (!text) return '';

    var content = document.getElementById('content');
    if (!content) return '';

    var range = selection.getRangeAt(0);
    var node = range.commonAncestorContainer;
    var element = node.nodeType === 1 ? node : node.parentElement;

    if (!element || !content.contains(element)) return '';

    return text;
  }

  function captureSelection() {
    var text = getSelectedText();
    if (!text) return;

    state.selection = text;
    render();
  }

  function parseFrontmatter(rawText) {
    var text = String(rawText || '');
    var meta = {};
    var body = text;

    if (text.indexOf('---') !== 0) {
      return {
        meta: meta,
        body: body
      };
    }

    var end = text.indexOf('\n---', 3);

    if (end === -1) {
      return {
        meta: meta,
        body: body
      };
    }

    var frontmatter = text.slice(3, end).trim();
    body = text.slice(end + 4).trim();

    frontmatter.split('\n').forEach(function (line) {
      var match = line.match(/^([^:]+):\s*["']?(.*?)["']?\s*$/);

      if (!match) return;

      meta[match[1].trim()] = match[2].trim();
    });

    return {
      meta: meta,
      body: body
    };
  }

  function extractSection(body, heading, nextHeading) {
    var text = String(body || '');

    var startPattern = new RegExp(
      '^#\\s+' + heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$',
      'mi'
    );

    var startMatch = startPattern.exec(text);

    if (!startMatch) return '';

    var start = startMatch.index + startMatch[0].length;
    var remainder = text.slice(start);

    if (nextHeading) {
      var nextPattern = new RegExp(
        '^#\\s+' + nextHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$',
        'mi'
      );

      var nextMatch = nextPattern.exec(remainder);

      if (nextMatch) {
        remainder = remainder.slice(0, nextMatch.index);
      }
    }

    return remainder.trim();
  }

  function parseIdeas(body) {
    var section = extractSection(body, 'Ideas fuerza', null);

    if (!section) return [];

    return section
      .split('\n')
      .map(function (line) {
        return line.trim();
      })
      .filter(function (line) {
        return /^\d+\.\s+/.test(line);
      })
      .map(function (line) {
        return line.replace(/^\d+\.\s+/, '').trim();
      });
  }

  function getDocumentContext() {
    var asset = getAsset();

    if (!asset || !asset.asset) {
      return Promise.reject(
        new Error('No hay un documento activo en Academia.')
      );
    }

    var title = asset.asset.title || '';

    if (!title) {
      return Promise.resolve({
        available: false,
        meta: {},
        summary: '',
        ideas: []
      });
    }

    var contextFile =
      '/pages/academy/context/' +
      encodeURIComponent(title + '.md');

    return fetch(contextFile)
      .then(function (response) {
        if (!response.ok) {
          return {
            available: false,
            meta: {},
            summary: '',
            ideas: []
          };
        }

        return response.text();
      })
      .then(function (rawText) {
        if (!rawText || typeof rawText !== 'string') {
          return {
            available: false,
            meta: {},
            summary: '',
            ideas: []
          };
        }

        var parsed = parseFrontmatter(rawText);

        return {
          available: true,
          meta: parsed.meta,
          summary: extractSection(
            parsed.body,
            'Resumen',
            'Ideas fuerza'
          ),
          ideas: parseIdeas(parsed.body)
        };
      })
      .catch(function (error) {
        console.warn(
          'Cartero: no fue posible cargar el contexto documental.',
          error
        );

        return {
          available: false,
          meta: {},
          summary: '',
          ideas: []
        };
      });
  }

  function getPedagogicalContext() {
    if (
      typeof LearningProfileService === 'undefined' ||
      typeof LearningProfileService.getFullContext !== 'function'
    ) {
      return Promise.resolve(
        'Todavía no hay contexto pedagógico disponible.'
      );
    }

    return LearningProfileService.getFullContext()
      .then(function (context) {
        var qualitative =
          context &&
          Array.isArray(context.microtestQualitative)
            ? context.microtestQualitative
            : [];

        var available = qualitative.filter(function (item) {
          return (
            item &&
            typeof item.interpretation === 'string' &&
            item.interpretation.trim()
          );
        });

        if (!available.length) {
          return 'Todavía no hay resultados cualitativos de Microtests disponibles.';
        }

        return available.map(function (item) {
          return item.title + ': ' + item.interpretation;
        }).join('\n');
      })
      .catch(function (error) {
        console.warn(
          'Cartero: no fue posible obtener contexto pedagógico.',
          error
        );

        return 'No fue posible recuperar el contexto pedagógico en este momento.';
      });
  }

  function buildPackage() {
    var asset = getAsset();

    if (!asset || !asset.asset) {
      return Promise.reject(
        new Error('No hay un documento activo en Academia.')
      );
    }

    var title = asset.asset.title || 'Documento';

    return Promise.all([
      getDocumentContext(),
      getPedagogicalContext()
    ]).then(function (results) {
      var documentContext = results[0];
      var pedagogicalContext = results[1];

      var lines = [
        'PAQUETE REY FILÓSOFO · CARTERO',
        '',
        'CONTEXTO DOCUMENTAL',
        'Título: ' + title,
        ''
      ];

      if (documentContext.available) {
        if (documentContext.meta.source) {
          lines.push('Fuente: ' + documentContext.meta.source);
        }

        if (documentContext.meta.document) {
          lines.push(
            'Documento: ' + documentContext.meta.document
          );
        }

        lines.push('');

        if (documentContext.summary) {
          lines.push(
            'Resumen:',
            documentContext.summary,
            ''
          );
        }

        if (documentContext.ideas.length) {
          lines.push('Ideas fuerza:');

          documentContext.ideas.forEach(function (idea) {
            lines.push('- ' + idea);
          });

          lines.push('');
        }
      } else {
        lines.push(
          'No hay una ficha de contexto documental disponible para este documento.',
          ''
        );
      }

      lines.push(
        'FRAGMENTO SELECCIONADO',
        state.selection,
        '',
        'PREGUNTA DEL USUARIO',
        state.question.trim(),
        '',
        'CONTEXTO PEDAGÓGICO',
        pedagogicalContext
      );

      return lines.join('\n');
    });
  }

  function copyPackage() {
    buildPackage()
      .then(function (text) {
        return navigator.clipboard.writeText(text);
      })
      .then(function () {
        alert(
          'Paquete copiado. Ahora puedes pegarlo en ChatGPT, Gemini, DeepSeek u otra IA.'
        );
      })
      .catch(function (error) {
        console.error('Cartero:', error);
        alert('No fue posible preparar el paquete.');
      });
  }

  function sharePackage() {
    buildPackage()
      .then(function (text) {
        if (navigator.share) {
          return navigator.share({
            title: 'Paquete Rey Filósofo',
            text: text
          });
        }

        return navigator.clipboard.writeText(text).then(function () {
          alert(
            'Paquete copiado. Tu dispositivo no ofrece el menú Compartir desde esta página.'
          );
        });
      })
      .catch(function (error) {
        if (error && error.name === 'AbortError') return;

        console.error('Cartero:', error);
        alert('No fue posible preparar el paquete.');
      });
  }

  function render() {
    var panel = document.getElementById('academy-cartero');

    if (!panel) return;

    if (!state.open) {
      panel.innerHTML = '';
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'block';

    panel.innerHTML =
      '<div class="academy-cartero-box">' +
        '<div class="academy-cartero-header">' +
          '<strong>Rey Filósofo · Cartero</strong>' +
          '<button type="button" id="academy-cartero-close">×</button>' +
        '</div>' +

        '<p class="academy-cartero-instruction">' +
          'Selecciona en el documento el párrafo o fragmento del que surge tu pregunta.' +
        '</p>' +

        '<div class="academy-cartero-selection">' +
          (
            state.selection
              ? '<div class="academy-cartero-label">Fragmento seleccionado</div>' +
                '<div class="academy-cartero-quote">' +
                  escapeHtml(state.selection) +
                '</div>' +
                '<p class="academy-cartero-helper">' +
                  'Si quieres cambiar el fragmento, selecciona otro en el documento.' +
                '</p>'
              : '<div class="academy-cartero-empty">' +
                  'Todavía no has seleccionado ningún fragmento.' +
                '</div>'
          ) +
        '</div>' +

        '<textarea id="academy-cartero-question" ' +
          'placeholder="Escribe tu pregunta..."></textarea>' +

        '<div class="academy-cartero-actions">' +
          '<button type="button" id="academy-cartero-share"' +
            (!state.selection ? ' disabled' : '') +
            '>Compartir</button>' +

          '<button type="button" id="academy-cartero-copy"' +
            (!state.selection ? ' disabled' : '') +
            '>Copiar prompt</button>' +
        '</div>' +
      '</div>';

    var question =
      document.getElementById('academy-cartero-question');

    if (question) {
      question.value = state.question;

      question.addEventListener('input', function () {
        state.question = question.value;
      });
    }

    var close =
      document.getElementById('academy-cartero-close');

    if (close) {
      close.addEventListener('click', function () {
        state.open = false;
        render();
      });
    }

    var share =
      document.getElementById('academy-cartero-share');

    if (share) {
      share.addEventListener('click', function () {
        if (!state.selection || !state.question.trim()) {
          alert('Selecciona un fragmento y escribe una pregunta.');
          return;
        }

        sharePackage();
      });
    }

    var copy =
      document.getElementById('academy-cartero-copy');

    if (copy) {
      copy.addEventListener('click', function () {
        if (!state.selection || !state.question.trim()) {
          alert('Selecciona un fragmento y escribe una pregunta.');
          return;
        }

        copyPackage();
      });
    }
  }

  function open() {
    state.open = true;
    render();
  }

  function close() {
    state.open = false;
    render();
  }

  function init() {
    var content = document.getElementById('content');

    if (!content) return;

    if (!document.getElementById('academy-cartero')) {
      var panel = document.createElement('div');

      panel.id = 'academy-cartero';

      document.body.appendChild(panel);
    }

    document.addEventListener('mouseup', captureSelection);

    document.addEventListener('touchend', function () {
      setTimeout(captureSelection, 50);
    });

    render();
  }

  window.AcademyCartero = {
    init: init,
    open: open,
    close: close,
    buildPackage: buildPackage,

    getState: function () {
      return {
        selection: state.selection,
        question: state.question,
        open: state.open
      };
    }
  };

  window.addEventListener('load', init);
})();
