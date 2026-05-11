"use client";

import * as React from "react";
import { SparklesSolid } from "@aazucena/icons";
import {
  AssistantTrigger,
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@aazucena/ui";

interface AssistantTriggerPopoverProps {
  isOpen: boolean;
  popoverVisible: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  onTriggerClick: () => void;
}

export function AssistantTriggerPopover({
  isOpen,
  popoverVisible,
  onPopoverOpenChange,
  onTriggerClick,
}: AssistantTriggerPopoverProps) {
  return (
    <Popover open={popoverVisible} onOpenChange={onPopoverOpenChange}>
      <PopoverAnchor asChild>
        <AssistantTrigger
          variant="default"
          isOpen={isOpen}
          icon={<SparklesSolid size={18} />}
          label="Chat"
          closeLabel="Close"
          tooltipSide="right"
          className="focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary-dark relative right-auto bottom-auto left-auto h-11 w-auto !rotate-0 rounded-full px-4 shadow-lg duration-300 outline-none hover:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={onTriggerClick}
        />
      </PopoverAnchor>
      <PopoverContent
        side="top"
        sideOffset={16}
        align="start"
        collisionPadding={16}
        className="w-52 p-0"
      >
        <div className="relative px-3 pt-3 pb-3">
          {/* Speech bubble arrow at bottom-left, pointing down toward the trigger */}
          <div className="bg-popover border-border absolute -bottom-[7px] left-12 h-3 w-3 rotate-45 border-r border-b" />
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-xs font-semibold">Hi! I'm Rin.</p>
            <button
              onClick={() => onPopoverOpenChange(false)}
              className="text-muted-foreground hover:text-foreground mt-0.5 shrink-0 rounded p-0.5 transition-colors"
              aria-label="Dismiss"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 1l8 8M9 1L1 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <p className="text-muted-foreground text-[11px]">
            Ask me anything about Aldrin's work.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
