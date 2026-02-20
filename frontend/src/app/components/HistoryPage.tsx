import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS } from '../constants/theme';
import { Button } from './ui/button';
import { getAnalysisHistory } from '../services/api';
import { Clock, FileText, Target, ChevronRight, Loader2, RefreshCw, Inbox } from 'lucide-react';
import type { AnalysisResult } from '../App';
import { useAnalysisFlow } from '../context/AnalysisFlowContext';

interface AnalysisHistoryItem {
  _id: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  jobDescription: string;
  resumeId: { _id: string; originalName: string } | string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAnalysisResult } = useAnalysisFlow();

  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalysisHistory(page, 10);
      setAnalyses(res.data.analyses);
      setPagination(res.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage, fetchHistory]);

  const handleViewResult = (item: AnalysisHistoryItem) => {
    const result: AnalysisResult = {
      id: item._id,
      matchScore: item.matchScore,
      matchedSkills: item.matchedSkills,
      missingSkills: item.missingSkills,
      suggestions: item.suggestions,
      jobDescription: item.jobDescription,
      resumeId: typeof item.resumeId === 'string' ? item.resumeId : item.resumeId._id,
      createdAt: item.createdAt,
    };
    setAnalysisResult(result);
    navigate('/results');
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return COLORS.success;
    if (score >= 50) return COLORS.warning;
    return COLORS.error;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLen = 120) =>
    text.length > maxLen ? text.substring(0, maxLen) + '...' : text;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-28 pb-20 px-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            Analysis History
          </h1>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>
            Review your past resume analyses and track your progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchHistory(currentPage)}
            className="gap-2"
          >
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button size="sm" onClick={() => navigate('/upload')} className="gap-2">
            + New Analysis
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 size={32} className="animate-spin" style={{ color: COLORS.accent }} />
          <p className="text-sm" style={{ color: COLORS.textMuted }}>
            Loading history...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-lg mb-4" style={{ color: COLORS.error }}>
            {error}
          </p>
          <Button variant="outline" onClick={() => fetchHistory(currentPage)}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && analyses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center border"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}
          >
            <Inbox size={32} style={{ color: COLORS.textMuted }} />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium mb-1" style={{ color: COLORS.text }}>
              No analyses yet
            </p>
            <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>
              Upload a resume and run your first analysis to see results here.
            </p>
            <Button onClick={() => navigate('/upload')}>Start Your First Analysis</Button>
          </div>
        </div>
      )}

      {/* History List */}
      {!loading && !error && analyses.length > 0 && (
        <>
          <div className="space-y-4">
            <AnimatePresence>
              {analyses.map((item, index) => {
                const resumeName =
                  typeof item.resumeId === 'object' && item.resumeId?.originalName
                    ? item.resumeId.originalName
                    : 'Resume';

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleViewResult(item)}
                    className="group cursor-pointer rounded-xl border p-5 transition-all hover:border-[#C6FF00]/30 hover:bg-[#151821]/80"
                    style={{
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.surface,
                    }}
                  >
                    <div className="flex items-start gap-5">
                      {/* Score Badge */}
                      <div
                        className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center border"
                        style={{
                          borderColor: `${getScoreColor(item.matchScore)}40`,
                          backgroundColor: `${getScoreColor(item.matchScore)}10`,
                        }}
                      >
                        <span
                          className="text-xl font-bold"
                          style={{ color: getScoreColor(item.matchScore) }}
                        >
                          {item.matchScore}
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-wide"
                          style={{ color: COLORS.textMuted }}
                        >
                          score
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={14} style={{ color: COLORS.accent }} />
                          <span
                            className="text-sm font-medium truncate"
                            style={{ color: COLORS.text }}
                          >
                            {resumeName}
                          </span>
                        </div>

                        <p
                          className="text-sm leading-relaxed mb-3"
                          style={{ color: COLORS.textMuted }}
                        >
                          {truncateText(item.jobDescription)}
                        </p>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Target size={12} style={{ color: COLORS.success }} />
                            <span className="text-xs" style={{ color: COLORS.textMuted }}>
                              {item.matchedSkills.length} matched
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target size={12} style={{ color: COLORS.error }} />
                            <span className="text-xs" style={{ color: COLORS.textMuted }}>
                              {item.missingSkills.length} missing
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} style={{ color: COLORS.textMuted }} />
                            <span className="text-xs" style={{ color: COLORS.textMuted }}>
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={20}
                        className="flex-shrink-0 mt-5 transition-transform group-hover:translate-x-1"
                        style={{ color: COLORS.textMuted }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm px-4" style={{ color: COLORS.textMuted }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
