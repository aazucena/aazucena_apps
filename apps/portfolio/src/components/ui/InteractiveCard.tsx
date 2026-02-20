import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "@mynaui/icons-react";

interface InteractiveCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: any;
  color: string;
  initialExpanded?: boolean;
}

export function InteractiveCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  initialExpanded = false,
}: InteractiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div
      className={`group rounded-3xl border p-6 transition-all duration-500 ${isExpanded ? "border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900" : "border-gray-100 bg-gray-50/50 hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:border-gray-700"} `}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start gap-4 text-left"
      >
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${color} transition-transform duration-500 group-hover:scale-110`}
        >
          <Icon size={24} />
        </div>
        <div className="flex-grow pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
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
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-600 italic dark:border-gray-800 dark:text-gray-400">
              {description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
