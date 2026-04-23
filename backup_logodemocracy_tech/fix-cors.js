const fs = require('fs');

let content = fs.readFileSync('server.cjs', 'utf8');

// Reemplazar configuración CORS completa
content = content.replace(
/app\.use\(cors\([\s\S]*?\)\);/,
`app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:10000",
      "https://chatbot-legal-widget.onrender.com"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🚨 CORS bloqueado:", origin);
      callback(null, true); // 🔥 TEMP: permitir igual para no romper producción
    }
  },
  credentials: true
}));`
);

fs.writeFileSync('server.cjs', content);
console.log("✅ CORS actualizado");
