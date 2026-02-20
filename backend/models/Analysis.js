/**
 * ResumeIQ — Analysis Model
 * Stores AI analysis results: match score, matched/missing skills, suggestions.
 * Linked to User and Resume.
 */

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Resume ID is required'],
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
