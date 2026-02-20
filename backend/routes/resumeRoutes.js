/**
 * ResumeIQ — Resume Routes
 * POST /api/resume/upload  — Upload a PDF resume (protected)
 */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../config/multer');
const { uploadResume } = require('../controllers/resumeController');

// Protected route — requires JWT; accepts single PDF via "resume" field
router.post('/upload', protect, upload.single('resume'), uploadResume);

module.exports = router;
