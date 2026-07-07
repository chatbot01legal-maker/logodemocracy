const FSMManager = {
  transition(session, event) {
    const rules = {
      'AUTONOMO': { 'confusion_detected': 'FRICCION' },
      'FRICCION': { 'request_help': 'ORIENTACION' },
      'ANDAMIAJE': { 'successful_transfer': 'TRANSFERENCIA' }
    };
    
    const nextState = rules[session.fsm_state]?.[event];
    if (nextState) {
      session.fsm_state = nextState;
    }
  }
};
module.exports = FSMManager;
