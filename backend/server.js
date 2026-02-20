/**
 * ===================================================
 *  ResumeIQ — Backend Server Entry Point
 * ===================================================
 *  AI-powered resume analysis and job matching platform.
 *
 *  This file:
 *  1. Loads environment variables
 *  2. Connects to MongoDB
 *  3. Configures Express middleware (CORS, JSON, etc.)
 *  4. Mounts API routes
 *  5. Attaches global error handler
 *  6. Starts the HTTP server
 * ===================================================
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ---------- Import Routes ----------
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// ---------- Initialize Express ----------
const app = express();

// ---------- Connect to MongoDB ----------
connectDB();

// ---------- CORS Configuration ----------
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ---------- Body Parsers ----------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------- Static folder for uploads (optional access) ----------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Health Check ----------
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResumeIQ API is running',
    timestamp: new Date().toISOString(),
  });
});

// ---------- Mount API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analyze', analysisRoutes);       // POST /api/analyze
app.use('/api/analysis', analysisRoutes);      // GET  /api/analysis/history & /api/analysis/:id

// ---------- 404 Handler ----------
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ---------- Global Error Handler ----------
app.use(errorHandler);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║   🚀 ResumeIQ Backend Server              ║
  ║   Running on: http://localhost:${PORT}       ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}            ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
