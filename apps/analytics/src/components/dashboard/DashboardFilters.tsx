import { useEffect, useState } from 'react';
import { toTitleCase } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleCategory, resetCategories, setSearchQuery } from '@/store';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  categories: string[];
}

export function DashboardFilters({ categories }: ToolbarProps) {
  const visibleCategories = useSelector((state: RootState) => state.dashboard.filters.visibleCategories);
  const searchQuery = useSelector((state: RootState) => state.dashboard.filters.searchQuery);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const CATEGORY_THRESHOLD = 12;
  const hasManyCategories = categories.length > CATEGORY_THRESHOLD;
  const displayedCategories = isExpanded ? categories : categories.slice(0, CATEGORY_THRESHOLD);

  // Initialize store with all categories if empty
  useEffect(() => {
    if (!visibleCategories || visibleCategories.length === 0) {
      dispatch(resetCategories(categories));
    }
  }, [categories, visibleCategories, dispatch]);

  if (!visibleCategories) return null;

  return (
    <div className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl backdrop-blur-md p-6 shadow-sm dark:shadow-none transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Category Toggles */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between gap-8 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                Domain Filter
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 font-mono">
                {visibleCategories.length} / {categories.length}
              </span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => dispatch(resetCategories(categories))}
                className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors uppercase tracking-widest"
              >
                Select All
              </button>
              <button 
                onClick={() => dispatch(resetCategories([]))}
                className="text-[10px] font-bold text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 transition-colors uppercase tracking-widest"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="relative">
            <div className={cn(
              "flex flex-wrap gap-2 transition-all duration-500",
              !isExpanded && "max-h-[80px] overflow-hidden"
            )}>
              {displayedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => dispatch(toggleCategory(cat))}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-wider",
                    visibleCategories.includes(cat)
                      ? "bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20"
                      : "bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  {toTitleCase(cat)}
                </button>
              ))}
              
              {hasManyCategories && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 text-primary-600 dark:text-primary-400 border border-dashed border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors uppercase tracking-widest"
                >
                  + {categories.length - CATEGORY_THRESHOLD} More
                </button>
              )}

              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors uppercase tracking-widest"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skill Search */}
        <div className="w-full lg:w-80 shrink-0">
          <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 block">
            Telemetry Search
          </span>
          <div className="relative group">
            <input 
              type="text"
              placeholder="Filter by event or ID..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button 
                  onClick={() => dispatch(setSearchQuery(''))}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              <svg 
                className={cn(
                  "h-4 w-4 transition-colors",
                  searchQuery ? "text-primary-500" : "text-zinc-400 dark:text-zinc-600"
                )}
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