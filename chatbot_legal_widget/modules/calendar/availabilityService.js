// modules/calendar/availabilityService.js
// Servicio de disponibilidad básico - mantener compatibilidad

async function getAvailability(block = 1, excludeDates = []) {
  console.log(`[AVAILABILITY SERVICE] Bloque ${block}, excluir: ${excludeDates}`);

  // Generar fechas de ejemplo para compatibilidad
  const now = new Date();
  const fechas = [];
  
  for (let i = 1; i <= 5; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!excludeDates.includes(dateStr)) {
      fechas.push({
        fecha: dateStr,
        formato: date.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })
      });
    }
  }

  return {
    fechas: fechas.slice(0, 4),
    bloque: block,
    hasMore: fechas.length > 4
  };
}

module.exports = { getAvailability };
