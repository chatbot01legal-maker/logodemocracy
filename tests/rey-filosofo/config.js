module.exports = {
  // Endpoint real del Rey Filósofo
  API_BASE: process.env.API_BASE || 'http://localhost:3000',
  CHAT_ENDPOINT: '/api/reyfilosofo/message',
  TIMEOUT: 30000,
  FIXTURES_DIR: __dirname + '/fixtures',
  REPORTS_DIR: __dirname + '/reports',
  VERBOSE: process.env.VERBOSE === 'true'
};
