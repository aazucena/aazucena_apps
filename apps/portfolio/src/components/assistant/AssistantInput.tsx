"use client";

import * as React from "react";
import {
  ChatInputContainer,
  ChatInputWrapper,
  ChatInputArea,
  ChatInputSubmit,
} from "@aazucena/ui";

interface AssistantInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export function AssistantInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  isLoading,
}: AssistantInputProps) {
  return (
    <ChatInputContainer className="px-3 pt-2 pb-3">
      <ChatInputWrapper className="border-foreground/20 bg-muted/30 rounded-xl border-2">
        <ChatInputArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about Aldrin's work…"
          minRows={1}
          maxRows={4}
          disabled={isLoading}
          className="pr-12 text-xs"
        />
        <ChatInputSubmit
          type="button"
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className="h-8 w-8"
        />
      </ChatInputWrapper>
      <p className="text-muted-foreground/50 mt-1.5 text-right text-[9px]">
        <kbd className="font-sans">Shift</kbd> +{" "}
        <kbd className="font-sans">Enter</kbd> for new line
      </p>
    </ChatInputContainer>
  );
}
