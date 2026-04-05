import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  visibleCategoriesStore,
  toggleCategory,
  resetCategories,
  skillSearchQueryStore,
} from "~/store/journey";
import { toTitleCase } from "@aazucena/utils";

interface ToolbarProps {
  categories: string[];
}

export function Toolbar({ categories }: ToolbarProps) {
  const visibleCategories = useStore(visibleCategoriesStore);
  const searchQuery = useStore(skillSearchQueryStore);
  const [isExpanded, setIsExpanded] = useState(false);

  const CATEGORY_THRESHOLD = 12;
  const hasManyCategories = categories.length > CATEGORY_THRESHOLD;
  const displayedCategories = isExpanded
    ? categories
    : categories.slice(0, CATEGORY_THRESHOLD);

  // Initialize store with all categories if empty
  useEffect(() => {
    if (visibleCategories === null) {
      resetCategories(categories);
    }
  }, [categories, visibleCategories]);

  if (visibleCategories === null) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        {/* Category Toggles */}
        <div className="w-full flex-1">
          <div className="mb-3 flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
                Domain Filter
              </span>
              <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-500 dark:bg-gray-800">
                {visibleCategories.size} / {categories.length}
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => resetCategories(categories)}
                className="text-[10px] font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
              >
                Select All
              </button>
              <button
                onClick={() => visibleCategoriesStore.set(new Set())}
                className="text-[10px] font-bold text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Desktop: Wrap with Expand | Mobile: Horizontal Scroll */}
            <div
              className={`scrollbar-hide flex flex-wrap gap-1.5 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0 ${!isExpanded && "max-h-[72px] overflow-hidden lg:max-h-none"}`}
            >
              {displayedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex-shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                    visibleCategories.has(cat)
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-100 dark:shadow-none"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                  }`}
                >
                  {toTitleCase(cat)}
                </button>
              ))}

              {hasManyCategories && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="rounded-lg border border-dashed border-blue-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-extrabold text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-900/50 dark:bg-gray-800 dark:text-blue-400"
                >
                  + {categories.length - CATEGORY_THRESHOLD} More
                </button>
              )}

              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-extrabold text-gray-400 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skill Search */}
        <div className="w-full shrink-0 lg:w-72">
          <span className="mb-3 block text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
            Search Technology
          </span>
          <div className="group relative">
            <input
              type="text"
              placeholder="Filter specific skills..."
              value={searchQuery}
              onChange={(e) => skillSearchQueryStore.set(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
            />
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => skillSearchQueryStore.set("")}
                  className="rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
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
                    className="text-gray-400"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <svg
                className={`h-4 w-4 transition-colors ${searchQuery ? "text-blue-500" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
