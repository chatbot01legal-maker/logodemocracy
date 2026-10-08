# analytics/reports.py

import csv
from collections import defaultdict
from .config import SOPHIA_STAGES, LOGOS_STAGES, FEEDBACK_ROUTE


def render_dashboard(http_logs, genai_logs, errors, period_label, ai_usage=None):

    endpoints = set(req['url'] for req in http_logs)
    total_tokens = sum(log['total'] for log in genai_logs)

    print(f"\n{'='*60}")
    print("DASHBOARD")
    print(f"Período: {period_label}")
    print(f"{'-'*30}")

    print(f"Requests HTTP:        {len(http_logs)}")
    print(f"Endpoints utilizados: {len(endpoints)}")
    print(f"Errores:              {len(errors)}")
    print(f"Llamadas a IA:        {len(genai_logs)}")
    print(f"Tokens registrados:   {total_tokens:,}")

    if ai_usage:
        print(f"\n{'-'*30}")
        print("GASTO IA — MongoDB ai_usage")
        print(f"{'-'*30}")

        print(f"Límite diario:        ${ai_usage['limitUsd']:.2f} USD")
        print(f"Gasto acumulado:      ${ai_usage['usedUsd']:.4f} USD")
        print(f"Saldo disponible:     ${ai_usage['remainingUsd']:.4f} USD")
        print(f"Uso del límite:       {ai_usage['percentageUsed']:.2f}%")
        print(
            f"Estado:               "
            f"{'BLOQUEADO' if ai_usage['blocked'] else 'OPERATIVO'}"
        )

    print(
        "\nUsuarios únicos: NO DISPONIBLE — "
        "requiere userId/sessionId en telemetría."
    )


def render_sophia(genai_logs):

    print(f"\n{'='*60}")
    print("SOPHIA")
    print(f"{'='*60}")

    stats = defaultdict(lambda: {'calls': 0, 'tokens': 0})
    total_tokens = 0
    total_calls = 0

    for log in genai_logs:
        stage = log['stage']

        if stage in SOPHIA_STAGES or stage.startswith("sophia"):
            stats[stage]['calls'] += 1
            stats[stage]['tokens'] += log['total']
            total_tokens += log['total']
            total_calls += 1

    if total_calls == 0:
        print("No se registraron llamadas de SOPHIA en este período.")
        return

    print(
        f"{'ETAPA':<25} "
        f"{'CALLS':<10} "
        f"{'TOKENS':<10} "
        f"{'% TOTAL':<10}"
    )
    print("-" * 55)

    for stage, data in stats.items():

        pct = (
            data['tokens'] / total_tokens * 100
            if total_tokens
            else 0
        )

        print(
            f"{stage:<25} "
            f"{data['calls']:<10} "
            f"{data['tokens']:<10,} "
            f"{pct:.1f}%"
        )

    print("-" * 55)
    print(
        f"{'TOTAL':<25} "
        f"{total_calls:<10} "
        f"{total_tokens:<10,}"
    )


def render_logos(genai_logs):

    print(f"\n{'='*60}")
    print("LOGOS")
    print(f"{'='*60}")

    stats = defaultdict(lambda: {'calls': 0, 'tokens': 0})

    for log in genai_logs:
        stage = log['stage']

        if stage in LOGOS_STAGES:
            stats[stage]['calls'] += 1
            stats[stage]['tokens'] += log['total']

    if not stats:
        print("No se registraron llamadas de LOGOS en este período.")
        return

    print(
        f"{'ETAPA':<25} "
        f"{'CALLS':<10} "
        f"{'TOKENS':<15} "
        f"{'PROMEDIO':<10}"
    )
    print("-" * 62)

    for stage in LOGOS_STAGES:

        data = stats.get(
            stage,
            {'calls': 0, 'tokens': 0}
        )

        avg = (
            data['tokens'] // data['calls']
            if data['calls']
            else 0
        )

        print(
            f"{stage:<25} "
            f"{data['calls']:<10} "
            f"{data['tokens']:<15,} "
            f"{avg:,}"
        )


