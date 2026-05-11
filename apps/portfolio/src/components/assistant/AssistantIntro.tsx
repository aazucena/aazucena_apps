"use client";

import * as React from "react";
import {
  ChatMessage,
  ChatAvatar,
  ChatContent,
  ChatBubble,
  ChatSuggestion,
} from "@aazucena/ui";
import { getSuggestions } from "./constants";
import { rinAvatarIcon } from "./RinMark";

interface AssistantIntroProps {
  pathname: string;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export function AssistantIntro({
  pathname,
  isLoading,
  onSendMessage,
}: AssistantIntroProps) {
  return (
    <>
      <ChatMessage role="assistant">
        <ChatAvatar variant="ai" icon={rinAvatarIcon} />
        <ChatContent role="assistant">
          <ChatBubble
            variant="default"
            role="assistant"
            className="space-y-2 p-3 font-sans text-xs [&_li]:text-xs [&_p]:text-xs [&_strong]:text-xs [&_ul]:text-xs"
          >
            <p>
              I'm <strong>Rin</strong>. I know <strong>Aldrin Azucena</strong>'s
              work well. The projects, the thinking behind them, the skills he's
              built, and where he's headed next.
            </p>
            <p className="text-muted-foreground/80 italic">
              What brings you here today?
            </p>
          </ChatBubble>
        </ChatContent>
      </ChatMessage>
      <ChatSuggestion
        suggestions={getSuggestions(pathname)}
        onSelectSuggestion={(s) => {
          if (!isLoading) onSendMessage(s);
        }}
        chipColors={[
          "h-7 px-2.5 text-[10px] rounded-full border bg-cyan-500/10 border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300",
          "h-7 px-2.5 text-[10px] rounded-full border bg-violet-500/10 border-violet-500/25 text-violet-400 hover:bg-violet-500/20 hover:text-violet-300",
          "h-7 px-2.5 text-[10px] rounded-full border bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300",
          "h-7 px-2.5 text-[10px] rounded-full border bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300",
        ]}
        className="justify-center"
      />
    </>
  );
}
