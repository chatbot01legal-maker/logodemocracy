const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor de LogoDemocracy',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;
