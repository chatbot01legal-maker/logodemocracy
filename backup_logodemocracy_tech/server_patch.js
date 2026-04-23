// Busca tu app.get("/api/availability", ...) y asegúrate de que incluya estos headers:

app.get("/api/availability", async (req, res) => {
    // FORZAR ANTI-CACHE
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });

    try {
        console.log("[AVAILABILITY] 🔍 Consultando disponibilidad real");
        const slots = await availabilityService.getAvailableSlots({
            daysAhead: 28,
            durationMinutes: 60
        });

        // ... resto de tu lógica de mapeo ...
