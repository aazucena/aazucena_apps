import {
  Code,
  Image,
  Zap as Bolt,
  Database,
  Globe,
  Shield,
  Users,
  CogFour as Settings
} from '@mynaui/icons-react';
import type { LoadingStep } from '../types';

// Default steps that can be extended or overridden
export const DEFAULT_LOADING_STEPS: LoadingStep[] = [
  {
    id: 1,
    name: 'Initializing',
    description: 'Setting up framework',
    icon: Code,
    weight: 20
  },
  {
    id: 2,
    name: 'Loading Assets',
    description: 'Images and resources',
    icon: Image,
    weight: 30
  },
  {
    id: 3,
    name: 'Optimizing',
    description: 'Performance tweaks',
    icon: Bolt,
    weight: 20
  },
];

// Additional step options that can be used
export const EXTRA_LOADING_STEPS: Record<string, LoadingStep> = {
  database: {
    id: 4,
    name: 'Database',
    description: 'Connecting to database',
    icon: Database,
    weight: 15,
    check: async () => {
      // Simulate database connection check
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 500);
      });
    }
  },
  api: {
    id: 5,
    name: 'API Services',
    description: 'Initializing API connections',
    icon: Globe,
    weight: 15,
    check: async () => {
      // Check if API is reachable
      try {
        const response = await fetch('/api/health', { method: 'HEAD' });
        return response.ok;
      } catch {
        return false; // API might not be available during preload
      }
    }
  },
  auth: {
    id: 6,
    name: 'Authentication',
    description: 'Setting up user session',
    icon: Shield,
    weight: 10,
    check: () => {
      // Check if authentication is ready
      return !!localStorage.getItem('auth-token') || true; // Fallback to true
    }
  },
  userData: {
    id: 7,
    name: 'User Data',
    description: 'Loading user preferences',
    icon: Users,
    weight: 10,
    check: async () => {
      // Simulate user data loading
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 300);
      });
    }
  },
  configuration: {
    id: 8,
    name: 'Configuration',
    description: 'Loading app settings',
    icon: Settings,
    weight: 10,
    check: () => {
      // Check if configuration is loaded
      if (typeof window === 'undefined' || 'appConfig' in window === false) {
        return false;
      }
      return !!window.appConfig || true; // Fallback to true
    }
  }
};

// Helper function to get steps with custom steps
export function getLoadingSteps(customSteps?: LoadingStep[]): LoadingStep[] {
  const baseSteps = [...DEFAULT_LOADING_STEPS];

  if (!customSteps || customSteps.length === 0) {
    return baseSteps;
  }

  // Merge custom steps with defaults, allowing overrides by ID
  const stepMap = new Map<number, LoadingStep>();

  // Add all base steps
  // baseSteps.forEach(step => stepMap.set(step.id, step));

  // Add or override with custom steps
  customSteps.forEach(customStep => {
    stepMap.set(customStep.id, {
      ...stepMap.get(customStep.id), // Keep existing properties if overriding
      ...customStep // Override with custom properties
    });
  });

  return Array.from(stepMap.values()).sort((a, b) => a.id - b.id);
}

// Helper to get a specific extra step
export function getExtraStep(stepKey: string): LoadingStep | undefined {
  return EXTRA_LOADING_STEPS[stepKey];
}

// Helper to get multiple extra steps
export function getExtraSteps(stepKeys: string[]): LoadingStep[] {
  return stepKeys
    .map(key => EXTRA_LOADING_STEPS[key])
    .filter((step): step is LoadingStep => step !== undefined);
}

export const DEFAULT_MIN_DISPLAY_TIME = 1500;
