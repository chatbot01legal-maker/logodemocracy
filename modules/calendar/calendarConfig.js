/**
 * CONFIGURACIÓN DE CALENDARIO - MOCK DE DESARROLLO
 * 
 * ⚠️  ATENCIÓN: Esta configuración es un mock para desarrollo.
 *     En producción, la disponibilidad real se obtendrá de Google Calendar API.
 *     Los feriados aquí listados son de ejemplo y deben reemplazarse por
 *     consultas a una fuente oficial de feriados chilenos.
 */

// Configuración de horarios laborales
const WORKING_HOURS = {
  start: 9,  // 9:00 AM
  end: 18,   // 6:00 PM
  breakStart: 13, // 1:00 PM
  breakEnd: 14,   // 2:00 PM
  slotDuration: 30 // minutos
};

// Feriados chilenos 2024 (ejemplo - datos simulados)
const HOLIDAYS_2024 = [
  '2024-01-01', // Año Nuevo
  '2024-03-29', // Viernes Santo
  '2024-05-01', // Día del Trabajo
  '2024-05-21', // Día de las Glorias Navales
  '2024-07-16', // Virgen del Carmen
  '2024-09-18', // Fiestas Patrias
  '2024-09-19', // Día de las Glorias del Ejército
  '2024-10-12', // Encuentro de Dos Mundos
  '2024-10-31', // Día de las Iglesias Evangélicas
  '2024-11-01', // Día de Todos los Santos
  '2024-12-25'  // Navidad
];

/**
 * Verifica si una fecha es feriado
 * @param {Date} date - Fecha a verificar
 * @returns {boolean}
 */
function isHoliday(date) {
  const dateStr = date.toISOString().split('T')[0];
  return HOLIDAYS_2024.includes(dateStr);
}

/**
 * Genera horarios disponibles para una fecha
 * @param {Date} date - Fecha
 * @returns {Array} Slots disponibles
 */
function getWorkingHours(date) {
  const slots = [];
  const dayOfWeek = date.getDay();
  
  // Solo días laborales (lunes a viernes)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
      // Saltar horario de almuerzo
      if (hour >= WORKING_HOURS.breakStart && hour < WORKING_HOURS.breakEnd) {
        continue;
      }
      
      // Formatear hora (HH:MM)
      const hourStr = hour.toString().padStart(2, '0');
      slots.push({
        hora: `${hourStr}:00`,
        disponible: true,
        calendarId: MOCK_MODE ? 'mock-calendar@abolegal.cl' : 'abogado1@abolegal.cl'
      });
    }
  }
  
  return slots;
}

module.exports = {
  WORKING_HOURS,
  HOLIDAYS_2024,
  isHoliday,
  getWorkingHours
};
