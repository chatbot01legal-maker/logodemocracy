// modules/calendar/googleCalendar.js
// INFRAESTRUCTURA PURA - Google Calendar API
// NO conoce Lex, NO interpreta contenido legal

const { google } = require("googleapis");

class GoogleCalendarService {
  constructor() {
    this.calendarClient = null;
  }

  _loadCredentials() {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const refreshToken = process.env.REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error("Faltan credenciales OAuth2 de Google Calendar");
    }

    return { clientId, clientSecret, refreshToken };
  }

  _getCalendarClient() {
    if (this.calendarClient) return this.calendarClient;

    const { clientId, clientSecret, refreshToken } = this._loadCredentials();
    
    const auth = new google.auth.OAuth2(
      clientId,
      clientSecret,
      process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground"
    );

    auth.setCredentials({ refresh_token: refreshToken });

    this.calendarClient = google.calendar({ 
      version: "v3", 
      auth 
    });

    return this.calendarClient;
  }

  /**
   * Crea un evento en Google Calendar
   * @param {Object} eventData - Datos del evento (formato Google Calendar)
   * @returns {Promise<{eventId: string, meetLink: string, htmlLink: string}>}
   */
  async createEvent(eventData) {
    try {
      const calendar = this._getCalendarClient();
      const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

      console.log(`[GOOGLE CALENDAR] Creando evento en calendario: ${calendarId}`);

      const response = await calendar.events.insert({
        calendarId,
        resource: eventData,
        sendUpdates: 'all',
        conferenceDataVersion: 1
      });

      const eventId = response.data.id;
      const meetLink = response.data.hangoutLink || 
                      response.data.conferenceData?.entryPoints?.[0]?.uri;

      console.log(`[GOOGLE CALENDAR] ✅ Evento creado: ${eventId}`);
      console.log(`[GOOGLE CALENDAR] 🔗 Meet: ${meetLink}`);

      return {
        eventId,
        meetLink: meetLink || "https://meet.google.com/new",
        htmlLink: response.data.htmlLink
      };

    } catch (error) {
      console.error("[GOOGLE CALENDAR] ❌ Error creando evento:", error.message);
      throw new Error(`Error de infraestructura Google Calendar: ${error.message}`);
    }
  }

  /**
   * Lista eventos (para disponibilidad - si se usa)
   * @param {string} timeMin - ISO string
   * @param {string} timeMax - ISO string
   * @returns {Promise<Array>} Eventos
   */
  async listEvents(timeMin, timeMax) {
    try {
      const calendar = this._getCalendarClient();
      const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

      const response = await calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        timeZone: process.env.CALENDAR_TIMEZONE || "America/Santiago"
      });

      return response.data.items || [];
    } catch (error) {
      console.error("[GOOGLE CALENDAR] ❌ Error listando eventos:", error.message);
      throw error;
    }
  }
}

// Exportar instancia singleton
module.exports = new GoogleCalendarService();
