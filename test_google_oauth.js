const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN) {
  console.error('❌ Faltan variables de entorno. Revisa CLIENT_ID, CLIENT_SECRET, REDIRECT_URI o REFRESH_TOKEN.');
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2.setCredentials({ refresh_token: REFRESH_TOKEN });

// Paso 1: verificar token
oauth2.getAccessToken().then(
  tokenRes => {
    if (!tokenRes || !tokenRes.token) {
      console.error('❌ No se pudo generar el access token. CLIENT_ID/CLIENT_SECRET o REFRESH_TOKEN incorrectos.');
      process.exit(1);
    }
    console.log('✅ Access token generado correctamente.');

    // Paso 2: listar calendarios
    const calendar = google.calendar({ version: 'v3', auth: oauth2 });
    calendar.calendarList.list({}, (err, res) => {
      if (err) {
        console.error('❌ Error al listar calendarios:', err.response?.data || err.message);
        process.exit(1);
      }
      console.log('✅ Calendarios encontrados:');
      res.data.items.forEach(c => console.log(' -', c.summary));
    });
  },
  err => {
    console.error('❌ Falló la obtención del access token:', err.response?.data || err.message);
    process.exit(1);
  }
);
