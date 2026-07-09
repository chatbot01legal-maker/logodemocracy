// assets/js/platform/api/ApiClient.js
// Cliente HTTP único de la plataforma LogoDemocracy.
// Todos los módulos deben usar este cliente para comunicarse con el backend.
// Proporciona resolución de servicios, headers automáticos, manejo robusto de respuestas
// y un sistema de interceptores extensible.

var ApiClient = (function() {
  'use strict';

  // --- Estado interno ---

  /**
   * Interceptores registrados.
   * Cada interceptor es una función que recibe un contexto y puede modificarlo.
   */
  var _interceptors = {
    beforeRequest: null,   // función (context) => context | void
    afterResponse: null,   // función (context) => context | void
    onError: null          // función (error, context) => void
  };

  // --- Funciones auxiliares privadas ---

  /**
   * Obtiene la URL base para un servicio.
   * @param {string} service - Nombre del servicio (ej: 'auth', 'profile', 'reyfilosofo').
   * @returns {string} URL base del servicio.
   */
  function _getBaseUrl(service) {
    if (!service) {
      throw new Error('ApiClient: service es obligatorio');
    }

    var base = CoreConfig.API_BASE;
    var servicePath = CoreConfig.SERVICES[service];

    if (!servicePath) {
      // Si el servicio no está definido en CoreConfig.SERVICES,
      // se asume que service es una ruta relativa o absoluta.
      // Esto permite flexibilidad para servicios temporales o externos.
      return service.startsWith('/') ? service : '/' + service;
    }

    return servicePath;
  }

  /**
   * Construye los headers para la petición.
   * @returns {object} Headers a enviar.
   */
  function _getHeaders() {
    var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    var token = IdentityProvider.getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return headers;
  }

  /**
   * Maneja la respuesta HTTP de manera robusta.
   * @param {Response} response - Objeto Response de fetch.
   * @param {object} options - Opciones de la petición original.
   * @returns {Promise<any>} Datos parseados o null.
   */
  async function _handleResponse(response, options) {
    // Caso 204 No Content
    if (response.status === 204) {
      return null;
    }

    var contentType = response.headers.get('Content-Type') || '';

    // Intentar parsear según Content-Type
    if (contentType.includes('application/json')) {
      var data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error en la solicitud');
      }
      return data;
    }

    if (contentType.includes('text/plain')) {
      var text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'Error en la solicitud');
      }
      return text;
    }

    
    // Fallback robusto: leer una sola vez el body
var rawBody = await response.text();

if (!response.ok) {

  try {
    var errorData = JSON.parse(rawBody);

    throw new Error(
      errorData.error ||
      errorData.message ||
      'Error en la solicitud'
    );

  } catch (parseError) {

    throw new Error(
      rawBody || 'Error en la solicitud'
    );

  }

}


