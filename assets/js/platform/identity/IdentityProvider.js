(function () {
  'use strict';

  // Guardar originales
  var originalConsoleLog   = console.log;
  var originalConsoleWarn  = console.warn;
  var originalConsoleError = console.error;
  var originalAlert        = window.alert;

  // Bandera para evitar bucles recursivos si fetch llegara a disparar logs
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

    // Asegurar stack del error si se envió como último argumento
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

  window.alert = function (message) {
    sendToServer('alert', [message]);
    // no se llama al original para evitar pop-ups
  };

  // Captura de errores no manejados (excepciones que no pasan por console.error)
  window.addEventListener('error', function (e) {
    var errorData = e.error || {};
    sendToServer('window-error', [
      e.message,
      'en ' + e.filename + ':' + e.lineno + ':' + e.colno,
      errorData.stack || errorData.message || ''
    ]);
  });

  // Captura de promesas rechazadas no manejadas
  window.addEventListener('unhandledrejection', function (e) {
    var reason = e.reason;
    var message = reason instanceof Error ? (reason.message + '\n' + reason.stack) : String(reason);
    sendToServer('promise', [message]);
  });

  // Mensaje de confirmación de que el sistema de telemetría arrancó
  sendToServer('log', ['Telemetría iniciada correctamente']);
})();
