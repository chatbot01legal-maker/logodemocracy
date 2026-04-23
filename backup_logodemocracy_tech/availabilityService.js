const moment = require('moment-timezone');
const { filterSlotsWithGoogle } = require('./googleCalendar');

// Configuración
const TIMEZONE = 'America/Santiago';
const WORKING_HOURS = { start: 9, end: 18 };
const SLOT_DURATION = 60;
const DAYS_AHEAD = 28;

// --- LÓGICA DE CONTROL (EL PORTERO) ---
let cache = { data: null, timestamp: 0 };
let pendingRequest = null;
const CACHE_DURATION = 15000; // 15 segundos de memoria
// --------------------------------------

async function getAvailableSlots(options = {}) {
    const nowTimestamp = Date.now();

    // 1. Si ya hay una consulta igual en marcha, nos unimos a ella en lugar de crear otra
    if (pendingRequest) {
        console.log("⏳ [LOCK] Consulta en curso detectada. Esperando resultado único...");
        return pendingRequest;
    }

    // 2. Si tenemos una respuesta reciente en memoria, la entregamos de inmediato
    if (cache.data && (nowTimestamp - cache.timestamp) < CACHE_DURATION) {
        console.log("♻️ [CACHE] Entregando disponibilidad guardada para evitar doble carga");
        return cache.data;
    }

    // 3. Si no, creamos la consulta y bloqueamos el paso a otras
    pendingRequest = (async () => {
        console.log("🚨 AVAILABILITY SERVICE EJECUTADO 🚨");
        try {
            const daysAhead = options.daysAhead || DAYS_AHEAD;
            const durationMinutes = options.durationMinutes || SLOT_DURATION;

            const slots = [];
            const now = moment().tz(TIMEZONE);
            let startDate = now.clone();

            if (now.hour() >= WORKING_HOURS.end) {
                startDate.add(1, 'day').startOf('day');
            } else {
                startDate.startOf('day');
            }

            for (let i = 0; i < daysAhead; i++) {
                const currentDate = startDate.clone().add(i, 'days');
                if (currentDate.day() === 0 || currentDate.day() === 6) continue;

                for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
                    const slotTime = currentDate.clone().hour(hour).minute(0).second(0);
                    if (slotTime.isAfter(now)) {
                        const endTime = slotTime.clone().add(durationMinutes, 'minutes');
                        slots.push({
                            start_iso: slotTime.toISOString(),
                            end_iso: endTime.toISOString(),
                            date: currentDate.format('YYYY-MM-DD'),
                            time: slotTime.format('HH:mm'),
                            datetime: slotTime.toISOString(),
                            duration: durationMinutes
                        });
                    }
                }
            }

            console.log(`📦 SLOTS LOCALES: ${slots.length}. Filtrando con Google...`);
            const availableSlots = await filterSlotsWithGoogle(slots);
            const finalResult = availableSlots.slice(0, 18);

            // Guardamos en memoria y actualizamos tiempo
            cache = { data: finalResult, timestamp: Date.now() };
            return finalResult;

        } catch (error) {
            console.error('[AVAILABILITY] ❌ Error crítico:', error);
            return generateFallbackSlots();
        } finally {
            // Liberamos el portero para futuras consultas
            pendingRequest = null;
        }
    })();

    return pendingRequest;
}

function generateFallbackSlots() {
    console.log("⚠️ ACTIVANDO PLAN B (Fallback)");
    const slots = [];
    const now = moment().tz(TIMEZONE);
    const startDate = now.clone().add(1, 'day').startOf('day');

    for (let i = 0; i < 7; i++) {
        const currentDate = startDate.clone().add(i, 'days');
        if (currentDate.day() === 0 || currentDate.day() === 6) continue;
        for (let hour of [9, 11, 15]) {
            const slotTime = currentDate.clone().hour(hour).minute(0).second(0);
            if (slotTime.isAfter(now)) {
                slots.push({
                    start_iso: slotTime.toISOString(),
                    end_iso: slotTime.clone().add(60, 'minutes').toISOString(),
                    date: currentDate.format('YYYY-MM-DD'),
                    time: slotTime.format('HH:mm'),
                    datetime: slotTime.toISOString(),
                    duration: 60
                });
            }
        }
    }
    return slots;
}

module.exports = {
    getAvailableSlots,
    timeZone: TIMEZONE
};
