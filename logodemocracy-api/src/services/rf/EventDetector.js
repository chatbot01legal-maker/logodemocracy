const EventDetector = {
  detect({ user_response, fsm_state }) {
    const events = [];
    if (!user_response) return events;

    // Lógica de detección de transferencia
    if (user_response.length > 50 && !user_response.includes("?")) {
      events.push("successful_transfer");
    }
    
    // Lógica de detección de frustración
    if (user_response.toLowerCase().includes("no entiendo")) {
      events.push("confusion_detected");
    }

    return events;
  }
};
