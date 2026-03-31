// modules/organizador.js - VERSIÓN 3.0-PIPELINE-COMPATIBLE + 4.7.1
const { createCalendarEvent, listEvents } = require("./calendar/googleCalendar");

console.log('✅ [ORGANIZADOR 3.0] Pipeline-compatible - Slots reales');

class OrganizadorFSM {
  constructor() {
    console.log('✅ Organizador FSM iniciado');
  }

  // ==================== MÉTODOS NUEVOS PARA PIPELINE ====================

  async getRawSlots(daysAhead = 14) {
    console.log(`📅 [ORGANIZADOR] Obteniendo slots reales (${daysAhead} días)`);
    try {
      const now = new Date();
      const timeMin = now.toISOString();
      const timeMax = new Date();
      timeMax.setDate(now.getDate() + daysAhead);
      timeMax.setHours(23, 59, 59, 999);

      const events = await listEvents(timeMin, timeMax.toISOString());
      const potentialSlots = this.generatePotentialSlots(now, daysAhead, events);
      const availableSlots = this.filterAvailableSlots(potentialSlots, events);

      return availableSlots.slice(0, 20);
    } catch (error) {
      console.error('❌ [ORGANIZADOR] Error slots reales:', error);
      return this.generateFallbackSlots();
    }
  }

  startBookingWithSlots(session, slots) {
    session.availableSlots = slots;

    if (session.userEmail) {
      session.organizerState = 'awaiting_selection';
      return {
        handled: true,
        response: this.formatSlotsResponse(session.userEmail, session.availableSlots),
        organizer_state: 'awaiting_selection'
      };
    }

    session.organizerState = 'awaiting_email';
    return {
      handled: true,
      response: 'Para agendar la videollamada necesito tu correo electrónico.',
      organizer_state: 'awaiting_email'
    };
  }

  updateAvailableSlots(session, slots) {
    if (session.organizerState !== 'awaiting_selection') return null;
    session.availableSlots = slots;
    return {
      handled: true,
      response: this.formatSlotsResponse(session.userEmail, session.availableSlots),
      organizer_state: 'awaiting_selection'
    };
  }

  // ==================== ADAPTADORES FSM (FIX CRÍTICO) ====================

  async awaitEmail(session, message) {
    return this.handleAwaitingEmail(message, session);
  }

  async awaitSelection(session, message) {
    return this.handleAwaitingSelection(message, session, {});
  }

  async awaitName(session, message) {
    // No se usa actualmente, pero se deja para contrato FSM completo
    return {
      handled: true,
      response: '¿Podrías indicarme tu nombre, por favor?',
      organizer_state: session.organizerState
    };
  }

  async confirm(session) {
    return {
      handled: true,
      response: 'Tu cita ya fue confirmada.',
      organizer_state: 'confirmed'
    };
  }

  // ==================== LÓGICA EXISTENTE (NO TOCADA) ====================

  async handleAwaitingEmail(message, session) {
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (!emailMatch) {
      return {
        handled: true,
        response: 'Por favor, indícame un correo válido.',
        organizer_state: 'awaiting_email'
      };
    }

    session.userEmail = emailMatch[0];
    session.organizerState = 'awaiting_selection';
    session.availableSlots = await this.generateAvailableSlots();

    return {
      handled: true,
      response: this.formatSlotsResponse(session.userEmail, session.availableSlots),
      organizer_state: 'awaiting_selection'
    };
  }

  async handleAwaitingSelection(message, session) {
    const match = message.match(/(\d+)/);
    if (!match) {
      return {
        handled: true,
        response: `Por favor elige un número válido.`,
        organizer_state: 'awaiting_selection'
      };
    }

    const index = parseInt(match[1], 10) - 1;
    const slot = session.availableSlots?.[index];

    if (!slot) {
      return {
        handled: true,
        response: 'Selección inválida.',
        organizer_state: 'awaiting_selection'
      };
    }

    const result = await createCalendarEvent(
      { start_iso: slot.start_iso, end_iso: slot.end_iso },
      session._id
    );

    session.organizerState = 'confirmed';

    return {
      handled: true,
      response: `🎉 Cita confirmada.\n📅 ${slot.formatted}\n🔗 ${result.meetLink}`,
      organizer_state: 'confirmed'
    };
  }

  // ==================== SLOT HELPERS ====================

  generateFallbackSlots() {
    return this.generateDefaultSlots();
  }

  generateAvailableSlots() {
    return this.generateDefaultSlots();
  }

  generateDefaultSlots() {
    const slots = [];
    const now = new Date();
    const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

    for (let i = 1; i <= 3; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      d.setHours(10, 0, 0, 0);
      slots.push({
        formatted: `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]} a las 10:00`,
        start_iso: d.toISOString(),
        end_iso: new Date(d.getTime() + 3600000).toISOString()
      });
    }
    return slots;
  }

  formatSlotsResponse(email, slots) {
    const list = slots.map((s, i) => `${i + 1}. ${s.formatted}`).join('\n');
    return `Perfecto ${email}, elige un horario:\n\n${list}`;
  }
}

module.exports = new OrganizadorFSM();
