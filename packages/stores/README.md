# @aazucena/stores : State_Orchestration_System

## SUMMARY

Multi-paradigm state management architecture unifying Redux Toolkit (global state), TanStack Query v5 (server state), Nanostores (lightweight atoms), WebSocket providers (real-time streams), and RealtimeSync (cross-tab synchronization). Provides type-safe state orchestration with DevTools integration, persistence patterns, and zero-config provider composition for analytics dashboards and intelligence interfaces.

---

## 🛠️ STATE_MANIFEST

| System                  | Protocol           | Description                                                                 |
| :---------------------- | :----------------- | :-------------------------------------------------------------------------- |
| **Redux_Slices**        | Global_Persist     | Dashboard, Chat, Journey slices with localStorage sync. Type-safe actions. |
| **TanStack_Query**      | Server_Cache       | Query hooks with polling, mutations, invalidation. DevTools included.      |
| **Nanostores**          | Lightweight_Atoms  | Theme, sidebar, interactions. Sub-100 byte reactive atoms.                  |
| **WebSocket_Provider**  | Realtime_Stream    | Socket.IO integration for live telemetry. Auto-reconnect.                  |
| **RealtimeSync**        | Cross_Tab_Sync     | BroadcastChannel API for multi-tab state synchronization.                  |
| **Provider_Composer**   | Zero_Config_Setup  | Compose multiple providers with single wrapper component.                   |

---

## 🏗️ STATE_FACTORIES

### [Redux Slices] : The_Global_State

**Location:** `src/slices/`
**Protocol:** Redux Toolkit with Immer mutations, createAsyncThunk for async actions, localStorage persistence
**Exports:** `dashboardSlice`, `chatSlice`

#### Dashboard Slice

**Purpose:** AZUCENA_LYTICS dashboard state (filters, UI, status)

**State Shape:**
```typescript
interface Dashboard_State {
  filters: {
    timeRange: Telemetry_TimeRange; // '1h' | '24h' | '7d' | '30d'
    startDate: string | null;
    endDate: string | null;
    searchQuery: string;
    visibleCategories: string[]; // ['Page View', 'Music Play', etc.]
  };
  ui: {
    isSidebarCollapsed: boolean;
    navMode: 'SYSTEM' | 'INTELLIGENCE';
    activeTab: string; // 'overview' | 'music' | 'logs' | 'performance'
    refreshInterval: number; // Milliseconds
  };
  status: {
    isLive: boolean; // Polling toggle
    lastUpdated: string | null; // ISO timestamp
  };
}
```

**Actions:**
```typescript
// Time Range Control
setDashboardTimeRange(timeRange: Telemetry_TimeRange)

// Search & Filters
setDashboardSearchQuery(query: string)
toggleDashboardCategory(category: string)
resetDashboardCategories(categories: string[])
setDashboardCategoryPreset(preset: CategoryPreset)

// UI Control
toggleDashboardSidebar()
setDashboardNavMode(mode: 'SYSTEM' | 'INTELLIGENCE')
setDashboardActiveTab(tab: string)

// Status Control
toggleDashboardLiveMode()
updateDashboardLastSync()
```

**Category Presets:**
```typescript
export const CATEGORY_PRESETS = {
  OVERVIEW: ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'],
  MUSIC: ['Music Play'],
  PERFORMANCE: ['Error', 'Interaction', 'API', 'Database', 'Cache'],
  LOGS: ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'],
  SYSTEM: ['Page View', 'Interaction', 'Error', 'API'],
  INTELLIGENCE: ['Interaction', 'Error', 'API', 'Database'],
} as const;

export type CategoryPreset = keyof typeof CATEGORY_PRESETS;
```

**Usage:**
```typescript
import { useAppDispatch, useAppSelector } from '@aazucena/stores';
import {
  setDashboardTimeRange,
  toggleDashboardCategory,
  setDashboardCategoryPreset
} from '@aazucena/stores/slices/dashboard';

export function DashboardFilters() {
  const dispatch = useAppDispatch();
  const { timeRange, visibleCategories } = useAppSelector(
    (state) => state.dashboard.filters
  );

  return (
    <div>
      <select
        value={timeRange}
        onChange={(e) => dispatch(setDashboardTimeRange(e.target.value))}
      >
        <option value="1h">Last Hour</option>
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
      </select>

      <button onClick={() => dispatch(setDashboardCategoryPreset('MUSIC'))}>
        Music Only
      </button>

      {visibleCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => dispatch(toggleDashboardCategory(cat))}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

---

#### Chat Slice

**Purpose:** AI Terminal conversation management (tree-structured messages, branching)

**State Shape:**
```typescript
interface ChatState {
  conversations: Record<string, AI_Conversation>;
  activeConversationId: string | null;
}

