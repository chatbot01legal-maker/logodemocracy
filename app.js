const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// Servir todo el proyecto como archivos estáticos
app.use(express.static(__dirname));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
