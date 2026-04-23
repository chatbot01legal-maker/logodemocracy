// MÉTODOS A AÑADIR AL ORGANIZADOR EXISTENTE (v3.0)

class OrganizadorFSM {
  // ... código existente ...

  /**
   * Inicia proceso de agendamiento con contexto semántico
   * @param {Object} session - Sesión actual
   * @param {Object} semanticContext - Contexto semántico del Analyzer
   * @returns {Object} Respuesta del Organizador
   */
  async startBooking(session, semanticContext) {
    console.log(`🚀 [ORGANIZADOR] Iniciando con contexto semántico`);
    
    // 1. USAR DATOS DEL CONTEXTO SEMÁNTICO
    if (semanticContext.extracted_data.email) {
      session.userEmail = semanticContext.extracted_data.email;
      console.log(`📧 [ORGANIZADOR] Email del contexto: ${session.userEmail}`);
    }
    
    // 2. OBTENER SLOTS SEGÚN PREFERENCIAS
    const slots = await this.getSlotsByPreference(semanticContext.extracted_data.time_preferences);
    session.availableSlots = slots;
    
    // 3. DECIDIR ESTADO INICIAL BASADO EN DATOS DISPONIBLES
    if (session.userEmail) {
      session.organizerState = 'awaiting_selection';
      return {
        handled: true,
        response: this.formatSlotsResponse(session.userEmail, session.availableSlots),
        organizer_state: 'awaiting_selection'
      };
    } else {
      session.organizerState = 'awaiting_email';
      return {
        handled: true,
        response: 'Para agendar la videollamada necesito tu correo electrónico.',
        organizer_state: 'awaiting_email'
      };
    }
  }

  /**
   * Continúa proceso de agendamiento con contexto actualizado
   * @param {Object} session - Sesión actual
   * @param {Object} semanticContext - Contexto semántico actualizado
   * @returns {Object} Respuesta del Organizador
   */
  async continueBooking(session, semanticContext) {
    console.log(`🔄 [ORGANIZADOR] Continuando agendamiento`);
    
    // 1. ACTUALIZAR DATOS DEL CONTEXTO
    if (semanticContext.extracted_data.email && !session.userEmail) {
      session.userEmail = semanticContext.extracted_data.email;
      console.log(`📧 [ORGANIZADOR] Email actualizado: ${session.userEmail}`);
    }
    
    // 2. MANEJAR SEGÚN ESTADO ACTUAL
    switch (session.organizerState) {
      case 'awaiting_email':
        return this.handleAwaitingEmailWithContext(session, semanticContext);
      case 'awaiting_selection':
        return this.handleAwaitingSelectionWithContext(session, semanticContext);
      default:
        return this.handleByState(session.lastMessage, session, semanticContext);
    }
  }

  /**
   * Obtiene slots filtrados por preferencias semánticas
   * @param {Object} timePreferences - Preferencias temporales del contexto
   * @returns {Array} Slots filtrados
   */
  async getSlotsByPreference(timePreferences) {
    console.log(`🎯 [ORGANIZADOR] Obteniendo slots con preferencias:`, timePreferences);
    
    // 1. OBTENER SLOTS REALES
    const rawSlots = await this.getRawSlots(14);
    
    // 2. FILTRAR SEGÚN PREFERENCIAS (INTERNAMENTE)
    if (timePreferences && timePreferences.constraints) {
      return this.filterSlotsByPreference(rawSlots, timePreferences.constraints);
    }
    
    return rawSlots.slice(0, 5); // Límite por defecto
  }

  /**
   * Filtra slots según preferencias (implementación interna)
   */
  filterSlotsByPreference(slots, constraints) {
    // Implementación de filtrado interno del Organizador
    // Esto mantiene el principio: Organizador filtra sus propios slots
    console.log(`🔍 [ORGANIZADOR] Filtrando ${slots.length} slots con ${constraints.length} restricciones`);
    return slots; // Implementar lógica real aquí
  }

  // ... resto del código existente ...
}
