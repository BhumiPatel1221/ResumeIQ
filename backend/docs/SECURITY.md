# ResumeIQ — Security Guide

> Authentication flow, password hashing, JWT details, and security best practices.

---

## Authentication Flow

```
┌──────────┐  POST /register   ┌──────────┐  hash    ┌──────────┐
│ Frontend │ ───────────────▶  │ Backend  │ ───────▶ │  bcrypt  │
│          │                   │          │          └──────────┘
│          │ ◀───────────────  │          │ ──────▶ ┌──────────┐
│          │   { token }       │          │  save   │ MongoDB  │
└──────────┘                   └──────────┘         └──────────┘

┌──────────┐  POST /login      ┌──────────┐ compare ┌──────────┐
│ Frontend │ ───────────────▶  │ Backend  │ ───────▶│  bcrypt  │
│          │                   │          │         └──────────┘
│          │ ◀───────────────  │          │ ──────▶ ┌──────────┐
│          │   { token }       │          │  sign   │   JWT    │
└──────────┘                   └──────────┘         └──────────┘

┌──────────┐  GET /protected   ┌──────────┐ verify  ┌──────────┐
│ Frontend │ ───────────────▶  │ auth.js  │ ───────▶│   JWT    │
│  Bearer  │   Authorization   │ middleware│         └──────────┘
│  <token> │                   │          │ ──────▶ ┌──────────┐
│          │ ◀───────────────  │          │  find   │ MongoDB  │
│          │   req.user        └──────────┘         └──────────┘
└──────────┘
```

---

## Password Hashing (bcrypt)

### How It Works

1. User submits a plaintext password during registration
2. A **salt** is generated using `bcrypt.genSalt(12)` (12 rounds)
3. The password is hashed using `bcrypt.hash(password, salt)`
4. Only the **hash** is stored in MongoDB — never the plaintext password

### Why bcrypt?

- **Adaptive** — the cost factor (salt rounds) can be increased as hardware improves
- **Salt built-in** — each password gets a unique salt, preventing rainbow table attacks
- **Slow by design** — makes brute-force attacks computationally expensive
- **12 rounds** provides a good balance between security and performance

### Code Reference

```javascript
// User model pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

## JWT Authentication

### What is JWT?

JSON Web Token (JWT) is a compact, self-contained token that securely transmits information between parties as a JSON object. It consists of three parts:

```
Header.Payload.Signature
```

- **Header** — algorithm & token type (`HS256`)
- **Payload** — user data (`{ id: "user_id" }`)
- **Signature** — HMAC-SHA256 using the server's secret key

### Token Lifecycle

1. **Generation** — on successful login/register, server signs a JWT with the user ID
2. **Storage** — frontend stores the token (localStorage or httpOnly cookie)
3. **Transmission** — frontend sends the token in every protected request header
4. **Verification** — auth middleware verifies the token signature and expiry
5. **Expiry** — token expires after `JWT_EXPIRES_IN` (default: 7 days)

### Sending the Token (Frontend)

```javascript
// Example: Axios interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Token Verification (Backend)

```javascript
// middleware/auth.js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id);
req.user = user; // attach to request
```

---

## Security Best Practices

### 1. Environment Variables

All secrets are stored in `.env` and never committed to version control:

```
JWT_SECRET=...
OPENAI_API_KEY=...
MONGO_URI=...
```

### 2. Password Security

- Passwords are **never** stored in plaintext
- Minimum length of 6 characters enforced at schema level
- `select: false` on the password field — never returned in queries by default
- bcrypt with 12 salt rounds

### 3. CORS Configuration

```javascript
const allowedOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
```

Only explicitly whitelisted origins can access the API.

### 4. Input Validation

- Required fields checked in controllers
- Mongoose schema validation (types, min/max, regex for email)
- File type validation (PDF only) in Multer config
- File size limit (configurable, default 5 MB)

### 5. Error Concealment

- In production, stack traces are **not** sent to the client
- Generic error messages for auth failures ("Invalid email or password") to prevent enumeration
- Custom `ApiError` distinguishes operational errors from programming bugs

### 6. HTTP Security Headers (Recommended Addition)

For production, consider adding `helmet`:

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

This sets secure HTTP headers (X-Frame-Options, Content-Security-Policy, etc.).

### 7. Rate Limiting (Recommended Addition)

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
}));
```

### 8. Data Ownership

- Resume and analysis routes verify that the requesting user **owns** the resource
- `userId` is always compared against the JWT-decoded user before returning data

---

## Checklist

| Practice                          | Status |
| --------------------------------- | ------ |
| Password hashing (bcrypt)         | ✅     |
| JWT authentication                | ✅     |
| Protected private routes          | ✅     |
| Environment variables for secrets | ✅     |
| OpenAI key not exposed            | ✅     |
| CORS configured                   | ✅     |
| Input validation                  | ✅     |
| Error concealment in production   | ✅     |
| Data ownership checks             | ✅     |
| File type validation              | ✅     |
| File size limits                  | ✅     |

---

## Interview Explanation

> "ResumeIQ uses bcrypt with 12 salt rounds to hash passwords before storing them in MongoDB. On login, we compare the plaintext password against the hash using bcrypt.compare(). If valid, we sign a JWT containing the user's ID using a server-side secret. The frontend stores this token and sends it in the Authorization header for every protected request. Our auth middleware extracts the token, verifies it using jwt.verify(), fetches the user from the database, and attaches it to the request. We also validate data ownership — a user can only access their own resumes and analyses."
