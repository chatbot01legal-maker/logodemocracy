function logDualCheck(slot, events) {
  console.log("🧪 SLOT CHECK:", slot.start_iso);

  events.forEach(e => {
    console.log("EVENT VS SLOT:");
    console.log("event:", e.start?.dateTime);
  });
}

module.exports = { logDualCheck };
