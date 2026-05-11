import type { LoadingStep } from '@aazucena/types';

// Default steps that can be extended or overridden
// Icons are now string IDs to decouple constants from UI packages
export const DEFAULT_LOADING_STEPS: LoadingStep[] = [
  {
    id: 1,
    name: 'Initializing',
    description: 'Setting up framework',
    icon: 'Code',
    weight: 20,
  },
  {
    id: 2,
    name: 'Loading Assets',
    description: 'Images and resources',
    icon: 'Image',
    weight: 30,
  },
  {
    id: 3,
    name: 'Optimizing',
    description: 'Performance tweaks',
    icon: 'Zap',
    weight: 20,
  },
];

// Additional step options that can be used
export const EXTRA_LOADING_STEPS: Record<string, LoadingStep> = {
  database: {
    id: 4,
    name: 'Database',
    description: 'Connecting to database',
    icon: 'Database',
    weight: 15,
  },
  api: {
    id: 5,
    name: 'API Services',
    description: 'Initializing API connections',
    icon: 'Globe',
    weight: 15,
  },
  auth: {
    id: 6,
    name: 'Authentication',
    description: 'Setting up user session',
    icon: 'Shield',
    weight: 10,
  },
  userData: {
    id: 7,
    name: 'User Data',
    description: 'Loading user preferences',
    icon: 'Users',
    weight: 10,
  },
  configuration: {
    id: 8,
    name: 'Configuration',
    description: 'Loading app settings',
    icon: 'Settings',
    weight: 10,
  },
};

export const DEFAULT_MIN_DISPLAY_TIME = 1500;
