const mongoose = require("mongoose");

let connectionPromise = null;

async function connectMongoServerless() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada");
  }

  connectionPromise = mongoose
    .connect(uri)
    .then((connection) => {
      console.log(
        `[MongoDB] Conexión serverless establecida: ${connection.connection.host}`
      );

      return connection.connection;
    })
    .catch((error) => {
      connectionPromise = null;

      console.error(
        `[MongoDB Error] Fallo de conexión serverless: ${error.message}`
      );

      throw error;
    });

  return connectionPromise;
}

async function mongooseServerless(req, res, next) {
  try {
    await connectMongoServerless();
    next();
  } catch (error) {
    return res.status(503).json({
      error: "Base de datos no disponible"
    });
  }
}

module.exports = {
  connectMongoServerless,
  mongooseServerless
};
