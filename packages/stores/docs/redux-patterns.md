# ⚡ REDUX_PATTERNS

**DEVELOPER_GUIDE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Advanced Redux Toolkit patterns for type-safe, performant state management in @aazucena/stores.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 SLICE_ARCHITECTURE](#-slice_architecture)
- [🔄 ASYNC_ACTIONS](#-async_actions)
- [🎨 SELECTOR_PATTERNS](#-selector_patterns)
- [💾 PERSISTENCE_PATTERNS](#-persistence_patterns)
- [🎯 BEST_PRACTICES](#-best_practices)

---

## 🎯 SLICE_ARCHITECTURE

### Standard Slice Pattern

```typescript
// slices/dashboard.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Dashboard_State } from '@aazucena/types';

// 1. Define presets as const for type inference
export const CATEGORY_PRESETS = {
  OVERVIEW: ['Page View', 'Music Play', 'Interaction'],
  MUSIC: ['Music Play'],
  PERFORMANCE: ['Error', 'API', 'Database'],
} as const;

export type CategoryPreset = keyof typeof CATEGORY_PRESETS;

// 2. Define initial state with type
const initialState: Dashboard_State = {
  filters: {
    timeRange: '24h',
    searchQuery: '',
    visibleCategories: CATEGORY_PRESETS.OVERVIEW as unknown as string[],
  },
  ui: {
    isSidebarCollapsed: false,
    activeTab: 'overview',
  },
  status: {
    isLive: true,
    lastUpdated: null,
  },
};

// 3. Create slice with typed reducers
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.filters.timeRange = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const categories = state.filters.visibleCategories;

      if (categories.includes(category)) {
        state.filters.visibleCategories = categories.filter(c => c !== category);
      } else {
        state.filters.visibleCategories.push(category);
      }
    },
    applyPreset: (state, action: PayloadAction<CategoryPreset>) => {
      const preset = CATEGORY_PRESETS[action.payload];
      if (preset) {
        state.filters.visibleCategories = [...preset];
      }
    },
  },
});

// 4. Export actions and reducer
export const { setTimeRange, toggleCategory, applyPreset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
```

**Key Patterns:**
- ✅ **`as const` for presets** - Enables literal type inference
- ✅ **PayloadAction typing** - Type-safe action payloads
- ✅ **Immer mutations** - Direct state mutation (Immer handles immutability)
- ✅ **Barrel exports** - Clean import paths

---

### Complex State Pattern (Chat Slice)

```typescript
// slices/chat.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AI_Conversation, AI_TerminalMessage } from '@aazucena/types';

interface ChatState {
  conversations: Record<string, AI_Conversation>;
  activeConversationId: string | null;
}

const initialState: ChatState = {
  conversations: {},
  activeConversationId: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createNewChat: (state) => {
      // 1. Check for empty conversations
      const emptyConvs = Object.values(state.conversations).filter(
        (conv) => Object.keys(conv.messages).length === 0,
      );

      if (emptyConvs.length > 0) {
        // Reuse existing empty conversation
        state.activeConversationId = emptyConvs[0]!.id;
      } else {
        // Create new conversation
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
        // Add message to conversation
        conv.messages[message.id] = message;
        conv.activeNodeId = message.id;
        conv.updatedAt = Date.now();

        // Auto-title from first user message
        if (message.role === 'user' && Object.keys(conv.messages).length === 1) {
          conv.title = message.parts[0]?.text.substring(0, 40) + '...';
        }
      }
    },
  },
});

export const { createNewChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
```

**Advanced Patterns:**
- ✅ **Record<string, T>** - Dynamic object keys with type safety
- ✅ **Optional chaining** - Safe nested property access
- ✅ **Auto-titling logic** - Derived state updates
- ✅ **UUID generation** - Unique identifiers for entities

---

## 🔄 ASYNC_ACTIONS

### createAsyncThunk Pattern

```typescript
// slices/telemetry.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Define async thunk
export const fetchTelemetry = createAsyncThunk(
  'telemetry/fetch',
  async (filters: { timeRange: string; categories: string[] }, thunkAPI) => {
    try {
      const response = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch telemetry');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 2. Create slice with extraReducers
const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTelemetry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTelemetry.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTelemetry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default telemetrySlice.reducer;
```

**Usage in Components:**
```tsx
import { useAppDispatch, useAppSelector } from '@aazucena/stores';
import { fetchTelemetry } from '@aazucena/stores/slices/telemetry';

export function TelemetryDashboard() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.telemetry);

  useEffect(() => {
    dispatch(fetchTelemetry({
      timeRange: '24h',
      categories: ['Error', 'Performance'],
    }));
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return <TelemetryGrid data={data} />;
}
```

**Key Benefits:**
- ✅ **Automatic loading states** - pending/fulfilled/rejected
- ✅ **Error handling** - rejectWithValue for typed errors
- ✅ **ThunkAPI** - Access to dispatch, getState, extra args
- ✅ **Type inference** - Full TypeScript support

---

### Polling Pattern with Async Thunks

```typescript
// slices/liveData.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const startPolling = createAsyncThunk(
  'liveData/startPolling',
  async (interval: number, { dispatch }) => {
    const pollInterval = setInterval(() => {
      dispatch(fetchLatestData());
    }, interval);

    return pollInterval;
  },
);

export const fetchLatestData = createAsyncThunk(
  'liveData/fetch',
  async () => {
    const response = await fetch('/api/live');
    return await response.json();
  },
);

const liveDataSlice = createSlice({
  name: 'liveData',
  initialState: {
    data: null,
    pollInterval: null,
  },
  reducers: {
    stopPolling: (state) => {
      if (state.pollInterval) {
        clearInterval(state.pollInterval);
        state.pollInterval = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startPolling.fulfilled, (state, action) => {
        state.pollInterval = action.payload;
      })
      .addCase(fetchLatestData.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { stopPolling } = liveDataSlice.actions;
export default liveDataSlice.reducer;
```

---

## 🎨 SELECTOR_PATTERNS

### Basic Selectors

```typescript
// selectors/dashboard.ts
import type { RootState } from '../store';

// 1. Direct selectors
export const selectTimeRange = (state: RootState) =>
  state.dashboard.filters.timeRange;

export const selectSearchQuery = (state: RootState) =>
  state.dashboard.filters.searchQuery;

export const selectVisibleCategories = (state: RootState) =>
  state.dashboard.filters.visibleCategories;

export const selectIsLive = (state: RootState) =>
  state.dashboard.status.isLive;
```

**Usage:**
```tsx
import { useAppSelector } from '@aazucena/stores';
import { selectTimeRange, selectIsLive } from '@aazucena/stores/selectors';

export function StatusBar() {
  const timeRange = useAppSelector(selectTimeRange);
  const isLive = useAppSelector(selectIsLive);

  return (
    <div>
      <span>Time Range: {timeRange}</span>
      <span>Live: {isLive ? '🟢' : '🔴'}</span>
    </div>
  );
}
```

---

### Memoized Selectors with createSelector

```typescript
// selectors/telemetry.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// 1. Input selectors
const selectAllEvents = (state: RootState) => state.telemetry.data;
const selectVisibleCategories = (state: RootState) =>
  state.dashboard.filters.visibleCategories;
const selectSearchQuery = (state: RootState) =>
  state.dashboard.filters.searchQuery;

// 2. Memoized filtered selector
export const selectFilteredEvents = createSelector(
  [selectAllEvents, selectVisibleCategories, selectSearchQuery],
  (events, categories, query) => {
    return events.filter((event) => {
      // Category filter
      const matchesCategory = categories.includes(event.category);

      // Search filter
      const matchesSearch = query
        ? event.message.toLowerCase().includes(query.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });
  },
);

// 3. Derived statistics selector
export const selectEventStats = createSelector(
  [selectFilteredEvents],
  (events) => {
    return {
      total: events.length,
      byCategory: events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      lastUpdated: events[events.length - 1]?.timestamp || null,
    };
  },
);
```

**Benefits of createSelector:**
- ✅ **Memoization** - Only recomputes when inputs change
- ✅ **Composition** - Combine multiple selectors
- ✅ **Performance** - Prevents unnecessary re-renders
- ✅ **Testing** - Pure functions, easy to test

---

### Parametric Selectors

```typescript
// selectors/conversations.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// 1. Factory function for parametric selector
export const makeSelectConversationById = () =>
  createSelector(
    [
      (state: RootState) => state.chat.conversations,
      (_: RootState, conversationId: string) => conversationId,
    ],
    (conversations, conversationId) => conversations[conversationId],
  );

// Usage with useMemo to maintain instance
function ConversationView({ id }: { id: string }) {
  const selectConversationById = useMemo(makeSelectConversationById, []);
  const conversation = useAppSelector((state) => selectConversationById(state, id));

  return <div>{conversation?.title}</div>;
}
```

---

## 💾 PERSISTENCE_PATTERNS

### LocalStorage Sync Pattern

```typescript
// slices/chat.ts
const isClient = typeof window !== 'undefined';
const STORAGE_KEY = 'aazucena_chat_state_v2';

// 1. Load from localStorage on init
const savedState = isClient ? localStorage.getItem(STORAGE_KEY) : null;
const initialState: ChatState = savedState ? JSON.parse(savedState) : defaultState;

// 2. Save to localStorage on every action
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // ... mutation logic

      // Persist to localStorage
      if (isClient) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    },

    clearAllHistory: (state) => {
      state.conversations = {};
      state.activeConversationId = null;

      // Remove from localStorage
      if (isClient) {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});
```

**Best Practices:**
- ✅ **Version keys** - `_v2` suffix for schema changes
- ✅ **SSR safety** - Check `typeof window !== 'undefined'`
- ✅ **Try/catch** - Handle JSON parsing errors
- ✅ **Debounce writes** - Use throttle for frequent updates

---

### Redux Persist Integration (Alternative)

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'aazucena-root',
  version: 2,
  storage,
  whitelist: ['chat', 'dashboard'], // Only persist these slices
  blacklist: ['telemetry'], // Exclude real-time data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
```

**Usage:**
```tsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <YourApp />
      </PersistGate>
    </Provider>
  );
}
```

---

## 🎯 BEST_PRACTICES

### 1. Typed Hooks

```typescript
// hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Benefits:**
- ✅ **Auto-completion** - IntelliSense for state shape
- ✅ **Type safety** - Catch errors at compile time
- ✅ **No manual typing** - Inferred from store

---

### 2. Slice Organization

```
src/slices/
├── dashboard.ts          # Dashboard state (filters, UI)
├── chat.ts               # Chat conversations
├── telemetry.ts          # Analytics data
├── ui.ts                 # Global UI state (modals, theme)
└── index.ts              # Barrel export
```

**Naming Convention:**
- `dashboard.ts` → `dashboardSlice` → `state.dashboard`
- Prefix actions: `setDashboardTimeRange`, `toggleDashboardSidebar`
- Avoid name collisions across slices

---

### 3. Action Naming

```typescript
// ✅ GOOD - Clear, scoped action names
setDashboardTimeRange
toggleDashboardCategory
resetDashboardFilters

// ❌ BAD - Generic names (collision risk)
setTimeRange
toggleCategory
reset
```

---

### 4. Immer Mutations

```typescript
// ✅ GOOD - Direct mutation (Immer handles immutability)
state.filters.timeRange = action.payload;
state.filters.visibleCategories.push(category);

// ❌ BAD - Manual immutability (unnecessary)
return {
  ...state,
  filters: {
    ...state.filters,
    timeRange: action.payload,
  },
};
```

---

### 5. Conditional Logic in Reducers

```typescript
// ✅ GOOD - Early returns for invalid actions
if (!state.conversations[conversationId]) {
  return; // No-op if conversation doesn't exist
}

// ✅ GOOD - Defensive checks
const preset = CATEGORY_PRESETS[action.payload];
if (preset) {
  state.filters.visibleCategories = [...preset];
}
```

---

### 6. DevTools Integration

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
```

**DevTools Features:**
- Time-travel debugging
- Action history
- State diff visualization
- Action replay

---

### 7. Testing Slices

```typescript
// dashboard.test.ts
import dashboardReducer, {
  setTimeRange,
  toggleCategory,
  CATEGORY_PRESETS,
} from './dashboard';

describe('dashboardSlice', () => {
  it('should set time range', () => {
    const state = dashboardReducer(undefined, setTimeRange('7d'));
    expect(state.filters.timeRange).toBe('7d');
  });

  it('should toggle category', () => {
    const initialState = {
      filters: { visibleCategories: ['Error', 'API'] },
    };

    const state = dashboardReducer(initialState, toggleCategory('Error'));
    expect(state.filters.visibleCategories).toEqual(['API']);
  });

  it('should apply preset', () => {
    const state = dashboardReducer(undefined, applyPreset('MUSIC'));
    expect(state.filters.visibleCategories).toEqual(CATEGORY_PRESETS.MUSIC);
  });
});
```

---

**DOCUMENTATION_METADATA:**
- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Lines:** ~400

**INTELLIGENCE_THEME** • **REDUX_MASTERY** ⚡
