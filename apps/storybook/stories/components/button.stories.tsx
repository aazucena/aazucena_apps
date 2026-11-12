import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Button } from '@aazucena/ui';
import { Play, Download, Trash, PlusCircle as Plus, ChevronRight, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic primitive for all interactive actions.
 * - **UX:** Features `active:scale-95` for physical tactile feedback.
 * - **Architecture:** Uses CVA for 9 visual variants and 4 size presets.
 * - **Accessibility:** Built on Radix `Slot` for polymorphism; supports `aria-label` for icon-only states.
 */
const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    // Figma component set in the Avra Design System file (addon-designs Design tab)
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=4-62',
    },
    docs: {
      description: {
        component:
          'The primary action primitive. Supports multiple visual themes (ShadCN + Custom), polymorphic rendering, and tactile feedback animations.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'glass',
        'cyber',
        'gradient',
      ],
      description: 'The visual style of the button',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Physical dimensions',
      table: { category: 'Appearance' },
    },
    asChild: {
      control: 'boolean',
      description: 'Change the underlying element (e.g. to a Link)',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies dimming',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard application button.
 */
export const Basic: Story = {
  args: {
    children: 'EXECUTE_COMMAND',
    variant: 'default',
    size: 'default',
  },
};

/**
 * High-performance cyber variant with neon borders and shadow glow.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
    children: (
      <>
        <Play className="mr-2" />
        INIT_SEQUENCE
      </>
    ),
  },
};

/**
 * Modern gradient variant for primary call-to-actions.
 */
export const Highlight: Story = {
  args: {
    variant: 'gradient',
    className: 'px-8 py-6 rounded-full font-black tracking-widest',
    children: (
      <>
        UPGRADE_NOW
        <ChevronRight className="ml-2" />
      </>
    ),
  },
};

/**
 * Transparent glass variant, ideal for atmospheric or image-heavy backgrounds.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 rounded-card">
      <Button {...args}>
        <Activity className="mr-2" />
        TELEMETRY_VIEW
      </Button>
    </div>
  ),
};

/**
 * Demonstrates the range of available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Button size="sm">Small_Unit</Button>
      <Button size="default">Default_Unit</Button>
      <Button size="lg">Large_Unit</Button>
      <Button size="icon" variant="outline" aria-label="Download">
        <Download />
      </Button>
    </div>
  ),
};

/**
 * Semantic variants for specific contexts like destruction or subtle navigation.
 */
export const Semantic: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="destructive">
        <Trash className="mr-2" /> Delete
      </Button>
      <Button variant="outline">Secondary Action</Button>
      <Button variant="ghost">Ghost Option</Button>
      <Button variant="link">External Link</Button>
    </div>
  ),
};

/**
 * Automated test for click interactions and active state styles.
 */
export const InteractionTest: Story = {
  args: {
    ...Basic.args,
    children: 'CLICK_ME',
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Initial state check
    await new Promise((r) => setTimeout(r, 500));

    // Simulate interaction
    await userEvent.click(button);

    // Instrument tokens reach the page (Avra 0.2)
    const root = getComputedStyle(document.documentElement);
    await expect(root.getPropertyValue('--radius-control').trim()).toBe('4px');
    await expect(root.getPropertyValue('--rule').trim()).not.toBe('');
    await expect(root.getPropertyValue('--card').trim()).not.toBe('');
  },
};

/**
 * Keyboard focus shows a 1px signal outline (no ring offset, no shadow); 4px control radius.
 */
export const FocusVisible: Story = {
  args: { ...Basic.args, children: 'FOCUS_ME' },
  play: async ({ canvasElement }: any) => {
    const button = within(canvasElement).getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    const style = getComputedStyle(button);
    await expect(style.outlineStyle).not.toBe('none');
    await expect(style.borderTopLeftRadius).toBe('4px');
    await expect(style.boxShadow).toBe('none');
  },
};
