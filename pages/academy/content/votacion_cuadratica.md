---
title: Votación Cuadrática
folder: Fundamentos
tags:
  - matematicas
  - estadistica
  - teoria-de-juegos
  - votacion-cuadratica
  - logodemocracia
---

# Votación Cuadrática: Fundamentos Matemáticos y Teóricos

## 1. Definición del Problema de Decisión Colectiva

Consideremos una sociedad o grupo compuesto por $N$ agentes, $i \in \{1, 2, \dots, N\}$, que deben tomar una decisión colectiva binaria respecto a una propuesta o proyecto de ley $x \in \{0, 1\}$, donde $x = 1$ representa la aprobación de la propuesta y $x = 0$ su rechazo.

Cada agente $i$ asigna una valoración o intensidad de preferencia privada $u_i \in \mathbb{R}$ a la aprobación de la propuesta. Si $u_i > 0$, el agente obtiene un beneficio neto de la aprobación; si $u_i < 0$, la propuesta le genera un perjuicio. Bajo el enfoque utilitarista de Pigou-Bentham, la decisión colectiva socialmente óptima busca maximizar la suma del bienestar social total:

$$x^* = \arg\max_{x \in \{0,1\}} \sum_{i=1}^{N} u_i \cdot x$$

### Limitaciones de la Regla de la Mayoría

En la regla de la mayoría tradicional (un ciudadano = un voto), cada agente emite un voto $v_i \in \{-1, +1\}$, registrando únicamente el signo de su preferencia pero omitiendo por completo su intensidad $|u_i|$. Esto acarrea distorsiones estructurales como la paradoja de la tiranía de la mayoría, donde una mayoría con preferencias débiles ($u_i = +1$) se impone sobre una minoría con preferencias profundamente intensas ($u_j = -100$), reduciendo de forma drástica el bienestar neto de la sociedad.

La Votación Cuadrática (Quadratic Voting - QV) resuelve esta falla permitiendo que los votantes adquieran e impriman $v_i$ votos (donde $v_i \in \mathbb{R}$ puede ser positivo o negativo), incurriendo en un coste de tokens o recursos proporcional al cuadrado de los votos emitidos:

$$C(v_i) = v_i^2$$

---

## 2. Derivación del Coste Marginal y Unicidad de la Función $Costo = V^2$

### 2.1 Derivación a partir de la Igualdad entre Beneficio Marginal y Coste Marginal
Supongamos que el resultado de la votación depende de la suma neta de votos $V = \sum_{j=1}^{N} v_j$. La probabilidad de que la propuesta sea aprobada se modela mediante una función estocástica suave de agregación $p(V) = P(x = 1 \mid V)$.

La utilidad esperada para el agente $i$ al emitir $v_i$ votos es:

$$EU_i(v_i) = u_i \cdot p\left(v_i + \sum_{j \neq i} v_j\right) - C(v_i)$$

Para maximizar la utilidad esperada, derivamos con respecto a $v_i$ e igualamos el beneficio marginal al coste marginal (Condición de Primer Orden - FOC):

$$\frac{dEU_i}{dv_i} = u_i \cdot p'(V) - C'(v_i) = 0 \implies u_i \cdot p'(V) = C'(v_i)$$

Donde $p'(V) = \frac{dp}{dV}$ representa la **probabilidad marginal de ser decisivo (pivotabilidad)**. 

Para que el mecanismo incentive la eficiencia formal, la cantidad de votos adquiridos $v_i^*$ debe ser directamente proporcional a la intensidad de preferencia real del votante $u_i$ (es decir, $v_i^* = \alpha \cdot u_i$ para alguna constante global $\alpha > 0$).

Sustituyendo $v_i = \alpha \cdot u_i$ en la FOC:

$$u_i \cdot p'(V) = C'(\alpha u_i) \implies C'(v_i) = \left(\frac{p'(V)}{\alpha}\right) \cdot v_i$$

En el margen de una votación con muchos participantes, $p'(V)$ se percibe como una constante esperada exógena. Por ende, la función de coste marginal $C'(v_i)$ **debe ser una función lineal en los votos**: $C'(v_i) = k \cdot v_i$.

### 2.2 Demostración de Unicidad de $Costo = V^2$
Para determinar la forma de $C(v)$, exigimos que la función cumpla tres propiedades axiomáticas deseables:

1. **Convexidad Estricta ($C''(v) > 0$):** Penaliza de forma creciente la adquisición de votos adicionales, impidiendo que agentes con utilidades o recursos extremos capturen la decisión colectiva.
2. **Simetría y Neutralidad ($C(v) = C(-v)$):** El coste de expresar preferencia a favor ($v > 0$) o en contra ($v < 0$) debe ser idéntico.
3. **Consistencia con la Utilidad Marginal Decreciente:** Exige que la respuesta del votante cumpla $v_i \propto u_i$, requiriendo un coste marginal lineal $C'(v) = 2kv$.

