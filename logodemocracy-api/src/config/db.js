const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Sincronizado con Atlas: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Fallo de conexión: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
