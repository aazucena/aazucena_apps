"use client";

import * as React from "react";
import { Maximize, Minimize } from "@aazucena/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@aazucena/ui";
import { RinAvatar } from "./RinMark";
import {
  AssistantDropdown,
  type AssistantMenuAction,
} from "./AssistantDropdown";
import { type ChatMode } from "./useAssistantChat";

interface AssistantHeaderProps {
  chatMode: ChatMode;
  dropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  onAction: (action: AssistantMenuAction) => void;
  onClose: () => void;
  messagesCount: number;
}

export function AssistantHeader({
  chatMode,
  dropdownOpen,
  onDropdownOpenChange,
  onAction,
  onClose,
  messagesCount,
}: AssistantHeaderProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const ExpandIcon = chatMode === "fullscreen" ? Minimize : Maximize;
  const expandLabel =
    chatMode === "fullscreen"
      ? "Exit full screen"
      : chatMode === "offcanvas"
        ? "Expand to full screen"
        : isMobile
          ? "Full screen"
          : "Open as side panel";

  return (
    <div className="border-border/50 flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <RinAvatar />
        <span className="text-foreground text-xs font-black tracking-widest uppercase">
          Rin
        </span>
      </div>
      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onAction("expand")}
                className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
                aria-label={expandLabel}
              >
                <ExpandIcon size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="z-[9999] text-xs">
              {expandLabel}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AssistantDropdown
          open={dropdownOpen}
          onOpenChange={onDropdownOpenChange}
          onAction={onAction}
          messagesCount={messagesCount}
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
