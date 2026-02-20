/**
 * ResumeIQ — Auth Routes
 * POST /api/auth/register  — Register a new user
 * POST /api/auth/login     — Login and receive JWT
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
