import React, { useState, type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from '@mynaui/icons-react';

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
  color,
  initialExpanded = false,
}: LogDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div
      className={`
        p-6 rounded-3xl border transition-all duration-500 group
        ${isExpanded ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl' : 'bg-gray-50/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}
      `}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-4 text-left"
      >
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${color} transition-transform duration-500 group-hover:scale-110`}
        >
          <Icon size={24} />
        </div>
        <div className="flex-grow pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
          {subtitle && (
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-1">
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
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
              {description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
