/**
 * ResumeIQ — Standardised API Response Helper
 * Ensures every successful response follows the same JSON contract.
 *
 * Response shape:
 * {
 *   success: true,
 *   message: "...",
 *   data: { ... }
 * }
 *
 * Usage:
 *   sendResponse(res, 200, 'User created', { user });
 */

const sendResponse = (res, statusCode, message, data = null) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

module.exports = sendResponse;
