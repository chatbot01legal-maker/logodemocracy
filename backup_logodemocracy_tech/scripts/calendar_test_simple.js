/**
 * TEST SIMPLE GOOGLE CALENDAR
 * Replica comportamiento funcional de chatbot_legal_v3
 */

const { google } = require("googleapis");

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  REDIRECT_URI,
  GOOGLE_CALENDAR_ID
} = process.env;

console.log("🔍 Verificando variables de entorno...");
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error("❌ Faltan variables OAuth2");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI || "http://localhost"
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client
});

async function testCalendar() {
  try {
    console.log("📅 Consultando eventos de Google Calendar...");

    const res = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID || "primary",
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime"
    });

    console.log("✅ Conexión exitosa");
    console.log("Eventos encontrados:", res.data.items.length);

    res.data.items.forEach((ev, i) => {
      const start = ev.start.dateTime || ev.start.date;
      console.log(`${i + 1}. ${start} — ${ev.summary || "(sin título)"}`);
    });

  } catch (err) {
    console.error("❌ Error accediendo a Google Calendar");
    console.error(err.message);
    process.exit(1);
  }
}

testCalendar();
