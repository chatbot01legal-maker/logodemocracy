/* ============================================================
   VIEWPORT RESET · LogoDemocracy
   Resetea el zoom/scroll de la página tras acciones clave:
   - cerrar modales
   - enviar formularios de login/registro
   - copiar prompts
   - cerrar chats internos
   - salir de inputs con teclado virtual
============================================================ */

(function () {
  'use strict';

  function resetViewport() {
    try {
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
    } catch (e) {}

    try {
      window.scrollTo({ top: window.scrollY, left: 0, behavior: 'instant' });
    } catch (e) {
      try { window.scrollTo(0, window.scrollY); } catch (e2) {}
    }
  }

  function resetViewportDelayed(delay) {
    delay = delay || 120;
    setTimeout(resetViewport, delay);
  }

  window.LDViewport = {
    reset: resetViewport,
    resetDelayed: resetViewportDelayed
  };

  // Auto-reset al clickear botones comunes
  document.addEventListener('click', function (ev) {
    var target = ev.target;
    if (!target || !target.closest) return;

    var closeBtn = target.closest(
      '[data-action="close"], .modal-close, .academy-cartero-close, ' +
      '#btnCloseChat, .academy-cartero-disclaimer-close, ' +
      '[aria-label="Cerrar"], [aria-label="close"]'
    );
    if (closeBtn) {
      resetViewportDelayed(80);
    }

    var copyBtn = target.closest(
      '[data-action="copy"], #academy-cartero-copy, #academy-cartero-info'
    );
    if (copyBtn) {
      resetViewportDelayed(200);
    }
  }, true);

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      resetViewportDelayed(80);
    }
  });

  // Restaurar scroll al cerrar teclado
  var lastScrollY = 0;
  document.addEventListener('focusin', function (ev) {
    if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) {
      lastScrollY = window.scrollY;
    }
  });

  document.addEventListener('focusout', function (ev) {
    if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) {
      setTimeout(function () {
        try {
          window.scrollTo({ top: lastScrollY, left: 0, behavior: 'instant' });
        } catch (e) {
          window.scrollTo(0, lastScrollY);
        }
      }, 100);
    }
  });
})();
