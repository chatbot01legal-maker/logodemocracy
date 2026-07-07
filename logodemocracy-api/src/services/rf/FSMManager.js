const FSMManager = {
  transition(session, event) {
    const rules = {
      'AUTONOMO': { 'confusion_detected': 'FRICCION' },
      'FRICCION': { 'request_help': 'ORIENTACION', 'default_interaction': 'ORIENTACION' },
      'ORIENTACION': { 'default_interaction': 'ANDAMIAJE' },
      'ANDAMIAJE': { 'successful_transfer': 'TRANSFERENCIA' },
      'TRANSFERENCIA': { 'default_interaction': 'REFLEXION' },
      'REFLEXION': { 'default_interaction': 'AUTONOMO' }
    };
    
    const nextState = rules[session.fsm_state]?.[event];
    if (nextState) {
      session.fsm_state = nextState;
    }
  }
};
module.exports = FSMManager;
