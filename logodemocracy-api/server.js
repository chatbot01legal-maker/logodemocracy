require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

// Importación de rutas
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const microtestRoutes = require('./src/routes/microtestRoutes');
const rfRoutes = require('./src/routes/rfRoutes');

// Configuración de Seguridad y Middlewares Globales
app.use(helmet());
app.use(cors({
  origin: '*', // Ajustar en producción al dominio de LogoDemocracy
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

// Conexión a Base de Datos
connectDB();

// Montaje de Rutas Core
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const microtestRoutes = require('./src/routes/microtestRoutes');
const rfRoutes = require('./src/routes/rfRoutes');
// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'LogoDemocracy Backend Core — Rey Filósofo MVP Fase 1',
    timestamp: new Date().toISOString()
  });
});

// Manejador Centralizado de Errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[LogoDemocracy API] Servidor ejecutándose en el puerto ${PORT}`);
});
