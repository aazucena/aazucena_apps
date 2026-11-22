import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  visibleCategoriesStore,
  toggleCategory,
  resetCategories,
  skillSearchQueryStore,
} from "~/store/journey";
import { Filter, Search } from "@aazucena/icons";
import { toTitleCase } from "@aazucena/utils";
import { Button, Input } from "@aazucena/ui";

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
    <div className="flex flex-col gap-4">
      {/* Mobile-only filter toggle + search */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="journey-domain-filter"
          className="shrink-0 lg:hidden"
        >
          <Filter aria-hidden />
          Filters
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
            aria-hidden="true"
            className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Button>

        <div className="relative flex-1">
          <Input
            type="text"
            aria-label="Search technology"
            placeholder="Search technology…"
            value={searchQuery}
            onChange={(e) => skillSearchQueryStore.set(e.target.value)}
            className="pl-8 font-mono"
          />
          <Search
            aria-hidden
            size={14}
            className={`pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 transition-colors ${searchQuery ? "text-signal" : "text-muted-foreground"}`}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-signal absolute top-1/2 right-2 -translate-y-1/2 p-1 focus-visible:outline-2"
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
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Domain filter: collapsed on mobile, always open from lg */}
      <div
        id="journey-domain-filter"
        role="group"
        aria-label="Domain filter"
        className={`lg:block ${filtersOpen ? "block" : "hidden"}`}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="micro-label text-muted-foreground">
            Domain filter{" "}
            <span className="text-foreground tabular-nums">
              {activeCount}/{totalCount}
            </span>
            {!allSelected && <span className="sr-only"> (filtered)</span>}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => resetCategories(categories)}
              className="micro-label text-signal focus-visible:outline-signal hover:underline focus-visible:outline-2"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => visibleCategoriesStore.set(new Set())}
              className="micro-label text-muted-foreground hover:text-foreground focus-visible:outline-signal focus-visible:outline-2"
            >
              Clear
            </button>
          </div>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const on = visibleCategories.has(cat);
            return (
              <li key={cat}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCategory(cat)}
                  className={`micro-label rounded-control focus-visible:outline-signal border px-2 py-1 focus-visible:outline-2 ${
                    on
                      ? "border-signal bg-signal-faint text-signal"
                      : "border-rule text-muted-foreground hover:bg-state"
                  }`}
                >
                  {toTitleCase(cat)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