Integrando la función de coste marginal lineal $C'(v) = 2kv$ bajo la condición de contorno $C(0) = 0$ (votar cero veces cuesta cero):

$$C(v) = \int_{0}^{v} 2k \tau \, d\tau = k v^2$$

Normalizando la constante de escala a $k = 1$, queda demostrado formalmente que **$C(v) = v^2$ es la única función diferenciable que satisface simultáneamente simetría, convexidad estricta y proporcionalidad marginal exacta entre votos e intensidad.**

---

## 3. Teorema de Revelación de Preferencias

### 3.1 Inducción a la Revelación de la Verdadera Intensidad
En la Votación Cuadrática, el coste marginal creciente penaliza la exageración estratégica. Si un votante intentara exagerar su preferencia aumentando artificialmente sus votos de $v_i$ a $v_i + \Delta$, el coste adicional pagado crece de forma cuadrática:

$$\text{Costo Adicional} = (v_i + \Delta)^2 - v_i^2 = 2v_i \Delta + \Delta^2$$

Dado que el beneficio marginal de mover la probabilidad $p(V)$ se mantiene prácticamente constante en el margen, el incremento cuadrático del coste supera rápidamente cualquier ganancia marginal esperada. Por lo tanto, el punto donde se igualan beneficio marginal y coste marginal ($C'(v_i) = u_i \cdot p'$) obliga al agente a revelar honestamente su verdadera intensidad privada $u_i$.

### 3.2 Relación con los Mecanismos de Vickrey-Clarke-Groves (VCG)
El paradigma de VCG establece que para lograr la revelación óptima de verdades en decisiones sobre bienes públicos, cada individuo debe pagar un monto igual a la **externalidad negativa** que su presencia impone sobre el resto de la sociedad.

| Criterio | Mecanismo VCG Clásico | Votación Cuadrática (QV) |
| :--- | :--- | :--- |
| **Cálculo del Pago** | Pago exacto según la pérdida de utilidad impuesta al resto. | Pago cuadrático $v_i^2$ que aproxima la externalidad marginal esperada. |
| **Complejidad Computacional** | Alta (exige calcular subproblemas de optimización por cada agente). | Baja y descentralizada (cada agente evalúa solo su propio coste $v_i^2$). |
| **Eficiencia Asintótica** | Exacta en muestra finita $N$. | Converge asintóticamente a la eficiencia social a medida que $N \to \infty$. |

Glen Weyl y Eric Posner demostraron que la Votación Cuadrática actúa como una versión continua y descentralizada del mecanismo VCG: el coste $v_i^2$ refleja de manera óptima la probabilidad esperada de que el voto de $i$ altere el resultado multiplicado por la pérdida agregada sobre los demás participantes.

### 3.3 Condición de Equilibrio de Nash Bayesiano en QV
En un juego con información incompleta donde las valoraciones $u_i$ son variables aleatorias i.i.d. extraídas de una distribución $F(u)$, un perfil de estrategias $(v_1^*, v_2^*, \dots, v_N^*)$ constituye un **Equilibrio de Nash Bayesiano** si para cada agente $i$ y toda valoración $u_i$:

$$v_i^*(u_i) = \arg\max_{v_i} \left\{ \mathbb{E}_{\mathbf{u}_{-i}} \left[ u_i \cdot \mathbb{I}\left(v_i + \sum_{j \neq i} v_j^*(u_j) > 0\right) \right] - v_i^2 \right\}$$

En el equilibrio de Nash simétrico, la tasa esperada de pivotabilidad $p' = \mathbb{E}[p'(V)]$ es constante e idéntica para todos los agentes, asegurando un equilibrio lineal estable de la forma:

