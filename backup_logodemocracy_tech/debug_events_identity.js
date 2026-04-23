function logEventIdentity(events) {
  events.forEach((e, i) => {
    console.log("🧪 EVENT IDENTITY:", i);
    console.log("id:", e.id);
    console.log("start:", e.start?.dateTime);
    console.log("end:", e.end?.dateTime);
  });
}

module.exports = { logEventIdentity };
