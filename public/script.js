// VERSIÓN NUCLEAR_2026_2 - 2026-02-06
// ================================================
// FASE 2.3 FRONTEND - RESERVA REAL CON BACKEND
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('[FASE 2.3 FRONTEND] Inicializando sistema de reserva real...');

    const bookingForm = document.getElementById('bookingForm');

    if (!bookingForm) {
        console.warn('[FASE 2.3 FRONTEND] ❌ No se encontró el formulario bookingForm');
        return;
    }

    console.log('[FASE 2.3 FRONTEND] ✅ Formulario bookingForm encontrado');

    let sessionId = window.sessionId || 'abolegal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    window.sessionId = sessionId;

    bookingForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('[FASE 2.3 FRONTEND] ✅ Submit interceptado - Iniciando reserva real');

        if (!window.selectedDate || !window.selectedTime) {
            showErrorAlert('Por favor, selecciona una fecha y una hora para agendar la videollamada.');
            return;
        }

        const clientName = document.getElementById('clientName').value.trim();
        const clientEmail = document.getElementById('clientEmail').value.trim();
        const clientPhone = document.getElementById('clientPhone').value.trim();
        const clientTopic = document.getElementById('clientTopic').value.trim();

        if (!clientName || !clientEmail) {
            showErrorAlert('Por favor, completa tu nombre y correo electrónico.');
            return;
        }

        if (!isValidEmail(clientEmail)) {
            showErrorAlert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        const [year, month, day] = window.selectedDate.split('-').map(Number);
        const formattedDate = new Date(year, month - 1, day).toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const submitBtn = bookingForm.querySelector('.btn-book');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando reserva...';
        submitBtn.disabled = true;

        // 🔥 FIX AQUÍ
        const bookingData = {
            sessionId: sessionId,
            clientName: clientName,
            clientEmail: clientEmail,
            appointmentDate: window.selectedDate,
            appointmentTime: window.selectedTime,
            clientPhone: clientPhone || '',
            comments: clientTopic || '',       // ✅ NUEVO
            caseSummary: clientTopic || ''     // ✅ COMPATIBILIDAD
        };

        console.log('[FASE 2.3 FRONTEND] 📤 Enviando datos al backend:', bookingData);

        try {
            const response = await fetch('/api/calendar/create-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error en la reserva');
            }

            if (!result.success) {
                throw new Error(result.error || 'La reserva no pudo ser procesada');
            }

            console.log('[FASE 2.3 FRONTEND] ✅ Reserva exitosa:', result);

            const meetLink = result.data?.meetLink || result.meetLink;
            const eventId = result.data?.eventId || result.eventId;

            if (!meetLink) {
                console.warn('[FASE 2.3 FRONTEND] ⚠️ No se recibió meetLink en la respuesta');
            }

            showConfirmationModal({
                date: formattedDate,
                time: window.selectedTime,
                clientName: clientName,
                clientEmail: clientEmail,
                meetLink: meetLink,
                eventId: eventId,
                hasRealMeetLink: !!meetLink && (meetLink.includes('meet.google.com') || meetLink.includes('hangouts.google.com'))
            });

        } catch (error) {
            console.error('[FASE 2.3 FRONTEND] ❌ Error en reserva:', error);

            let errorMessage = 'Hubo un error al procesar tu reserva. ';

            if (error.message.includes('credenciales') || error.message.includes('credentials')) {
                errorMessage += 'El sistema de agendamiento está en mantenimiento. Por favor, intenta más tarde.';
            } else if (error.message.includes('Google Calendar')) {
                errorMessage += 'No se pudo crear el evento en el calendario.';
            } else if (error.message.includes('timezone') || error.message.includes('zona horaria')) {
                errorMessage += 'Error en la configuración de zona horaria.';
            } else {
                errorMessage += 'Por favor, verifica tus datos e intenta nuevamente.';
            }

            showErrorAlert(errorMessage);

            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
        }
    });

    console.log('[FASE 2.3 FRONTEND] ✅ Sistema de reserva configurado correctamente');
});

// ================= FUNCIONES AUXILIARES =================

function showConfirmationModal(bookingDetails) {
    const existingModal = document.getElementById('bookingConfirmationModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'bookingConfirmationModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        text-align: center;
    `;

    modalContent.innerHTML = `
        <h3>¡Videollamada Agendada!</h3>
        <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
        <p><strong>Hora:</strong> ${bookingDetails.time}</p>
        <p><strong>Cliente:</strong> ${bookingDetails.clientName}</p>
        <p><strong>Email:</strong> ${bookingDetails.clientEmail}</p>
        <button id="closeModalBtn">Cerrar</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

function showErrorAlert(message) {
    alert(message);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
