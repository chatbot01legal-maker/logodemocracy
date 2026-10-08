# analytics/ld_analytics.py

import sys
import os
import json
import subprocess

from .gcloud import fetch_logs
from .parsers import (
    parse_genai_logs,
    parse_http_logs,
    get_errors
)

from .reports import (
    render_dashboard,
    render_sophia,
    render_logos,
    render_academia,
    render_rey_filosofo,
    render_feedback,
    render_health,
    render_costs,
    export_data
)


def fetch_ai_usage():

    script_path = os.path.join(
        os.path.dirname(__file__),
        "ai_usage_mongodb.js"
    )

    try:

        result = subprocess.run(
            ["node", script_path],
            capture_output=True,
            text=True,
            check=True
        )

        output = result.stdout.strip()

        if not output:
            print("ERROR: MongoDB no devolvió datos.")
            return None

        return json.loads(output)

    except subprocess.CalledProcessError as e:

        print("\nERROR consultando MongoDB:")

        if e.stderr:
            print(e.stderr.strip())

        return None

    except json.JSONDecodeError:

        print("\nERROR: respuesta inválida desde MongoDB.")
        return None


def print_missing_metrics():

    print(f"\n{'='*60}")
    print("MÉTRICAS QUE REQUIEREN INSTRUMENTACIÓN")
    print(f"{'='*60}")

    print("""
Plataforma:
- Usuarios únicos, recurrentes y retención.
- Abandono y sesiones.

LOGOS:
- Confirmaciones, rechazos y correcciones.
- Cambios sustanciales en claims.
- Tiempo de validación y casos ABSTAINED.

SOPHIA:
- Evaluaciones y resultados IRD.
- Distribución de riesgo por documento.

Academia & Rey Filósofo:
- documentId unificado.
- Continuidad de conversación estructurada.
""")


def main():

    while True:

        print(f"\n{'='*60}")
        print("LOGODEMOCRACY ANALYTICS v2")
        print(f"{'='*60}")

        print("Selecciona período:")
        print("1. Últimas 24 horas")
        print("2. Últimos 7 días")
        print("3. Últimos 10 días")
        print("4. Últimos 20 días")
        print("5. Últimos 30 días")
        print("q. Salir")

        choice = input("\nOpción: ")

        freshness_map = {
            "1": "24h",
            "2": "7d",
            "3": "10d",
            "4": "20d",
            "5": "30d"
        }

        if choice.lower() == 'q':
            sys.exit(0)

        if choice not in freshness_map:
            print("Opción inválida.")
            continue

        freshness = freshness_map[choice]

        period_label = (
            f"Últimos "
            f"{freshness.replace('d', ' días').replace('h', ' horas')}"
        )

        # -----------------------------------------------
        # TRÁFICO / SALUD
        # Fuente: Cloud Logging
        # -----------------------------------------------

        raw_genai = fetch_logs(
            freshness=freshness,
            filter_str='textPayload:"[SOPHIA-GENAI] METRICS"'
        )

        raw_http = fetch_logs(
            freshness=freshness,
            filter_str='httpRequest:*'
        )

        raw_errors = fetch_logs(
            freshness=freshness,
            filter_str='severity>=ERROR'
        )

        genai_logs = parse_genai_logs(raw_genai)
        http_logs = parse_http_logs(raw_http)
        errors = get_errors(raw_errors)

        # -----------------------------------------------
        # GASTO IA
        # Fuente ÚNICA: MongoDB ai_usage
        # -----------------------------------------------

        ai_usage = fetch_ai_usage()

        while True:

            print(f"\n{'='*60}")
            print(
                f"LOGODEMOCRACY ANALYTICS - "
                f"{period_label}"
            )
            print(f"{'='*60}")

            print("1. Dashboard general")
            print("2. SOPHIA")
            print("3. LOGOS")
            print("4. Academia")
            print("5. Rey Filósofo")
            print("6. Feedback")
            print("7. Salud técnica")
            print("8. Consumo de IA")
            print("9. Exportar datos (CSV)")
            print("10. ¿Qué métricas todavía faltan?")
            print("0. Cambiar período")
            print("q. Salir")

            sub_choice = input("\nSelecciona: ")

            if sub_choice == '1':

                render_dashboard(
                    http_logs,
                    genai_logs,
                    errors,
                    period_label,
                    ai_usage
                )

            elif sub_choice == '2':
                render_sophia(genai_logs)

            elif sub_choice == '3':
                render_logos(genai_logs)

            elif sub_choice == '4':
                render_academia(http_logs)

            elif sub_choice == '5':
                render_rey_filosofo()

            elif sub_choice == '6':
                render_feedback(http_logs)

            elif sub_choice == '7':
                render_health(
                    http_logs,
                    errors
                )

            elif sub_choice == '8':
                render_costs(ai_usage)

            elif sub_choice == '9':
                export_data(
                    genai_logs,
                    freshness
                )

            elif sub_choice == '10':
                print_missing_metrics()

            elif sub_choice == '0':
                break

            elif sub_choice.lower() == 'q':
                sys.exit(0)

            else:
                print("Opción inválida.")

            input(
                "\nPresiona ENTER para volver al menú..."
            )


if __name__ == "__main__":
    main()
