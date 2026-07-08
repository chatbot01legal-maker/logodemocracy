const errorHandler = (err, req, res, next) => {
  // Loggear el error en el servidor (con stack)
  console.error(`[Error] ${err.message}`, err.stack);

  // Determinar el código de estado
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Si el error es un SyntaxError (JSON malformado), forzar 400
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
  }

  // Construir la respuesta de error (NUNCA incluir stack)
  const errorResponse = {
    error: err.message || 'Error interno del servidor de LogoDemocracy'
  };

  // Si es un error de validación (400) y tenemos un mensaje específico, usarlo
  if (statusCode === 400 && err.message) {
    errorResponse.error = err.message;
  }

  // Enviar respuesta
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
