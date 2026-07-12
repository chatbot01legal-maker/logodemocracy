console.log('[layout.js] ARCHIVO CARGADO');

// assets/js/layout.js
// Controlador del layout compartido (topbar, sidebar, botón de login).
// Usa SIEMPRE window.LDIdentityProvider de forma explícita — nunca el
// identificador "pelado" — para eliminar cualquier ambigüedad de scope.

(function () {
  'use strict';

  function initLayout() {

    // ─── Verificación de dependencia ───────────────────
    if (!window.LDIdentityProvider) {
      console.error(
        '[layout.js] window.LDIdentityProvider no está disponible. ' +
        'Verifica que IdentityProvider.js se haya cargado ANTES que layout.js ' +
        'en el <script> del HTML, y que no haya un archivo duplicado ' +
        '(con o sin extensión .js) siendo servido en su lugar.'
      );
      return;
    }

    var IDP = window.LDIdentityProvider;

    var authButton = document.getElementById('authButton');
    var userLabel = document.getElementById('userLabel');

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

    // ─── Click en el botón de login/logout ─────────────
authButton.addEventListener('click', function (e) {

  console.log('[layout.js] CLICK EVENT DETECTADO');

  e.preventDefault();

  console.log('[layout.js] Click en authButton. Modo actual:', IDP.getMode());

  if (IDP.isAuthenticated()) {
    IDP.clear();
    console.log('[layout.js] Sesión cerrada.');
  } else {

    
        // TODO: reemplazar por el flujo real de login (formulario / OAuth).
        // Por ahora, autenticación simulada para continuar el desarrollo
        // del resto de la plataforma sin bloquear en el backend de auth.
        IDP.setAuthenticated('mock-jwt-token', { id: 'u123', name: 'Rodrigo' });
        console.log('[layout.js] Sesión simulada iniciada.');
      }

      renderAuthState();
    });

    console.log('[layout.js] Inicializado. Modo:', IDP.getMode());
  }

  // ─── Arranque seguro, sin importar dónde se cargue el script ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }

})();
