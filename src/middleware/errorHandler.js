import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error Middleware:', err.message);

  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message || err.name,
    });
    return;
  }

  // Обробка помилок з multer
  if (err.message && err.message.includes('image')) {
    res.status(400).json({
      error: err.message,
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
