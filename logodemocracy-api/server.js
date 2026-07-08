require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const microtestRoutes = require('./src/routes/microtestRoutes');
const rfRoutes = require('./src/routes/rfRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

const app = express();

app.use(helmet());

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json({limit:'1mb'}));

connectDB();

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'LogoDemocracy Backend Core — Rey Filósofo MVP Fase 1',
    timestamp: new Date().toISOString()
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reyfilosofo/microtests', microtestRoutes);
app.use('/api/reyfilosofo', rfRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[LogoDemocracy API] Servidor ejecutándose en puerto ${PORT}`);
});
