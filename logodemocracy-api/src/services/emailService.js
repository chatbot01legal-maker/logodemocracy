const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendTransactionalEmail({ toEmail, toName, subject, htmlContent, textContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'LogoDemocracy';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY no está configurada.');
  }

  if (!senderEmail) {
    throw new Error('BREVO_SENDER_EMAIL no está configurada.');
  }

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      {
        email: toEmail,
        name: toName || undefined
      }
    ],
    replyTo: {
      email: senderEmail,
      name: senderName
    },
    subject,
    htmlContent,
    textContent
  };

  const response = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      data && (data.message || data.code)
        ? `${data.code || ''} ${data.message || ''}`.trim()
        : `HTTP ${response.status}`;

    throw new Error(`Brevo rechazó el envío: ${detail}`);
  }

  return data;
}

async function sendPasswordResetEmail({ toEmail, toName, resetUrl }) {
  const subject = 'Restablecer contraseña — LogoDemocracy';

  const safeName = String(toName || '').replace(/[<>&"']/g, '');

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Restablecer contraseña</title>
</head>
<body style="margin:0;padding:0;background:#000;color:#fff;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <h1 style="font-size:24px;font-weight:400;">LogoDemocracy</h1>

    <p>Hola${safeName ? ` ${safeName}` : ''}:</p>

    <p>
      Recibimos una solicitud para restablecer la contraseña de tu cuenta.
    </p>

    <p>
      Si hiciste esta solicitud, utiliza el siguiente enlace:
    </p>

    <p style="margin:28px 0;">
      <a
        href="${resetUrl}"
        style="display:inline-block;padding:12px 18px;background:#fff;color:#000;text-decoration:none;"
      >
        Restablecer contraseña
      </a>
    </p>

    <p>
      Este enlace es de un solo uso y expira después de un tiempo limitado.
    </p>

    <p>
      Si no solicitaste este cambio, puedes ignorar este mensaje.
    </p>

    <p style="margin-top:32px;font-size:13px;opacity:.7;">
      LogoDemocracy — Infraestructura cognitiva para una democracia aumentada.
    </p>
  </div>
</body>
</html>`;

  const textContent = `LogoDemocracy

Hola${toName ? ` ${toName}` : ''}:

Recibimos una solicitud para restablecer la contraseña de tu cuenta.

Si hiciste esta solicitud, utiliza este enlace:

${resetUrl}

Este enlace es de un solo uso y expira después de un tiempo limitado.

Si no solicitaste este cambio, puedes ignorar este mensaje.
`;

  return sendTransactionalEmail({
    toEmail,
    toName,
    subject,
    htmlContent,
    textContent
  });
}

module.exports = {
  sendTransactionalEmail,
  sendPasswordResetEmail
};
