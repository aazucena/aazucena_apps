"use client";

import * as React from "react";
import { RinAvatar } from "./RinMark";
import { AssistantDropdown } from "./AssistantDropdown";

interface AssistantHeaderProps {
  isExpanded: boolean;
  dropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  onToggleExpand: () => void;
  onOpenLore: () => void;
  onOpenClear: () => void;
  onClose: () => void;
}

export function AssistantHeader({
  isExpanded,
  dropdownOpen,
  onDropdownOpenChange,
  onToggleExpand,
  onOpenLore,
  onOpenClear,
  onClose,
}: AssistantHeaderProps) {
  return (
    <div className="border-border/50 flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <RinAvatar />
        <span className="text-foreground text-xs font-black tracking-widest uppercase">
          Rin
        </span>
      </div>
      <div className="flex items-center gap-1">
        <AssistantDropdown
          open={dropdownOpen}
          onOpenChange={onDropdownOpenChange}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          onOpenLore={onOpenLore}
          onOpenClear={onOpenClear}
        />
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
          aria-label="Close chat"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
