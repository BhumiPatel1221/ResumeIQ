/**
 * ResumeIQ — Resume Controller
 * Handles resume PDF upload and text extraction.
 */

const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const ApiError = require('../utils/ApiError');

// ==================== UPLOAD RESUME ====================
// POST /api/resume/upload
const uploadResume = asyncHandler(async (req, res) => {
  // Multer attaches the file to req.file
  if (!req.file) {
    throw new ApiError(400, 'Please upload a PDF file');
  }

  // Read the uploaded PDF and extract text
  const pdfBuffer = fs.readFileSync(req.file.path);
  let extractedText = '';

  try {
    const pdfData = await pdfParse(pdfBuffer);
    extractedText = pdfData.text;
  } catch (err) {
    // Clean up the uploaded file if parsing fails
    fs.unlinkSync(req.file.path);
    throw new ApiError(422, 'Failed to extract text from the PDF. Please upload a valid resume.');
  }

  if (!extractedText || !extractedText.trim()) {
    fs.unlinkSync(req.file.path);
    throw new ApiError(422, 'The uploaded PDF appears to be empty or contains no readable text.');
  }

  // Save resume record in the database
  const resume = await Resume.create({
    userId: req.user._id,
    filePath: req.file.path,
    originalName: req.file.originalname,
    extractedText,
  });

  sendResponse(res, 201, 'Resume uploaded and text extracted successfully', {
    resume: {
      id: resume._id,
      originalName: resume.originalName,
      extractedTextPreview: extractedText.substring(0, 300) + '...',
      createdAt: resume.createdAt,
    },
  });
});

module.exports = { uploadResume };
