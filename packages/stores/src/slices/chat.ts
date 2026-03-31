import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { AI_Conversation, AI_TerminalMessage } from '@aazucena/types';

interface ChatState {
  conversations: Record<string, AI_Conversation>;
  activeConversationId: string | null;
}

export interface ChatSliceConfig {
  /** localStorage key for persisting chat state */
  storageKey?: string;
  /** Title assigned to newly created conversations */
  defaultConversationTitle?: string;
}

/**
 * createChatSlice - Factory for the chat Redux slice.
 * Allows configuring the storage key and default conversation title
 * so multiple apps can share the slice without key collisions.
 *
 * @example
 * // Zero-config (analytics app defaults)
 * const slice = createChatSlice();
 *
 * // Custom app
 * const slice = createChatSlice({
 *   storageKey: 'my_app_chat_v1',
 *   defaultConversationTitle: 'New Chat',
 * });
 */
export const CHAT_STORAGE_KEY = 'az_chat_state_v2';

export function createChatSlice(config?: ChatSliceConfig) {
  const STORAGE_KEY = config?.storageKey ?? CHAT_STORAGE_KEY;
  const DEFAULT_TITLE = config?.defaultConversationTitle ?? 'New Conversation';

  // Always start empty — SSR-safe. Consumers dispatch hydrateFromStorage in useEffect after mount.
  const initialState: ChatState = {
    conversations: {},
    activeConversationId: null,
  };

  const slice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
      // Hydrate from localStorage after client mount — call in useEffect to avoid SSR mismatch
      hydrateFromStorage: (state, action: PayloadAction<ChatState>) => {
        state.conversations = action.payload.conversations;
        state.activeConversationId = action.payload.activeConversationId;
      },

      createNewChat: (state) => {
        // 1. Find all empty conversations
        const emptyConvs = Object.values(state.conversations).filter(
          (conv) => Object.keys(conv.messages).length === 0,
        );

        if (emptyConvs.length > 0) {
          // 2. If multiple somehow exist, delete all but the first one
          emptyConvs.slice(1).forEach((c) => delete state.conversations[c.id]);
          // 3. Switch to the first one
          state.activeConversationId = emptyConvs[0]!.id;
        } else {
          // 4. Create a truly new one if none exist
          const id = crypto.randomUUID();
          state.conversations[id] = {
            id,
            title: DEFAULT_TITLE,
            messages: {},
            activeNodeId: null,
            updatedAt: Date.now(),
          };
          state.activeConversationId = id;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },

      addMessage: (
        state,
        action: PayloadAction<{
          conversationId: string;
          message: AI_TerminalMessage;
        }>,
      ) => {
        const { conversationId, message } = action.payload;
        const conv = state.conversations[conversationId];
        if (conv) {
          conv.messages[message.id] = message;
          conv.activeNodeId = message.id;
          conv.updatedAt = Date.now();

          // Auto-title if it's the first user message
          if (message.role === 'user' && Object.keys(conv.messages).length === 1) {
            conv.title =
              message.parts[0]?.text.substring(0, 40) +
              (message.parts[0]!.text.length > 40 ? '...' : '');
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },

      setActiveNode: (state, action: PayloadAction<{ conversationId: string; nodeId: string }>) => {
        const { conversationId, nodeId } = action.payload;
        if (state.conversations[conversationId]) {
          state.conversations[conversationId]!.activeNodeId = nodeId;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },

      switchConversation: (state, action: PayloadAction<string>) => {
        state.activeConversationId = action.payload;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },

      deleteConversation: (state, action: PayloadAction<string>) => {
        delete state.conversations[action.payload];
        if (state.activeConversationId === action.payload) {
          const remaining = Object.keys(state.conversations);
          state.activeConversationId = remaining.length > 0 ? remaining[0]! : null;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },

      updateConversationTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
        const conv = state.conversations[action.payload.id];
        if (conv) {
          conv.title = action.payload.title;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },

      clearAllHistory: (state) => {
        state.conversations = {};
        state.activeConversationId = null;
        localStorage.removeItem(STORAGE_KEY);
      },
    },
  });

  return slice;
}

// Default export — zero-config for backwards compatibility
export const chatSlice = createChatSlice();

export const {
  hydrateFromStorage,
  createNewChat,
  addMessage,
  setActiveNode,
  switchConversation,
  deleteConversation,
  clearAllHistory,
  updateConversationTitle,
} = chatSlice.actions;

export default chatSlice.reducer;

type ChatRootState = {
  chat: { conversations: Record<string, AI_Conversation>; activeConversationId: string | null };
};

const EMPTY_THREAD: AI_TerminalMessage[] = [];
const EMPTY_MESSAGES: Record<string, AI_TerminalMessage> = {};

/**
 * SELECTOR: Reconstructs the linear thread for the active conversation.
 * Memoized with createSelector so the same array reference is returned
 * when the active conversation's messages and activeNodeId haven't changed.
 */
export const selectActiveThread = createSelector(
  (state: ChatRootState) => state.chat.activeConversationId,
  (state: ChatRootState) => state.chat.conversations,
  (activeId, conversations) => {
    if (!activeId) return EMPTY_THREAD;

    const conv = conversations[activeId];
    if (!conv) return EMPTY_THREAD;

    const { messages, activeNodeId } = conv;
    const thread: AI_TerminalMessage[] = [];
    let currentId = activeNodeId;

    while (currentId && messages[currentId]) {
      const msg = messages[currentId]!;
      thread.push(msg);
      currentId = msg.parentId;
    }

    return thread.reverse();
  },
);

/**
 * SELECTOR: Returns the messages map for the active conversation.
 * Stable EMPTY_MESSAGES reference prevents the "Selector unknown returned a
 * different result" warning that occurs when using `|| {}` inline.
 */
export const selectActiveMessages = createSelector(
  (state: ChatRootState) => state.chat.activeConversationId,
  (state: ChatRootState) => state.chat.conversations,
  (activeId, conversations) => {
    if (!activeId) return EMPTY_MESSAGES;
    return conversations[activeId]?.messages ?? EMPTY_MESSAGES;
  },
);
