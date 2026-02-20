# ResumeIQ — AI Integration Guide

> How ResumeIQ uses the OpenAI API for resume analysis and job matching.

---

## Overview

ResumeIQ integrates with OpenAI's Chat Completions API to compare an uploaded resume against a job description. The AI returns a structured JSON object containing:

- **Match Score** (0–100%)
- **Matched Skills** — skills found in both resume and job description
- **Missing Skills** — skills required by the job but absent from the resume
- **Suggestions** — actionable tips to improve the match

---

## Integration Architecture

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ analysisController│ ────▶│   aiService.js   │ ────▶│   OpenAI API     │
│                  │       │                  │       │  (Chat API)      │
│  Validates input │       │  Builds prompt   │       │                  │
│  Saves result    │ ◀──── │  Parses JSON     │ ◀──── │  Returns JSON    │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

**File:** `services/aiService.js`

---

## Prompt Strategy

### System Message

```
You are a JSON-only API.
You must respond with a single valid JSON object and nothing else.
```

This constrains the model to output pure JSON without markdown fences or commentary.

### User Prompt

```
You are an expert career advisor and resume analyst for the ResumeIQ platform.

Analyse the following resume against the provided job description.

Return ONLY a valid JSON object with exactly this shape:

{
  "matchScore": <number between 0 and 100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Rules:
- matchScore is a percentage indicating how well the resume matches the job.
- matchedSkills lists skills found in BOTH the resume and job description.
- missingSkills lists skills required by the job but NOT in the resume.
- suggestions lists actionable improvement tips (max 5).
- Keep skill names concise.
- Return ONLY the JSON object.

--- RESUME ---
<extracted resume text>

--- JOB DESCRIPTION ---
<user-provided job description>
```

### Why This Works

1. **Explicit schema** — the model knows the exact shape to return
2. **Role constraint** — system message restricts to JSON-only
3. **`response_format: { type: "json_object" }`** — OpenAI's native JSON mode
4. **Low temperature (0.3)** — reduces creative variance, improves consistency
5. **Clear delimiters** — `--- RESUME ---` and `--- JOB DESCRIPTION ---` prevent confusion

---

## JSON Enforcement Strategy

### 1. OpenAI JSON Mode

```javascript
response_format: { type: 'json_object' }
```

This tells the API to return valid JSON only. If the model would normally add commentary, this mode strips it.

### 2. Markdown Fence Stripping

Even with JSON mode, some edge cases produce markdown fences. The service strips them:

```javascript
if (cleaned.startsWith('```')) {
  cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
}
```

### 3. Structural Validation

After parsing, the service validates:

- `matchScore` is a number between 0–100
- `matchedSkills`, `missingSkills`, `suggestions` are arrays

If validation fails, a `502 Bad Gateway` error is returned.

---

## Error Handling

| Scenario                  | HTTP Code | Message                                    |
| ------------------------- | --------- | ------------------------------------------ |
| Empty resume text         | 400       | Resume text is empty                       |
| Empty job description     | 400       | Job description is empty                   |
| API key not configured    | 500       | OpenAI API key is not configured           |
| Rate limit (429)          | 429       | OpenAI rate limit exceeded                 |
| Invalid API key           | 500       | Invalid OpenAI API key                     |
| Empty AI response         | 502       | OpenAI returned an empty response          |
| Malformed JSON            | 502       | Failed to get analysis from AI service     |

---

## Cost Optimization Tips

### 1. Use `gpt-4o-mini` Instead of `gpt-4`

`gpt-4o-mini` is **~60× cheaper** than `gpt-4` and provides excellent results for structured analysis tasks.

### 2. Limit `max_tokens`

```javascript
max_tokens: 1024
```

The expected response is small (~200–300 tokens). Capping at 1024 prevents runaway costs.

### 3. Low Temperature

```javascript
temperature: 0.3
```

Lower temperature = fewer retry-worthy responses = fewer wasted tokens.

### 4. Truncate Long Resumes

For production, consider truncating resume text to the first ~3000 words to stay within token limits and reduce cost.

### 5. Cache Identical Requests

If the same resume + job description combo is submitted twice, return the cached analysis instead of calling OpenAI again.

### 6. Rate Limiting

Add per-user rate limiting (e.g., 10 analyses per hour) to prevent abuse and runaway costs.

---

## Configuration

| Env Variable     | Purpose                | Default        |
| ---------------- | ---------------------- | -------------- |
| `OPENAI_API_KEY` | Your OpenAI secret key | (required)     |
| `OPENAI_MODEL`   | Model to use           | `gpt-4o-mini`  |

---

## Interview Explanation

> "ResumeIQ uses OpenAI's Chat Completions API with a carefully engineered prompt that enforces JSON-only output. We use a system message for role constraint, OpenAI's native `json_object` response format, low temperature for consistency, and post-parse validation to guarantee the response matches our schema. The service is isolated in `aiService.js`, keeping the controller clean and the AI logic testable independently."
