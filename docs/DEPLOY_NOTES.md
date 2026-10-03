# Notas de Deploy — Rey Filósofo

## Vercel sirve desde `public/`, no desde `assets/`

**Hallazgo (2026-10-03):** El proyecto está configurado para que Vercel sirva
los archivos estáticos desde `public/`. Los cambios realizados en `assets/` o
`pages/` **no llegan a producción** salvo que se copien manualmente a
`public/assets/` y `public/pages/`.

`vercel.json` no especifica `outputDirectory`. El `.vercel/project.json` declara
`framework: "express"`. Express sirve con `app.use(express.static(__dirname))`,
pero la capa estática de Vercel intercepta las requests antes y sirve `public/`.

### Rutina de deploy obligatoria

Después de cualquier cambio en frontend:

    cp assets/js/rey-filosofo.v1.1.0.js public/assets/js/rey-filosofo.js
    cp assets/js/rey-filosofo.v1.1.0.js public/assets/js/rey-filosofo.v1.1.0.js
    cp pages/rey-filosofo.html public/pages/rey-filosofo.html
    cp assets/js/platform/services/LearningProfileService.js public/assets/js/platform/services/LearningProfileService.js

    vercel --prod --force
    vercel cache purge --type=cdn --yes

### Por qué `vercel --prod` sin `--force` no siempre funciona

El CLI cachea archivos por checksum. Si el archivo local es igual al anterior,
no lo re-sube. `--force` fuerza la subida.

### Por qué a veces hay que renombrar

Si el CDN sirve una versión vieja y `vercel cache purge` no la invalida,
la solución es renombrar el archivo. Ejemplo:

- Antes: `assets/js/rey-filosofo.js`
- Después: `assets/js/rey-filosofo.v1.1.0.js`

URL nueva = entrada nueva en el CDN = sirve desde el origen.

---

## Fix del `test.compute` en `finishTest()`

**Problema:** Cuando un Microtest no tiene el método `compute()` (como Brújula
tras la alineación con el catálogo canónico), la línea:

    const variables = test.compute(this.answers) || {};

lanza un `TypeError` que congela la pantalla en la última pregunta.

**Solución aplicada (línea 1140 de `rey-filosofo.v1.1.0.js`):**

    const variables = (typeof test.compute === 'function' ? test.compute(this.answers) : {}) || {};

Se aplica a cualquier Microtest que no implemente `compute()`. No afecta a los
que sí lo tienen.

---

## Aprendizajes para MT2–MT12

1. Vercel sirve `public/`. Sin la sincronización, los cambios no llegan a
   producción.
2. `vercel cache purge` no siempre invalida. A veces hay que renombrar.
3. Los métodos `compute()` en el frontend son opcionales. El backend recalcula
   todo desde `attempt.evidence` con `brujulaEngine.buildProfile()`.
4. Los intentos históricos conservan su `phase` original (Contrato General §16).
   No se migran automáticamente.
5. La Deployment Protection de Vercel bloquea `curl` a URLs de deploy específico.
   Verificar siempre contra el alias `logodemocracy.tech`.

