import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@aazucena/ui';
import { ChevronDown, Search, Cog, Plus, Minus, ArrowRight } from '@aazucena/icons';
import type React from 'react';
/**
 * ## Accessibility (A11y)
 * - **Keyboard Navigation:** Use `Tab` to navigate between triggers and `Enter` or `Space` to toggle content.
 * - **Aria Roles:** Automatically handles `aria-expanded` and `aria-controls` for screen readers.
 * - **Nested Support:** Properly manages focus trapping and labels even in deep hierarchies.
 *
 * ## Engineering Status
 * - **Design:** `Verified`
 * - **Maturity:** `Stable`
 * - **Theme Support:** `AAZUCENA_v1`
 */

type AccordionStoryArgs = React.ComponentProps<typeof Accordion> & {
  type: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string;
  variant?: 'default' | 'card' | 'glass' | 'cyber';
  icon?: any;
  openIcon?: any;
  iconAnimation?: 'rotate' | 'rotate-90' | 'rotate-45' | 'flip-v' | 'flip-h' | 'none';
  hideIcon?: boolean;
  headerClassName?: string;
  iconClassName?: string;
  className?: string;
};

const meta = {
  title: 'Components/Navigation/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem, AccordionTrigger, AccordionContent } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A vertically stacked set of interactive headings that each reveal an associated section of content. Built on top of Radix UI Accordion primitive with enhanced styling and icon support.',
      },
    },
  },
  tags: ['autodocs', 'stable', 'a11y-verified'],
  argTypes: {
    // --- BEHAVIOR ---
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Determines whether one or multiple items can be opened at the same time.',
      table: {
        category: 'Behavior',
        type: { summary: 'single | multiple' },
        defaultValue: { summary: 'single' },
      },
    },
    collapsible: {
      control: 'boolean',
      description:
        'Allows closing content when clicking trigger for an open item (Single type only).',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'true' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'The value of the item to expand by default.',
      table: {
        category: 'Behavior',
      },
    },

    // --- APPEARANCE ---
    variant: {
      control: 'select',
      options: ['default', 'card'],
      description: 'The visual style of the accordion root container.',
      table: {
        category: 'Appearance',
        type: { summary: 'default | card' },
        defaultValue: { summary: 'default' },
      },
    },

    // --- ICONS & TRIGGERS ---
    icon: {
      control: 'text',
      description: 'The default icon component or string ID.',
      table: {
        category: 'Trigger Icons',
        type: { summary: 'ReactNode | string' },
        defaultValue: { summary: 'Plus' },
      },
    },
    openIcon: {
      control: 'text',
      description: 'The icon to show when expanded (enables Swap mode).',
      table: {
        category: 'Trigger Icons',
      },
    },
    iconAnimation: {
      control: 'select',
      options: ['rotate', 'rotate-90', 'rotate-45', 'flip-v', 'flip-h', 'none'],
      description: 'The animation preset for the icon.',
      table: {
        category: 'Trigger Icons',
        defaultValue: { summary: 'rotate' },
      },
    },
    hideIcon: {
      control: 'boolean',
      description: 'Removes the icon from the trigger.',
      table: {
        category: 'Trigger Icons',
      },
    },

    // --- STYLING ---
    headerClassName: {
      control: 'text',
      table: { category: 'Styling' },
    },
    iconClassName: {
      control: 'text',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<AccordionStoryArgs>;

export default meta;
type Story = StoryObj<AccordionStoryArgs>;

// --- TEMPLATES & HELPERS ---

const defaultItems = [
  {
    value: 'item-1',
    trigger: 'Is it accessible?',
    content: 'Yes. It adheres to the WAI-ARIA design pattern and includes full keyboard support.',
  },
  {
    value: 'item-2',
    trigger: 'Is it styled?',
    content: "Yes. It comes with default styles that matches the other components' aesthetic.",
  },
  {
    value: 'item-3',
    trigger: 'Is it animated?',
    content: "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

/**
 * Common render function to ensure Basic story responds to Controls
 */
const AccordionTemplate = (args: any) => (
  <Accordion {...args} className="w-full">
    {defaultItems.map((item) => (
      <AccordionItem key={item.value} value={item.value} variant={args.variant}>
        <AccordionTrigger
          variant={args.variant}
          icon={args.icon}
          openIcon={args.openIcon}
          iconAnimation={args.iconAnimation}
          hideIcon={args.hideIcon}
        >
          {item.trigger}
        </AccordionTrigger>
        <AccordionContent>{item.content}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

// --- BASIC USAGE ---

/**
 * The primary playground for the accordion.
 * **Interact with the Controls below** to live-edit the type, variant, and animations.
 */
export const Basic: Story = {
  args: {
    type: 'single',
    collapsible: true,
    variant: 'default',
    iconAnimation: 'rotate',
  },
  render: (args) => <AccordionTemplate {...args} />,
};

/**
 * A guided interaction story that demonstrates the expansion animation automatically.
 */
export const GuidedTour: Story = {
  args: {
    ...Basic.args,
  },
  render: (args) => <AccordionTemplate {...args} />,
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Is it accessible?');
    // Click to expand — wait for entry animation
    await userEvent.click(trigger);
    const content = canvas.getByText(
      'Yes. It adheres to the WAI-ARIA design pattern and includes full keyboard support.',
    );
    await waitFor(() => expect(content).toBeVisible(), { timeout: 2000 });
    // Click to collapse — Radix animates height to 0 before hiding
    await userEvent.click(trigger);
    await waitFor(() => expect(content).not.toBeVisible(), { timeout: 2000 });
  },
};

/**
 * Multiple items can be open simultaneously when type is set to "multiple".
 */
export const Multiple: Story = {
  args: {
    type: 'multiple',
    variant: 'default',
  },
  render: (args) => <AccordionTemplate {...args} />,
};

// --- VISUAL VARIANTS ---

/**
 * The Card variant provides a unified container with internal dividers.
 */
export const Card: Story = {
  args: {
    variant: 'card',
    type: 'single',
    collapsible: true,
  },
  render: (args) => <AccordionTemplate {...args} />,
};

export const Glass: Story = {
  args: {
    type: 'single',
  },
  render: () => (
    <Accordion type="single" collapsible={true} className="w-full">
      <AccordionItem value="item-1" variant="glass">
        <AccordionTrigger variant="glass">Glass Design</AccordionTrigger>
        <AccordionContent>
          Semi-transparent background with backdrop blur effect for a modern layered look.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" variant="glass">
        <AccordionTrigger variant="glass">Soft Interaction</AccordionTrigger>
        <AccordionContent>
          The glass variant features subtle borders and high-fidelity transitions.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Cyber: Story = {
  args: {
    type: 'single',
  },
  render: () => (
    <Accordion type="single" collapsible={true} className="w-full">
      <AccordionItem value="item-1" variant="cyber">
        <AccordionTrigger variant="cyber">// SYSTEM_PROTOCOL</AccordionTrigger>
        <AccordionContent>
          Cyber-styled accordion with glowing cyan borders and monospace typography.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" variant="cyber">
        <AccordionTrigger variant="cyber">// SIGNAL_LOCK</AccordionTrigger>
        <AccordionContent>
          Optimized for high-contrast engineering interfaces and telemetry dashboards.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// --- ICON CUSTOMIZATION ---

/**
 * Showcasing the various animation presets available for the trigger icons.
 */
export const Animations: Story = {
  args: {
    type: 'single',
  },
  render: () => (
    <Accordion type="single" collapsible={true} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger icon={ChevronDown} iconAnimation="rotate">
          Rotate 180 (Chevron)
        </AccordionTrigger>
        <AccordionContent>Standard rotation for navigation-style accordions.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger icon={Plus} iconAnimation="rotate-45">
          Rotate 45 (Plus to X)
        </AccordionTrigger>
        <AccordionContent>Transforms a plus icon into a close cross.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger icon={ArrowRight} iconAnimation="rotate-90">
          Rotate 90 (Arrow Right to Down)
        </AccordionTrigger>
        <AccordionContent>Great for directional arrows that indicate expansion.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Demonstrate the swapping effect where the icon component changes entirely.
 */
export const Swapping: Story = {
  args: {
    icon: Plus,
    openIcon: Minus,
    type: 'single',
    collapsible: true,
  },
  render: (args) => <AccordionTemplate {...args} />,
};

// --- ADVANCED ---

/**
 * Demonstrate granular styling control using Tailwind classes.
 */
export const Styling: Story = {
  args: {
    type: 'single',
  },
  render: () => (
    <Accordion type="single" collapsible={true} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="text-primary hover:text-primary/90"
          iconClassName="text-primary"
        >
          Primary Themed Trigger
        </AccordionTrigger>
        <AccordionContent>
          The text and icon are colored using the primary theme color.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger
          headerClassName="bg-emerald-500/10 rounded-lg px-2"
          className="text-emerald-600 dark:text-emerald-400 hover:no-underline"
          iconClassName="text-emerald-500"
        >
          Emerald Header Wrapper
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          The headerClassName prop styles the background wrapper independently.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Accordions can be nested within one another for complex data hierarchies.
 */
export const Nested: Story = {
  args: {
    type: 'single',
  },
  render: () => (
    <Accordion type="single" collapsible={true} variant="card" className="w-full">
      <AccordionItem value="parent-1" variant="card">
        <AccordionTrigger variant="card">Frontend Architecture</AccordionTrigger>
        <AccordionContent>
          <div className="pb-2 text-muted-foreground italic text-xs">
            Explore our frontend stack:
          </div>
          <Accordion
            type="single"
            collapsible={true}
            className="w-full border-t border-border mt-2"
          >
            <AccordionItem value="child-1">
              <AccordionTrigger className="py-2">Framework Core</AccordionTrigger>
              <AccordionContent>
                Astro 5.x for static optimization and React 19 for rich client-side interactivity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="child-2">
              <AccordionTrigger className="py-2">Style System</AccordionTrigger>
              <AccordionContent>
                Tailwind CSS 4 for utility-first styling and Framer Motion for complex animations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
