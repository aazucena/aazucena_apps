/**
 * LogDetailsCard Component
 * Expandable card for displaying specific log details with icons and descriptions.
 */

import React, { useState, type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from '@aazucena/icons';

interface LogDetailsProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: ElementType;
  color: string;
  initialExpanded?: boolean;
}

export function LogDetailsCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color: _color,
  initialExpanded = false,
}: LogDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div
      className={`group \${isExpanded ? "bg-white shadow-xl" : "bg-zinc-50/50 dark:hover:border-zinc-700"} rounded-3xl border border-zinc-100 border-zinc-200 p-6 transition-all duration-500 hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:bg-zinc-900/30`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start gap-4 border-none bg-transparent p-0 text-left outline-none"
      >
        <div
          className={`\${color} flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110`}
        >
          <Icon size={24} />
        </div>
        <div className="flex-grow pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h3>
            <ChevronDown
              size={18}
              className={`\${isExpanded ? "rotate-180" : ""} text-zinc-400 transition-transform duration-300`}
            />
          </div>
          {subtitle && (
            <p className="mt-1 text-xs font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
              {subtitle}
            </p>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-zinc-100 pt-4 text-sm leading-relaxed text-zinc-600 italic dark:border-zinc-800 dark:text-zinc-400">
              {description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
