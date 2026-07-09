// assets/js/platform/testing/Reporter.js
// ==========================================================
// LogoDemocracy Platform Reporter
// Muestra los resultados del TestRunner directamente en HTML.
// Dependencia: TestRunner
// ==========================================================

var Reporter = (function () {
    'use strict';

    var CONTAINER_ID = "test-results";

    function _ensureContainer() {

        var container = document.getElementById(CONTAINER_ID);

        if (!container) {

            container = document.createElement("div");
            container.id = CONTAINER_ID;

            container.style.fontFamily = "monospace";
            container.style.fontSize = "16px";
            container.style.padding = "20px";
            container.style.whiteSpace = "pre-wrap";
            container.style.lineHeight = "1.6";

            document.body.appendChild(container);
        }

        return container;
    }

    function _line(text) {
        return text + "\n";
    }

    async function render() {

        var container = _ensureContainer();

        container.textContent = "Ejecutando pruebas...\n";

        var report = await TestRunner.run();

        var output = "";

        output += _line("========================================");
        output += _line("LogoDemocracy Platform Test Runner");
        output += _line("========================================");
        output += _line("");

        report.results.forEach(function (result) {

            if (result.status === "PASS") {

                output += _line("✅ PASS  " + result.name);

            } else {

    output += _line("❌ FAIL  " + result.name);
    output += _line("        " + result.error);

    if (result.stack) {
        output += _line("        STACK:");
        output += _line("        " + result.stack);
    }
            }

        });

        output += _line("");
        output += _line("----------------------------------------");
        output += _line("");

        output += _line("Total      : " + report.total);
        output += _line("Aprobadas  : " + report.passed);
        output += _line("Fallidas   : " + report.failed);
        output += _line("Tiempo     : " + report.elapsed + " ms");

        output += _line("");

        if (report.failed === 0) {

            output += _line("🟢 PLATFORM VALIDADA");

        } else {

            output += _line("🔴 PLATFORM NO VALIDADA");

        }

        container.textContent = output;

        return report;

    }

    return {

        render: render

    };

})();
