// EJEMPLO - AJUSTA A TU RUTA REAL

app.get("/availability", async (req, res) => {
  try {
    // 🚫 ANTI CACHE TOTAL
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store"
    });

    const slots = await getAvailableSlots();

    res.json(slots);

  } catch (error) {
    console.error("❌ ERROR API:", error.message);

    res.status(500).json({
      error: "No se pudo obtener disponibilidad real"
    });
  }
});
