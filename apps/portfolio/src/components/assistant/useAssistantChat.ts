"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { STORAGE_KEY, LOADING_STATUSES } from "./constants";
import { loadPersistedMessages } from "./utils";

export function useAssistantChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [loreDialogOpen, setLoreDialogOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loadingStatusIdx, setLoadingStatusIdx] = React.useState(0);
  const feedRef = React.useRef<HTMLDivElement | null>(null);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { pathname },
    }),
    messages: loadPersistedMessages(),
  });

  const isLoading = status === "streaming" || status === "submitted";

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
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return {
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
  };
}