interface AI_Conversation {
  id: string;
  title: string;
  messages: Record<string, AI_TerminalMessage>; // Tree structure
  activeNodeId: string | null; // Current branch tip
  updatedAt: number; // Unix timestamp
}

interface AI_TerminalMessage {
  id: string;
  parentId: string | null; // Tree parent
  role: 'user' | 'assistant';
  parts: { type: 'text'; text: string }[];
}
```

**Actions:**
```typescript
// Conversation Management
createNewChat() // Creates or reuses empty conversation
switchConversation(id: string)
deleteConversation(id: string)
updateConversationTitle(id: string, title: string)
clearAllHistory()

// Message Management
addMessage({ conversationId: string, message: AI_TerminalMessage })
setActiveNode({ conversationId: string, nodeId: string })
```

**Persistence:**
```typescript
// localStorage key: 'aazucena_chat_state_v2'
// Auto-saves on every action
// SSR-safe: checks typeof window !== 'undefined'
```

**Selectors:**
```typescript
// Reconstructs linear thread from tree structure
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
```

**Usage:**
```typescript
import { useAppDispatch, useAppSelector } from '@aazucena/stores';
import {
  createNewChat,
  addMessage,
  selectActiveThread
} from '@aazucena/stores/slices/chat';

export function AITerminal() {
  const dispatch = useDispatch();
  const thread = useSelector(selectActiveThread);

  const handleSend = (text: string) => {
    const message: AI_TerminalMessage = {
      id: crypto.randomUUID(),
      parentId: thread[thread.length - 1]?.id || null,
      role: 'user',
      parts: [{ type: 'text', text }],
    };

    dispatch(addMessage({
      conversationId: activeConversationId,
      message,
    }));
  };

  return (
    <div>
      {thread.map((msg) => (
        <div key={msg.id}>{msg.parts[0].text}</div>
      ))}
    </div>
  );
}
```

---

### [Nano Stores] : The_Lightweight_Atoms

**Location:** `src/ui/`, `src/interactions/`, `src/journey/`
**Protocol:** Sub-100 byte reactive atoms, MapStore for objects, @nanostores/react integration
**Exports:** Theme, sidebar, interactions, journey stores

#### Theme Store

```typescript
// src/ui/index.ts
import { atom } from 'nanostores';

export const $theme = atom<'light' | 'dark' | 'auto'>('auto');

export function setTheme(theme: 'light' | 'dark' | 'auto') {
  $theme.set(theme);
}

export function toggleTheme() {
  const current = $theme.get();
  $theme.set(current === 'dark' ? 'light' : 'dark');
}
```

**Usage:**
```tsx
import { useStore } from '@nanostores/react';
import { $theme, toggleTheme } from '@aazucena/stores/ui';

export function ThemeToggle() {
  const theme = useStore($theme);

  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

---

#### Sidebar Store

```typescript
// src/ui/index.ts
import { atom } from 'nanostores';

export const $sidebarOpen = atom<boolean>(true);

export function toggleSidebar() {
  $sidebarOpen.set(!$sidebarOpen.get());
}

export function setSidebarOpen(open: boolean) {
  $sidebarOpen.set(open);
}
```

---

#### Interactions Store

```typescript
// src/interactions/index.ts
import { map } from 'nanostores';

export const $clickedElements = map<Record<string, number>>({});

export function recordClick(elementId: string) {
  const clicks = $clickedElements.get();
  $clickedElements.set({
    ...clicks,
    [elementId]: (clicks[elementId] || 0) + 1,
  });
}

export function getClickCount(elementId: string): number {
  return $clickedElements.get()[elementId] || 0;
}
```

**Usage:**
```tsx
import { useStore } from '@nanostores/react';
import { $clickedElements, recordClick } from '@aazucena/stores/interactions';

export function InteractiveButton({ id }: { id: string }) {
  const clicks = useStore($clickedElements);

  return (
    <button onClick={() => recordClick(id)}>
      Clicked {clicks[id] || 0} times
    </button>
  );
}
```

---

#### Journey Store

```typescript
// src/journey/index.ts
import { atom } from 'nanostores';

export const $currentStep = atom<number>(0);

export function nextStep() {
  $currentStep.set($currentStep.get() + 1);
}

export function prevStep() {
  const current = $currentStep.get();
  if (current > 0) {
    $currentStep.set(current - 1);
  }
}

export function setStep(step: number) {
  $currentStep.set(step);
}
```

---

### [TanStack Query] : The_Server_Cache

**Location:** `src/providers/QueryProvider.tsx`
**Protocol:** TanStack Query v5, polling, mutations, optimistic updates, DevTools
**Exports:** `QueryProvider`, query hooks

#### Query Provider Setup

```tsx
// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### Usage Pattern: Polling Telemetry

```tsx
import { useQuery } from '@tanstack/react-query';

export function useTelemetry(filters: { timeRange: string; categories: string[] }) {
  return useQuery({
    queryKey: ['telemetry', filters],
    queryFn: async () => {
      const response = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch telemetry');
      }

      return response.json();
    },
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: filters.categories.length > 0, // Conditional fetching
  });
}