$$v_i^*(u_i) = \left(\frac{p'}{2}\right) u_i$$

---

## 4. Interpretación Estadística y Agregación

### 4.1 Fórmula para Calcular el Resultado Agregado
Dado un conjunto de votos emitidos $\{v_1, v_2, \dots, v_N\}$ y los costes asociados $C_i = v_i^2$:

* **Resultado Neto de Votos ($V_{\text{total}}$):**
  $$V_{\text{total}} = \sum_{i=1}^{N} v_i$$
* **Decisión Social Final ($X$):**
  $$X = \begin{cases} 1 & \text{si } V_{\text{total}} > 0 \\ 0 & \text{si } V_{\text{total}} \le 0 \end{cases}$$
* **Coste / Recaudación Total ($C_{\text{total}}$):**
  $$C_{\text{total}} = \sum_{i=1}^{N} v_i^2$$
* **Estimador de la Intensidad Media Ponderada ($\bar{u}_{\text{est}}$):**
  $$\bar{u}_{\text{est}} = \frac{1}{\alpha N} \sum_{i=1}^{N} v_i = \frac{\bar{v}}{\alpha}$$
  donde $\bar{v} = \frac{1}{N} \sum v_i$ es la media muestral de los votos emitidos y $\alpha = \frac{p'}{2}$.

### 4.2 Relación con la Regla de la Mayoría y Propiedades Asintóticas
Mientras que la regla de la mayoría ordinaria aproxima la **mediana** de las preferencias ignorando la magnitud de los valores, la Votación Cuadrática agrega linealmente las intensidades para estimar la **media poblacional** del bienestar.

**Propiedad Asintótica:** Conforme el número de votantes crece ($N \to \infty$), la probabilidad de tomar la decisión socialmente eficiente (aquella que maximiza $\sum u_i$) bajo QV tiende a $1$, cumpliendo la Ley de los Grandes Números sobre la distribución muestral de las intensidades reales.

### 4.3 Interpretación Estadística
Estadísticamente, el mecanismo de agregación en QV funciona como un estimador insesgado de la media del bienestar social. Cada voto $v_i$ actúa como una muestra ruidosa de la intensidad subyacente $u_i$. Al sumar los votos $V_{\text{total}}$, la varianza individual del ruido se reduce a un ritmo $O(1/\sqrt{N})$, permitiendo que la señal agregada $V_{\text{total}}$ responda con precisión al signo del verdadero promedio del bienestar cívico $\mathbb{E}[u]$.

---

## 5. Supuestos y Límites Matemáticos

### 5.1 Supuestos sobre la Distribución de Preferencias
La validez del Teorema de Revelación en QV requiere los siguientes supuestos teóricos:

* **Preferencias Cuasilineales:** La función de utilidad del agente debe ser separable aditivamente y lineal en dinero o tokens: $U_i(x, c_i) = u_i \cdot x - c_i$. Esto evita que los efectos de riqueza distorsionen la disposición marginal a pagar.
* **Valoraciones i.i.d.:** Se asume que las intensidades $u_i$ son independientes e idénticamente distribuidas con varianza finita.

### 5.2 Comportamiento bajo Preferencias No Lineales
Si los agentes presentan **aversión al riesgo** o utilidad marginal decreciente respecto a los tokens/riqueza (p. ej. utilidad logarítmica $U(w) = \ln w$), la tasa marginal de sustitución entre votos y dinero varía según el patrimonio del ciudadano. Un ciudadano con bajos recursos percibirá un coste de utilidad real mayor por cada token gastado que un ciudadano adinerado, distorsionando la relación $v_i \propto u_i$ e introduciendo un sesgo si no se provee una asignación equitativa y no transferible de tokens.

### 5.3 Condiciones de Equilibrio de Nash y sus Limitaciones
En entornos prácticos, el equilibrio de Nash teórico enfrenta tres limitaciones estructurales:

1. **Colusión (Carteles de Votantes):**
   Si $k$ agentes con idéntica preferencia $u$ coordinan sus votos para emitir un total de $V$ unidades, el coste para un solo votante aislado sería $V^2$. Si el grupo se reparte la compra asignando $v = V/k$ a cada miembro, el coste total del grupo se reduce a:
   $$\text{Costo Grupo} = k \cdot \left(\frac{V}{k}\right)^2 = \frac{V^2}{k}$$
   La colusión reduce el coste por un factor de $1/k$, distorsionando el peso de los bloques organizados.
2. **Ataques Sybil (Identidades Falsas Múltiples):**
   Es la consecuencia directa del problema de colusión: un único individuo que cree $k$ identidades falsas puede fragmentar su voto $V$ entre sus $k$ cuentas, pagando solo $V^2/k$. La prevención matemática de este ataque requiere mecanismos strictly estrictos de Identidad Digital Única o Proof of Personhood.
3. **Voto Estratégico e Información Asimétrica:**
   Si existe información perfecta sobre las intenciones del resto (ej. mediante encuestas precisas), votantes con intensidades bajas pueden hacer *free-riding* confiando en los votos ajenos, o inflar desproporcionadamente su gasto en escenarios con alta incertidumbre.

---

## 6. Integración en el Modelo LogoDemocracia

En el modelo de LogoDemocracia, la Votación Cuadrática constituye el motor matemático central para la agregación de preferencias en la asignación de presupuestos participativos, la priorización de la agenda legislativa en el Congreso Virtual y el balance ponderado entre las recomendaciones del Panel de Expertos y la voluntad cívica. Al reemplazar las votaciones binarias polarizantes por una medición precisa de la intensidad ciudadana, LogoDemocracia asegura decisiones que optimizan el bienestar colectivo.

Este documento contiene los fundamentos matemáticos completos. El Rey Filósofo (Tutor Cognitivo de IA) está diseñado para traducir estos conceptos a niveles de abstracción adecuados para cada ciudadano, utilizando ejemplos interactivos, simulaciones y preguntas guiadas. La experiencia de aprendizaje no requiere que el ciudadano memorice las demostraciones, sino que comprenda sus implicaciones prácticas.
