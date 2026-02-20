/**
 * ResumeIQ — Analysis Controller
 * Handles AI resume analysis, history retrieval, and single analysis lookup.
 */

const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { analyzeResume } = require('../services/aiService');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const ApiError = require('../utils/ApiError');

// ==================== RUN ANALYSIS ====================
// POST /api/analyze
const runAnalysis = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription } = req.body;

  // Validate inputs
  if (!resumeId) {
    throw new ApiError(400, 'resumeId is required');
  }
  if (!jobDescription || !jobDescription.trim()) {
    throw new ApiError(400, 'jobDescription is required');
  }

  // Find the resume and verify ownership
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }
  if (resume.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to use this resume');
  }

  // Call AI service
  const aiResult = await analyzeResume(resume.extractedText, jobDescription);

  // Save analysis to database
  const analysis = await Analysis.create({
    userId: req.user._id,
    resumeId: resume._id,
    jobDescription,
    matchScore: aiResult.matchScore,
    matchedSkills: aiResult.matchedSkills,
    missingSkills: aiResult.missingSkills,
    suggestions: aiResult.suggestions,
  });

  sendResponse(res, 201, 'Analysis completed successfully', {
    analysis: {
      id: analysis._id,
      matchScore: analysis.matchScore,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      jobDescription: analysis.jobDescription,
      resumeId: analysis.resumeId,
      createdAt: analysis.createdAt,
    },
  });
});

// ==================== GET ANALYSIS HISTORY ====================
// GET /api/analysis/history
const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('resumeId', 'originalName')
      .lean(),
    Analysis.countDocuments({ userId: req.user._id }),
  ]);

  sendResponse(res, 200, 'Analysis history retrieved', {
    analyses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ==================== GET SINGLE ANALYSIS ====================
// GET /api/analysis/:id
const getAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id)
    .populate('resumeId', 'originalName extractedText')
    .lean();

  if (!analysis) {
    throw new ApiError(404, 'Analysis not found');
  }

  // Verify ownership
  if (analysis.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to view this analysis');
  }

  sendResponse(res, 200, 'Analysis retrieved', { analysis });
});

module.exports = { runAnalysis, getHistory, getAnalysisById };
