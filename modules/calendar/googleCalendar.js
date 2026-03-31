const { google } = require("googleapis");
const moment = require("moment-timezone");

const TIMEZONE = "America/Santiago";

function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

/**
 * Crea un evento con link de Google Meet
 */
async function createCalendarEvent(slot, sessionId, clientEmail, clientName, comments) {
  const calendar = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const event = {
    summary: `Consulta Legal: ${clientName}`,
    description: `
Agendado vía Chatbot Lex

👤 Cliente: ${clientName}
📧 Email: ${clientEmail}
🆔 Sesión: ${sessionId}

📝 Comentarios del cliente:
${comments && comments.trim() !== "" ? comments : "Sin comentarios"}
`,
    start: { dateTime: slot.start_iso, timeZone: TIMEZONE },
    end: { dateTime: slot.end_iso, timeZone: TIMEZONE },
    attendees: [
      { email: clientEmail },
      { email: process.env.LAWYER_EMAIL || "nicolasblanco@abolegal.cl" }
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId,
    resource: event,
    conferenceDataVersion: 1,
  });

  return {
    eventId: response.data.id,
    meetLink: response.data.hangoutLink,
    htmlLink: response.data.htmlLink
  };
}

/**
 * Filtra los slots generados localmente contra los eventos reales de Google
 */
async function filterSlotsWithGoogle(localSlots) {
  if (!localSlots || localSlots.length === 0) return [];

  const calendar = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const minDate = localSlots[0].start_iso;
  const maxDate = localSlots[localSlots.length - 1].end_iso;

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: minDate,
      timeMax: maxDate,
      singleEvents: true,
      orderBy: "startTime",
    });

    const googleEvents = response.data.items || [];
    console.log(`📅 Eventos reales traídos: ${googleEvents.length}`);

    return localSlots.filter(slot => {
      const slotStart = moment(slot.start_iso);
      const slotEnd = moment(slot.end_iso);

      const isOccupied = googleEvents.some(event => {
        const eventStart = moment(event.start?.dateTime || event.start?.date);
        const eventEnd = moment(event.end?.dateTime || event.end?.date);

        const overlap = slotStart.isBefore(eventEnd) && slotEnd.isAfter(eventStart);

        if (overlap) {
          console.log(`❌ SLOT OCUPADO: ${slot.start_iso}`);
        }
        return overlap;
      });

      return !isOccupied;
    });
  } catch (error) {
    console.error("❌ Error filtrando con Google:", error);
    return [];
  }
}

module.exports = { createCalendarEvent, filterSlotsWithGoogle };
