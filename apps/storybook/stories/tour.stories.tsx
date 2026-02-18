import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tour, TourStep } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Guided walkthrough system for onboarding and feature discovery.
 * - **UX:** Step-by-step tooltips with spotlight highlight on target elements; skip/back/next navigation.
 * - **Accessibility:** Dialog role on tooltip with aria-label; backdrop click to dismiss.
 * - **Design:** CSS z-index layering with dynamic scroll-into-view for each step target.
 */
const meta = {
  title: 'Components/Overlays/Tour',
  component: Tour,
  subcomponents: { TourStep },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Guided tour component for onboarding walkthroughs. Highlights target elements with spotlight and step-by-step tooltips with navigation controls.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Whether the tour is active',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultStep: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Index of the initial step to display',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    steps: {
      description: 'Array of step definitions with target selectors and content',
      table: {
        category: 'Content',
        type: { summary: 'TourStepData[]' },
      },
    },
    onComplete: {
      description: 'Callback fired when the user finishes the last step',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    onSkip: {
      description: 'Callback fired when the user skips the tour',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[500px] bg-background p-8">
        <div className="flex gap-4">
          <button
            id="tour-btn-1"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Dashboard
          </button>
          <button id="tour-btn-2" className="rounded-md border border-border px-4 py-2">
            Navigation
          </button>
          <button id="tour-btn-3" className="rounded-md border border-border px-4 py-2">
            Settings
          </button>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSteps = [
  {
    target: '#tour-btn-1',
    title: 'Welcome',
    description: 'This is your dashboard. Let us show you around.',
  },
  {
    target: '#tour-btn-2',
    title: 'Navigation',
    description: 'Use this menu to navigate between sections.',
  },
  {
    target: '#tour-btn-3',
    title: 'Settings',
    description: 'Customize your experience here.',
  },
];

// --- BASIC USAGE ---

/**
 * Standard three-step tour highlighting buttons in sequence.
 */
export const Basic: Story = {
  args: {
    open: true,
    steps: defaultSteps,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted translucent tooltip on a gradient background.
 */
export const Glass: Story = {
  args: {
    open: true,
    variant: 'glass',
    steps: defaultSteps,
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[500px] rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <div className="flex gap-4">
          <button
            id="tour-btn-1"
            className="rounded-md bg-white/20 px-4 py-2 text-white backdrop-blur-sm"
          >
            Dashboard
          </button>
          <button
            id="tour-btn-2"
            className="rounded-md border border-white/30 px-4 py-2 text-white"
          >
            Navigation
          </button>
          <button
            id="tour-btn-3"
            className="rounded-md border border-white/30 px-4 py-2 text-white"
          >
            Settings
          </button>
        </div>
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with mono typography and cyan neon glow.
 */
export const Cyber: Story = {
  args: {
    open: true,
    variant: 'cyber',
    steps: [
      {
        target: '#tour-btn-1',
        title: 'SYSTEM_INIT',
        description: 'Neural interface calibration in progress.',
      },
      {
        target: '#tour-btn-2',
        title: 'NAV_MODULE',
        description: 'Routing sub-system engaged.',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[400px] bg-black p-8">
        <div className="flex gap-4">
          <button
            id="tour-btn-1"
            className="rounded border border-cyan-500/30 px-4 py-2 font-mono text-cyan-400"
          >
            INITIALIZE
          </button>
          <button
            id="tour-btn-2"
            className="rounded border border-cyan-500/20 px-4 py-2 font-mono text-cyan-500/60"
          >
            NAV_MODULE
          </button>
        </div>
        <Story />
      </div>
    ),
  ],
};

// --- ADVANCED ---

/**
 * Tour starting at the second step to demonstrate the defaultStep prop.
 */
export const StartAtStep: Story = {
  args: {
    open: true,
    defaultStep: 1,
    steps: defaultSteps,
  },
};

/**
 * Single-step tour useful for spotlighting a single feature.
 */
export const SingleStep: Story = {
  args: {
    open: true,
    steps: [
      {
        target: '#tour-btn-1',
        title: 'Quick Tip',
        description: 'Click here to access your main dashboard.',
      },
    ],
  },
};

/**
 * Tour in its closed (inactive) state. Nothing is rendered to the DOM.
 */
export const Closed: Story = {
  args: {
    open: false,
    steps: defaultSteps,
  },
};
