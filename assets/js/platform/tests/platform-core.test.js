// assets/js/platform/tests/platform-core.test.js
// Pruebas de integridad del núcleo de plataforma LogoDemocracy (Hito 1).
// Adaptado para ejecución en navegador móvil/tablet.
// Sin dependencias externas.

(function() {
  'use strict';

  var tests = [];
  var passed = 0;
  var failed = 0;

  function render(message, type) {

    var container = document.getElementById('test-results');

    if (!container) {
      container = document.createElement('div');
      container.id = 'test-results';
      document.body.appendChild(container);
    }

    var element = document.createElement('p');

    element.textContent = message;

    if (type === 'pass') {
      element.style.color = 'green';
    }

    if (type === 'fail') {
      element.style.color = 'red';
    }

    container.appendChild(element);
  }


  function test(name, fn) {
    tests.push({
      name: name,
      fn: fn
    });
  }


  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }


  function runTests() {

    render('🧪 Ejecutando pruebas del Hito 1 - Core Platform');

    tests.forEach(function(t) {

      try {

        t.fn();

        passed++;

        render('✅ PASS: ' + t.name, 'pass');

        console.log('PASS:', t.name);

      } catch(e) {

        failed++;

        render('❌ FAIL: ' + t.name + ' → ' + e.message, 'fail');

        console.error('FAIL:', t.name, e);

      }

    });


    render('');
    render(
      '📊 Resultado: ' +
      passed +
      ' aprobadas / ' +
      failed +
      ' fallidas'
    );


    if (failed === 0) {

      render(
        '🎉 HITO 1 VALIDADO CORRECTAMENTE',
        'pass'
      );

    } else {

      render(
        '⚠️ HITO 1 TIENE ERRORES',
        'fail'
      );

    }

  }



  // ==========================
  // TESTS
  // ==========================


  test(
    'CoreConfig existe y tiene configuración básica',
    function() {

      assert(
        typeof CoreConfig !== 'undefined',
        'CoreConfig no existe'
      );


      assert(
        typeof CoreConfig.API_BASE === 'string',
        'API_BASE inválido'
      );


      assert(
        CoreConfig.SERVICES.auth,
        'Servicio auth faltante'
      );


      assert(
        CoreConfig.SERVICES.profile,
        'Servicio profile faltante'
      );


      assert(
        CoreConfig.SERVICES.reyfilosofo,
        'Servicio reyfilosofo faltante'
      );

    }
  );



  test(
    'IdentityStorage genera y guarda sessionId',
    function() {


      assert(
        typeof IdentityStorage !== 'undefined',
        'IdentityStorage no existe'
      );


      var id =
        'test-' + Date.now();


      IdentityStorage.saveSessionId(id);


      var recovered =
        IdentityStorage.getSessionId();


      assert(
        recovered === id,
        'sessionId no coincide'
      );


      IdentityStorage.clearSessionId();


    }
  );



  test(
    'CurrentUser guarda y recupera usuario',
    function() {


      assert(
        typeof CurrentUser !== 'undefined',
        'CurrentUser no existe'
      );


      var user = {

        id: 'test-user',

        name: 'Usuario Test',

        email: 'test@test.com',

        role: 'citizen'

      };


      CurrentUser.set(user);


      var result =
        CurrentUser.get();


      assert(
        result !== null,
        'Usuario vacío'
      );


      assert(
        result.id === user.id,
        'ID incorrecto'
      );


      assert(
        result.name === user.name,
        'Nombre incorrecto'
      );


      CurrentUser.clear();


      assert(
        CurrentUser.exists() === false,
        'No limpió usuario'
      );


    }
  );



  test(
    'IdentityProvider funciona en modo invitado',
    function() {


      assert(
        typeof IdentityProvider !== 'undefined',
        'IdentityProvider no existe'
      );


      IdentityProvider.clear();


      assert(
        IdentityProvider.getMode() === 'guest',
        'No está en modo guest'
      );


      assert(
        IdentityProvider.isAuthenticated() === false,
        'isAuthenticated debería ser false'
      );


      assert(
        IdentityProvider.getSessionId(),
        'No existe sessionId'
      );


    }
  );



  test(
    'EventBus emite y recibe eventos',
    function() {


      assert(
        typeof EventBus !== 'undefined',
        'EventBus no existe'
      );


      var received = false;


      function handler(data){

        if(data.value === 123){

          received = true;

        }

      }


      EventBus.on(
        'test:event',
        handler
      );


      EventBus.emit(
        'test:event',
        {
          value:123
        }
      );


      assert(
        received === true,
        'Evento no recibido'
      );


      EventBus.off(
        'test:event',
        handler
      );


    }
  );



  test(
    'ApiClient tiene interfaz pública',
    function() {


      assert(
        typeof ApiClient !== 'undefined',
        'ApiClient no existe'
      );


      var methods = [

        'request',
        'get',
        'post',
        'put',
        'delete',
        'setInterceptor'

      ];


      methods.forEach(function(method){

        assert(
          typeof ApiClient[method] === 'function',
          'Falta método ' + method
        );

      });


    }
  );



  // Ejecutar después de cargar todo

  window.addEventListener(
    'load',
    function(){

      runTests();

    }
  );


})();
