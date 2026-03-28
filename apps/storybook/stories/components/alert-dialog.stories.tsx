import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@aazucena/ui';
import type React from 'react';

/**
 * ## Accessibility (A11y)
 * - **Focus Trapping:** Automatically traps focus within the dialog when open.
 * - **Dismissal:** Can be closed via `Escape` key or by clicking the Cancel button.
 * - **Screen Readers:** Uses `AlertDialogTitle` and `AlertDialogDescription` to set the appropriate accessible labels.
 *
 * ## Engineering Status
 * - **Design:** `Verified`
 * - **Maturity:** `Stable`
 * - **Theme Support:** `AAZUCENA_v1`
 */

type AlertDialogStoryArgs = React.ComponentProps<typeof AlertDialog> & {
  variant?: 'default' | 'glass' | 'cyber';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  alignment?: 'start' | 'center' | 'end' | 'between' | 'stacked';
  title?: string;
  description?: string;
};

const meta = {
  title: 'Components/Overlay/AlertDialog',
  component: AlertDialog,
  subcomponents: {
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal dialog that interrupts the user with urgent content and expects a confirmation. Built on Radix UI AlertDialog.',
      },
    },
  },
  tags: ['autodocs', 'stable', 'a11y-verified'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual style of the dialog content',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'The maximum width of the dialog',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'lg' },
      },
    },
    alignment: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'stacked'],
      description: 'The alignment of buttons in the footer',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'end' },
      },
    },
  },
} satisfies Meta<AlertDialogStoryArgs>;

export default meta;
type Story = StoryObj<AlertDialogStoryArgs>;

// --- TEMPLATES ---

const AlertDialogTemplate = (args: any) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant={
          args.variant === 'cyber' ? 'cyber' : args.variant === 'glass' ? 'glass' : 'outline'
        }
      >
        Trigger {args.size?.toUpperCase() || 'LG'} Alert
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent variant={args.variant} size={args.size}>
      <AlertDialogHeader>
        <AlertDialogTitle>{args.title || 'Are you absolutely sure?'}</AlertDialogTitle>
        <AlertDialogDescription>
          {args.description ||
            'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter alignment={args.alignment}>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={args.variant === 'cyber' ? 'bg-cyan-600 hover:bg-cyan-500' : ''}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// --- BASIC USAGE ---

/**
 * The primary playground for the AlertDialog.
 * **Interact with the Controls below** to live-edit the variant, size, and button alignment.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    alignment: 'end',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

/**
 * Automatically opens the dialog to demonstrate the entry animation and focus trapping.
 */
export const GuidedTour: Story = {
  args: {
    ...Basic.args,
    title: 'Interaction Verified',
    description: 'The automated play function has successfully triggered this modal.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Trigger LG Alert/i });

    // Open Dialog
    await userEvent.click(trigger);

    // Wait for entry animation before asserting visibility
    const title = await within(document.body).findByText(/Interaction Verified/i);
    await waitFor(() => expect(title).toBeVisible(), { timeout: 2000 });

    // Close Dialog
    const cancel = within(document.body).getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancel);
  },
};

// --- SIZES ---

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Small Alert',
    description: 'A compact dialog for quick confirmations.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    title: 'Expanded Context',
    description:
      'Use larger sizes when you need to display more descriptive text or additional data visualizations within the alert dialog.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

export const FullWidth: Story = {
  args: {
    size: 'full',
    title: 'Maximum Impact',
    description:
      'The full width variant scales to 95% of the viewport width, useful for complex workflows.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

// --- FOOTER ALIGNMENT ---

export const CenterAligned: Story = {
  args: {
    alignment: 'center',
    title: 'Balanced Layout',
    description: 'Buttons are centered in the footer for a symmetrical appearance.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

export const StartAligned: Story = {
  args: {
    alignment: 'start',
    title: 'Alternative Placement',
    description: 'Buttons are aligned to the start (left) of the footer.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

export const StackedButtons: Story = {
  args: {
    alignment: 'stacked',
    title: 'Mobile-First Layout',
    description:
      'Buttons are stacked vertically, which is often better for long button labels or mobile-optimized interfaces.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

// --- VISUAL VARIANTS ---

export const Glass: Story = {
  args: {
    variant: 'glass',
    size: 'md',
    title: 'Atmospheric Override',
    description: 'Applying frosted textures to the global overlay system.',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};

export const Cyber: Story = {
  args: {
    variant: 'cyber',
    size: 'md',
    title: '// SECURE_DELETION',
    description: 'Protocol 0.9 initiated. Are you prepared to scrub the local database?',
  },
  render: (args) => <AlertDialogTemplate {...args} />,
};
