import React from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { motion } from 'motion/react';
import { Shield, Brain, Lock, GraduationCap } from 'lucide-react';
import { ResumeIQLogo } from '../brand/ResumeIQLogo';

export const Footer = () => {
  return (
    <footer 
      className="border-t border-[#2A2E3B] pt-16 pb-8 px-6"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Trust Badges Row */}
      <div className="max-w-7xl mx-auto mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 p-5 rounded-xl bg-[#151821] border border-[#2A2E3B]">
            <div className="w-10 h-10 rounded-lg bg-[#C6FF00]/10 flex items-center justify-center flex-shrink-0">
              <Brain className="text-[#C6FF00]" size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: COLORS.text }}>AI Transparency</p>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>
                Our AI models are explainable. Every score and suggestion comes with clear reasoning you can verify.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-5 rounded-xl bg-[#151821] border border-[#2A2E3B]">
            <div className="w-10 h-10 rounded-lg bg-[#C6FF00]/10 flex items-center justify-center flex-shrink-0">
              <Lock className="text-[#C6FF00]" size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: COLORS.text }}>Resume Privacy</p>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>
                Your resume is encrypted, never shared with third parties, and automatically deleted after 30 days.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-5 rounded-xl bg-[#151821] border border-[#2A2E3B]">
            <div className="w-10 h-10 rounded-lg bg-[#C6FF00]/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-[#C6FF00]" size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: COLORS.text }}>Built for Students</p>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>
                Designed specifically for campus placements, internships, and early-career professionals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <ResumeIQLogo size="md" />
          <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
            The intelligent resume analysis platform.
            Optimize your career path with AI-driven insights.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Shield size={14} className="text-[#C6FF00]" />
            <span className="text-xs text-[#9E9C96]">SOC2 Compliant • GDPR Ready</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-wider" style={{ color: COLORS.text }}>Product</h4>
          <ul className="space-y-3 text-sm" style={{ color: COLORS.textMuted }}>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Resume Analyzer</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Skill Gap Finder</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Job Matcher</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">API</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-wider" style={{ color: COLORS.text }}>Resources</h4>
          <ul className="space-y-3 text-sm" style={{ color: COLORS.textMuted }}>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Resume Guide</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Interview Prep</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Campus Program</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-wider" style={{ color: COLORS.text }}>Legal</h4>
          <ul className="space-y-3 text-sm" style={{ color: COLORS.textMuted }}>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">Data Security</li>
            <li className="hover:text-[#C6FF00] cursor-pointer transition-colors">AI Ethics Policy</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-[#2A2E3B] flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: COLORS.textMuted }}>
        <p>© 2026 ResumeIQ. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-[#C6FF00] cursor-pointer transition-colors">Twitter</span>
          <span className="hover:text-[#C6FF00] cursor-pointer transition-colors">LinkedIn</span>
          <span className="hover:text-[#C6FF00] cursor-pointer transition-colors">GitHub</span>
          <span className="hover:text-[#C6FF00] cursor-pointer transition-colors">Discord</span>
        </div>
      </div>
    </footer>
  );
};
