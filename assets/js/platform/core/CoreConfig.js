var CoreConfig = (function () {
  'use strict';

  return {
    API_BASE: 'http://localhost:5000/api',

    SERVICES: {
      auth: '/auth',
      profile: '/profile',
      reyfilosofo: '/reyfilosofo',
      microtests: '/reyfilosofo/microtests'
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
