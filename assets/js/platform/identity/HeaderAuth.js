/*
 * HeaderAuth.js
 * Autenticación global del header de LogoDemocracy.
 *
 * Reutiliza:
 *   LDIdentityProvider
 *   CurrentUser
 *   AuthService
 *
 * No implementa autenticación propia.
 */

(function () {
  'use strict';

  var HEADER_AUTH_ID = 'ld-header-auth';

  var STRINGS = {
    es: {
      guest: '⌂ Invitado',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      user: 'Usuario',
      email: 'Correo electrónico',
      password: 'Contraseña',
      newPassword: 'Nueva contraseña',
      confirmPassword: 'Repetir contraseña',
      create: 'Crear cuenta',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      forgotPassword: '¿Olvidaste tu contraseña?',
      recoverPassword: 'Recuperar contraseña',
      recoverDescription: 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.',
      sendLink: 'Enviar enlace',
      recoverySent: 'Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer la contraseña.',
      backToLogin: 'Volver a iniciar sesión',
      resetPassword: 'Restablecer contraseña',
      passwordUpdated: 'Tu contraseña fue actualizada correctamente.',
      invalidReset: 'El enlace no es válido o ya expiró.',
      passwordsMismatch: 'Las contraseñas no coinciden.',
      passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
      continueGuest: 'Continuar como invitado',
      cancel: 'Cancelar',
      logging: 'Ingresando...',
      registering: 'Creando cuenta...',
      sending: 'Enviando...',
      resetting: 'Actualizando...',
      required: 'Completa todos los campos.',
      genericError: 'No fue posible completar la operación.'
    },

    en: {
      guest: '⌂ Guest',
      login: 'Log in',
      logout: 'Log out',
      user: 'User',
      email: 'Email',
      password: 'Password',
      newPassword: 'New password',
      confirmPassword: 'Repeat password',
      create: 'Create account',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      forgotPassword: 'Forgot your password?',
      recoverPassword: 'Recover password',
      recoverDescription: 'Enter your email address and we will send you a link to reset your password.',
      sendLink: 'Send link',
      recoverySent: 'If an account is associated with that email, you will receive a password reset link.',
      backToLogin: 'Back to log in',
      resetPassword: 'Reset password',
      passwordUpdated: 'Your password was updated successfully.',
      invalidReset: 'The link is invalid or has expired.',
      passwordsMismatch: 'The passwords do not match.',
      passwordTooShort: 'The password must contain at least 8 characters.',
      continueGuest: 'Continue as guest',
      cancel: 'Cancel',
      logging: 'Signing in...',
      registering: 'Creating account...',
      sending: 'Sending...',
      resetting: 'Updating...',
      required: 'Complete all fields.',
      genericError: 'The operation could not be completed.'
    }
  };

  function isEnglish() {
    return (document.documentElement.lang || '')
      .toLowerCase()
      .indexOf('en') === 0;
  }

  function t() {
    return STRINGS[isEnglish() ? 'en' : 'es'];
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');

      if (existing) {
        if (existing.dataset && existing.dataset.ldLoaded === 'true') {
          resolve();
          return;
        }

        existing.addEventListener('load', function () {
          if (existing.dataset) {
            existing.dataset.ldLoaded = 'true';
          }
          resolve();
        }, { once: true });

        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.dataset.ldHeaderDependency = 'true';

      script.onload = function () {
        script.dataset.ldLoaded = 'true';
        resolve();
      };

      script.onerror = function () {
        reject(new Error('No se pudo cargar ' + src));
      };

      document.head.appendChild(script);
    });
  }

  async function ensureDependencies() {
    /*
     * HeaderAuth puede convivir con páginas que ya cargan estas
     * dependencias. Solo carga lo que todavía no existe.
     */

    if (typeof CoreConfig === 'undefined') {
      await loadScript('/assets/js/config.js');
      await loadScript('/assets/js/platform/core/CoreConfig.js');
    }

    if (typeof EventBus === 'undefined') {
      await loadScript('/assets/js/platform/events/EventBus.js');
    }

    if (typeof IdentityStorage === 'undefined') {
      await loadScript('/assets/js/platform/identity/IdentityStorage.js');
    }

    if (typeof CurrentUser === 'undefined') {
      await loadScript('/assets/js/platform/identity/CurrentUser.js');
    }

    if (typeof LDIdentityProvider === 'undefined') {
      await loadScript('/assets/js/platform/identity/IdentityProvider.js');
    }

    if (typeof AuthService === 'undefined') {
      await loadScript('/assets/js/platform/identity/AuthService.js');
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function ensureStyles() {
    if (document.getElementById('ld-header-auth-styles')) {
      return;
    }

    var style = document.createElement('style');
    style.id = 'ld-header-auth-styles';

    style.textContent = `
      #ld-header-auth {
        display: flex;
        align-items: center;
        gap: 14px;
        position: relative;
        font-size: 12px;
      }

      #ld-header-auth .user-menu,
      #ld-header-auth .auth-btn {
        font: inherit;
        color: inherit;
        text-decoration: none;
        background: transparent;
        border: 0;
        cursor: pointer;
        padding: 0;
      }

      #ld-header-auth .auth-btn {
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      #ld-header-auth .auth-panel {
        position: fixed;
        z-index: 99999;
        top: 72px;
        right: 16px;
        left: auto;
        width: min(320px, calc(100vw - 32px));
        max-height: calc(100vh - 88px);
        overflow-y: auto;
        box-sizing: border-box;
        padding: 18px;
        background: #000;
        border: 1px solid currentColor;
        box-shadow: 0 8px 30px rgba(0, 0, 0, .35);
      }

      #ld-header-auth .auth-panel[hidden] {
        display: none;
      }

      #ld-header-auth .auth-view[hidden] {
        display: none;
      }

      #ld-header-auth .auth-panel h3 {
        margin: 0 0 16px;
      }

      #ld-header-auth .auth-description {
        margin: 0 0 16px;
        line-height: 1.5;
      }

      #ld-header-auth .auth-field {
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin: 0 0 12px;
        padding: 9px 10px;
        border: 1px solid currentColor;
        border-radius: 0;
        background: #fff;
        color: #000;
        font: inherit;
      }

      #ld-header-auth .auth-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        margin-top: 12px;
      }

      #ld-header-auth .auth-submit,
      #ld-header-auth .auth-secondary {
        border: 1px solid currentColor;
        border-radius: 0;
        background: transparent;
        color: inherit;
        padding: 8px 12px;
        cursor: pointer;
        font: inherit;
      }

      #ld-header-auth .auth-secondary {
        border: 0;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      #ld-header-auth .auth-error {
        margin: 0 0 12px;
        font-size: .9em;
      }

      #ld-header-auth .auth-message {
        margin: 0 0 16px;
        line-height: 1.5;
      }

      #ld-header-auth .auth-link {
        display: inline-block;
        margin-top: 4px;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-decoration: underline;
        text-underline-offset: 3px;
        cursor: pointer;
      }

      #ld-header-auth .auth-switch {
        margin-top: 14px;
        font-size: .9em;
      }

      #ld-header-auth .auth-close {
        position: absolute;
        top: 8px;
        right: 10px;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        font: inherit;
        font-size: 18px;
      }

      @media (max-width: 700px) {
        #ld-header-auth .auth-panel {
          top: 64px;
          right: 16px;
          left: 16px;
          width: auto;
          max-width: none;
          max-height: calc(100vh - 80px);
        }
      }
    `;

    document.head.appendChild(style);
  }

  function getAuthContainer() {
    var existing = document.getElementById(HEADER_AUTH_ID);

    if (existing) {
      return existing;
    }

    var right = document.querySelector('.topbar-right');

    if (!right) {
      var nav = document.querySelector('header.topbar .module-nav');

      if (!nav) {
        return null;
      }

      right = document.createElement('div');
      right.className = 'topbar-right';
      nav.appendChild(right);
    }

    /*
     * Si el header ya tiene un bloque de autenticación antiguo,
     * reutilizamos el contenedor en vez de duplicarlo.
     */

    var oldUser = right.querySelector('#userLabel');
    var oldAuth = right.querySelector('#authButton');

    if (oldUser || oldAuth) {
      if (oldUser) {
        oldUser.remove();
      }

      if (oldAuth) {
        oldAuth.remove();
      }
    }

    var oldAuthContainer = right.querySelector('#ld-header-auth');

    if (oldAuthContainer) {
      return oldAuthContainer;
    }

    var container = document.createElement('div');
    container.id = HEADER_AUTH_ID;

    right.insertBefore(container, right.firstChild);

    return container;
  }

  function getMode() {
    try {
      return LDIdentityProvider.getMode();
    } catch (e) {
      return 'guest';
    }
  }

  function getUser() {
    try {
      return CurrentUser.get() ||
        LDIdentityProvider.getUser() ||
        null;
    } catch (e) {
      try {
        return LDIdentityProvider.getUser() || null;
      } catch (ignored) {
        return null;
      }
    }
  }

  function closePanel(container) {
    var panel = container.querySelector('.auth-panel');

    if (panel) {
      panel.hidden = true;
    }
  }

  function getResetTokenFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('reset_token') || '';
    } catch (e) {
      return '';
    }
  }

  function clearResetTokenFromUrl() {
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete('reset_token');

      var cleanUrl = url.pathname;

      if (url.search) {
        cleanUrl += url.search;
      }

      if (url.hash) {
        cleanUrl += url.hash;
      }

      window.history.replaceState({}, document.title, cleanUrl);
    } catch (e) {
      /*
       * Si el navegador no permite modificar la URL,
       * simplemente dejamos el token visible.
       */
    }
  }

  function render(container) {
    var labels = t();
    var mode = getMode();
    var user = getUser();

    var authenticated =
      mode === 'authenticated' &&
      user &&
      (user.name || user.email || user.id);

    if (authenticated) {
      container.innerHTML = `
        <a
          href="#"
          class="user-menu"
          id="userLabel"
          aria-label="${escapeHtml(user.name || labels.user)}"
        >
          ⌂ ${escapeHtml(user.name || labels.user)}
        </a>

        <button type="button" class="auth-btn" id="authButton">
          ${escapeHtml(labels.logout)}
        </button>
      `;

      container
        .querySelector('#userLabel')
        .addEventListener('click', function (event) {
          event.preventDefault();
          window.location.href = '/pages/rey-filosofo.html';
        });

      container
        .querySelector('#authButton')
        .addEventListener('click', function () {
          AuthService.logout();
          render(container);
        });

      return;
    }

    container.innerHTML = `
      <a href="#" class="user-menu" id="userLabel">
        ${escapeHtml(labels.guest)}
      </a>

      <button type="button" class="auth-btn" id="authButton">
        ${escapeHtml(labels.login)}
      </button>

      <div class="auth-panel" hidden>
        <button
          type="button"
          class="auth-close"
          aria-label="${escapeHtml(labels.cancel)}"
        >×</button>

        <div class="auth-view auth-login-view">
          <h3 class="auth-title">${escapeHtml(labels.login)}</h3>

          <form class="auth-form">
            <input
              class="auth-field auth-name"
              type="text"
              name="name"
              placeholder="${escapeHtml(labels.user)}"
              autocomplete="name"
              hidden
            >

            <input
              class="auth-field auth-email"
              type="email"
              name="email"
              placeholder="${escapeHtml(labels.email)}"
              autocomplete="email"
              required
            >

            <input
              class="auth-field auth-password"
              type="password"
              name="password"
              placeholder="${escapeHtml(labels.password)}"
              autocomplete="current-password"
              required
            >

            <p class="auth-error" hidden></p>

            <div class="auth-actions">
              <button type="submit" class="auth-submit">
                ${escapeHtml(labels.login)}
              </button>

              <button type="button" class="auth-secondary auth-guest">
                ${escapeHtml(labels.continueGuest)}
              </button>
            </div>

            <div class="auth-switch">
              <span class="auth-switch-text">
                ${escapeHtml(labels.noAccount)}
              </span>

              <button
                type="button"
                class="auth-secondary auth-toggle"
              >
                ${escapeHtml(labels.create)}
              </button>
            </div>

            <button
              type="button"
              class="auth-link auth-forgot"
            >
              ${escapeHtml(labels.forgotPassword)}
            </button>
          </form>
        </div>

        <div class="auth-view auth-recovery-view" hidden>
          <h3>${escapeHtml(labels.recoverPassword)}</h3>

          <p class="auth-description">
            ${escapeHtml(labels.recoverDescription)}
          </p>

          <form class="auth-recovery-form">
            <input
              class="auth-field"
              type="email"
              name="recoveryEmail"
              placeholder="${escapeHtml(labels.email)}"
              autocomplete="email"
              required
            >

            <p class="auth-error" hidden></p>

            <div class="auth-actions">
              <button type="submit" class="auth-submit">
                ${escapeHtml(labels.sendLink)}
              </button>

              <button
                type="button"
                class="auth-secondary auth-back-login"
              >
                ${escapeHtml(labels.backToLogin)}
              </button>
            </div>
          </form>
        </div>

        <div class="auth-view auth-reset-view" hidden>
          <h3>${escapeHtml(labels.resetPassword)}</h3>

          <form class="auth-reset-form">
            <input
              class="auth-field"
              type="password"
              name="newPassword"
              placeholder="${escapeHtml(labels.newPassword)}"
              autocomplete="new-password"
              minlength="8"
              required
            >

            <input
              class="auth-field"
              type="password"
              name="confirmPassword"
              placeholder="${escapeHtml(labels.confirmPassword)}"
              autocomplete="new-password"
              minlength="8"
              required
            >

            <p class="auth-error" hidden></p>

            <div class="auth-actions">
              <button type="submit" class="auth-submit">
                ${escapeHtml(labels.resetPassword)}
              </button>

              <button
                type="button"
                class="auth-secondary auth-back-login"
              >
                ${escapeHtml(labels.backToLogin)}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    var panel = container.querySelector('.auth-panel');

    var loginView = container.querySelector('.auth-login-view');
    var recoveryView = container.querySelector('.auth-recovery-view');
    var resetView = container.querySelector('.auth-reset-view');

    var form = container.querySelector('.auth-form');
    var title = container.querySelector('.auth-title');

    var nameField = container.querySelector('.auth-name');
    var passwordField = container.querySelector('.auth-password');

    var submit = form.querySelector('.auth-submit');
    var error = form.querySelector('.auth-error');

    var toggle = container.querySelector('.auth-toggle');
    var switchText = container.querySelector('.auth-switch-text');

    var close = container.querySelector('.auth-close');
    var guest = container.querySelector('.auth-guest');
    var forgot = container.querySelector('.auth-forgot');

    var recoveryForm = container.querySelector('.auth-recovery-form');
    var recoveryEmail = recoveryForm.querySelector('[name="recoveryEmail"]');
    var recoverySubmit = recoveryForm.querySelector('.auth-submit');
    var recoveryError = recoveryForm.querySelector('.auth-error');

    var resetForm = container.querySelector('.auth-reset-form');
    var resetSubmit = resetForm.querySelector('.auth-submit');
    var resetError = resetForm.querySelector('.auth-error');

    var registerMode = false;
    var resetToken = getResetTokenFromUrl();

    function setError(element, message) {
      element.textContent = message || '';
      element.hidden = !message;
    }

    function showAuthView(view) {
      loginView.hidden = view !== 'login';
      recoveryView.hidden = view !== 'recovery';
      resetView.hidden = view !== 'reset';

      panel.hidden = false;
    }

    function updateMode() {
      if (registerMode) {
        title.textContent = labels.create;
        nameField.hidden = false;
        nameField.required = true;
        passwordField.autocomplete = 'new-password';
        submit.textContent = labels.create;
        switchText.textContent = labels.hasAccount;
        toggle.textContent = labels.login;
      } else {
        title.textContent = labels.login;
        nameField.hidden = true;
        nameField.required = false;
        passwordField.autocomplete = 'current-password';
        submit.textContent = labels.login;
        switchText.textContent = labels.noAccount;
        toggle.textContent = labels.create;
      }
    }

    function showLogin() {
      registerMode = false;

      form.reset();
      recoveryForm.reset();
      resetForm.reset();

      setError(error, '');
      setError(recoveryError, '');
      setError(resetError, '');

      updateMode();
      showAuthView('login');
    }

    container
      .querySelector('#userLabel')
      .addEventListener('click', function (event) {
        event.preventDefault();
        panel.hidden = !panel.hidden;
      });

    container
      .querySelector('#authButton')
      .addEventListener('click', function () {
        panel.hidden = !panel.hidden;
      });

    close.addEventListener('click', function () {
      closePanel(container);
    });

    toggle.addEventListener('click', function () {
      registerMode = !registerMode;

      setError(error, '');
      form.reset();

      updateMode();

      if (registerMode) {
        nameField.focus();
      } else {
        container
          .querySelector('.auth-email')
          .focus();
      }
    });

    guest.addEventListener('click', function () {
      closePanel(container);
    });

    forgot.addEventListener('click', function () {
      setError(error, '');
      recoveryForm.reset();
      setError(recoveryError, '');

      showAuthView('recovery');

      recoveryEmail.focus();
    });

    container
      .querySelectorAll('.auth-back-login')
      .forEach(function (button) {
        button.addEventListener('click', function () {
          showLogin();
        });
      });

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      setError(error, '');

      var email = form
        .querySelector('[name="email"]')
        .value
        .trim();

      var password = form
        .querySelector('[name="password"]')
        .value;

      var name = nameField.value.trim();

      if (!email || !password || (registerMode && !name)) {
        setError(error, labels.required);
        return;
      }

      submit.disabled = true;
      submit.textContent =
        registerMode ? labels.registering : labels.logging;

      try {
        if (registerMode) {
          var sessionId = null;

          try {
            sessionId = LDIdentityProvider.getSessionId();
          } catch (e) {}

          await AuthService.register(
            name,
            email,
            password,
            sessionId
          );
        } else {
          await AuthService.login(email, password);
        }

        closePanel(container);
        render(container);

        /*
         * Notificamos al resto de la plataforma sin asumir
         * que ninguna página concreta necesite reaccionar.
         */
        try {
          if (
            typeof EventBus !== 'undefined' &&
            EventBus.emit
          ) {
            EventBus.emit('identity:changed', {
              mode: getMode(),
              user: getUser()
            });
          }
        } catch (e) {}

      } catch (err) {
        setError(
          error,
          err && err.message
            ? err.message
            : labels.genericError
        );
      } finally {
        submit.disabled = false;
        updateMode();
      }
    });

    recoveryForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      setError(recoveryError, '');

      var email = recoveryEmail.value.trim();

      if (!email) {
        setError(recoveryError, labels.required);
        return;
      }

      recoverySubmit.disabled = true;
      recoverySubmit.textContent = labels.sending;

      try {
        await AuthService.requestPasswordReset(email);

        recoveryForm.innerHTML = `
          <p class="auth-message">
            ${escapeHtml(labels.recoverySent)}
          </p>

          <div class="auth-actions">
            <button
              type="button"
              class="auth-secondary auth-back-login"
            >
              ${escapeHtml(labels.backToLogin)}
            </button>
          </div>
        `;

        recoveryForm
          .querySelector('.auth-back-login')
          .addEventListener('click', function () {
            showLogin();
          });

      } catch (err) {
        setError(
          recoveryError,
          err && err.message
            ? err.message
            : labels.genericError
        );

        recoverySubmit.disabled = false;
        recoverySubmit.textContent = labels.sendLink;
      }
    });

    resetForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      setError(resetError, '');

      if (!resetToken) {
        setError(resetError, labels.invalidReset);
        return;
      }

      var newPassword = resetForm
        .querySelector('[name="newPassword"]')
        .value;

      var confirmPassword = resetForm
        .querySelector('[name="confirmPassword"]')
        .value;

      if (!newPassword || !confirmPassword) {
        setError(resetError, labels.required);
        return;
      }

      if (newPassword.length < 8) {
        setError(resetError, labels.passwordTooShort);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError(resetError, labels.passwordsMismatch);
        return;
      }

      resetSubmit.disabled = true;
      resetSubmit.textContent = labels.resetting;

      try {
        await AuthService.resetPassword(
          resetToken,
          newPassword
        );

        resetForm.innerHTML = `
          <p class="auth-message">
            ${escapeHtml(labels.passwordUpdated)}
          </p>

          <div class="auth-actions">
            <button
              type="button"
              class="auth-secondary auth-back-login"
            >
              ${escapeHtml(labels.backToLogin)}
            </button>
          </div>
        `;

        clearResetTokenFromUrl();
        resetToken = '';

        resetForm
          .querySelector('.auth-back-login')
          .addEventListener('click', function () {
            showLogin();
          });

      } catch (err) {
        setError(
          resetError,
          err && err.message
            ? err.message
            : labels.invalidReset
        );

        resetSubmit.disabled = false;
        resetSubmit.textContent = labels.resetPassword;
      }
    });

    updateMode();

    /*
     * Si la página fue abierta desde un enlace de recuperación,
     * mostramos directamente el formulario de nueva contraseña.
     */
    if (resetToken) {
      showAuthView('reset');
    }
  }

  async function init() {
    if (!document.querySelector('header.topbar')) {
      return;
    }

    ensureStyles();

    var container = getAuthContainer();

    if (!container) {
      return;
    }

    try {
      await ensureDependencies();
      render(container);
    } catch (error) {
      console.error(
        '[HeaderAuth] Error inicializando autenticación:',
        error
      );
    }
  }

  window.HeaderAuth = {
    init: init,

    render: function () {
      var container =
        document.getElementById(HEADER_AUTH_ID);

      if (container) {
        render(container);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    );
  } else {
    init();
  }

})();
