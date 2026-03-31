function logGoogleError(err) {
  console.log("🚨 GOOGLE ERROR DETECTED");
  console.log("status:", err?.code);
  console.log("message:", err?.message);
  console.log("timestamp:", Date.now());
}

module.exports = { logGoogleError };
