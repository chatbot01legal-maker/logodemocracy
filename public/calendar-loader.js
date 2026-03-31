async function loadAvailability() {
    console.log("🚀 [Loader] Sincronizando con app.js...");
    try {
        const response = await fetch('/api/availability');
        const data = await response.json();
        if (data.success && data.fechas) {
            window.availabilityData = data.fechas;
            renderDates();
        }
    } catch (e) {
        console.error("❌ Error al cargar disponibilidad:", e);
    }
}

function renderDates() {
    const container = document.getElementById('dateOptions');
    if (!container) return;
    container.innerHTML = ''; 

    window.availabilityData.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'date-option'; 
        btn.type = "button";
        const [y, m, d] = item.fecha.split('-');
        btn.innerText = new Date(y, m-1, d).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' });
        
        btn.onclick = () => {
            // USAMOS LAS VARIABLES DE APP.JS
            window.selectedDate = item.fecha;
            document.querySelectorAll('.date-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Renderizamos horas y disparamos la UI original de app.js
            renderTimes(item.slots);
            if (typeof window.updateSelectedDateTime === 'function') {
                window.updateSelectedDateTime();
            }
        };
        container.appendChild(btn);
    });
}

function renderTimes(slots) {
    const container = document.getElementById('timeSlots');
    if (!container) return;
    container.innerHTML = '';

    slots.forEach(time => {
        const btn = document.createElement('button');
        btn.className = 'time-slot';
        btn.type = "button";
        btn.innerText = time;
        btn.onclick = () => {
            // USAMOS LAS VARIABLES DE APP.JS
            window.selectedTime = time;
            document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Sincronizamos con app.js
            if (typeof window.updateSelectedDateTime === 'function') {
                window.updateSelectedDateTime();
            }
            
            // Habilitar botón de reserva si existe
            const reserveBtn = document.getElementById('confirm-appointment') || document.querySelector('.booking-form button');
            if (reserveBtn) reserveBtn.disabled = false;
        };
        container.appendChild(btn);
    });
}

// Iniciar carga
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAvailability);
} else {
    loadAvailability();
}
