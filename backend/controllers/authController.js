/**
 * ResumeIQ — Auth Controller
 * Handles user registration and login.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const ApiError = require('../utils/ApiError');

/**
 * Generate a signed JWT for the given user ID.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ==================== REGISTER ====================
// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // Create user (password is hashed by the pre-save hook)
  const user = await User.create({ name, email, password });

  // Generate token
  const token = generateToken(user._id);

  sendResponse(res, 201, 'Registration successful', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

// ==================== LOGIN ====================
// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  // Find user and explicitly select password (excluded by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate token
  const token = generateToken(user._id);

  sendResponse(res, 200, 'Login successful', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

module.exports = { register, login };
