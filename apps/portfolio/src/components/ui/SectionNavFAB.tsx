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
    <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-3 md:hidden">
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
        <div className="overflow-hidden rounded-xl border border-white/20 bg-black/80 backdrop-blur-md">
          {sectionNames.map((name, index) => (
            <button
              key={name}
              onClick={() => {
                onSectionClick(index);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm transition-colors ${
                currentSection === index
                  ? "bg-cyan-400/20 text-cyan-400"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="w-5 font-mono text-xs text-white/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={currentSection === index ? "font-medium" : ""}>
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
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/70 backdrop-blur-md transition-all duration-200 hover:bg-black/80 hover:text-white active:scale-95"
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
