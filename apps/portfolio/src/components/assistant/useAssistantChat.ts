"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  STORAGE_KEY,
  LOADING_STATUSES,
  POPOVER_SHOWN_KEY,
  TRANSPARENCY_KEY,
  MAX_INPUT_WORDS,
  countWords,
} from "./constants";
import { loadPersistedMessages } from "./utils";
import type { RinEmotion } from "~/lib/utils/chat/tools/set-emotion";
import { type RinBehavior } from "./RinCharacter";

export type { RinEmotion, RinBehavior };
export type ChatMode = "floating" | "offcanvas" | "fullscreen";

export function useAssistantChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [chatMode, setChatMode] = React.useState<ChatMode>("floating");
  const [input, setInput] = React.useState("");
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [loreDialogOpen, setLoreDialogOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loadingStatusIdx, setLoadingStatusIdx] = React.useState(0);
  const [transparencyOpen, setTransparencyOpen] = React.useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      return localStorage.getItem(TRANSPARENCY_KEY) !== "true";
    },
  );
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const feedRef = React.useRef<HTMLDivElement | null>(null);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // Switch to /api/brain (LangGraph) when PUBLIC_USE_BRAIN_ENDPOINT is set.
  // Falls back to /api/chat (AI SDK direct) when unset or on any error.
  const chatApi =
    import.meta.env.PUBLIC_USE_BRAIN_ENDPOINT === "true"
      ? "/api/brain"
      : "/api/chat";

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: chatApi,
      body: { pathname },
    }),
    messages: loadPersistedMessages(),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const [behavior, setBehavior] = React.useState<RinBehavior>("idle");

  // Derive current emotion from the last assistant message's set_emotion tool result.
  // Forces "thinking" while streaming so the emote updates before text arrives.
  // Forces "sad" on error so Rin looks apologetic rather than blank.
  const currentEmotion = React.useMemo((): RinEmotion => {
    if (status === "error") return "sad";
    if (isLoading) return "thinking";
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAssistant) return "idle";
    const emotionPart = (lastAssistant.parts ?? []).find(
      (p: any) => p.type === "tool-set_emotion" && p.state === "result",
    );
    return (emotionPart as any)?.output?.emotion ?? "idle";
  }, [messages, isLoading, status]);

  const deferredInput = React.useDeferredValue(input);
  const wordCount = countWords(deferredInput);
  const isOverWordLimit = wordCount > MAX_INPUT_WORDS;

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [messages]);

  React.useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStatusIdx(0);
      return;
    }
    const id = setInterval(() => {
      setLoadingStatusIdx((s) => (s + 1) % LOADING_STATUSES.length);
    }, 2000);
    return () => clearInterval(id);
  }, [isLoading]);

  // Derive behavior from AI SDK status + input. The 300ms tail on idle keeps
  // the responding animation running until the last token renders.
  React.useEffect(() => {
    if (status === "streaming") {
      setBehavior("responding");
      return;
    }
    if (status === "submitted") {
      setBehavior("thinking");
      return;
    }
    if (status === "error") {
      setBehavior("error");
      return;
    }
    if (input.length > 0) {
      setBehavior("listening");
      return;
    }
    const t = setTimeout(() => setBehavior("idle"), 300);
    return () => clearTimeout(t);
  }, [status, input]);

  // Reset to floating mode whenever the chat is closed
  React.useEffect(() => {
    if (!isOpen) setChatMode("floating");
  }, [isOpen]);

  // Show popover once, 3s after first visit; auto-dismiss after 8s
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(POPOVER_SHOWN_KEY) === "true") return;
    let dismissTimer: ReturnType<typeof setTimeout>;
    const showTimer = setTimeout(() => {
      setPopoverVisible(true);
      try {
        localStorage.setItem(POPOVER_SHOWN_KEY, "true");
      } catch {
        // ignore
      }
      dismissTimer = setTimeout(() => setPopoverVisible(false), 8000 * 8);
    }, 3000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer!);
    };
  }, []);

  function handleClear() {
    setMessages([]);
    setClearDialogOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isLoading || isOverWordLimit) return;
    setInput("");
    sendMessage({ text });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTriggerClick() {
    setPopoverVisible(false);
    setIsOpen((o) => !o);
  }

  function handleCycleMode() {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    setChatMode((m) => {
      if (m === "floating") return isMobile ? "fullscreen" : "offcanvas";
      if (m === "offcanvas") return "fullscreen";
      return "floating";
    });
  }

  return {
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
    behavior,
    currentEmotion,
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
  };
}
