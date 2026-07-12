// assets/js/layout.js
// Controlador del layout compartido (topbar, sidebar, botón de login).
// Usa SIEMPRE window.LDIdentityProvider de forma explícita.

(function () {
  'use strict';

  // ─── Panel de debug visual en pantalla ──────────────
  // Útil para depurar en dispositivos sin DevTools (ej. tablet).
  // Se activa agregando ?debug=1 a la URL; si no, queda oculto.
  var DEBUG_ON = window.location.search.indexOf('debug=1') !== -1;
  var debugPanel = null;

  function debugLog(msg) {
    if (!DEBUG_ON) return;
    if (!debugPanel) {
      debugPanel = document.createElement('div');
      debugPanel.id = 'debug-layout';
      debugPanel.style.cssText =
        'position:fixed;top:10px;left:10px;z-index:99999;background:#fff;' +
        'color:#000;padding:10px;border:2px solid red;font-size:12px;' +
        'max-width:80vw;max-height:40vh;overflow:auto;font-family:monospace;';
      document.body.appendChild(debugPanel);
    }
    debugPanel.innerHTML += msg + '<br>';
  }

  function initLayout() {
    debugLog('🔥 layout.js cargado');

    // ─── Verificación de dependencia ───────────────────
    if (!window.LDIdentityProvider) {
      var msg = '[layout.js] window.LDIdentityProvider no está disponible. ' +
        'Verifica que IdentityProvider.js se haya cargado ANTES que layout.js, ' +
        'y que ese archivo realmente contenga el código de IdentityProvider ' +
        '(no otro script por error de ubicación).';
      console.error(msg);
      debugLog('❌ ' + msg);
      return;
    }

    var IDP = window.LDIdentityProvider;
    debugLog('✅ LDIdentityProvider encontrado. Modo: ' + IDP.getMode());

    var authButton = document.getElementById('authButton');
    var userLabel = document.getElementById('userLabel');
    debugLog('🔎 authButton: ' + (authButton ? 'encontrado' : 'NO ENCONTRADO'));

    if (!authButton) {
      console.error('[layout.js] No se encontró #authButton en el DOM.');
      return;
    }

    // ─── Pintar estado inicial ──────────────────────────
    function renderAuthState() {
      if (IDP.isAuthenticated()) {
        var userName = IDP.getUserName() || 'Usuario';
        authButton.textContent = 'Log out';
        if (userLabel) userLabel.textContent = '⌂ ' + userName;
      } else {
        authButton.textContent = 'Log in';
        if (userLabel) userLabel.textContent = '⌂ Invitado';
      }
    }

    renderAuthState();

    // ─── Reaccionar a cambios de identidad desde cualquier módulo ───
    if (typeof EventBus !== 'undefined') {
      EventBus.on('auth:changed', renderAuthState);
    }

    // ─── Click en el botón de login/logout ─────────────
    authButton.addEventListener('click', function (e) {
      debugLog('🖱️ CLICK DETECTADO');
      e.preventDefault();

      console.log('[layout.js] Click en authButton. Modo actual:', IDP.getMode());

      if (IDP.isAuthenticated()) {
        IDP.clear();
        console.log('[layout.js] Sesión cerrada.');
      } else {
        // TODO: reemplazar por el flujo real de login (formulario / OAuth)
        // vía AuthService.login(). Por ahora, autenticación simulada.
        IDP.setAuthenticated('mock-jwt-token', { id: 'u123', name: 'Rodrigo' });
        console.log('[layout.js] Sesión simulada iniciada.');
      }

      renderAuthState();
      debugLog('🔄 Estado actualizado. Modo: ' + IDP.getMode());
    });

    console.log('[layout.js] Inicializado. Modo:', IDP.getMode());
    debugLog('✅ layout.js inicializado correctamente');
  }

  // ─── Arranque seguro, sin importar dónde se cargue el script ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }

})();
