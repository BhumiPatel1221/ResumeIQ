# ResumeIQ — System Architecture

> This document explains the overall architecture, data flow, and folder structure of the ResumeIQ backend.

---

## High-Level Architecture

```
┌──────────────┐      REST API       ┌──────────────────────┐
│   Frontend   │ ──────────────────▶ │   Express.js Server  │
│  (React SPA) │ ◀────────────────── │   (Node.js)          │
└──────────────┘    JSON responses   └──────────┬───────────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          │                     │                     │
                          ▼                     ▼                     ▼
                  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
                  │   MongoDB    │     │  OpenAI API  │     │  File System │
                  │  (Mongoose)  │     │  (GPT-4o)    │     │  (Uploads)   │
                  └──────────────┘     └──────────────┘     └──────────────┘
```

---

## Data Flow

### Registration & Login

```
Frontend → POST /api/auth/register → Validate → Hash Password → Save to MongoDB → Return JWT
Frontend → POST /api/auth/login    → Validate → Compare Hash  → Return JWT
```

### Resume Upload & Analysis

```
Frontend → POST /api/resume/upload (PDF file + JWT)
         → Multer saves file to /uploads
         → pdf-parse extracts text
         → Save resume record to MongoDB
         → Return resumeId

Frontend → POST /api/analyze (resumeId + jobDescription + JWT)
         → Fetch resume text from MongoDB
         → Send resume text + job description to OpenAI API
         → OpenAI returns structured JSON (matchScore, skills, suggestions)
         → Save analysis record to MongoDB
         → Return analysis to frontend
```

### Complete Data Flow Diagram

```
┌──────────┐   PDF    ┌──────────┐  text   ┌──────────┐  prompt  ┌──────────┐
│ Frontend │ ───────▶ │ Backend  │ ──────▶ │ pdf-parse│ ───────▶ │  OpenAI  │
│          │          │ (Express)│         └──────────┘          │   API    │
│          │          │          │ ◀──────────────────────────── │          │
│          │ ◀─────── │          │       structured JSON         └──────────┘
│          │  result  │          │ ──────▶ ┌──────────┐
└──────────┘          │          │  save   │ MongoDB  │
                      └──────────┘         └──────────┘
```

---

## Folder Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection via Mongoose
│   └── multer.js             # Multer upload configuration
├── controllers/
│   ├── authController.js     # Register & Login logic
│   ├── resumeController.js   # Resume upload & text extraction
│   └── analysisController.js # AI analysis, history, single lookup
├── docs/
│   ├── README.md             # Project overview & API reference
│   ├── ARCHITECTURE.md       # This file
│   ├── AI_INTEGRATION.md     # OpenAI integration details
│   ├── SECURITY.md           # Authentication & security docs
│   └── DEPLOYMENT.md         # Production deployment guide
├── middleware/
│   ├── auth.js               # JWT verification middleware
│   └── errorHandler.js       # Global error handling middleware
├── models/
│   ├── User.js               # User schema (name, email, hashed password)
│   ├── Resume.js             # Resume schema (userId, filePath, extractedText)
│   └── Analysis.js           # Analysis schema (scores, skills, suggestions)
├── routes/
│   ├── authRoutes.js         # /api/auth/*
│   ├── resumeRoutes.js       # /api/resume/*
│   └── analysisRoutes.js     # /api/analyze & /api/analysis/*
├── services/
│   └── aiService.js          # OpenAI integration & prompt engineering
├── uploads/                  # Uploaded PDF files (gitignored)
├── utils/
│   ├── ApiError.js           # Custom error class with HTTP status codes
│   ├── asyncHandler.js       # Wraps async functions to catch errors
│   └── sendResponse.js       # Standardised success response helper
├── .env                      # Environment variables (gitignored)
├── .env.example              # Template for environment variables
├── .gitignore
├── package.json
└── server.js                 # Application entry point
```

---

## Design Principles

| Principle             | Implementation                                      |
| --------------------- | --------------------------------------------------- |
| **Separation of Concerns** | Controllers, Services, Models, Routes are separate |
| **Single Responsibility** | Each file does one thing well                      |
| **DRY**               | Shared utilities (asyncHandler, ApiError, sendResponse) |
| **Security First**    | JWT auth, bcrypt hashing, env vars for secrets      |
| **Error Consistency** | Global error handler with uniform JSON shape        |
| **Scalability**       | Modular structure — easy to add new features        |

---

## Interview Explanation

> "ResumeIQ follows a layered MVC-like architecture. **Routes** define endpoints, **Controllers** handle request/response logic, **Services** encapsulate business logic (like AI calls), and **Models** define database schemas. A global error handler and async wrapper ensure consistent error handling. JWT middleware protects private routes. This separation makes the codebase testable, maintainable, and scalable."
