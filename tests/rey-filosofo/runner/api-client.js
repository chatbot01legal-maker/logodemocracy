const axios = require('axios');
const crypto = require('crypto');
const config = require('../config');

async function sendChatMessage(message, context) {
  const url = `${config.API_BASE}${config.CHAT_ENDPOINT}`;
  const sessionId = `rf-test-${crypto.randomUUID()}`;

  const payload = {
    sessionId,
    content: message,
    message,
    activeAsset: context.activeAsset
  };

  try {
    const response = await axios.post(url, payload, {
      timeout: config.TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        data: error.response.data
      };
    }

    throw error;
  }
}

module.exports = {
  sendChatMessage
};
