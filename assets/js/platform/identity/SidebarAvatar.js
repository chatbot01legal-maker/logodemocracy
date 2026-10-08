/* =========================================================
   SIDEBAR AVATAR
   Reemplaza la letra del badge (.module-badge) por el avatar
   del usuario cuando:
     - hay sesión activa
     - el usuario eligió un avatar en su perfil
   Si no hay sesión o no hay avatar, deja la letra original.
   Se re-ejecuta cuando cambia la identidad (login/logout).
========================================================= */

(function () {
  'use strict';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }

  function getBadge() {
    return document.querySelector('.module-badge');
  }

  function replaceWithAvatar(avatarId) {
    var badge = getBadge();
    if (!badge) return;
    if (badge.dataset.avatarReplaced === 'true' && badge.dataset.avatarId === avatarId) return;

    var url = '/assets/avatares/' + avatarId + '.svg';

    badge.dataset.avatarReplaced = 'true';
    badge.dataset.avatarId = avatarId;
    badge.classList.add('module-badge--avatar');
    badge.innerHTML = '<img src="' + url + '" alt="" class="module-badge-img">';
  }

  function restoreLetter() {
    var badge = getBadge();
    if (!badge) return;
    if (badge.dataset.avatarReplaced !== 'true') return;

    var letter = badge.dataset.originalLetter || '';
    badge.classList.remove('module-badge--avatar');
    badge.innerHTML = letter;
    delete badge.dataset.avatarReplaced;
    delete badge.dataset.avatarId;
  }

  async function refresh() {
    var badge = getBadge();
    if (!badge) return;

    if (!badge.dataset.originalLetter) {
      badge.dataset.originalLetter = (badge.textContent || '').trim();
    }

    if (typeof CurrentUser === 'undefined' || !CurrentUser.exists || !CurrentUser.exists()) {
      restoreLetter();
      return;
    }

    if (typeof ProfileService === 'undefined') {
      try {
        await loadScript('/assets/js/platform/services/ProfileService.js?v=1');
      } catch (e) {
        restoreLetter();
        return;
      }
    }

    try {
      var info = await ProfileService.getUserInfo();
      var hasAvatar = !!(info && info.avatar_id);
      if (hasAvatar) {
        replaceWithAvatar(info.avatar_id);
      } else {
        restoreLetter();
      }

    } catch (e) {
      restoreLetter();
    }
  }

  function runWithRetry() {
    var attempts = 0;
    var maxAttempts = 300; // 30 segundos
    var interval = setInterval(function () {
      attempts++;
      if (typeof CurrentUser !== 'undefined') {
        clearInterval(interval);
        refresh();
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }

  function init() {
    // Estado inicial
    if (typeof CurrentUser !== 'undefined') {
      refresh();
    } else {
      runWithRetry();
    }

    // Respaldo: reintentar en window.load
    window.addEventListener('load', function () {
      setTimeout(refresh, 500);
    });

    // Reaccionar a cambios de sesión
    if (typeof EventBus !== 'undefined' && EventBus.on) {
      EventBus.on('identity:changed', function () {
        setTimeout(refresh, 300);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
