import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect, userEvent } from 'storybook/test';
import {
  AppLoader,
  AppLoaderContent,
  AppLoaderIcon,
  AppLoaderProgress,
  AppLoaderTitle,
  AppLoaderStatus,
  Logo,
} from '@aazucena/ui';
import { useState, useEffect } from 'react';

/**
 * ## Visual Metadata
 * - **Design Agency:** `AAZUCENA_DIGITAL`
 * - **Maturity:** `Stable`
 * - **A11y:** Traps focus and prevents interaction with underlying content.
 *
 * ## Structuring Guide Alignment
 * This component follows the "Atomic Composability" pattern. The root `AppLoader`
 * provides the backdrop, while sub-components handle the branding, progress, and status.
 */
type AppLoaderStoryArgs = React.ComponentProps<typeof AppLoader> & {
  value?: number;
  showPercentage?: boolean;
  progressVariant?: 'default' | 'primary' | 'cyan' | 'destructive';
  animation?: 'pulse' | 'cyber-pulse' | 'spin' | 'glitch' | 'none';
  status?: string;
  title?: string;
};

const meta = {
  title: 'Components/Feedback/AppLoader',
  component: AppLoader,
  subcomponents: {
    AppLoaderContent,
    AppLoaderIcon,
    AppLoaderProgress,
    AppLoaderTitle,
    AppLoaderStatus,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-screen application preloader with integrated brand identity and progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual theme of the background',
      table: { category: 'Appearance' },
    },
    isHidden: {
      control: 'boolean',
      description: 'Toggle visibility (trigger exit animation)',
      table: { category: 'Behavior' },
    },
    // Progress Props (for the playground)
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress completion percentage',
      table: { category: 'Progress' },
    },
    showPercentage: {
      control: 'boolean',
      description: 'Display the numeric percentage label',
      table: { category: 'Progress' },
    },
    progressVariant: {
      control: 'select',
      options: ['default', 'primary', 'cyan', 'destructive'],
      description: 'Color variant of the progress bar',
      table: { category: 'Progress' },
    },
  },
} satisfies Meta<AppLoaderStoryArgs>;

export default meta;
type Story = StoryObj<AppLoaderStoryArgs>;

// --- COMPONENT TEMPLATES ---

const StaticLoader = (args: any) => (
  <AppLoader variant={args.variant} isHidden={args.isHidden}>
    <AppLoaderContent>
      <AppLoaderIcon animation={args.animation || 'cyber-pulse'} size="md">
        <Logo variant={args.variant === 'cyber' ? 'cyber' : 'main'} size="full" />
      </AppLoaderIcon>

      <div className="flex flex-col items-center gap-4">
        <AppLoaderTitle>{args.title || 'Aldrin Azucena'}</AppLoaderTitle>
        <AppLoaderProgress
          value={args.value}
          variant={args.progressVariant}
          showPercentage={args.showPercentage}
        />
        <AppLoaderStatus>{args.status || 'SYSTEM_READY'}</AppLoaderStatus>
      </div>
    </AppLoaderContent>
  </AppLoader>
);

const AnimatedSequence = ({
  variant,
  iconAnimation = 'cyber-pulse',
  progressVariant = 'default',
}: any) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing_Core_Modules');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStatus('Ready_to_Launch');
          return 100;
        }
        if (prev === 30) setStatus('Syncing_Cloud_Data');
        if (prev === 60) setStatus('Generating_Interface');
        if (prev === 85) setStatus('Optimizing_Assets');
        return prev + 1;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <StaticLoader
      variant={variant}
      value={progress}
      status={status}
      animation={iconAnimation}
      progressVariant={progressVariant}
      showPercentage
    />
  );
};

// --- CATEGORY: ESSENTIALS ---

/**
 * The primary playground story. **Use the Controls panel** to manually adjust
 * the progress bar, variant, and percentage display.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    value: 45,
    showPercentage: true,
    progressVariant: 'default',
    isHidden: false,
  },
  render: (args) => <StaticLoader {...args} />,
};

// --- CATEGORY: VARIANTS ---

export const Cyber: Story = {
  args: {
    variant: 'cyber',
    progressVariant: 'cyan',
    animation: 'glitch' as any,
    status: 'ENCRYPTING_SESSION',
    value: 72,
    showPercentage: true,
  },
  render: (args) => <StaticLoader {...args} />,
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    progressVariant: 'primary',
    value: 30,
    status: 'TRANSPARENCY_LAYER_ACTIVE',
  },
  render: (args) => <StaticLoader {...args} />,
};

export const Minimal: Story = {
  args: {
    variant: 'default',
  },
  render: () => (
    <AppLoader variant="default">
      <AppLoaderContent>
        <AppLoaderIcon animation="spin" size="sm">
          <Logo size="full" />
        </AppLoaderIcon>
      </AppLoaderContent>
    </AppLoader>
  ),
};

// --- CATEGORY: STATES ---

/**
 * Visual feedback for when the application fails to initialize properly.
 */
export const ErrorState: Story = {
  args: {
    variant: 'cyber',
    progressVariant: 'destructive',
    value: 12,
    status: 'ERR_DATABASE_UNREACHABLE',
    title: 'CRITICAL_FAILURE',
  },
  render: (args) => <StaticLoader {...args} />,
};

// --- CATEGORY: ADVANCED ---

/**
 * A real-world example of how the loader handles a stateful initialization sequence.
 */
export const LoadingSequence: Story = {
  args: {
    variant: 'default',
  },
  render: () => <AnimatedSequence variant="default" />,
};

/**
 * Demonstrates the exit animation by toggling the `isHidden` state.
 */
export const ExitAnimation: Story = {
  args: {
    ...Basic.args,
    isHidden: false,
  },
  render: (args) => {
    const [hidden, setHidden] = useState(args.isHidden);
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground transition-colors duration-500">
        <button
          onClick={() => setHidden(!hidden)}
          className="fixed bottom-8 right-8 z-[10001] rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold"
        >
          {hidden ? 'Re-run Loader' : 'Trigger Exit'}
        </button>
        <StaticLoader {...args} isHidden={hidden} />
      </div>
    );
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: /Trigger Exit/i });

    // Wait for initial view
    await new Promise((r) => setTimeout(r, 1500));

    // Trigger Exit
    await userEvent.click(trigger);

    // Wait for animation to finish
    await new Promise((r) => setTimeout(r, 1500));

    // Reset for the user
    await userEvent.click(await canvas.findByRole('button', { name: /Re-run Loader/i }));
  },
};
