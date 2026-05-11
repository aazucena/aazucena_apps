"use client";

import * as React from "react";
import { ChatMessage, ChatAvatar, ChatContent, ChatBubble } from "@aazucena/ui";
import type { UIMessage } from "ai";
import { renderMarkdown } from "./utils";
import { rinAvatarIcon } from "./RinMark";

interface AssistantMessageListProps {
  messages: UIMessage[];
}

export function AssistantMessageList({ messages }: AssistantMessageListProps) {
  return (
    <>
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const parts = msg.parts ?? [];
        const hasVisibleParts = parts.some(
          (p: any) =>
            p.type === "text" ||
            (p.type === "tool-submit_contact_form" &&
              p.state === "result" &&
              p.output?.success === true),
        );
        if (!hasVisibleParts) return null;
        return (
          <ChatMessage key={msg.id} role={msg.role as "user" | "assistant"}>
            {!isUser && <ChatAvatar variant="ai" icon={rinAvatarIcon} />}
            <ChatContent role={msg.role as "user" | "assistant"}>
              {parts.map((part: any, i: number) => {
                if (part.type === "tool-set_emotion") {
                  return null;
                }
                if (part.type === "text") {
                  return (
                    <ChatBubble
                      key={i}
                      variant={isUser ? "muted" : "default"}
                      role={msg.role as "user" | "assistant"}
                      className="p-3 font-sans text-xs"
                    >
                      {isUser ? (
                        <span>{part.text}</span>
                      ) : (
                        // Content from Claude via controlled Vercel AI Gateway.
                        // renderMarkdown strips script/iframe tags as extra defence.
                        <div
                          className="[&_a]:text-primary [&_code]:bg-muted text-xs [&_a]:underline [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[10px] [&_em]:opacity-80 [&_li]:mb-0.5 [&_li]:text-xs [&_ol]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:text-xs [&_p]:mb-1.5 [&_p]:text-xs [&_p]:last:mb-0 [&_strong]:font-semibold [&_ul]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:text-xs"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(part.text),
                          }}
                        />
                      )}
                    </ChatBubble>
                  );
                }
                if (
                  part.type === "tool-submit_contact_form" &&
                  part.state === "result" &&
                  part.output?.success === true
                ) {
                  return (
                    <p
                      key={i}
                      className="mt-1 font-mono text-[10px] text-emerald-500"
                    >
                      ✓ Message sent to Aldrin.
                    </p>
                  );
                }
                return null;
              })}
            </ChatContent>
          </ChatMessage>
        );
      })}
    </>
  );
}
