import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import Preloader, {
  type UnifiedPreloaderPropsWithTheme as UnifiedPreloaderProps,
} from '../components/preloader/index.js';
import { Check, Database, Layout, Shield } from '@aazucena/icons';

const meta = {
  title: 'UI/Preloader',
  component: Preloader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A highly customizable preloader component with multiple variants and extensive configuration options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['interactive', 'simple'],
      description: 'The type of preloader to display',
      table: {
        type: { summary: 'PreloaderVariant' },
        defaultValue: { summary: 'interactive' },
      },
    },
    minDisplayTime: {
      control: { type: 'number', min: 0, max: 10000, step: 100 },
      description: 'Minimum time in milliseconds to display the preloader',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1500' },
      },
    },
    maxDisplayTime: {
      control: { type: 'number', min: 0, max: 30000, step: 1000 },
      description: 'Maximum time before auto-completing (safety net)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '10000' },
      },
    },
    autoStart: {
      control: { type: 'boolean' },
      description: 'Whether to start loading automatically',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    enableSkip: {
      control: { type: 'boolean' },
      description: 'Allow users to skip the preloader',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'Main title during loading',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Preparing Your Experience' },
      },
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtitle during loading',
    },
    readyTitle: {
      control: { type: 'text' },
      description: 'Title shown when ready',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Ready to Explore!' },
      },
    },
    readySubtitle: {
      control: { type: 'text' },
      description: 'Subtitle shown when ready',
      table: {
        type: { summary: 'string' },
        defaultValue: {
          summary: 'Your experience is fully optimized and ready',
        },
      },
    },
    continueButton: {
      control: { type: 'boolean' },
      description: 'Allow users to skip the continue button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    continueButtonText: {
      control: { type: 'text' },
      description: 'Text for the continue button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Enter Website' },
      },
    },
    animationDuration: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Duration of animations in milliseconds',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '600' },
      },
    },
    enableAnimations: {
      control: { type: 'boolean' },
      description: 'Enable or disable all animations',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    transitionType: {
      control: { type: 'select' },
      options: ['fade', 'slide', 'scale', 'none'],
      description: 'Type of transition animation',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'fade' },
      },
    },
    lazyLoad: {
      control: { type: 'boolean' },
      description: 'Only load when in viewport',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onComplete: {
      action: 'completed',
      description: 'Callback when preloader completes',
    },
    onSkip: {
      action: 'skipped',
      description: 'Callback when user skips preloader',
    },
    onLoadingStart: {
      action: 'loadingStarted',
      description: 'Callback when loading starts',
    },
    onLoadingProgress: {
      action: 'loadingProgress',
      description: 'Callback with progress updates',
    },
    onError: {
      action: 'error',
      description: 'Callback when error occurs',
    },
  },
  args: {
    variant: 'interactive',
    minDisplayTime: 1500,
    maxDisplayTime: 10000,
    autoStart: true,
    enableSkip: false,
    title: 'Preparing Your Experience',
    readyTitle: 'Ready to Explore!',
    readySubtitle: 'Your experience is fully optimized and ready',
    continueButtonText: 'Enter Website',
    animationDuration: 600,
    enableAnimations: true,
    transitionType: 'fade',
    lazyLoad: false,
    onComplete: fn(),
    onSkip: fn(),
    onLoadingStart: fn(),
    onLoadingProgress: fn(),
    onError: fn(),
  },
} satisfies Meta<UnifiedPreloaderProps>;

export default meta;
type Story = StoryObj<UnifiedPreloaderProps>;

export const Interactive: Story = {
  args: {
    variant: 'interactive',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Feature-rich preloader with step indicators, progress tracking, and smooth animations.',
      },
    },
  },
};

export const Simple: Story = {
  args: {
    variant: 'simple',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal preloader with clean design and basic progress indication.',
      },
    },
  },
};

