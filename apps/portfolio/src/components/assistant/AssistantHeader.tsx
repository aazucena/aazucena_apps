"use client";

import * as React from "react";
import { Maximize, Minimize, X } from "@aazucena/icons";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@aazucena/ui";
import { RinCharacter } from "@aazucena/ui";
import {
  AssistantDropdown,
  type AssistantMenuAction,
} from "./AssistantDropdown";
import {
  type ChatMode,
  type RinEmotion,
  type RinBehavior,
} from "./useAssistantChat";

interface AssistantHeaderProps {
  chatMode: ChatMode;
  dropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  onAction: (action: AssistantMenuAction) => void;
  onClose: () => void;
  messagesCount: number;
  currentEmotion: RinEmotion;
  behavior: RinBehavior;
  rinSrc?: string;
}

export function AssistantHeader({
  chatMode,
  dropdownOpen,
  onDropdownOpenChange,
  onAction,
  onClose,
  messagesCount,
  currentEmotion,
  behavior,
  rinSrc,
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
    <div className="border-rule flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <RinCharacter
          src={rinSrc}
          currentEmotion={currentEmotion}
          behavior={behavior}
          className="text-signal h-7 w-7 shrink-0"
        />
        <span className="text-foreground text-sm font-semibold">Rin</span>
      </div>
      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAction("expand")}
                className="text-muted-foreground hover:text-foreground size-8"
                aria-label={expandLabel}
              >
                <ExpandIcon size={18} />
              </Button>
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
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground size-8"
          aria-label="Close chat"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
