const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require("dotenv").config();

const { connect } = require("./modules/database");
const { evaluate } = require("./modules/sophiaEvaluationPipeline");

const PROTOCOL = { version: "4.0" };
const CONTENT_DIR = path.join(__dirname, 'pages/academy/content');

async function auditAllDocuments() {
  console.log(`\n🔍 Iniciando auditoría incremental SOPHIA en MongoDB (Protocolo: v${PROTOCOL.version})...\n`);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ No se encontró la carpeta de contenido en: ${CONTENT_DIR}`);
    process.exit(1);
  }

  let db;
  try {
    db = await connect();
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  let processedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const textContent = fs.readFileSync(filePath, 'utf8');
    const contentHash = crypto.createHash("sha256").update(textContent).digest("hex");

    // Verificar presencia en la colección de caché de MongoDB
    const cached = await db.collection("sophia_document_cache").findOne({
      docId: file,
      content_hash: contentHash,
      protocol_version: PROTOCOL.version
    });

    if (cached) {
      console.log(`⏩ [CACHE HIT - OMITIDO] ${file}`);
      skippedCount++;
      continue;
    }

    // Si el documento es nuevo o cambió su contenido/protocolo:
    console.log(`⚡ [EVALUANDO CON IA] ${file}...`);
    try {
      const report = await evaluate({ text: textContent });

      await db.collection("sophia_document_cache").updateOne(
        { docId: file },
        {
          $set: {
            docId: file,
            content_hash: contentHash,
            protocol_version: PROTOCOL.version,
            result: report,
            evaluated_at: new Date()
          }
        },
        { upsert: true }
      );

      console.log(`✅ [GUARDADO EN MONGODB] ${file}`);
      processedCount++;
    } catch (err) {
      console.error(`❌ Error evaluando ${file}:`, err.message);
    }
  }

  console.log(`\n🎉 Auditoría finalizada.`);
  console.log(`    Documentos evaluados e indexados en MongoDB: ${processedCount}`);
  console.log(`    Documentos reutilizados desde caché: ${skippedCount}\n`);

  process.exit(0);
}

auditAllDocuments();
