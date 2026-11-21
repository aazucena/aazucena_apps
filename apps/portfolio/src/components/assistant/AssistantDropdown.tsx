"use client";

import * as React from "react";
import { Download, Dots, Info, ShieldCheck, Trash } from "@aazucena/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aazucena/ui";

export type AssistantMenuAction =
  "lore" | "transparency" | "expand" | "export" | "clear";

interface AssistantDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: AssistantMenuAction) => void;
  messagesCount: number;
}

export function AssistantDropdown({
  open,
  onOpenChange,
  onAction,
  messagesCount,
}: AssistantDropdownProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="text-muted-foreground hover:bg-state hover:text-foreground rounded-control flex size-8 items-center justify-center transition-colors"
          aria-label="More options"
        >
          <Dots size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="z-[200] min-w-[160px]"
      >
        <DropdownMenuItem
          onSelect={() => {
            onOpenChange(false);
            onAction("lore");
          }}
          className="cursor-pointer gap-2 text-xs"
        >
          <Info size={13} className="shrink-0" />
          About Rin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            onOpenChange(false);
            onAction("transparency");
          }}
          className="cursor-pointer gap-2 text-xs"
        >
          <ShieldCheck size={13} className="shrink-0" />
          Transparency
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            onOpenChange(false);
            onAction("export");
          }}
          disabled={messagesCount === 0}
          className="cursor-pointer gap-2 text-xs"
        >
          <Download size={13} className="shrink-0" />
          Export transcript
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            onOpenChange(false);
            onAction("clear");
          }}
          className="text-destructive focus:text-destructive cursor-pointer gap-2 text-xs"
        >
          <Trash size={13} className="shrink-0" />
          Clear conversation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
