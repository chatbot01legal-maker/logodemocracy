# Design Notes — Premisa oculta 2 (MT5)

## Nota de control: Q5 y contenido social

La pregunta `premisa_oculta_2-Q5` introduce un contenido social (una ciudad, el cambio en el patrón de consumo, con una de las explicaciones siendo la llegada de migrantes) potencialmente asociado a conocimientos, actitudes o posiciones previas del participante.

El contenido no constituye una variable observada. La respuesta del usuario no se interpreta como evidencia sobre sus actitudes hacia el tema.

Esta nota no convierte Q5 en una condición experimental ni corrige estadísticamente el posible efecto. Deja trazabilidad de una fuente potencial de contaminación que deberá revisarse en la auditoría posterior.

## Tipos estructurales de los estímulos (registro O2)

Todos los estímulos de MT5 comparten el tipo general *elección de causa entre varias posibles para un mismo efecto*. La variación está en el ámbito de cada situación:

| question_id | tipo_estructural | ámbito | descripción breve |
|---|---|---|---|
| `premisa_oculta_2-Q1` | `eleccion_de_causa_entre_varias` | comercial | Efecto comercial (caída de ventas) con varias causas plausibles. |
| `premisa_oculta_2-Q2` | `eleccion_de_causa_entre_varias` | personal | Comportamiento personal (dejar de responder) con varias causas plausibles. |
| `premisa_oculta_2-Q3` | `eleccion_de_causa_entre_varias` | natural | Fenómeno natural (plantas marchitas) con varias causas plausibles. |
| `premisa_oculta_2-Q4` | `eleccion_de_causa_entre_varias` | decisional | Decisión personal (rechazar oferta) con varias causas plausibles. |
| `premisa_oculta_2-Q5` | `eleccion_de_causa_entre_varias` | social | Fenómeno social (cambio de consumo) con varias causas plausibles. |

Este registro permite, en la auditoría posterior, distinguir la **variable observada** (modalidad de detección de premisas) de la **variable de diseño/control** (tipo estructural y ámbito del estímulo).

## Singularidad de la premisa (registro O1)

La tarea no asume que cada razonamiento tenga una única formulación canónica de la premisa. En MT5, además, se presentan varias explicaciones plausibles del mismo hecho. La observación se centra en la modalidad utilizada para detectar cuál es la estructuralmente necesaria, no en la elección de una explicación "verdadera".

## Diferencia respecto de MT4

MT4 presenta argumentos directos con una premisa no expresada. MT5 presenta varias explicaciones plausibles del mismo hecho, con una conclusión que sostiene una de ellas. La diferencia es deliberada y se documenta como condición experimental (no como dificultad).
