function logGoogleRequest(params) {
  console.log("🧪 GOOGLE REQUEST HASH:");
  console.log(JSON.stringify(params, null, 2));
  console.log("timestamp:", Date.now());
}

module.exports = { logGoogleRequest };
