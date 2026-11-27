"use client";

import * as React from "react";
import { Button, Chat, ChatFeed } from "@aazucena/ui";
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
  // Set PUBLIC_RIN_CHARACTER_SRC in .env to point to the hosted .riv file URL.
  // Falls back to the static RinMark SVG when unset.
  const RIN_SRC = import.meta.env.PUBLIC_RIN_CHARACTER_SRC as
    string | undefined;

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
    handleRetry,
    hasError,
    isLoading,
    behavior,
    currentEmotion,
    wordCount,
    charCount,
    isOverCharLimit,
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

  // Announce only the finished assistant reply: the feed itself is aria-live="off"
  // so streaming tokens and the user's own messages are not read out.
  const [announcement, setAnnouncement] = React.useState("");
  const wasLoading = React.useRef(false);
  React.useEffect(() => {
    if (!wasLoading.current && isLoading) setAnnouncement("");
    if (wasLoading.current && !isLoading) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") {
        setAnnouncement(
          (last.parts ?? [])
            .map((p: any) => (p.type === "text" ? p.text : ""))
            .join(" ")
            .trim(),
        );
      }
    }
    wasLoading.current = isLoading;
  }, [isLoading, messages]);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const wasOpen = React.useRef(false);
  const focusTriggerPending = React.useRef(false);

  const focusComposer = React.useCallback(() => {
    rootRef.current
      ?.querySelector<HTMLTextAreaElement>('[data-testid="assistant-input"]')
      ?.focus();
  }, []);

  const overlayOpen = loreDialogOpen || transparencyOpen;
  const hadOverlay = React.useRef(false);

  // Focus moves into the composer on open and back to the trigger on close. While an overlay
  // (Lore, Transparency) covers the chat, the controls behind it are inert and focus sits in the
  // overlay (it focuses its own Close button); closing the overlay returns focus to the composer.
  React.useEffect(() => {
    const root = rootRef.current;
    if (isOpen) {
      if (!overlayOpen) focusComposer();
    } else if (wasOpen.current) {
      // The Chat button only renders in floating mode, and closing from the side panel or full
      // screen switches back to floating a render later, so wait for the button to exist.
      focusTriggerPending.current = true;
    }
    if (focusTriggerPending.current) {
      const trigger = root?.querySelector<HTMLButtonElement>(
        'button[aria-haspopup="dialog"][aria-expanded]',
      );
      if (trigger) {
        trigger.focus();
        focusTriggerPending.current = false;
      }
    }
    wasOpen.current = isOpen;
  }, [isOpen, overlayOpen, focusComposer, chatMode]);

  React.useEffect(() => {
    const region = rootRef.current?.querySelector<HTMLElement>(
      '[aria-label="Chat with Rin"]',
    );
    if (!region) return;
    const behind = Array.from(region.children).filter(
      (el) => el.getAttribute("role") !== "dialog",
    ) as HTMLElement[];
    for (const el of behind) el.inert = overlayOpen;
    if (hadOverlay.current && !overlayOpen && isOpen) {
      region
        .querySelector<HTMLTextAreaElement>('[data-testid="assistant-input"]')
        ?.focus();
    }
    hadOverlay.current = overlayOpen;
    return () => {
      for (const el of behind) el.inert = false;
    };
  }, [overlayOpen, isOpen]);

  // Escape closes the top overlay first, then the chat. Menus and the clear
  // dialog handle their own Escape.
  React.useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape" || e.defaultPrevented || e.isComposing) return;
      if (dropdownOpen || clearDialogOpen) return;
      if (loreDialogOpen) setLoreDialogOpen(false);
      else if (transparencyOpen) setTransparencyOpen(false);
      else setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [
    isOpen,
    dropdownOpen,
    clearDialogOpen,
    loreDialogOpen,
    transparencyOpen,
    setLoreDialogOpen,
    setTransparencyOpen,
    setIsOpen,
  ]);

  return (
    <div ref={rootRef} className={outerVariants({ mode: chatMode })}>
      {isOpen && (
        <div
          role="region"
          aria-label="Chat with Rin"
          className={innerVariants({ mode: chatMode })}
        >
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
            currentEmotion={currentEmotion}
            behavior={behavior}
            rinSrc={RIN_SRC}
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
            <ChatFeed ref={feedRef} aria-live="off" className="space-y-4 p-4">
              {messages.length === 0 && (
                <AssistantIntro
                  pathname={pathname}
                  isLoading={isLoading}
                  onSendMessage={(text) => {
                    sendMessage({ text });
                    // the suggestion unmounts with the intro
                    focusComposer();
                  }}
                  currentEmotion={currentEmotion}
                  behavior={behavior}
                  rinSrc={RIN_SRC}
                />
              )}
              <AssistantMessageList messages={messages} />
              {isLoading && (
                <AssistantLoadingBubble statusIdx={loadingStatusIdx} />
              )}
              {hasError && !isLoading && (
                <div
                  role="alert"
                  className="border-alert text-foreground flex flex-wrap items-center gap-3 border-l-2 px-3 py-2 text-sm"
                >
                  <span>
                    <span aria-hidden="true" className="text-alert">
                      ▲{" "}
                    </span>
                    Rin couldn&apos;t reply. Try again.
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void handleRetry();
                      // the Retry button unmounts with the alert, so focus goes back to the composer
                      focusComposer();
                    }}
                  >
                    Retry
                  </Button>
                </div>
              )}
            </ChatFeed>

            <AssistantInput
              value={input}
              onChange={setInput}
              onSend={() => {
                handleSend();
                // the Send button disables itself while Rin replies
                focusComposer();
              }}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
              wordCount={wordCount}
              charCount={charCount}
              isOverCharLimit={isOverCharLimit}
              isOverWordLimit={isOverWordLimit}
            />
          </Chat>
        </div>
      )}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <AssistantClearDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        onConfirm={handleClear}
        onCloseFocus={focusComposer}
      />

      {chatMode === "floating" && (
        <AssistantTriggerPopover
          isOpen={isOpen}
          popoverVisible={popoverVisible}
          onPopoverOpenChange={setPopoverVisible}
          onTriggerClick={handleTriggerClick}
          currentEmotion={currentEmotion}
          behavior={behavior}
          rinSrc={RIN_SRC}
        />
      )}
    </div>
  );
}
