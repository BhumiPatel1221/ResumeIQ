/**
 * ResumeIQ — Analysis Routes
 * POST /api/analyze             — Run AI analysis (protected)
 * GET  /api/analysis/history    — Get user's analysis history (protected)
 * GET  /api/analysis/:id        — Get single analysis by ID (protected)
 */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { runAnalysis, getHistory, getAnalysisById } = require('../controllers/analysisController');

router.post('/', protect, runAnalysis);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getAnalysisById);

module.exports = router;