// Intentar convertir respuesta válida a JSON
try {

  return JSON.parse(rawBody);

} catch (_) {

  return rawBody;

}
  }
  /**
   * Ejecuta una petición HTTP con el pipeline de interceptores.
   * @param {object} options - Opciones de la petición.
   * @param {string} options.service - Nombre del servicio.
   * @param {string} options.endpoint - Ruta dentro del servicio.
   * @param {string} options.method - Método HTTP (GET, POST, PUT, DELETE).
   * @param {object} [options.body] - Cuerpo de la petición (para POST/PUT).
   * @param {object} [options.query] - Parámetros de consulta (para GET).
   * @param {object} [options.headers] - Headers adicionales.
   * @returns {Promise<any>} Datos de la respuesta.
   */
  async function request(options) {
    var {
      service,
      endpoint,
      method = 'GET',
      body = null,
      query = null,
      headers = {}
    } = options;

    if (!service) {
      throw new Error('ApiClient.request: service es obligatorio');
    }
    if (!endpoint) {
      throw new Error('ApiClient.request: endpoint es obligatorio');
    }

    // Construir URL
    var baseUrl = _getBaseUrl(service);
    var url = baseUrl + endpoint;

    // Agregar query string si existe
    if (query && Object.keys(query).length > 0) {
      var params = new URLSearchParams(query);
      url += '?' + params.toString();
    }

    // Construir configuración de fetch
    var config = {
      method: method.toUpperCase(),
      headers: Object.assign(_getHeaders(), headers)
    };

    if (body && method.toUpperCase() !== 'GET') {
      config.body = JSON.stringify(body);
    }

    // --- Contexto para interceptores ---
    var context = {
      options: options,
      url: url,
      config: config,
      response: null,
      error: null
    };

    // --- Interceptor: beforeRequest ---
    if (_interceptors.beforeRequest) {
      try {
        var result = _interceptors.beforeRequest(context);
        if (result) {
          // Si el interceptor devuelve un contexto modificado, usarlo
          context = result;
        }
      } catch (e) {
        // Si el interceptor lanza error, propagarlo
        throw new Error('Interceptor beforeRequest falló: ' + e.message);
      }
    }

    try {
      // Ejecutar fetch con la configuración posiblemente modificada
      var response = await fetch(context.url, context.config);
      context.response = response;

      // --- Interceptor: afterResponse ---
      if (_interceptors.afterResponse) {
        var afterResult = _interceptors.afterResponse(context);
        if (afterResult) {
          context = afterResult;
        }
      }

      // Procesar respuesta
      var data = await _handleResponse(response, context.options);
      return data;

    } catch (error) {
      context.error = error;

      // --- Interceptor: onError ---
      if (_interceptors.onError) {
        try {
          _interceptors.onError(error, context);
        } catch (_) {
          // El interceptor de error no debe romper la ejecución
        }
      }

      // Re-lanzar el error para que el módulo consumidor lo maneje
      throw error;
    }
  }

  // --- Métodos públicos abreviados ---

  /**
   * Realiza una petición GET.
   * @param {string} service - Nombre del servicio.
   * @param {string} endpoint - Ruta dentro del servicio.
   * @param {object} [query] - Parámetros de consulta.
   * @returns {Promise<any>}
   */
  function get(service, endpoint, query) {
    return request({
      service: service,
      endpoint: endpoint,
      method: 'GET',
      query: query
    });
  }

  /**
   * Realiza una petición POST.
   * @param {string} service - Nombre del servicio.
   * @param {string} endpoint - Ruta dentro del servicio.
   * @param {object} [body] - Cuerpo de la petición.
   * @returns {Promise<any>}
   */
  function post(service, endpoint, body) {
    return request({
      service: service,
      endpoint: endpoint,
      method: 'POST',
      body: body
    });
  }

  /**
   * Realiza una petición PUT.
   * @param {string} service - Nombre del servicio.
   * @param {string} endpoint - Ruta dentro del servicio.
   * @param {object} [body] - Cuerpo de la petición.
   * @returns {Promise<any>}
   */
  function put(service, endpoint, body) {
    return request({
      service: service,
      endpoint: endpoint,
      method: 'PUT',
      body: body
    });
  }

  /**
   * Realiza una petición DELETE.
   * @param {string} service - Nombre del servicio.
   * @param {string} endpoint - Ruta dentro del servicio.
   * @returns {Promise<any>}
   */
  function del(service, endpoint) {
    return request({
      service: service,
      endpoint: endpoint,
      method: 'DELETE'
    });
  }

  // --- Sistema de interceptores ---

  /**
   * Registra un interceptor para el pipeline de peticiones.
   * @param {string} name - Nombre del interceptor ('beforeRequest', 'afterResponse', 'onError').
   * @param {function} fn - Función interceptor.
   */
  function setInterceptor(name, fn) {
    if (typeof fn !== 'function') {
      throw new Error('ApiClient.setInterceptor: el interceptor debe ser una función');
    }

    if (name === 'beforeRequest' || name === 'afterResponse' || name === 'onError') {
      _interceptors[name] = fn;
    } else {
      throw new Error('ApiClient.setInterceptor: nombre de interceptor inválido');
    }
  }

  // --- Exponer API pública ---
  return {
    request: request,
    get: get,
    post: post,
    put: put,
    delete: del,
    setInterceptor: setInterceptor
  };

})();
