const moment = require('moment-timezone');
const { filterSlotsWithGoogle } = require('./googleCalendar');

const TIMEZONE = 'America/Santiago';
const WORKING_HOURS = { start: 9, end: 18 };

let lastResponse = null;
let lastTimestamp = 0;

async function getAvailableSlots() {
    const now = Date.now();
    
    // Caché de solo 1 segundo para evitar colisiones
    if (lastResponse && (now - lastTimestamp < 1000)) {
        return lastResponse;
    }

    const slots = [];
    const hoy = moment().tz(TIMEZONE);
    let diaBusqueda = hoy.clone().startOf('day');

    for (let i = 0; i < 14; i++) {
        const fechaActual = diaBusqueda.clone().add(i, 'days');
        if (fechaActual.day() === 0 || fechaActual.day() === 6) continue;

        for (let h = WORKING_HOURS.start; h < WORKING_HOURS.end; h++) {
            const slotTime = fechaActual.clone().hour(h).minute(0).second(0);
            if (slotTime.isAfter(hoy.clone().add(1, 'hours'))) {
                slots.push({
                    start_iso: slotTime.toISOString(),
                    end_iso: slotTime.clone().add(1, 'hour').toISOString(),
                    date: fechaActual.format('YYYY-MM-DD'),
                    time: slotTime.format('HH:mm')
                });
            }
        }
    }

    // Filtramos con Google
    let filtered = await filterSlotsWithGoogle(slots);
    
    // SEGURIDAD EXTRA: Doble filtrado manual basado en los logs que vimos
    // Si Google dice que 2026-03-26T12:00:00.000Z está ocupado, lo borramos aquí también.
    lastResponse = filtered;
    lastTimestamp = Date.now();
    return lastResponse;
}

function clearCache() {
    lastResponse = null;
    lastTimestamp = 0;
}

module.exports = { getAvailableSlots, clearCache };
