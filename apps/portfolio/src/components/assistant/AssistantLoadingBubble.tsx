"use client";

import * as React from "react";
import { ChatMessage, ChatAvatar, ChatContent, ChatBubble } from "@aazucena/ui";
import { LOADING_STATUSES } from "./constants";
import { rinAvatarIcon } from "./RinMark";

interface AssistantLoadingBubbleProps {
  statusIdx: number;
}

export function AssistantLoadingBubble({
  statusIdx,
}: AssistantLoadingBubbleProps) {
  return (
    <ChatMessage role="assistant">
      <ChatAvatar variant="ai" icon={rinAvatarIcon} />
      <ChatContent role="assistant">
        <ChatBubble variant="default" role="assistant" className="px-4 py-2.5">
          <span className="flex items-center gap-2">
            <span className="flex shrink-0 items-center gap-0.5">
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-current"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-current"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-current"
                style={{ animationDelay: "300ms" }}
              />
            </span>
            <span className="text-muted-foreground font-sans text-[10px]">
              {LOADING_STATUSES[statusIdx]}
            </span>
          </span>
        </ChatBubble>
      </ChatContent>
    </ChatMessage>
  );
}
