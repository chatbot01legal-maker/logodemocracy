const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const DAILY_LIMIT_USD = Number(process.env.AI_DAILY_LIMIT_USD || "8");

if (!uri) {
  console.error("ERROR: MONGODB_URI no está definida.");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db();

    const now = new Date();

    const start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const result = await database
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

            usedUsd: {
              $sum: {
                $convert: {
                  input: "$estimatedCostUsd",
                  to: "double",
                  onError: 0,
                  onNull: 0
                }
              }
            },

            totalTokens: {
              $sum: {
                $convert: {
                  input: "$totalTokens",
                  to: "long",
                  onError: 0,
                  onNull: 0
                }
              }
            },

            inputTokens: {
              $sum: {
                $convert: {
                  input: {
                    $ifNull: ["$inputTokens", "$promptTokens"]
                  },
                  to: "long",
                  onError: 0,
                  onNull: 0
                }
              }
            },

            outputTokens: {
              $sum: {
                $convert: {
                  input: "$outputTokens",
                  to: "long",
                  onError: 0,
                  onNull: 0
                }
              }
            },

            calls: {
              $sum: 1
            }
          }
        }
      ])
      .toArray();

    const data = result[0] || {};

    const usedUsd = Number(data.usedUsd || 0);
    const remainingUsd = Math.max(
      0,
      DAILY_LIMIT_USD - usedUsd
    );

    const percentageUsed =
      DAILY_LIMIT_USD > 0
        ? (usedUsd / DAILY_LIMIT_USD) * 100
        : 0;

    console.log(
      JSON.stringify({
        date: start.toISOString().slice(0, 10),
        limitUsd: DAILY_LIMIT_USD,
        usedUsd,
        remainingUsd,
        percentageUsed,
        blocked: usedUsd >= DAILY_LIMIT_USD,
        calls: Number(data.calls || 0),
        totalTokens: Number(data.totalTokens || 0),
        inputTokens: Number(data.inputTokens || 0),
        outputTokens: Number(data.outputTokens || 0)
      })
    );

  } finally {
    await client.close();
  }
}

main().catch(error => {
  console.error("ERROR:", error.message);
  process.exit(1);
});
