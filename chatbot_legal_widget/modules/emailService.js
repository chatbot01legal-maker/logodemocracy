// modules/emailService.js
// INFRAESTRUCTURA PURA - Notificaciones técnicas
// NO contiene contenido legal, NO interpreta casos

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this._initializeTransporter();
  }

  _initializeTransporter() {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword) {
      console.warn("[EMAIL SERVICE] ⚠️  Credenciales de email no configuradas");
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });

    console.log("[EMAIL SERVICE] ✅ Transporte de email inicializado");
  }

  /**
   * Envía notificación técnica de cita agendada
   * @param {Object} appointmentData - Datos operativos de la cita
   * @returns {Promise<{messageId: string}>}
   */
  async sendAppointmentNotification(appointmentData) {
    // Validar que el transporte esté inicializado
    if (!this.transporter) {
      console.warn("[EMAIL SERVICE] ⚠️  No se puede enviar email: transporte no inicializado");
      throw new Error("Servicio de email no configurado");
    }

    const {
      lawyerEmail,
      clientName,
      clientEmail,
      appointmentDateTime,
      meetLink,
      sessionId
    } = appointmentData;

    if (!lawyerEmail) {
      throw new Error("Email del abogado no especificado");
    }

    console.log(`[EMAIL SERVICE] 📧 Enviando notificación a: ${lawyerEmail}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: lawyerEmail,
      subject: `[ABOLEGAL] Nueva cita agendada - ${clientName}`,
      html: this._buildTechnicalEmail({
        clientName,
        clientEmail,
        appointmentDateTime,
        meetLink,
        sessionId
      })
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] ✅ Notificación enviada: ${info.messageId}`);
      return { messageId: info.messageId };
    } catch (error) {
      console.error("[EMAIL SERVICE] ❌ Error enviando email:", error.message);
      throw new Error(`Error de infraestructura email: ${error.message}`);
    }
  }

  /**
   * Construye email técnico (sin contenido legal)
   * @private
   */
  _buildTechnicalEmail(data) {
    // LÍMITE MÁXIMO PERMITIDO: referencia a sessionId para consulta en Lex
    const lexReference = data.sessionId 
      ? `<p><strong>ID de sesión para consulta en Lex:</strong> ${data.sessionId}</p>`
      : "";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva cita agendada - ABOLEGAL</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #19213a;
      color: white;
      padding: 24px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    .content {
      padding: 24px 20px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .card-title {
      color: #19213a;
      font-size: 18px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .card-title i {
      color: #3949ab;
    }
    .info-row {
      display: flex;
      margin-bottom: 12px;
      align-items: flex-start;
    }
    .info-label {
      font-weight: 600;
      color: #666666;
      min-width: 140px;
      font-size: 14px;
    }
    .info-value {
      color: #333333;
      font-size: 14px;
      flex: 1;
    }
    .meet-link {
      display: inline-block;
      background-color: #19213a;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 16px;
      transition: background-color 0.3s ease;
    }
    .meet-link:hover {
      background-color: #0f1529;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #e0e0e0;
      background-color: #f8f9fa;
    }
    .session-id {
      font-family: monospace;
      background-color: #f0f0f0;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 13px;
      word-break: break-all;
    }
    .disclaimer {
      font-size: 12px;
      color: #666666;
      font-style: italic;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>📅 Nueva cita agendada - Sistema ABOLEGAL</h1>
    </div>
    
    <div class="content">
      <div class="card">
        <h2 class="card-title">
          <i class="fas fa-calendar-check"></i>
          Detalles de la cita
        </h2>
        
        <div class="info-row">
          <div class="info-label">👤 Cliente:</div>
          <div class="info-value">${data.clientName}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">📧 Email cliente:</div>
          <div class="info-value">${data.clientEmail}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">📅 Fecha y hora:</div>
          <div class="info-value">${data.appointmentDateTime}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">🔗 Videollamada:</div>
          <div class="info-value">
            <a href="${data.meetLink}" class="meet-link">
              <i class="fas fa-video"></i> Unirse a la videollamada
            </a>
          </div>
        </div>
      </div>
      
      ${lexReference}
      
      <div class="disclaimer">
        <p>📋 <strong>Nota importante:</strong> Este es un correo automático generado por el sistema de agendamiento de ABOLEGAL.</p>
        <p>Para información legal del caso, consulte el sistema Lex utilizando el sessionId proporcionado.</p>
      </div>
    </div>
    
    <div class="footer">
      <p>ABOLEGAL · Asistencia Legal 24/7</p>
      <p>Este correo fue generado automáticamente. Por favor, no responda a esta dirección.</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

// Exportar instancia singleton
module.exports = new EmailService();
