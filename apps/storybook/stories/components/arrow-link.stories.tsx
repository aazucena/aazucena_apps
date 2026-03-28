import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect, userEvent } from 'storybook/test';
import { ArrowLink, ArrowLinkSubtitle, ArrowLinkTitle } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic Link component with composite Card variations.
 * - **Logic:** Uses CVA to handle directionality and complex variant switching.
 * - **UX:** Features active-scale feedback and hover-triggered arrow displacement.
 */
const meta = {
  title: 'Components/Navigation/ArrowLink',
  component: ArrowLink,
  subcomponents: { ArrowLinkTitle, ArrowLinkSubtitle } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A semantic navigation link featuring an animated directional arrow. Supports inline, circular, and large card variations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'cyber',
        'muted',
        'white',
        'card',
        'card-glass',
        'card-cyber',
        'circular',
        'circular-cyber',
      ],
      description: 'Visual style variation',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
      description: 'Text size preset',
      table: { category: 'Appearance' },
    },
    direction: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Direction of the arrow and flow',
      table: { category: 'Behavior' },
    },
    showArrow: {
      control: 'boolean',
      description: 'Toggle arrow visibility',
      table: { category: 'Behavior' },
    },
    iconSize: {
      control: 'number',
      description: 'Override standard icon size',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ArrowLink>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The primary playground for testing ArrowLink variations.
 */
export const Basic: Story = {
  args: {
    href: '#',
    children: 'EXPLORE_ARCHIVE',
    variant: 'default',
    size: 'default',
    direction: 'right',
    showArrow: true,
  },
};

/**
 * High-performance dark mode variant with glitch-ready italics and cyan tints.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    children: 'ESTABLISH_UPLINK',
  },
};

/**
 * Navigation links with rounded backdrops, ideal for "Back" buttons or pagination.
 */
export const Circular: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <ArrowLink variant="circular" direction="left" href="#">
        Back
      </ArrowLink>
      <ArrowLink variant="circular-cyber" size="sm" href="#">
        CONTINUE
      </ArrowLink>
    </div>
  ),
};

/**
 * Large, immersive navigation blocks designed for homepage section entries.
 */
export const Cards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[1000px]">
      <ArrowLink variant="card" href="#">
        <ArrowLinkTitle>PROJECTS</ArrowLinkTitle>
        <ArrowLinkSubtitle>Engineering portfolio</ArrowLinkSubtitle>
      </ArrowLink>

      <ArrowLink variant="card-glass" href="#">
        <ArrowLinkTitle>JOURNEY</ArrowLinkTitle>
        <ArrowLinkSubtitle>Career timeline & stats</ArrowLinkSubtitle>
      </ArrowLink>

      <ArrowLink variant="card-cyber" href="#">
        <ArrowLinkTitle className="font-mono italic">// INTEL</ArrowLinkTitle>
        <ArrowLinkSubtitle className="font-mono">Technical telemetry</ArrowLinkSubtitle>
      </ArrowLink>
    </div>
  ),
};

/**
 * Test focused state and active scaling.
 */
export const InteractionTest: Story = {
  args: {
    ...Basic.args,
    children: 'FOCUS_TEST',
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');

    // Test focus
    await link.focus();
    await expect(link).toHaveFocus();

    // Simulate interaction
    await userEvent.click(link);
  },
};
