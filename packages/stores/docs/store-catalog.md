# 📖 STORE_CATALOG

**REFERENCE_DOCUMENTATION** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Complete reference for all stores in @aazucena/stores package.

---

## REDUX_TOOLKIT_SLICES

### dashboard.ts

**State:**
```typescript
{
  visibleCategories: string[];
  searchQuery: string;
  isSidebarCollapsed: boolean;
  isLive: boolean;
}
```

**Actions:**
- `toggleCategory(category: string)` - Toggle category visibility
- `setSearchQuery(query: string)` - Update search filter
- `toggleSidebar()` - Collapse/expand sidebar
- `setLiveMode(isLive: boolean)` - Enable/disable live updates

**Selectors:**
- `selectVisibleCategories(state)` - Get active categories
- `selectSearchQuery(state)` - Get search query
- `selectIsSidebarCollapsed(state)` - Get sidebar state

**Usage:**
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { toggleCategory, setLiveMode } from '@aazucena/stores';

const dispatch = useDispatch();
const categories = useSelector(selectVisibleCategories);

dispatch(toggleCategory('AI'));
dispatch(setLiveMode(true));
```

---

### chat.ts

**State:**
```typescript
{
  messages: Message[];
  isLoading: boolean;
  model: string;
  streamingMessage: string | null;
}
```

**Actions:**
- `addMessage(message: Message)` - Add chat message
- `setLoading(isLoading: boolean)` - Set loading state
- `setModel(model: string)` - Change AI model
- `updateStreamingMessage(text: string)` - Update streaming response

---

## NANO_STORES

### ui/index.ts

#### $theme
**Type:** `Atom<'light' | 'dark' | 'auto'>`
**Purpose:** Global theme preference

```typescript
import { $theme, setTheme } from '@aazucena/stores/ui';
import { useStore } from '@nanostores/react';

const theme = useStore($theme);
setTheme('dark');
```

#### $sidebarOpen
**Type:** `Atom<boolean>`
**Purpose:** Sidebar visibility state

```typescript
import { $sidebarOpen, toggleSidebar } from '@aazucena/stores/ui';

const isOpen = useStore($sidebarOpen);
toggleSidebar();
```

---

### interactions/index.ts

#### $clickedElements
**Type:** `MapStore<Record<string, number>>`
**Purpose:** Track user click interactions

```typescript
import { $clickedElements, recordClick } from '@aazucena/stores/interactions';

const clicks = useStore($clickedElements);
recordClick('submit-button');
```

---

### journey/index.ts

#### $currentStep
**Type:** `Atom<number>`
**Purpose:** Current journey step

```typescript
import { $currentStep, nextStep, prevStep } from '@aazucena/stores/journey';

const step = useStore($currentStep);
nextStep(); // Increment step
prevStep(); // Decrement step
```

---

## PROVIDERS

### QueryProvider
**Purpose:** TanStack Query client setup

```typescript
import { QueryProvider } from '@aazucena/stores/providers';

<QueryProvider>
  <App />
</QueryProvider>
```

### WebSocketProvider
**Purpose:** Real-time event streaming

```typescript
import { WebSocketProvider } from '@aazucena/stores/providers';

<WebSocketProvider url="ws://localhost:3001">
  <App />
</WebSocketProvider>
```

### ProviderComposer
**Purpose:** Compose multiple providers

```typescript
import { ProviderComposer, StoreProvider, QueryProvider } from '@aazucena/stores/providers';

<ProviderComposer providers={[StoreProvider, QueryProvider, WebSocketProvider]}>
  <App />
</ProviderComposer>
```

---

**DOCUMENTATION_METADATA:**
- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Lines:** ~200

**INTELLIGENCE_THEME** • **STORE_REFERENCE** 📖
