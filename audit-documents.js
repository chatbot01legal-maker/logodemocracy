const fs = require('fs');
const path = require('path');

// VERSIÓN ACTUAL DEL PROTOCOLO SOPHIA
// (Incrementa este número cuando cambies las reglas/prompts de SOPHIA para reevaluar todo)
const SOPHIA_PROTOCOL_VERSION = "4.0";

const CONTENT_DIR = path.join(__dirname, 'pages/academy/content');
const CACHE_DIR = path.join(__dirname, 'cache/sophia'); // Ajusta la ruta a tu carpeta de caché si es distinta

// Asegurar que existe la carpeta de caché
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

async function auditAllDocuments() {
  console.log(`\n🔍 Iniciando auditoría incremental SOPHIA (Versión del protocolo: v${SOPHIA_PROTOCOL_VERSION})...\n`);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ No se encontró la carpeta de contenido en: ${CONTENT_DIR}`);
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  let processedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const cacheFilePath = path.join(CACHE_DIR, `${file}.json`);
    let needsEvaluation = true;

    // Verificar si existe en caché
    if (fs.existsSync(cacheFilePath)) {
      try {
        const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
        // Si ya existe y la versión coincide, se omite
        if (cachedData.protocol_version === SOPHIA_PROTOCOL_VERSION) {
          needsEvaluation = false;
        }
      } catch (e) {
        needsEvaluation = true;
      }
    }

    if (!needsEvaluation) {
      console.log(`⏩ [OMITIDO - CACHÉ VÁLIDA] ${file}`);
      skippedCount++;
      continue;
    }

    // Si requiere evaluación:
    console.log(`⚡ [EVALUANDO TOKEN DE IA] ${file}...`);
    const textContent = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');

    try {
      // AQUÍ SE CONECTA CON TU LÓGICA / BACKEND DE EVALUACIÓN
      // Simulamos la estructura guardada con la versión de protocolo asignada:
      const evaluationResult = {
        docId: file,
        protocol_version: SOPHIA_PROTOCOL_VERSION,
        evaluated_at: new Date().toISOString(),
        IRD_global: 85, // Ejemplo
        riesgo: "Bajo"
      };

      fs.writeFileSync(cacheFilePath, JSON.stringify(evaluationResult, null, 2));
      console.log(`✅ [GUARDADO EN CACHÉ] ${file}`);
      processedCount++;
    } catch (err) {
      console.error(`❌ Error evaluando ${file}:`, err.message);
    }
  }

  console.log(`\n🎉 Auditoría finalizada.`);
  console.log(`    Documentos evaluados con IA: ${processedCount}`);
  console.log(`    Documentos reutilizados desde caché: ${skippedCount}\n`);
}

auditAllDocuments();
