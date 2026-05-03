"use client";

import * as React from "react";
import { Dots, Info, ShieldCheck, Trash } from "@aazucena/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aazucena/ui";

export type AssistantMenuAction = "lore" | "transparency" | "expand" | "clear";

interface AssistantDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: AssistantMenuAction) => void;
}

export function AssistantDropdown({
  open,
  onOpenChange,
  onAction,
}: AssistantDropdownProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground flex h-[32px] w-[32px] items-center justify-center rounded-md transition-colors"
          aria-label="More options"
        >
          <Dots size={32} />
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
