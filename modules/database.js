const {
  MongoClient
} = require("mongodb");

const uri =
  process.env.MONGODB_URI;

let db;

/* ============================================================
   CONEXIÓN EXISTENTE
   ============================================================ */

async function connect() {
  if (db)
    return db;

  const client =
    new MongoClient(uri);

  await client.connect();

  db =
    client.db();

  return db;
}

/* ============================================================
   USERS — CONTRATO EXISTENTE
   ============================================================ */

async function saveUser(user) {
  const database =
    await connect();

  return database
    .collection("users")
    .insertOne(user);
}

async function getUser(email) {
  const database =
    await connect();

  return database
    .collection("users")
    .findOne({
      email
    });
}

/* ============================================================
   AI USAGE — NUEVO
   ============================================================ */

/**
 * Guarda una llamada real a Gemini.
 *
 * Colección:
 *   ai_usage
 */
async function saveAIUsage(record) {
  const database =
    await connect();

  return database
    .collection("ai_usage")
    .insertOne(record);
}

/**
 * Obtiene el consumo acumulado del día.
 *
 * Por defecto utiliza la fecha actual.
 *
 * El agrupamiento se realiza por timestamp UTC.
 */
async function getDailyAIUsage(
  date = new Date()
) {
  const database =
    await connect();

  const start =
    new Date(date);

  start.setUTCHours(
    0,
    0,
    0,
    0
  );

  const end =
    new Date(start);

  end.setUTCDate(
    end.getUTCDate() + 1
  );

  const result =
    await database
      .collection("ai_usage")
      .aggregate([
        {
          $match: {
            timestamp: {
              $gte: start,
              $lt: end
            }
          }
        },

        {
          $group: {
            _id: null,

            totalCostUsd: {
              $sum:
                "$estimatedCostUsd"
            },

            totalTokens: {
              $sum:
                "$totalTokens"
            },

            calls: {
              $sum: 1
            }
          }
        }
      ])
      .toArray();

  const data =
    result[0] || {};

  return {
    date:
      start
        .toISOString()
        .slice(0, 10),

    totalCostUsd:
      Number(
        data.totalCostUsd || 0
      ),

    totalTokens:
      Number(
        data.totalTokens || 0
      ),

    calls:
      Number(
        data.calls || 0
      )
  };
}

/* ============================================================
   EXPORTS
   ============================================================ */

module.exports = {
  connect,

  // Contrato existente
  saveUser,
  getUser,

  // Nuevo sistema de límite diario
  saveAIUsage,
  getDailyAIUsage
};
