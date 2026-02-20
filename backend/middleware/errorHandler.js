/**
 * ResumeIQ — Global Error Handling Middleware
 * Catches all errors (thrown or passed via next()) and sends a consistent JSON response.
 *
 * Error response shape:
 * {
 *   success: false,
 *   message: "...",
 *   ...(stack in development only)
 * }
 */

const errorHandler = (err, _req, res, _next) => {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ---------- Mongoose: bad ObjectId ----------
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid resource ID format';
  }

  // ---------- Mongoose: duplicate key ----------
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    statusCode = 409;
    message = `Duplicate value for field: ${field}`;
  }

  // ---------- Mongoose: validation error ----------
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    statusCode = 400;
    message = messages.join('. ');
  }

  // ---------- Multer: file size exceeded ----------
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 5} MB`;
  }

  // ---------- Multer: wrong file type ----------
  if (err.message === 'Only PDF files are allowed') {
    statusCode = 400;
  }

  // ---------- Build response ----------
  const response = {
    success: false,
    message,
  };

  // Include stack trace in development for debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  console.error(`❌ [${statusCode}] ${message}`);

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
