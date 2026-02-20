/**
 * ResumeIQ — Resume Model
 * Stores uploaded resume file path and extracted text.
 * Linked to User via userId.
 */

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    originalName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
