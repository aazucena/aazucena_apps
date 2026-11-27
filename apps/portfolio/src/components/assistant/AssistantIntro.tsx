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
import { RinCharacter } from "@aazucena/ui";
import type { RinBehavior } from "@aazucena/constants";
import type { RinEmotion } from "~/lib/utils/chat/tools/set-emotion";

interface AssistantIntroProps {
  pathname: string;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  currentEmotion: RinEmotion;
  behavior: RinBehavior;
  rinSrc?: string;
}

export function AssistantIntro({
  pathname,
  isLoading,
  onSendMessage,
  currentEmotion,
  behavior,
  rinSrc,
}: AssistantIntroProps) {
  return (
    <>
      {/* Prominent character portrait — the first thing every visitor sees */}
      <div className="flex flex-col items-center pt-3 pb-1">
        <RinCharacter
          src={rinSrc}
          currentEmotion={currentEmotion}
          behavior={behavior}
          className="h-36 w-36"
        />
      </div>

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
            <p className="text-muted-foreground italic">
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
          "border-series-1 text-foreground hover:bg-state rounded-control h-8 border bg-transparent px-2.5 text-xs",
          "border-series-2 text-foreground hover:bg-state rounded-control h-8 border bg-transparent px-2.5 text-xs",
          "border-series-3 text-foreground hover:bg-state rounded-control h-8 border bg-transparent px-2.5 text-xs",
          "border-series-4 text-foreground hover:bg-state rounded-control h-8 border bg-transparent px-2.5 text-xs",
        ]}
        className="justify-center"
      />
    </>
  );
}
