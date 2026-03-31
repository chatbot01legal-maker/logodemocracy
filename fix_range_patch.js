function getSlotsRange(slots) {
  let minStart = slots[0].start_iso;
  let maxEnd = slots[0].end_iso;

  for (const slot of slots) {
    if (slot.start_iso < minStart) minStart = slot.start_iso;
    if (slot.end_iso > maxEnd) maxEnd = slot.end_iso;
  }

  return { start: minStart, end: maxEnd };
}
