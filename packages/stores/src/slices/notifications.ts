import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NotificationSourceType = 'form' | 'socket' | 'system';

export interface StoredNotification {
  id: string;
  title: string;
  description?: string;
  time?: string;
  read: boolean;
  sourceType: NotificationSourceType;
  /** Entity ID used for deduplication (e.g. form submission documentId) */
  sourceId?: string;
}

interface NotificationsState {
  items: StoredNotification[];
  /** Tracks source entity IDs that have already produced a notification */
  seenSourceIds: string[];
}

const initialState: NotificationsState = {
  items: [],
  seenSourceIds: [],
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<StoredNotification>) => {
      const { sourceId } = action.payload;
      if (sourceId && state.seenSourceIds.includes(sourceId)) return;
      state.items.unshift(action.payload);
      if (sourceId) state.seenSourceIds.push(sourceId);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllNotificationsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
