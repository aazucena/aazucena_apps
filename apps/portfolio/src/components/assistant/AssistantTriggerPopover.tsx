"use client";

import * as React from "react";
import {
  AssistantTrigger,
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@aazucena/ui";
import { RinCharacter } from "@aazucena/ui";
import { type RinEmotion, type RinBehavior } from "./useAssistantChat";

interface AssistantTriggerPopoverProps {
  isOpen: boolean;
  popoverVisible: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  onTriggerClick: () => void;
  currentEmotion: RinEmotion;
  behavior: RinBehavior;
  rinSrc?: string;
}

export function AssistantTriggerPopover({
  isOpen,
  popoverVisible,
  onPopoverOpenChange,
  onTriggerClick,
  currentEmotion,
  behavior,
  rinSrc,
}: AssistantTriggerPopoverProps) {
  return (
    <Popover open={popoverVisible} onOpenChange={onPopoverOpenChange}>
      <PopoverAnchor asChild>
        <AssistantTrigger
          variant="default"
          isOpen={isOpen}
          aria-label={isOpen ? "Close chat" : "Chat with Rin"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          icon={
            <RinCharacter
              src={rinSrc}
              currentEmotion={currentEmotion}
              behavior={behavior}
              className="h-7 w-7"
            />
          }
          label="Chat"
          closeLabel="Close"
          tooltipSide="right"
          className="border-signal bg-background text-signal hover:bg-signal-faint focus-visible:ring-ring rounded-control h-control-lg relative right-auto bottom-auto left-auto w-auto !rotate-0 border px-4 outline-none hover:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={onTriggerClick}
        />
      </PopoverAnchor>
      <PopoverContent
        side="top"
        sideOffset={16}
        align="start"
        collisionPadding={16}
        className="z-[100] w-52 p-0"
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
            What brings you here today?
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
