# ResumeIQ — Backend API

> AI-powered resume analysis and job matching platform.

---

## Features

- **User Registration & Login** — secure JWT-based authentication
- **Resume Upload** — PDF upload with automatic text extraction
- **AI Analysis** — OpenAI-powered resume vs. job description matching
- **Analysis History** — saved results with pagination
- **Production-Ready** — CORS, error handling, security best practices

---

## Tech Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Runtime        | Node.js                       |
| Framework      | Express.js                    |
| Database       | MongoDB (Mongoose ODM)        |
| Authentication | JWT + bcrypt                  |
| File Upload    | Multer                        |
| PDF Parsing    | pdf-parse                     |
| AI Engine      | OpenAI API (GPT-4o-mini)      |
| CORS           | cors                          |

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Create .env from the example
cp .env.example .env
# (or copy-paste and edit each value)

# 4. Start MongoDB locally (MongoDB Compass or mongod)

# 5. Run in development
npm run dev

# 6. Run in production
npm start
```

---

## Environment Variables

| Variable          | Description                          | Example                         |
| ----------------- | ------------------------------------ | ------------------------------- |
| `PORT`            | Server port                          | `5000`                          |
| `NODE_ENV`        | Environment mode                     | `development` / `production`    |
| `MONGO_URI`       | MongoDB connection string            | `mongodb://127.0.0.1:27017/resumeiq` |
| `JWT_SECRET`      | Secret key for signing JWTs          | `my_super_secret_key`           |
| `JWT_EXPIRES_IN`  | Token expiry duration                | `7d`                            |
| `OPENAI_API_KEY`  | OpenAI API key                       | `sk-...`                        |
| `OPENAI_MODEL`    | OpenAI model to use                  | `gpt-4o-mini`                   |
| `CORS_ORIGIN`     | Comma-separated allowed origins      | `http://localhost:5173`         |
| `MAX_FILE_SIZE_MB`| Maximum upload file size in MB       | `5`                             |

---

## API Endpoints

### Auth

| Method | Endpoint              | Auth | Description          |
| ------ | --------------------- | ---- | -------------------- |
| POST   | `/api/auth/register`  | No   | Register a new user  |
| POST   | `/api/auth/login`     | No   | Login & get JWT      |

### Resume

| Method | Endpoint              | Auth | Description                        |
| ------ | --------------------- | ---- | ---------------------------------- |
| POST   | `/api/resume/upload`  | Yes  | Upload PDF resume (multipart/form) |

### Analysis

| Method | Endpoint                | Auth | Description                  |
| ------ | ----------------------- | ---- | ---------------------------- |
| POST   | `/api/analyze`          | Yes  | Run AI analysis              |
| GET    | `/api/analysis/history` | Yes  | Get paginated history        |
| GET    | `/api/analysis/:id`     | Yes  | Get single analysis by ID    |

### Utility

| Method | Endpoint       | Auth | Description          |
| ------ | -------------- | ---- | -------------------- |
| GET    | `/api/health`  | No   | Health check         |

---

## Example API Requests

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secure123"}'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "6651...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "6651...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Upload Resume

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer <token>" \
  -F "resume=@./my-resume.pdf"
```

**Response (201):**
```json
{
  "success": true,
  "message": "Resume uploaded and text extracted successfully",
  "data": {
    "resume": {
      "id": "6651...",
      "originalName": "my-resume.pdf",
      "extractedTextPreview": "John Doe — Software Engineer...",
      "createdAt": "2026-02-17T12:00:00.000Z"
    }
  }
}
```

### Run Analysis

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"resumeId":"6651...","jobDescription":"Looking for a React developer with 3+ years..."}'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "data": {
    "analysis": {
      "id": "6651...",
      "matchScore": 78,
      "matchedSkills": ["React", "JavaScript", "CSS", "Git"],
      "missingSkills": ["TypeScript", "GraphQL"],
      "suggestions": [
        "Add TypeScript projects to your portfolio",
        "Consider obtaining a GraphQL certification"
      ],
      "jobDescription": "Looking for a React developer...",
      "resumeId": "6651...",
      "createdAt": "2026-02-17T12:05:00.000Z"
    }
  }
}
```

### Get Analysis History

```bash
curl http://localhost:5000/api/analysis/history?page=1&limit=10 \
  -H "Authorization: Bearer <token>"
```

### Get Single Analysis

```bash
curl http://localhost:5000/api/analysis/6651... \
  -H "Authorization: Bearer <token>"
```

---

## Frontend Integration

### Sending the Token

After login, the frontend must include the JWT in every protected request:

```
Authorization: Bearer <token>
```

### Consistent JSON Contract

Every response follows this shape:

```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "..." }
```

### Branding

The **ResumeIQ** logo and branding should remain consistent across all frontend pages and match the API documentation.

---

## License

MIT
