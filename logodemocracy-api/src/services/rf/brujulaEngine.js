// logodemocracy-api/src/services/rf/brujulaEngine.js
//
// Wrapper temporal de compatibilidad.
//
// La lógica de procesamiento de Brújula fue movida al motor universal
// en microtestEngine.js. Este archivo conserva la API histórica
// (buildProfile(indicators)) mientras el resto del sistema sigue
// llamándolo por su nombre específico.
//
// Se retirará cuando:
//   1. El controller migre a microtestEngine.buildProfile('brujula', ...).
//   2. Los tests migren a la nueva interfaz.
//   3. Se verifique en producción que ninguna otra referencia lo usa.

'use strict';

var microtestEngine = require('./microtestEngine');

module.exports = {
  buildProfile: function (indicators) {
    return microtestEngine.buildProfile('brujula', indicators);
  }
};// logodemocracy-api/src/services/rf/brujulaEngine.js
//
// Wrapper temporal de compatibilidad.
//
// La lógica de procesamiento de Brújula fue movida al motor universal
// en microtestEngine.js. Este archivo conserva la API histórica
// (buildProfile(indicators)) mientras el resto del sistema sigue
// llamándolo por su nombre específico.
//
// Se retirará cuando:
//   1. El controller migre a microtestEngine.buildProfile('brujula', ...).
//   2. Los tests migren a la nueva interfaz.
//   3. Se verifique en producción que ninguna otra referencia lo usa.

'use strict';

var microtestEngine = require('./microtestEngine');

module.exports = {
  buildProfile: function (indicators) {
    return microtestEngine.buildProfile('brujula', indicators);
  }
};
