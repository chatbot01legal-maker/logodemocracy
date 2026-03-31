async function filterSlotsWithGoogle(slots) {
  if (!slots || slots.length === 0) return [];

  // 🔍 FILTRAR slots inválidos
  const validSlots = slots.filter((slot) => {
    if (!slot.start_iso || !slot.end_iso) {
      console.error("❌ Slot inválido (sin fechas):", slot);
      return false;
    }

    const start = new Date(slot.start_iso);
    const end = new Date(slot.end_iso);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("❌ Slot con fecha inválida:", slot);
      return false;
    }

    return true;
  });

  if (validSlots.length === 0) {
    console.error("❌ No hay slots válidos");
    return [];
  }

  const start = validSlots[0].start_iso;
  const end = validSlots[validSlots.length - 1].end_iso;

  const events = await fetchEventsInRange(start, end);

  return validSlots.filter((slot) => {
    return !isSlotOccupied(slot.start_iso, slot.end_iso, events);
  });
}
