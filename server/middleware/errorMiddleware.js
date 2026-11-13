/**
 * Catch-all middleware for handling 404 (Not Found) endpoints
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized error handling middleware.
 * Formats errors into consistent JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  // If the status code was still 200, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

