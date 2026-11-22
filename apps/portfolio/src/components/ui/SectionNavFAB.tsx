/**
 * SectionNavFAB Component
 * Mobile-only floating action button for section navigation.
 * Replaces the dot indicators on small screens with a named list.
 */

import { useState, useEffect } from "react";
import type { JSX } from "react";
import { DotGrid, X } from "@aazucena/icons";

export interface SectionNavFABProps {
  currentSection: number;
  sectionNames: string[];
  onSectionClick: (index: number) => void;
}

export function SectionNavFAB({
  currentSection,
  sectionNames,
  onSectionClick,
}: SectionNavFABProps): JSX.Element {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      data-testid="section-nav-fab"
      className="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-3 md:hidden"
    >
      {/* Backdrop — closes list on outside tap */}
      {open && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Section list — opens upward above FAB */}
      {open && (
        <div className="rounded-card border-rule-strong bg-panel overflow-hidden border">
          {sectionNames.map((name, index) => (
            <button
              key={name}
              onClick={() => {
                onSectionClick(index);
                setOpen(false);
              }}
              data-testid={`section-nav-item-${index}`}
              className={`focus-visible:outline-signal flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm transition-colors focus-visible:outline-1 focus-visible:-outline-offset-2 ${
                currentSection === index
                  ? "bg-state text-foreground"
                  : "text-muted-foreground hover:bg-state hover:text-foreground"
              }`}
              aria-current={currentSection === index ? "step" : undefined}
            >
              <span className="text-muted-foreground w-5 font-mono text-xs">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={
                  currentSection === index ? "text-signal font-medium" : ""
                }
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* FAB trigger — dot grid icon, distinct from the toolbar's hamburger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={
          open ? "Close section navigation" : "Open section navigation"
        }
        aria-expanded={open}
        data-testid="section-nav-fab-trigger"
        className="press rounded-control border-rule-strong bg-panel text-foreground hover:bg-state focus-visible:outline-signal flex size-12 items-center justify-center border transition-[background-color] duration-(--motion-base) focus-visible:outline-1 focus-visible:outline-offset-2"
      >
        {open ? (
          <X size={14} aria-hidden="true" />
        ) : (
          <DotGrid size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