// Usage in component
export function TelemetryDashboard() {
  const { data, isLoading, error } = useTelemetry({
    timeRange: '24h',
    categories: ['Error', 'Performance'],
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return <TelemetryGrid data={data} />;
}
```

#### Mutation Pattern: Ingest Event

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useIngestEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: TelemetryEvent) => {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to ingest event');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate telemetry queries to refetch
      queryClient.invalidateQueries({ queryKey: ['telemetry'] });
    },
  });
}
```

---

### [WebSocket Provider] : The_Realtime_Stream

**Location:** `src/providers/WebSocketProvider.tsx`
**Protocol:** Socket.IO client, auto-reconnect, channel subscriptions
**Exports:** `WebSocketProvider`, `useWebSocket`

#### Provider Setup

```tsx
// src/providers/WebSocketProvider.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

interface WebSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  socket: null,
  isConnected: false,
});

export function WebSocketProvider({
  url,
  children
}: {
  url: string;
  children: ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket<T = any>(channel: string) {
  const { socket, isConnected } = useContext(WebSocketContext);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on(channel, (message: T) => {
      setData(message);
    });

    return () => {
      socket.off(channel);
    };
  }, [socket, channel]);

  const send = (payload: any) => {
    if (socket) {
      socket.emit(channel, payload);
    }
  };

  return { data, isConnected, send };
}
```

#### Usage: Live Telemetry Stream

```tsx
import { WebSocketProvider, useWebSocket } from '@aazucena/stores/providers';

export function App() {
  return (
    <WebSocketProvider url="ws://localhost:3001">
      <TelemetryStream />
    </WebSocketProvider>
  );
}

function TelemetryStream() {
  const { data, isConnected } = useWebSocket<TelemetryEvent>('telemetry:live');

  return (
    <div>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      {data && (
        <div>
          <strong>{data.category}</strong>: {data.message}
        </div>
      )}
    </div>
  );
}
```

---

### [RealtimeSync] : The_Cross_Tab_Sync

**Location:** `src/providers/RealtimeSync.tsx`
**Protocol:** BroadcastChannel API for cross-tab communication
**Exports:** `RealtimeSyncProvider`, `useRealtimeSync`

#### Provider Setup

```tsx
// src/providers/RealtimeSync.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface RealtimeSyncContextValue {
  channel: BroadcastChannel | null;
}

const RealtimeSyncContext = createContext<RealtimeSyncContextValue>({
  channel: null,
});

export function RealtimeSyncProvider({ children }: { children: ReactNode }) {
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bc = new BroadcastChannel('aazucena-sync');
    setChannel(bc);

    return () => {
      bc.close();
    };
  }, []);

  return (
    <RealtimeSyncContext.Provider value={{ channel }}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}

export function useRealtimeSync<T = any>(key: string) {
  const { channel } = useContext(RealtimeSyncContext);
  const [state, setState] = useState<T | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    if (!channel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.key === key) {
        setState(event.data.value);
        setIsSynced(true);
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, [channel, key]);

  const updateState = (newState: T) => {
    setState(newState);
    if (channel) {
      channel.postMessage({ key, value: newState });
    }
  };

  return { state, setState: updateState, isSynced };
}
```

#### Usage: Synchronized Filter State

```tsx
import { RealtimeSyncProvider, useRealtimeSync } from '@aazucena/stores/providers';

export function App() {
  return (
    <RealtimeSyncProvider>
      <DashboardFilters />
    </RealtimeSyncProvider>
  );
}

function DashboardFilters() {
  const { state, setState, isSynced } = useRealtimeSync<string>('activeFilter');

  return (
    <div>
      <p>Synced across tabs: {isSynced ? '✅' : '⏳'}</p>
      <select
        value={state || 'all'}
        onChange={(e) => setState(e.target.value)}
      >
        <option value="all">All</option>
        <option value="errors">Errors</option>
        <option value="performance">Performance</option>
      </select>
    </div>
  );
}
```

---

### [Provider Composer] : The_Zero_Config_Setup

**Location:** `src/providers/ProviderComposer.tsx`
**Protocol:** Nested provider composition with single component
**Exports:** `ProviderComposer`

#### Composer Implementation

```tsx
// src/providers/ProviderComposer.tsx
import { type ComponentType, type ReactNode } from 'react';

interface ProviderComposerProps {
  providers: ComponentType<{ children: ReactNode }>[];
  children: ReactNode;
}

export function ProviderComposer({ providers, children }: ProviderComposerProps) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}
```

#### Usage: Complete Setup

```tsx
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import {
  QueryProvider,
  WebSocketProvider,
  RealtimeSyncProvider,
  ProviderComposer,
} from '@aazucena/stores/providers';

// Individual providers
const StoreProvider = ({ children }: { children: ReactNode }) => (
  <ReduxProvider store={store}>{children}</ReduxProvider>
);

const WebSocketWrapper = ({ children }: { children: ReactNode }) => (
  <WebSocketProvider url="ws://localhost:3001">{children}</WebSocketProvider>
);

// Compose all providers
export function App() {
  return (
    <ProviderComposer
      providers={[
        StoreProvider,
        QueryProvider,
        WebSocketWrapper,
        RealtimeSyncProvider,
      ]}
    >
      <Dashboard />
    </ProviderComposer>
  );
}
```

---

## 🔗 INTEGRATION_PROTOCOLS

### Redux Store Configuration

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { dashboardSlice } from '@aazucena/stores/slices/dashboard';
import { chatSlice } from '@aazucena/stores/slices/chat';

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer,
    chat: chatSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks

```typescript
// hooks.ts
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 📖 API_REFERENCE

### Redux Toolkit Slices

#### dashboardSlice

**State:**
```typescript
{
  filters: {
    timeRange: '24h',
    searchQuery: '',
    visibleCategories: ['Page View', 'Music Play'],
  },
  ui: {
    isSidebarCollapsed: false,
    navMode: 'SYSTEM',
    activeTab: 'overview',
    refreshInterval: 5000,
  },
  status: {
    isLive: true,
    lastUpdated: null,
  }
}
```

**Actions:**
- `setDashboardTimeRange(timeRange: Telemetry_TimeRange)`
- `setDashboardSearchQuery(query: string)`
- `toggleDashboardCategory(category: string)`
- `resetDashboardCategories(categories: string[])`
- `setDashboardCategoryPreset(preset: CategoryPreset)`
- `toggleDashboardSidebar()`
- `setDashboardNavMode(mode: 'SYSTEM' | 'INTELLIGENCE')`
- `setDashboardActiveTab(tab: string)`
- `toggleDashboardLiveMode()`
- `updateDashboardLastSync()`

---

#### chatSlice

**State:**
```typescript
{
  conversations: Record<string, AI_Conversation>,
  activeConversationId: string | null
}
```

**Actions:**
- `createNewChat()`
- `addMessage({ conversationId: string, message: AI_TerminalMessage })`
- `setActiveNode({ conversationId: string, nodeId: string })`
- `switchConversation(id: string)`
- `deleteConversation(id: string)`
- `updateConversationTitle({ id: string, title: string })`
- `clearAllHistory()`

**Selectors:**
- `selectActiveThread(state: { chat: ChatState })` - Reconstructs linear thread from tree

---

### Nanostores API

#### Theme Store
- `$theme: Atom<'light' | 'dark' | 'auto'>`
- `setTheme(theme)`
- `toggleTheme()`

#### Sidebar Store
- `$sidebarOpen: Atom<boolean>`
- `toggleSidebar()`
- `setSidebarOpen(open: boolean)`

#### Interactions Store
- `$clickedElements: MapStore<Record<string, number>>`
- `recordClick(elementId: string)`
- `getClickCount(elementId: string)`

#### Journey Store
- `$currentStep: Atom<number>`
- `nextStep()`
- `prevStep()`
- `setStep(step: number)`

---

### TanStack Query Hooks

All query hooks follow TanStack Query v5 conventions:

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['resource', params],
  queryFn: async () => { /* fetch logic */ },
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchInterval: 5000, // Optional polling
});

const { mutate, isPending } = useMutation({
  mutationFn: async (payload) => { /* mutation logic */ },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] });
  },
});
```

---

### Provider Components

#### `<QueryProvider />`
- **Purpose:** TanStack Query client setup
- **Props:** `children: ReactNode`
- **DevTools:** Included

#### `<WebSocketProvider />`
- **Purpose:** Socket.IO real-time connection
- **Props:** `url: string`, `children: ReactNode`
- **Auto-reconnect:** Yes

#### `<RealtimeSyncProvider />`
- **Purpose:** Cross-tab state sync via BroadcastChannel
- **Props:** `children: ReactNode`

#### `<ProviderComposer />`
- **Purpose:** Compose multiple providers
- **Props:** `providers: ComponentType[]`, `children: ReactNode`

---

## 🗂️ ARCHITECTURE_BLUEPRINT

```
packages/stores/
├── src/
│   ├── index.ts                      # Main export (Redux slices)
│   ├── slices/
│   │   ├── dashboard.ts              # Dashboard state (113 lines)
│   │   └── chat.ts                   # AI chat state (123 lines)
│   ├── ui/
│   │   └── index.ts                  # Nano stores ($theme, $sidebarOpen)
│   ├── interactions/
│   │   └── index.ts                  # Nano stores ($clickedElements)
│   ├── journey/
│   │   └── index.ts                  # Nano stores ($currentStep)
│   └── providers/
│       ├── index.ts                  # Provider exports
│       ├── QueryProvider.tsx         # TanStack Query setup
│       ├── StoreProvider.tsx         # Redux provider wrapper
│       ├── WebSocketProvider.tsx     # Socket.IO integration
│       ├── RealtimeSync.tsx          # BroadcastChannel sync
│       └── ProviderComposer.tsx      # Provider composition
├── docs/
│   ├── store-catalog.md              # Complete store reference (~200 lines)
│   └── redux-patterns.md             # Advanced patterns (~400 lines)
├── package.json
├── tsconfig.json
└── README.md                         # This file (~1,200 lines)
```

**Design Principles:**
- **Type Safety:** Full TypeScript with inferred types
- **DevTools:** Redux DevTools + React Query DevTools
- **Performance:** Memoization, selector optimization, lazy loading
- **Modularity:** Domain-specific slices, atomic stores
- **Persistence:** LocalStorage sync with SSR safety
- **Zero Config:** ProviderComposer for single-line setup

---

## 🌐 FRAMEWORK_COMPATIBILITY

| Framework | Support | Notes                                         |
| :-------- | :------ | :-------------------------------------------- |
| Next.js   | ✅      | App Router + Pages Router. Use client components. |
| Astro     | ✅      | Use `client:load` or `client:only="react"`.   |
| Remix     | ✅      | Full support with React 19.                    |
| Vite      | ✅      | Native support.                                |
| Universal | ✅      | Any React 18+ environment.                     |

**SSR Considerations:**
- Redux slices: Safe (no window references)
- Nanostores: Safe (reactive atoms)
- WebSocket: Use `client:only` in Astro
- LocalStorage: Checks `typeof window !== 'undefined'`

---

## 📦 DEPENDENCY_MATRIX

### Internal Dependencies
None (leaf package)

### External Dependencies

| Package                             | Version | Purpose                          |
| :---------------------------------- | :------ | :------------------------------- |
| @reduxjs/toolkit                    | ^2.5.0  | Redux state management           |
| @tanstack/react-query               | ^5.62.14| Server state caching             |
| @tanstack/react-query-devtools      | ^5.62.14| Query DevTools                   |
| nanostores                          | ^0.11.3 | Lightweight reactive atoms       |
| @nanostores/react                   | ^0.8.0  | React integration for Nanostores |
| socket.io-client                    | ^4.8.1  | WebSocket client                 |
| react                               | ^19.2.0 | Peer dependency                  |
| react-redux                         | ^9.2.0  | Redux React bindings             |

---

## 🔗 RELATED_SYSTEMS

- **[@aazucena/hooks](../hooks)** - Custom hooks that consume these stores
- **[@aazucena/types](../types)** - Type definitions for state shapes
- **[@aazucena/ui](../ui)** - Components that use Redux/Query state
- **[AZUCENA_LYTICS](../../apps/analytics)** - Analytics dashboard powered by these stores

---

## 📚 DOCUMENTATION_HUB

- **[Store Catalog](./docs/store-catalog.md)** - Complete reference for Redux slices, Nano stores, providers
- **[Redux Patterns](./docs/redux-patterns.md)** - Advanced Redux Toolkit patterns, async actions, selectors, persistence

---

**Package:** @aazucena/stores
**Version:** 0.0.0
**Status:** Development
**Maintainer:** @aazucena
**Lines:** ~1,200
**Last Updated:** 2026-02-11

**INTELLIGENCE_THEME** • **STATE_ORCHESTRATION_SYSTEM** 🗂️
