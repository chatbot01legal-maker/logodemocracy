// modules/emailService.js
// SERVICIO DESACTIVADO
// Google Calendar ya envía automáticamente las invitaciones y correos.
// Este archivo queda como stub para mantener compatibilidad con imports existentes.

class EmailService {
  async sendAppointmentNotification() {
    console.log("[EMAIL SERVICE] Desactivado: Google Calendar maneja las notificaciones.");
    return { messageId: "disabled" };
  }

  async sendClientConfirmation() {
    console.log("[EMAIL SERVICE] Desactivado: Google Calendar maneja las notificaciones.");
    return { messageId: "disabled" };
  }
}

// Crear instancia singleton
const emailServiceInstance = new EmailService();

// Exportar instancia y métodos para compatibilidad
module.exports = emailServiceInstance;
module.exports.sendAppointmentNotification = emailServiceInstance.sendAppointmentNotification.bind(emailServiceInstance);
module.exports.sendClientConfirmation = emailServiceInstance.sendClientConfirmation.bind(emailServiceInstance);
module.exports.instance = emailServiceInstance;