def render_academia(http_logs):

    print(f"\n{'='*60}")
    print("ACADEMIA")
    print(f"{'='*60}")

    docs = defaultdict(int)

    for req in http_logs:
        url = req['url']

        if "/academy/" in url.lower() or ".md" in url.lower():
            docs[url] += 1

    if not docs:
        print("No se identificaron lecturas claras en los logs HTTP.")
        print(
            "NO DISPONIBLE — "
            "requiere documentId."
        )
    else:
        print("TOP RUTAS DETECTADAS")

        for url, count in sorted(
            docs.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]:
            print(f"{url:<50} {count} lecturas")


def render_rey_filosofo():

    print(f"\n{'='*60}")
    print("REY FILÓSOFO")
    print(f"{'='*60}")

    print(
        "Interacciones, sesiones y documentos asociados:"
    )
    print(
        "NO DISPONIBLE — "
        "requiere documentId/sessionId."
    )


def render_feedback(http_logs):

    print(f"\n{'='*60}")
    print("FEEDBACK")
    print(f"{'='*60}")

    feedback_reqs = [
        req
        for req in http_logs
        if FEEDBACK_ROUTE in req['url']
    ]

    print(
        f"Total eventos en ruta "
        f"{FEEDBACK_ROUTE}: "
        f"{len(feedback_reqs)}"
    )


def render_health(http_logs, errors):

    print(f"\n{'='*60}")
    print("SALUD TÉCNICA")
    print(f"{'='*60}")

    status_4xx = [
        req for req in http_logs
        if req['status']
        and 400 <= req['status'] < 500
    ]

    status_5xx = [
        req for req in http_logs
        if req['status']
        and req['status'] >= 500
    ]

    print(f"Errores HTTP 4xx: {len(status_4xx)}")
    print(f"Errores HTTP 5xx: {len(status_5xx)}")
    print(f"Excepciones/Errores app: {len(errors)}")

    if errors:
        print("\nÚltimos 5 errores registrados:")

        for e in errors[:5]:
            print(
                f"[{e['timestamp']}] "
                f"{e['text'][:100]}..."
            )


def render_costs(ai_usage):

    print(f"\n{'='*60}")
    print("CONSUMO DE IA")
    print(f"{'='*60}")

    if not ai_usage:
        print("No fue posible obtener datos desde MongoDB.")
        return

    print(
        "FUENTE ÚNICA DE VERDAD: "
        "MongoDB → ai_usage"
    )

    print(f"\nFecha:                 {ai_usage['date']}")
    print(f"Límite diario:         ${ai_usage['limitUsd']:.2f} USD")
    print(f"Gasto acumulado:       ${ai_usage['usedUsd']:.4f} USD")
    print(f"Saldo restante:        ${ai_usage['remainingUsd']:.4f} USD")
    print(f"Porcentaje utilizado:  {ai_usage['percentageUsed']:.2f}%")

    print(
        f"Estado:                "
        f"{'BLOQUEADO' if ai_usage['blocked'] else 'OPERATIVO'}"
    )

    print(f"\nLlamadas IA:            {ai_usage['calls']:,}")
    print(f"Tokens input:           {ai_usage['inputTokens']:,}")
    print(f"Tokens output:          {ai_usage['outputTokens']:,}")
    print(f"Tokens totales:         {ai_usage['totalTokens']:,}")

    print(
        "\nEl gasto NO se recalcula en Analytics."
    )


def export_data(genai_logs, period):

    filename = (
        f"logodemocracy_export_"
        f"{period.replace(' ', '_')}.csv"
    )

    with open(filename, 'w', newline='') as csvfile:

        fieldnames = [
            'timestamp',
            'stage',
            'input',
            'output',
            'thoughts',
            'total',
            'model'
        ]

        writer = csv.DictWriter(
            csvfile,
            fieldnames=fieldnames
        )

        writer.writeheader()

        for log in genai_logs:
            writer.writerow(log)

    print(
        f"\nDatos exportados exitosamente a {filename}"
    )