export const WithCustomText: Story = {
  args: {
    variant: 'interactive',
    title: 'Loading Your Dashboard',
    subtitle: 'Please wait while we prepare your personalized experience',
    readyTitle: 'Dashboard Ready!',
    readySubtitle: 'Your analytics and reports are now available',
    continueButtonText: 'View Dashboard',
  },
  name: 'With Custom Text',
  parameters: {
    docs: {
      description: {
        story: 'Preloader with customized text for specific use cases like dashboards.',
      },
    },
  },
};

export const SkipEnabled: Story = {
  args: {
    variant: 'interactive',
    enableSkip: true,
    minDisplayTime: 3000,
  },
  name: 'With Skip Button',
  parameters: {
    docs: {
      description: {
        story: 'Preloader with skip functionality for impatient users.',
      },
    },
  },
};

export const NoContinueButton: Story = {
  args: {
    variant: 'interactive',
    continueButton: false,
  },
  name: 'No Continue Button',
  parameters: {
    docs: {
      description: {
        story: 'Preloader without the continue button for a more streamlined experience.',
      },
    },
  },
};

export const QuickLoad: Story = {
  args: {
    variant: 'interactive',
    minDisplayTime: 800,
    animationDuration: 300,
  },
  name: 'Quick Load',
  parameters: {
    docs: {
      description: {
        story: 'Fast-loading preloader with shorter animations and display time.',
      },
    },
  },
};

export const NoAnimations: Story = {
  args: {
    variant: 'interactive',
    enableAnimations: false,
    transitionType: 'none',
  },
  name: 'Without Animations',
  parameters: {
    docs: {
      description: {
        story: 'Preloader with all animations disabled for performance or accessibility reasons.',
      },
    },
  },
};

export const WithCallbacks: Story = {
  args: {
    variant: 'interactive',
    onLoadingStart: fn().mockImplementation(() => {
      console.warn('🔄 Loading started at:', new Date().toISOString());
    }),
    onLoadingProgress: fn().mockImplementation((progress, step) => {
      console.warn(`📊 Progress: ${progress}%, Step: ${step}`);
    }),
    onComplete: fn().mockImplementation(() => {
      console.warn('✅ Loading completed at:', new Date().toISOString());
    }),
    onSkip: fn().mockImplementation(() => {
      console.warn('⏭️ User skipped loading');
    }),
  },
  name: 'With All Callbacks',
  parameters: {
    docs: {
      description: {
        story:
          'Preloader demonstrating all available callback functions for tracking loading lifecycle.',
      },
    },
  },
};

export const CustomSteps: Story = {
  args: {
    variant: 'interactive',
    customSteps: [
      {
        id: 1,
        name: 'Authentication',
        description: 'Verifying user credentials',
        icon: Shield,
        weight: 20,
        check: async () => {
          await new Promise((resolve) => setTimeout(resolve, 800));
          return true;
        },
      },
      {
        id: 2,
        name: 'Data Loading',
        description: 'Fetching user data',
        icon: Database,
        weight: 40,
        check: async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          return true;
        },
      },
      {
        id: 3,
        name: 'UI Setup',
        description: 'Preparing interface',
        icon: Layout,
        weight: 30,
      },
      {
        id: 4,
        name: 'Final Checks',
        description: 'Running final verifications',
        icon: Check,
        weight: 10,
      },
    ],
  },
  name: 'With Custom Steps',
  parameters: {
    docs: {
      description: {
        story: 'Interactive preloader with completely custom steps and progress checking.',
      },
    },
  },
};

// Showcase all features
// export const FeatureShowcase: StoryObj = {
//   render: () => Page,
//   parameters: {
//     docs: {
//       description: {
//         story: 'Comprehensive overview of all preloader features and customization options.',
//       },
//     },
//   },
// };

// Mobile responsive stories
export const MobileInteractive: Story = {
  args: {
    variant: 'interactive',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Interactive preloader optimized for mobile devices.',
      },
    },
  },
};

export const MobileSimple: Story = {
  args: {
    variant: 'simple',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Simple preloader on mobile viewport.',
      },
    },
  },
};
