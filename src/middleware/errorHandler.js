export const errorHandler = (err, req, res, next) => {
  console.error('Error Middleware:', err.message);

  if (err.status) {
    res.status(err.status).json({
      error: err.message || err.name,
    });
    return;
  }

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};
