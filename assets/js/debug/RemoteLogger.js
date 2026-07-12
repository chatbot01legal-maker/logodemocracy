// assets/js/debug/RemoteLogger.js
// Intercepta console.log/warn/error y alert() y los reenvía a
// /api/debug-log, para poder depurar desde un dispositivo sin DevTools
// (ej. tablet). Cárgalo PRIMERO en el HTML, antes que cualquier otro
// script de la plataforma, para capturar también sus errores de carga.
//
// IMPORTANTE: este archivo NO debe vivir en platform/identity/ — no
// tiene relación con IdentityProvider. Ese fue el bug que causó que
// window.LDIdentityProvider nunca se creara: este script terminó
// ocupando ese archivo por error.

(function () {
  'use strict';

  var originalConsoleLog   = console.log;
  var originalConsoleWarn  = console.warn;
  var originalConsoleError = console.error;
  var originalAlert        = window.alert;

  var sending = false;

  function sendToServer(level, messages) {
    if (sending) return;
    sending = true;

    var serialized = Array.from(messages).map(function (arg) {
      try {
        if (arg instanceof Error) {
          return arg.message + '\n' + (arg.stack || '');
        }
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      } catch (e) {
        return '[No serializable]';
      }
    }).join(' ');

    if (level === 'error' && messages.length > 0 && messages[messages.length - 1] instanceof Error) {
      var err = messages[messages.length - 1];
      serialized += '\n' + (err.stack || '');
    }

    fetch('/api/debug-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: level, message: serialized })
    })
      .catch(function () { /* evita que un error de fetch genere más logs */ })
      .finally(function () {
        sending = false;
      });
  }

  console.log = function () {
    originalConsoleLog.apply(console, arguments);
    sendToServer('log', arguments);
  };

  console.warn = function () {
    originalConsoleWarn.apply(console, arguments);
    sendToServer('warn', arguments);
  };

  console.error = function () {
    originalConsoleError.apply(console, arguments);
    sendToServer('error', arguments);
  };

  // A diferencia de la versión anterior, SÍ mostramos el alert original
  // además de mandarlo al servidor — así puedes seguir viendo el popup
  // en pantalla Y tener el registro remoto, en vez de perder uno u otro.
  window.alert = function (message) {
    sendToServer('alert', [message]);
    originalAlert.call(window, message);
  };

  window.addEventListener('error', function (e) {
    var errorData = e.error || {};
    sendToServer('window-error', [
      e.message,
      'en ' + e.filename + ':' + e.lineno + ':' + e.colno,
      errorData.stack || errorData.message || ''
    ]);
  });

  window.addEventListener('unhandledrejection', function (e) {
    var reason = e.reason;
    var message = reason instanceof Error ? (reason.message + '\n' + reason.stack) : String(reason);
    sendToServer('promise', [message]);
  });

  sendToServer('log', ['Telemetría iniciada correctamente']);
})();
