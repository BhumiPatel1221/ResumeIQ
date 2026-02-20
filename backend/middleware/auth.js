/**
 * ResumeIQ — JWT Authentication Middleware
 * Extracts and verifies the Bearer token from the Authorization header.
 * On success, attaches the decoded user payload to req.user.
 */

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const protect = asyncHandler(async (req, _res, next) => {
  // 1. Extract token from "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired — please login again');
    }
    throw new ApiError(401, 'Invalid token');
  }

  // 3. Ensure user still exists in the database
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new ApiError(401, 'User belonging to this token no longer exists');
  }

  // 4. Attach user to request
  req.user = user;
  next();
});

module.exports = protect;
