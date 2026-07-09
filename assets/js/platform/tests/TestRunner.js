// assets/js/platform/testing/TestRunner.js
// ==========================================================
// LogoDemocracy Platform Test Runner
// Núcleo del framework interno de pruebas.
// ==========================================================

var TestRunner = (function () {
    'use strict';

    var _tests = [];
    var _results = [];

    function test(name, fn) {

        if (!name) {
            throw new Error("TestRunner.test(): name es obligatorio.");
        }

        if (typeof fn !== "function") {
            throw new Error("TestRunner.test(): fn debe ser una función.");
        }

        _tests.push({
            name: name,
            fn: fn
        });
    }

    async function run() {

        _results = [];

        var passed = 0;
        var failed = 0;

        var start = Date.now();

        for (var i = 0; i < _tests.length; i++) {

            var current = _tests[i];

            try {

                await current.fn();

                passed++;

                _results.push({
                    name: current.name,
                    status: "PASS"
                });

            } catch (err) {

    failed++;

    _results.push({
        name: current.name,
        status: "FAIL",
        error: err.message,
        stack: err.stack || "Sin stack"
    });

            }
        }

        var elapsed = Date.now() - start;

        return {

            total: _tests.length,

            passed: passed,

            failed: failed,

            elapsed: elapsed,

            results: _results

        };

    }

    function clear() {
        _tests = [];
        _results = [];
    }

    function getTests() {
        return _tests.slice();
    }

    return {

        test: test,

        run: run,

        clear: clear,

        getTests: getTests

    };

})();
