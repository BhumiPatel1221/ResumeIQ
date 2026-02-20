/**
 * ResumeIQ — Custom API Error Class
 * Extends the native Error with an HTTP status code.
 * Thrown errors are caught by the global error middleware.
 *
 * Usage:
 *   throw new ApiError(404, 'Resource not found');
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 404, 500)
   * @param {string} message    - Human-readable error message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
