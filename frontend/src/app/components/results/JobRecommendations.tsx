import React, { useState } from 'react';
import { motion } from 'motion/react';
import { COLORS, FONTS } from '../../constants/theme';
import { Button } from '../ui/button';
import { Briefcase, MapPin, ExternalLink, Heart } from 'lucide-react';

export const JobRecommendations: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const jobs = [
    {
      id: 1,
      role: 'Senior Frontend Engineer',
      company: 'Vercel',
      match: 94,
      location: 'Remote',
      skills: ['React', 'Next.js', 'TypeScript'],
      type: 'Full-time'
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'Linear',
      match: 88,
      location: 'Hybrid',
      skills: ['Figma', 'System Design', 'React'],
      type: 'Full-time'
    },
    {
      id: 3,
      role: 'Software Engineer, UI',
      company: 'Airbnb',
      match: 76,
      location: 'San Francisco',
      skills: ['React', 'GraphQL', 'Animation'],
      type: 'Onsite'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Recommended For You</h3>
        
        <div className="flex gap-2">
          {['All', 'Remote', 'Hybrid', 'Onsite'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                filter === f 
                  ? 'bg-[#F5F2E8] text-[#0E0F13] border-[#F5F2E8]' 
                  : 'bg-transparent text-[#9E9C96] border-[#2A2E3B] hover:border-[#F5F2E8]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job, i) => (
          <motion.div 
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-[#151821] border border-[#2A2E3B] p-6 rounded-lg hover:border-[#C6FF00] transition-all duration-300 hover:shadow-[0_0_30px_rgba(198,255,0,0.1)]"
          >
            {job.match > 90 && (
               <div className="absolute -top-3 -right-3 bg-[#C6FF00] text-[#0E0F13] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                 TOP MATCH
               </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg mb-1" style={{ color: COLORS.text }}>{job.role}</h4>
                <p className="text-[#9E9C96]">{job.company}</p>
              </div>
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-sm
                ${job.match >= 90 ? 'border-[#C6FF00] text-[#C6FF00]' : job.match >= 80 ? 'border-[#F4EBDD] text-[#F4EBDD]' : 'border-[#FFD700] text-[#FFD700]'}
              `}>
                {job.match}%
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {job.skills.map(s => (
                <span key={s} className="text-xs bg-[#1E222F] text-[#F5F2E8] px-2 py-1 rounded border border-[#2A2E3B]">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#2A2E3B]">
              <div className="flex items-center gap-4 text-sm text-[#9E9C96]">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 hover:bg-[#1E222F] rounded text-[#9E9C96] hover:text-[#FF4D4D] transition-colors">
                   <Heart size={18} />
                 </button>
                 <Button size="sm" variant="outline" icon={<ExternalLink size={14} />}>
                   Apply
                 </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
