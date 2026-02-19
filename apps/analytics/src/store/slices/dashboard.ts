import { ALL_CATEGORIES } from '@/lib/data';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Define Valid Time Ranges (Avoid magic strings)
export type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all';

// Define standard presets
export const CATEGORY_PRESETS = {
  OVERVIEW: ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'],
  MUSIC: ['Music Play'],
  PERFORMANCE: ['Error', 'Interaction', 'API', 'Database', 'Cache'], // Focus on potential issues
  LOGS: ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'],
  SYSTEM: ['Page View', 'Interaction', 'Error', 'API'],
  INTELLIGENCE: ['Interaction', 'Error', 'API', 'Database'],
} as const;

export type CategoryPreset = keyof typeof CATEGORY_PRESETS;

// 2. Define the State Interface
interface DashboardState {
  // Global Filters (affects all charts)
  filters: {
    timeRange: TimeRange;
    startDate: string | null; // ISO Date String
    endDate: string | null; // ISO Date String
    searchQuery: string; // For filtering logs/tables
    visibleCategories: string[];
  };
  // UI State (persists during session)
  ui: {
    isSidebarCollapsed: boolean;
    navMode: 'SYSTEM' | 'INTELLIGENCE';
    activeTab: string; // 'overview' | 'music' | 'logs'
    refreshInterval: number; // 5000ms, 10000ms, or 0 (paused)
  };
  // Status (for the header badge)
  status: {
    isLive: boolean; // True if polling is active
    lastUpdated: string | null; // ISO Date String
  };
}

// 3. Initial State
const initialState: DashboardState = {
  filters: {
    timeRange: '24h',
    startDate: null,
    endDate: null,
    searchQuery: '',
    visibleCategories: CATEGORY_PRESETS.OVERVIEW as unknown as string[],
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
  },
};

// 4. The Slice
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.filters.timeRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    toggleSidebar: (state) => {
      state.ui.isSidebarCollapsed = !state.ui.isSidebarCollapsed;
    },
    toggleLiveMode: (state) => {
      state.status.isLive = !state.status.isLive;
      // When paused, stop polling (handled in component via refreshInterval)
      state.ui.refreshInterval = state.status.isLive ? 5000 : 0;
    },
    updateLastSync: (state) => {
      state.status.lastUpdated = new Date().toISOString();
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.filters.visibleCategories.includes(category)) {
        state.filters.visibleCategories = state.filters.visibleCategories.filter(
          (c) => c !== category,
        );
      } else {
        state.filters.visibleCategories.push(category);
      }
    },
    resetCategories: (state, action: PayloadAction<string[]>) => {
      state.filters.visibleCategories = action.payload;
    },
    setCategoryPreset: (state, action: PayloadAction<CategoryPreset>) => {
      console.log(`[Redux] setCategoryPreset payload: ${action.payload}`);
      console.log(`[Redux] Available presets:`, Object.keys(CATEGORY_PRESETS));
      const preset = CATEGORY_PRESETS[action.payload];
      if (preset) {
        state.filters.visibleCategories = [...preset];
      } else {
        console.warn(`[Redux] Attempted to set unknown category preset: ${action.payload}`);
      }
    },
    setNavMode: (state, action: PayloadAction<'SYSTEM' | 'INTELLIGENCE'>) => {
      state.ui.navMode = action.payload;
    },
  },
});

export const {
  setTimeRange,
  setSearchQuery,
  toggleSidebar,
  toggleLiveMode,
  updateLastSync,
  resetCategories,
  toggleCategory,
  setCategoryPreset,
  setNavMode,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
