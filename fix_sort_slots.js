async function filterSlotsWithGoogle(slots) {
  if (!slots || slots.length === 0) return [];

  const normalized = slots.map((slot) => {
    const start = slot.start_iso || slot.start;
    const end = slot.end_iso || slot.end;

    return {
      ...slot,
      start_iso: start,
      end_iso: end,
    };
  }).filter(s => s.start_iso && s.end_iso);

  // 🔥 FIX CRÍTICO: ordenar por fecha
  normalized.sort((a, b) => {
    return new Date(a.start_iso) - new Date(b.start_iso);
  });

  const start = normalized[0].start_iso;
  const end = normalized[normalized.length - 1].end_iso;

  // 🔍 DEBUG REAL (esto te dirá si vuelve a romper)
  console.log("🧪 RANGE:", start, "→", end);

  const events = await fetchEventsInRange(start, end);

  return normalized.filter((slot) => {
    return !isSlotOccupied(slot.start_iso, slot.end_iso, events);
  });
}
EOFcat > fix_sort_slots.js << 'EOF'
async function filterSlotsWithGoogle(slots) {
  if (!slots || slots.length === 0) return [];

  const normalized = slots.map((slot) => {
    const start = slot.start_iso || slot.start;
    const end = slot.end_iso || slot.end;

    return {
      ...slot,
      start_iso: start,
      end_iso: end,
    };
  }).filter(s => s.start_iso && s.end_iso);

  // 🔥 FIX CRÍTICO: ordenar por fecha
  normalized.sort((a, b) => {
    return new Date(a.start_iso) - new Date(b.start_iso);
  });

  const start = normalized[0].start_iso;
  const end = normalized[normalized.length - 1].end_iso;

  // 🔍 DEBUG REAL (esto te dirá si vuelve a romper)
  console.log("🧪 RANGE:", start, "→", end);

  const events = await fetchEventsInRange(start, end);

  return normalized.filter((slot) => {
    return !isSlotOccupied(slot.start_iso, slot.end_iso, events);
  });
}
