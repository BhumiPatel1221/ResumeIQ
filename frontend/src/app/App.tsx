import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Header } from './components/layout/Header';
import { Landing } from './components/Landing';
import { UploadResume } from './components/UploadResume';
import { JobInput } from './components/JobInput';
import { Analyzing } from './components/Analyzing';
import { Results } from './components/Results';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { HistoryPage } from './components/HistoryPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { COLORS } from './constants/theme';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { AnalysisFlowProvider } from './context/AnalysisFlowContext';

// ---------- Analysis result type ----------
export interface AnalysisResult {
  id: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  jobDescription: string;
  resumeId: string;
  createdAt: string;
}

function AppInner() {
  return (
    <div
      className="min-h-screen text-[#F5F2E8] font-sans selection:bg-[#C6FF00] selection:text-[#0E0F13]"
      style={{ backgroundColor: COLORS.background }}
    >
      <Toaster position="top-center" richColors theme="dark" />
      <Header />

      <main className="relative z-0">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-input"
            element={
              <ProtectedRoute>
                <JobInput />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzing"
            element={
              <ProtectedRoute>
                <Analyzing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all → redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AnalysisFlowProvider>
        <AppInner />
      </AnalysisFlowProvider>
    </AuthProvider>
  );
}
