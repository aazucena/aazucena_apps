/**
 * EducationItem.tsx
 * An expandable education card showing degree, institution, and detailed description.
 */

import { Calendar, ChevronDown, ClockCircle as Clock } from "@aazucena/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
// TEST 13: stub @aazucena/ui barrel import
// import { MarkdownRenderer } from "@aazucena/ui";
import { calculateDuration } from "@aazucena/utils";

const MarkdownRenderer = ({ content }: { content?: string }) => (
  <div>{content}</div>
);

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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const duration = calculateDuration(
    edu.startDate,
    edu.graduationDate || undefined,
    edu.current,
  );

  return (
    <div className="relative border-l-2 border-gray-100 pb-8 pl-8 last:pb-0 dark:border-gray-800">
      {/* Timeline Node */}
      <div className="absolute top-0 -left-[9px] z-10 h-4 w-4 rounded-full border-2 border-blue-500 bg-white shadow-sm dark:bg-gray-950"></div>

      <div
        className="group cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {edu.degree}
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </h3>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {edu.institution}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-[10px] font-black tracking-widest text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                <Calendar size={12} />
                {formatEduDate(edu.startDate)} —{" "}
                {edu.graduationDate
                  ? formatEduDate(edu.graduationDate)
                  : "Present"}
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-blue-100/50 bg-blue-50/50 px-3 py-1 text-[10px] font-black tracking-widest text-blue-600 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400">
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
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-gray-100 py-4 dark:border-gray-800">
                {edu.description ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-gray-600 dark:text-gray-400">
                    <MarkdownRenderer content={edu.description} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No additional details provided.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
