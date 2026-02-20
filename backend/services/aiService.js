/**
 * ResumeIQ — AI Analysis Service
 * Calls a local Python FastAPI microservice that uses
 * sentence-transformers (all-MiniLM-L6-v2) for embedding-based
 * resume-vs-job-description analysis.
 *
 * Returns:
 * {
 *   matchScore: number (0-100),
 *   matchedSkills: string[],
 *   missingSkills: string[],
 *   suggestions: string[]
 * }
 */

const ApiError = require('../utils/ApiError');

// URL of the local Python AI service
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Validate that the response from the Python service has the expected shape.
 */
const validateResponse = (data) => {
  if (typeof data.matchScore !== 'number' || data.matchScore < 0 || data.matchScore > 100) {
    throw new Error('Invalid matchScore');
  }
  if (!Array.isArray(data.matchedSkills)) throw new Error('matchedSkills must be an array');
  if (!Array.isArray(data.missingSkills)) throw new Error('missingSkills must be an array');
  if (!Array.isArray(data.suggestions)) throw new Error('suggestions must be an array');
  return data;
};

/**
 * Main analysis function — called by the controller.
 * Sends resume text and job description to the local Python AI service.
 *
 * @param {string} resumeText     - Plain text extracted from the uploaded PDF resume
 * @param {string} jobDescription - Job description text provided by the user
 * @returns {Promise<Object>}     - Structured analysis result
 */
const analyzeResume = async (resumeText, jobDescription) => {
  // Guard: ensure inputs are non-empty
  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is empty — cannot analyze');
  }
  if (!jobDescription || !jobDescription.trim()) {
    throw new ApiError(400, 'Job description is empty — cannot analyze');
  }

  try {
    const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('AI Service HTTP Error:', response.status, errBody);

      if (response.status === 422) {
        throw new ApiError(400, 'Invalid input — resume or job description too short');
      }
      throw new ApiError(502, 'AI analysis service returned an error');
    }

    const data = await response.json();
    return validateResponse(data);
  } catch (error) {
    // Re-throw our own ApiErrors as-is
    if (error.statusCode) throw error;

    // Connection refused → Python service not running
    if (error.cause?.code === 'ECONNREFUSED' || error.code === 'ECONNREFUSED') {
      console.error('AI Service not reachable at', AI_SERVICE_URL);
      throw new ApiError(503, 'AI analysis service is not running. Start the Python AI service first.');
    }

    console.error('AI Service Error:', error.message);
    throw new ApiError(502, 'Failed to get analysis from AI service');
  }
};

module.exports = { analyzeResume };
