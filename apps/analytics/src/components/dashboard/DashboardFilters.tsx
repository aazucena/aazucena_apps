import { useEffect, useState } from 'react';
import { toTitleCase } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleCategory, resetCategories, setSearchQuery } from '@/store';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  categories: string[];
}

export function DashboardFilters({ categories }: ToolbarProps) {
  const visibleCategories = useSelector(
    (state: RootState) => state.dashboard.filters.visibleCategories,
  );
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
    <div className="rounded-card border border-rule bg-panel p-panel">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        {/* Category Toggles */}
        <div className="w-full flex-1">
          <div className="mb-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="micro-label text-muted-foreground">Domain Filter</span>
              <span className="rounded-control border border-rule px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {visibleCategories.length} / {categories.length}
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => dispatch(resetCategories(categories))}
                className="micro-label text-signal hover:underline"
              >
                Select All
              </button>
              <button
                onClick={() => dispatch(resetCategories([]))}
                className="micro-label text-muted-foreground hover:text-foreground"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className={cn('flex flex-wrap gap-2', !isExpanded && 'max-h-[80px] overflow-hidden')}
            >
              {displayedCategories.map((cat) => (
                <button
                  key={cat}
                  aria-pressed={visibleCategories.includes(cat)}
                  onClick={() => dispatch(toggleCategory(cat))}
                  className={cn(
                    'micro-label h-control-sm rounded-control border px-3 transition-colors',
                    visibleCategories.includes(cat)
                      ? 'border-signal bg-signal text-signal-foreground'
                      : 'border-rule text-muted-foreground hover:bg-state hover:text-foreground',
                  )}
                >
                  {toTitleCase(cat)}
                </button>
              ))}

              {hasManyCategories && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="micro-label h-control-sm rounded-control border border-dashed border-rule px-3 text-signal hover:bg-state"
                >
                  + {categories.length - CATEGORY_THRESHOLD} More
                </button>
              )}

              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="micro-label h-control-sm rounded-control border border-rule px-3 text-muted-foreground hover:bg-state"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry search */}
        <div className="w-full shrink-0 lg:w-80">
          <label
            htmlFor="telemetry-search"
            className="micro-label mb-3 block text-muted-foreground"
          >
            Telemetry Search
          </label>
          <div className="relative">
            <input
              id="telemetry-search"
              type="text"
              placeholder="Filter by event or ID..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="h-control w-full rounded-control border border-rule bg-background px-3 pr-16 font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-signal"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {searchQuery && (
                <button
                  aria-label="Clear search"
                  onClick={() => dispatch(setSearchQuery(''))}
                  className="rounded-control p-1 text-muted-foreground hover:bg-state hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <svg
                className={cn('h-4 w-4', searchQuery ? 'text-signal' : 'text-muted-foreground')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
