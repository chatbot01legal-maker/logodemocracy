const EventDetector = {
  detect({ user_response, fsm_state }) {
    const events = [];
    if (!user_response) return events;
    const text = user_response.toLowerCase().trim();

    if (text.includes("no entiendo") || text.includes("confuso") || text.includes("ayuda") || text.includes("qué significa")) {
      events.push("confusion_detected");
    } else if (text.length > 35 && !text.includes("?")) {
      events.push("successful_transfer");
    } else {
      events.push("default_interaction");
    }
    return events;
  }
};
module.exports = EventDetector;
