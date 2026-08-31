export const errorHandler = (error, req, res, next) => {
  console.error('❌ Error real:', error);
  res.setHeader('Content-Type', 'application/json');

  const status = error.statusCode || error.status || 500;
  const message = error.message || 'Error interno del servidor';

  return res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};