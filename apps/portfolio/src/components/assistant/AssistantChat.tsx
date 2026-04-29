"use client";

import * as React from "react";
import { SparklesSolid } from "@aazucena/icons";
import {
  AssistantTrigger,
  Chat,
  ChatFeed,
  ChatMessage,
  ChatAvatar,
  ChatContent,
  ChatBubble,
} from "@aazucena/ui";
import { renderMarkdown } from "./utils";
import { rinAvatarIcon } from "./RinMark";
import { AssistantLoreOverlay } from "./AssistantLoreOverlay";
import { AssistantHeader } from "./AssistantHeader";
import { AssistantClearDialog } from "./AssistantClearDialog";
import { AssistantIntro } from "./AssistantIntro";
import { AssistantLoadingBubble } from "./AssistantLoadingBubble";
import { AssistantInput } from "./AssistantInput";
import { useAssistantChat } from "./useAssistantChat";

export default function AssistantChat() {
  const {
    isOpen,
    setIsOpen,
    isExpanded,
    setIsExpanded,
    input,
    setInput,
    clearDialogOpen,
    setClearDialogOpen,
    loreDialogOpen,
    setLoreDialogOpen,
    dropdownOpen,
    setDropdownOpen,
    loadingStatusIdx,
    feedRef,
    pathname,
    messages,
    sendMessage,
    isLoading,
    handleClear,
    handleSend,
    handleKeyDown,
  } = useAssistantChat();

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 z-[100]"
          : "fixed bottom-8 left-8 z-[100] flex flex-col items-start gap-3"
      }
    >
      {isOpen && (
        <div
          className={
            isExpanded
              ? "bg-background relative flex h-full w-full flex-col overflow-hidden"
              : "border-border bg-background relative flex h-[480px] max-h-[60vh] w-80 flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300"
          }
        >
          {loreDialogOpen && (
            <AssistantLoreOverlay onClose={() => setLoreDialogOpen(false)} />
          )}

          <AssistantHeader
            isExpanded={isExpanded}
            dropdownOpen={dropdownOpen}
            onDropdownOpenChange={setDropdownOpen}
            onToggleExpand={() => setIsExpanded((e) => !e)}
            onOpenLore={() => setLoreDialogOpen(true)}
            onOpenClear={() => setClearDialogOpen(true)}
            onClose={() => setIsOpen(false)}
          />

          <Chat className="flex-1 overflow-hidden">
            <ChatFeed ref={feedRef} className="space-y-4 p-4">
              {messages.length === 0 && (
                <AssistantIntro
                  pathname={pathname}
                  isLoading={isLoading}
                  onSendMessage={(text) => sendMessage({ text })}
                />
              )}
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const parts = msg.parts ?? [];
                return (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role as "user" | "assistant"}
                  >
                    {!isUser && (
                      <ChatAvatar variant="ai" icon={rinAvatarIcon} />
                    )}
                    <ChatContent role={msg.role as "user" | "assistant"}>
                      {parts.map((part: any, i: number) => {
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
                                // chatMarked strips script/iframe tags as extra defence.
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
              {isLoading && (
                <AssistantLoadingBubble statusIdx={loadingStatusIdx} />
              )}
            </ChatFeed>

            <AssistantInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
            />
          </Chat>
        </div>
      )}

      <AssistantClearDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        onConfirm={handleClear}
      />

      {!isExpanded && (
        <AssistantTrigger
          variant="default"
          isOpen={isOpen}
          icon={<SparklesSolid size={18} />}
          label="Chat"
          closeLabel="Close"
          tooltipSide="right"
          className="focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary-dark relative right-auto bottom-auto left-auto h-11 w-auto !rotate-0 rounded-full px-4 shadow-lg duration-300 outline-none hover:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={() => setIsOpen((o) => !o)}
        />
      )}
    </div>
  );
}
