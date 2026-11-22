"use client";

import * as React from "react";
import { cn } from "@aazucena/utils";
import {
  ChatInputContainer,
  ChatInputWrapper,
  ChatInputArea,
  ChatInputSubmit,
} from "@aazucena/ui";
import { MAX_INPUT_WORDS } from "./constants";
import { MAX_MESSAGE_CHARS } from "~/lib/utils/chat/limits";

interface AssistantInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  wordCount: number;
  charCount: number;
  isOverCharLimit: boolean;
  isOverWordLimit: boolean;
}

export function AssistantInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  isLoading,
  wordCount,
  charCount,
  isOverCharLimit,
  isOverWordLimit,
}: AssistantInputProps) {
  return (
    <ChatInputContainer className="px-3 pt-2 pb-3">
      <ChatInputWrapper className="border-rule bg-state rounded-control border">
        <ChatInputArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Message Rin"
          placeholder="Ask about Aldrin's work…"
          minRows={1}
          maxRows={4}
          disabled={isLoading}
          data-testid="assistant-input"
          className="pb-10 text-base md:text-xs"
        />
        <span
          className={cn(
            "pointer-events-none absolute right-14 bottom-2 font-mono text-[10px] tracking-widest uppercase",
            isOverWordLimit
              ? "text-alert"
              : wordCount >= MAX_INPUT_WORDS * 0.8
                ? "text-warning"
                : "text-muted-foreground",
          )}
        >
          {isOverWordLimit
            ? "▲ "
            : wordCount >= MAX_INPUT_WORDS * 0.8
              ? "◆ "
              : ""}
          {isOverCharLimit
            ? `${charCount} / ${MAX_MESSAGE_CHARS} characters`
            : `${wordCount} / ${MAX_INPUT_WORDS} words`}
        </span>
        <ChatInputSubmit
          type="button"
          onClick={onSend}
          disabled={isLoading || !value.trim() || isOverWordLimit}
          data-testid="assistant-send"
          className="rounded-control h-8 w-8"
        />
      </ChatInputWrapper>
      <p className="text-muted-foreground mt-1.5 text-right font-mono text-[10px] tracking-widest uppercase">
        <kbd className="font-sans">Shift</kbd> +{" "}
        <kbd className="font-sans">Enter</kbd> for new line
      </p>
    </ChatInputContainer>
  );
}
