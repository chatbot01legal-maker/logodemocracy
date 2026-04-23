/* ================================================
   CONFIRMACIÓN DE CITA - INFRAESTRUCTURA PURA
   ================================================ */
app.post("/api/calendar/create-event", async (req, res) => {
  try {
    // SOLO DATOS OPERATIVOS - Validación básica
    const { sessionId, clientName, clientEmail, appointmentDate, appointmentTime } = req.body;

    if (!sessionId || !clientName || !clientEmail || !appointmentDate || !appointmentTime) {
      console.warn("[CALENDAR CREATE] ❌ Datos incompletos:", req.body);
      return res.status(400).json({
        success: false,
        error: "Datos incompletos para agendamiento. Requeridos: sessionId, clientName, clientEmail, appointmentDate, appointmentTime"
      });
    }

    console.log(`[CALENDAR CREATE] 📅 Creando cita para ${clientName} (${clientEmail})`);

    // 1. PREPARAR DATOS PARA GOOGLE CALENDAR (Infraestructura pura)
    const [year, month, day] = appointmentDate.split("-");
    const [hour, minute] = appointmentTime.split(":");
    
    const startDateTime = new Date(year, month - 1, day, hour, minute);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hora

    const timeZone = process.env.CALENDAR_TIMEZONE || "America/Santiago";
    
    const eventData = {
      summary: `Consulta Legal - ${clientName}`,
      description: `Agendamiento via widget ABOLEGAL\n\n` +
                  `• Session ID: ${sessionId}\n` +
                  `• Cliente: ${clientName}\n` +
                  `• Email: ${clientEmail}\n` +
                  `• Sistema: Widget de Agendamiento`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timeZone
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timeZone
      },
      attendees: [
        { 
          email: process.env.LAWYER_EMAIL || "nicolas.blanco@abolegal.cl", 
          displayName: "Abogado ABOLEGAL" 
        },
        { 
          email: "chatbot.01.legal@gmail.com", 
          displayName: "Sistema ABOLEGAL (Notificaciones)" 
        }
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${sessionId}-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      },
      reminders: {
        useDefault: true
      }
    };

    // 2. CREAR EVENTO EN GOOGLE CALENDAR (Infraestructura)
    const googleCalendar = require("./modules/calendar/googleCalendar");
    const calendarResult = await googleCalendar.createEvent(eventData);

    // 3. ENVIAR NOTIFICACIÓN TÉCNICA AL ABOGADO (Infraestructura)
    const emailService = require("./modules/emailService");
    
    await emailService.sendAppointmentNotification({
      lawyerEmail: process.env.LAWYER_EMAIL || "nicolas.blanco@abolegal.cl",
      clientName,
      clientEmail,
      appointmentDateTime: `${appointmentDate} ${appointmentTime}`,
      meetLink: calendarResult.meetLink,
      sessionId // ← ÚNICO vínculo con Lex, sin interpretación
    });

    // 4. RESPUESTA PURAMENTE OPERATIVA
    res.json({
      success: true,
      message: "Cita agendada exitosamente",
      data: {
        eventId: calendarResult.eventId,
        meetLink: calendarResult.meetLink,
        sessionId, // ← Devuelto para referencia del frontend
        appointmentDetails: {
          clientName,
          clientEmail,
          date: appointmentDate,
          time: appointmentTime,
          timeZone: timeZone
        }
      },
      metadata: {
        service: "calendar-infrastructure",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      }
    });

  } catch (error) {
    console.error("[CALENDAR CREATE] ❌ Error de infraestructura:", error);
    
    // Clasificación de errores para mejor debugging
    let errorType = "unknown";
    if (error.message.includes("Google Calendar")) errorType = "calendar";
    if (error.message.includes("email")) errorType = "email";
    if (error.message.includes("credenciales")) errorType = "credentials";

    res.status(500).json({
      success: false,
      error: "Error en servicio de agendamiento",
      errorType: errorType,
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
      suggestion: errorType === "credentials" 
        ? "Verificar variables de entorno CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN" 
        : "Contactar al administrador del sistema"
    });
  }
});
