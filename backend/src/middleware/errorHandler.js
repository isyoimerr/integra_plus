export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });

  const isMalformedJson =
    err instanceof SyntaxError &&
    err.status === 400 &&
    typeof err.body === 'string';

  if (isMalformedJson) {
    return res.status(400).json({
      error: 'Solicitud inválida',
      message: 'El cuerpo JSON es inválido.',
    });
  }

  const isDbUnavailable =
    err?.name === 'PrismaClientInitializationError' ||
    err?.code === 'P1001' ||
    (typeof err?.message === 'string' && err.message.includes('Can\'t reach database server'));

  if (isDbUnavailable) {
    return res.status(503).json({
      error: 'Servicio temporalmente no disponible',
      message: 'La base de datos no esta disponible. Verifica MySQL y vuelve a intentar.',
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
