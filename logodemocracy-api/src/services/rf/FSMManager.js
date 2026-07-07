const FSMManager = {
  async update(session) {
    const transitions = {
      'AUTONOMO': 'FRICCION',
      'FRICCION': 'ORIENTACION',
      'ORIENTACION': 'ANDAMIAJE',
      'ANDAMIAJE': 'TRANSFERENCIA',
      'TRANSFERENCIA': 'REFLEXION',
      'REFLEXION': 'AUTONOMO'
    };
    
    // Implementación mínima: avanza linealmente por defecto
    // Aquí se insertaría la lógica de eventos de input
    session.fsm_state = transitions[session.fsm_state] || 'AUTONOMO';
  }
};

module.exports = FSMManager;
