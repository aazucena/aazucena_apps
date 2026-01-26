import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { visibleCategoriesStore, toggleCategory, resetCategories, skillSearchQueryStore } from '../store';
import { toTitleCase } from '~/lib/utils/text';

interface ToolbarProps {
  categories: string[];
}

export function Toolbar({ categories }: ToolbarProps) {
  const visibleCategories = useStore(visibleCategoriesStore);
  const searchQuery = useStore(skillSearchQueryStore);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const CATEGORY_THRESHOLD = 12;
  const hasManyCategories = categories.length > CATEGORY_THRESHOLD;
  const displayedCategories = isExpanded ? categories : categories.slice(0, CATEGORY_THRESHOLD);

  // Initialize store with all categories if empty
  useEffect(() => {
    if (visibleCategories === null) {
      resetCategories(categories);
    }
  }, [categories, visibleCategories]);

  if (visibleCategories === null) return null;

  return (
    <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-2xl backdrop-blur-md p-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Category Toggles */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between gap-8 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                Domain Filter
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-bold text-gray-500">
                {visibleCategories.size} / {categories.length}
              </span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => resetCategories(categories)}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
              >
                Select All
              </button>
              <button 
                onClick={() => visibleCategoriesStore.set(new Set())}
                className="text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Desktop: Wrap with Expand | Mobile: Horizontal Scroll */}
            <div className={`flex flex-wrap lg:flex-wrap gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide ${!isExpanded && 'max-h-[72px] lg:max-h-none overflow-hidden'}`}>
              {displayedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                    visibleCategories.has(cat)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100 dark:shadow-none'
                      : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {toTitleCase(cat)}
                </button>
              ))}
              
              {hasManyCategories && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-dashed border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 transition-colors"
                >
                  + {categories.length - CATEGORY_THRESHOLD} More
                </button>
              )}

              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skill Search */}
        <div className="w-full lg:w-72 shrink-0">
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 block">
            Search Technology
          </span>
          <div className="relative group">
            <input 
              type="text"
              placeholder="Filter specific skills..."
              value={searchQuery}
              onChange={(e) => skillSearchQueryStore.set(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button 
                  onClick={() => skillSearchQueryStore.set('')}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              <svg 
                className={`h-4 w-4 transition-colors ${searchQuery ? 'text-blue-500' : 'text-gray-400'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
