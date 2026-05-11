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
  // Mobile: filters collapsed by default; desktop always expanded via CSS
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Initialize store with all categories on first mount
  useEffect(() => {
    if (visibleCategories === null) {
      resetCategories(categories);
    }
  }, [categories, visibleCategories]);

  if (visibleCategories === null) return null;

  const activeCount = visibleCategories.size;
  const totalCount = categories.length;
  const allSelected = activeCount === totalCount;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90">
      {/* ── Top bar: always visible ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 p-4">
        {/* Mobile-only filter toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold transition-colors hover:bg-gray-100 lg:hidden dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Filters</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-auto transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Search — full width on mobile, fixed width on desktop */}
        <div className="group relative flex-1">
          <input
            type="text"
            placeholder="Search technology…"
            value={searchQuery}
            onChange={(e) => skillSearchQueryStore.set(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
          />
          <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
            {searchQuery && (
              <button
                className="pointer-events-auto rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => skillSearchQueryStore.set("")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
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

      {/* ── Filter pills ─────────────────────────────────────────────────── */}
      {/*
        Mobile: shown only when filtersOpen=true (accordion).
        Desktop: always visible (lg:block overrides the conditional class).
      */}
      <div
        className={`border-t border-gray-100 lg:block dark:border-gray-800 ${filtersOpen ? "block" : "hidden"}`}
      >
        <div className="p-4 pt-3">
          {/* Filter header — always visible inside the pills panel */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
                Domain Filter
              </span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-black tabular-nums ${
                  allSelected
                    ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                {activeCount}/{totalCount}
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => resetCategories(categories)}
                className="text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
              >
                Select All
              </button>
              <button
                onClick={() => visibleCategoriesStore.set(new Set())}
                className="text-[11px] font-bold text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Pills — wrap on desktop, horizontal scroll on mobile */}
          <div className="scrollbar-hide flex gap-1.5 overflow-x-auto pb-0.5 lg:flex-wrap lg:overflow-visible">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                  visibleCategories.has(cat)
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-100 dark:shadow-none"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                }`}
              >
                {toTitleCase(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
