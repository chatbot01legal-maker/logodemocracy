if (start < eventEnd && end > eventStart) {
  console.log("🔥 MATCH DETECTADO");
  console.log("SLOT:", new Date(start).toISOString());
  console.log("EVENT:", new Date(eventStart).toISOString());
  return true;
}
