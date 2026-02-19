import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent } from '@storybook/test';
import { BackToTop } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **UX:** Provides a frictionless way to return to the top of long-form content.
 * - **Logic:** Uses an intersection-style threshold (default 300px) to trigger visibility.
 * - **Animation:** Orchestrated with Framer Motion `AnimatePresence` for smooth entry/exit.
 * - **Variants:** Supports `glass` (default) and high-fidelity `cyber` styles.
 */
const meta = {
  title: 'Components/Navigation/BackToTop',
  component: BackToTop,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating button that appears after scrolling a certain distance, allowing users to return to the top of the page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual style of the button',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Physical dimensions',
      table: { category: 'Appearance' },
    },
    threshold: {
      control: 'number',
      description: 'Scroll distance (px) before the button appears',
      table: { category: 'Behavior' },
    },
    forceVisible: {
      control: 'boolean',
      description: 'Force the button to be visible regardless of scroll position (Storybook only)',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof BackToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The default glass variant, designed to be subtle and non-distracting.
 */
export const Basic: Story = {
  args: {
    variant: 'glass',
    size: 'default',
    forceVisible: true,
  },
};

/**
 * High-performance cyber variant with neon borders and glow.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
};

/**
 * Demonstrates the auto-show behavior. **Scroll the preview window below.**
 */
export const ScrollBehavior: Story = {
  render: (args) => (
    <div className="h-[150vh] w-full flex items-center justify-center border border-dashed rounded-3xl bg-muted/5 relative">
      <div className="text-center space-y-4">
        <p className="font-mono text-xs opacity-40">↓ SCROLL_DOWN_TO_ACTIVATE ↓</p>
        <div className="h-96" />
        <p className="text-sm font-bold animate-pulse">TRIGGER_ZONE</p>
      </div>
      <BackToTop {...args} className="absolute" />
    </div>
  ),
  args: {
    ...Basic.args,
    forceVisible: false,
    threshold: 100,
  },
};

/**
 * Interaction test for clicking the button.
 */
export const InteractionTest: Story = {
  args: {
    ...Basic.args,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Check initial state
    await new Promise((r) => setTimeout(r, 500));

    // Simulate Click
    await userEvent.click(button);
  },
};
