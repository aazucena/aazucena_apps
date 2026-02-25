import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AI_Conversation, AI_TerminalMessage } from '@aazucena/types';

interface ChatState {
  conversations: Record<string, AI_Conversation>;
  activeConversationId: string | null;
}

const isClient = typeof window !== 'undefined';
const savedState = isClient ? localStorage.getItem('aazucena_chat_state_v2') : null;

const initialState: ChatState = savedState
  ? JSON.parse(savedState)
  : {
      conversations: {},
      activeConversationId: null,
    };

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
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
          title: 'New Conversation',
          messages: {},
          activeNodeId: null,
          updatedAt: Date.now(),
        };
        state.activeConversationId = id;
      }

      if (isClient) localStorage.setItem('aazucena_chat_state_v2', JSON.stringify(state));
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
      if (isClient) localStorage.setItem('aazucena_chat_state_v2', JSON.stringify(state));
    },

    setActiveNode: (state, action: PayloadAction<{ conversationId: string; nodeId: string }>) => {
      const { conversationId, nodeId } = action.payload;
      if (state.conversations[conversationId]) {
        state.conversations[conversationId]!.activeNodeId = nodeId;
      }
      if (isClient) localStorage.setItem('aazucena_chat_state_v2', JSON.stringify(state));
    },

    switchConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
      if (isClient) localStorage.setItem('aazucena_chat_state_v2', JSON.stringify(state));
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload];
      if (state.activeConversationId === action.payload) {
        const remaining = Object.keys(state.conversations);
        state.activeConversationId = remaining.length > 0 ? remaining[0]! : null;
      }
      if (isClient) localStorage.setItem('aazucena_chat_state_v2', JSON.stringify(state));
    },

    updateConversationTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const conv = state.conversations[action.payload.id];
      if (conv) {
        conv.title = action.payload.title;
      }
      if (isClient) localStorage.setItem('aazucena_chat_state_v2', JSON.stringify(state));
    },

    clearAllHistory: (state) => {
      state.conversations = {};
      state.activeConversationId = null;
      if (isClient) localStorage.removeItem('aazucena_chat_state_v2');
    },
  },
});

export const {
  createNewChat,
  addMessage,
  setActiveNode,
  switchConversation,
  deleteConversation,
  clearAllHistory,
  updateConversationTitle,
} = chatSlice.actions;

export default chatSlice.reducer;

/**
 * SELECTOR: Reconstructs the linear thread for the active conversation.
 */
export const selectActiveThread = (state: { chat: ChatState }) => {
  const activeId = state.chat.activeConversationId;
  if (!activeId) return [];

  const conv = state.chat.conversations[activeId];
  if (!conv) return [];

  const { messages, activeNodeId } = conv;
  const thread: AI_TerminalMessage[] = [];
  let currentId = activeNodeId;

  while (currentId && messages[currentId]) {
    const msg = messages[currentId]!;
    thread.push(msg);
    currentId = msg.parentId;
  }

  return thread.reverse();
};
