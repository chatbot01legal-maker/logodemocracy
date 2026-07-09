// assets/js/platform/core/CoreConfig.js
// Configuración del núcleo de LogoDemocracy.

var CoreConfig = (function () {
  'use strict';

  return {
    API_BASE: '/api',

    SERVICES: {
      auth: '/api/auth',
      profile: '/api/profile',
      reyfilosofo: '/api/reyfilosofo',
      microtests: '/api/reyfilosofo/microtests'
    },

    STORAGE_KEYS: {
      TOKEN: 'platform_token',
      USER: 'platform_user',
      SESSION: 'platform_session_id',
      PREFERENCES: 'platform_preferences'
    },

    FEATURES: {
      enableAnalytics: false,
      enableOffline: false,
      enableDebug: true
    }
  };
})();
