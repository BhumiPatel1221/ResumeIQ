# ResumeIQ
ResumeIQ is a full-stack AI-driven SaaS application that compares resumes with job descriptions to deliver match scores, skill gap analysis, and personalized improvement insights.
# ResumeIQ — AI-Powered Resume Analyzer & Job Matcher

## Features

- **Resume Upload & Parsing** — Upload PDF resumes; text is automatically extracted for analysis.
- **AI-Powered Analysis** — Uses OpenAI GPT-4o to compare resume content against job descriptions.
- **Match Score** — Get a percentage-based compatibility score between your resume and the target role.
- **Missing Skills Detection** — Identifies key skills from the job description absent in your resume.
- **Improvement Suggestions** — Personalized, actionable tips to strengthen your resume.
- **Job Recommendations** — AI-suggested roles that align with your experience and skills.
- **Analysis History** — View and revisit past analyses from your dashboard.
- **Authentication** — Secure JWT-based signup/login flow.

---

## Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Radix UI |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose          |
| **AI Service** | Python, FastAPI, Sentence-Transformers, KeyBERT |
| **AI Model** | OpenAI GPT-4o (via API)                         |
| **Auth**     | JWT, bcrypt                                     |
| **File Handling** | Multer, pdf-parse                          |

---

## Architecture

```
┌──────────────┐     REST API      ┌──────────────────────┐
│   Frontend   │ ────────────────▶ │   Express.js Server  │
│  (React SPA) │ ◀──────────────── │   (Node.js)          │
└──────────────┘   JSON responses  └──────────┬───────────┘
                                              │
                        ┌─────────────────────┼─────────────────────┐
                        │                     │                     │
                        ▼                     ▼                     ▼
                ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
                │   MongoDB    │     │  OpenAI API  │     │ Python AI    │
                │  (Mongoose)  │     │  (GPT-4o)    │     │ Service      │
                └──────────────┘     └──────────────┘     └──────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **Python** >= 3.10
- **MongoDB** (local or Atlas)
- **OpenAI API key**

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ResumeIQ.git
cd ResumeIQ
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

Start the server:

```bash
npm run dev
```

### 3. AI Service setup

```bash
cd backend/ai_service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 4. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
ResumeIQ/
├── backend/
│   ├── ai_service/       # Python FastAPI AI microservice
│   ├── config/            # DB & file upload configuration
│   ├── controllers/       # Route handler logic
│   ├── middleware/         # Auth & error handling middleware
│   ├── models/            # Mongoose schemas (User, Resume, Analysis)
│   ├── routes/            # Express route definitions
│   ├── services/          # AI service integration layer
│   ├── uploads/           # Uploaded resume files (git-ignored)
│   └── server.js          # Express app entry point
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── components/   # React UI components
│       │   ├── context/      # Auth & analysis flow context
│       │   ├── constants/    # Theme configuration
│       │   └── services/     # API client
│       └── styles/           # CSS & Tailwind config
└── README.md
```

---

## API Endpoints

| Method | Endpoint               | Description                  | Auth |
| ------ | ---------------------- | ---------------------------- | ---- |
| POST   | `/api/auth/register`   | Register a new user          | No   |
| POST   | `/api/auth/login`      | Login & receive JWT          | No   |
| POST   | `/api/resume/upload`   | Upload a PDF resume          | Yes  |
| POST   | `/api/analyze`         | Analyze resume vs job desc   | Yes  |
| GET    | `/api/analyze/history` | Get user's analysis history  | Yes  |

---

## License

This project is licensed under the [MIT License](LICENSE).
