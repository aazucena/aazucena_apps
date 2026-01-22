/**
 * AskMeAbout.tsx
 * A personal context component prompting interview questions.
 * Designed to look like a direct message or tip from the candidate.
 */

import { MessageDots } from '@mynaui/icons-react';
import type { JSX } from 'react';

interface AskMeAboutProps {
  topics: string[];
}

export function AskMeAbout({ topics }: AskMeAboutProps): JSX.Element | null {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 relative overflow-hidden group print:break-inside-avoid">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <MessageDots size={64} className="text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <MessageDots className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Ask Me About...
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">
          Want to dive deeper? I'd love to chat about these specific challenges I tackled in this role:
        </p>
        <ul className="space-y-2">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-start gap-2 text-blue-800 dark:text-blue-200 text-sm font-medium">
              <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
