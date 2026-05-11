"use client";

import * as React from "react";
import { Chat, ChatFeed } from "@aazucena/ui";
import { AssistantLoreOverlay } from "./AssistantLoreOverlay";
import { AssistantTransparencyOverlay } from "./AssistantTransparencyOverlay";
import { AssistantHeader } from "./AssistantHeader";
import { AssistantClearDialog } from "./AssistantClearDialog";
import { AssistantIntro } from "./AssistantIntro";
import { AssistantLoadingBubble } from "./AssistantLoadingBubble";
import { AssistantInput } from "./AssistantInput";
import { AssistantMessageList } from "./AssistantMessageList";
import { AssistantTriggerPopover } from "./AssistantTriggerPopover";
import { useAssistantChat } from "./useAssistantChat";
import { TRANSPARENCY_KEY } from "./constants";
import { exportTranscript } from "./utils";
import { outerVariants, innerVariants } from "./variants";

export default function AssistantChat() {
  const {
    isOpen,
    setIsOpen,
    chatMode,
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
    wordCount,
    isOverWordLimit,
    transparencyOpen,
    setTransparencyOpen,
    popoverVisible,
    setPopoverVisible,
    handleTriggerClick,
    handleCycleMode,
    handleClear,
    handleSend,
    handleKeyDown,
  } = useAssistantChat();

  return (
    <div className={outerVariants({ mode: chatMode })}>
      {isOpen && (
        <div className={innerVariants({ mode: chatMode })}>
          {loreDialogOpen && (
            <AssistantLoreOverlay onClose={() => setLoreDialogOpen(false)} />
          )}

          {transparencyOpen && (
            <AssistantTransparencyOverlay
              onClose={() => {
                try {
                  localStorage.setItem(TRANSPARENCY_KEY, "true");
                } catch {
                  // ignore
                }
                setTransparencyOpen(false);
              }}
            />
          )}

          <AssistantHeader
            chatMode={chatMode}
            dropdownOpen={dropdownOpen}
            onDropdownOpenChange={setDropdownOpen}
            messagesCount={messages.length}
            onAction={(action) => {
              switch (action) {
                case "lore":
                  setLoreDialogOpen(true);
                  break;
                case "transparency":
                  setTransparencyOpen(true);
                  break;
                case "expand":
                  handleCycleMode();
                  break;
                case "export":
                  exportTranscript(messages);
                  break;
                case "clear":
                  setClearDialogOpen(true);
                  break;
              }
            }}
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
              <AssistantMessageList messages={messages} />
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
              wordCount={wordCount}
              isOverWordLimit={isOverWordLimit}
            />
          </Chat>
        </div>
      )}

      <AssistantClearDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        onConfirm={handleClear}
      />

      {chatMode === "floating" && (
        <AssistantTriggerPopover
          isOpen={isOpen}
          popoverVisible={popoverVisible}
          onPopoverOpenChange={setPopoverVisible}
          onTriggerClick={handleTriggerClick}
        />
      )}
    </div>
  );
}
