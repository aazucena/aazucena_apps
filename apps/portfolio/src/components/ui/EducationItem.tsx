/**
 * EducationItem.tsx
 * An expandable education card showing degree, institution, and detailed description.
 */

import { Calendar, ChevronDown, ClockCircle as Clock } from '@mynaui/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MarkdownRenderer } from '~/components/blocks/MarkdownRenderer';
import { calculateDuration } from '~/lib/utils/experiences';

interface EducationItemProps {
  edu: {
    startDate: string;
    graduationDate?: string | null;
    current: boolean;
    degree: string;
    institution: string;
    description?: string | null;
  };
}

export function EducationItem({ edu }: EducationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatEduDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const duration = calculateDuration(edu.startDate, edu.graduationDate || undefined, edu.current);

  return (
    <div className="relative pl-8 border-l-2 border-gray-100 dark:border-gray-800 pb-8 last:pb-0">
      {/* Timeline Node */}
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-gray-950 border-2 border-blue-500 shadow-sm z-10"></div>
      
      <div 
        className="group cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
              {edu.degree}
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </h3>
            <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">{edu.institution}</p>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
                <Calendar size={12} />
                {formatEduDate(edu.startDate)} — {edu.graduationDate ? formatEduDate(edu.graduationDate) : 'Present'}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100/50 dark:border-blue-800/50 flex items-center gap-1.5">
                <Clock size={12} />
                {duration}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 py-4 border-t border-gray-100 dark:border-gray-800">
                {edu.description ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed">
                    <MarkdownRenderer content={edu.description} />
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No additional details provided.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
