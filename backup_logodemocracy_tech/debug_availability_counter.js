let counter = 0;

function logAvailabilityCall() {
  counter++;
  console.log("🧪 AVAILABILITY CALL COUNT:", counter, "timestamp:", Date.now());
}

module.exports = { logAvailabilityCall };
