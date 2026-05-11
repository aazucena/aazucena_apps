import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlipWords } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Animated text primitive for dynamic brand messaging.
 * - **Animation:** Uses custom `useFlipText` hook for 3D rotation and state-aware cycling.
 * - **UX:** Features a templating system using `{{ tag }}` syntax for precise word placement within strings.
 * - **Variants:** Supports `default` and high-fidelity `cyber` (mono) styles.
 */
const meta = {
  title: 'Components/Content/FlipWords',
  component: FlipWords,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tagline component that cycles through a list of words with a 3D flip animation. Supports integrated templating for seamless sentence integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
      description: 'The visual style of the text',
      table: { category: 'Appearance' },
    },
    content: {
      control: 'text',
      description: 'The full string with a placeholder tag (e.g. {{ flipWord }})',
      table: { category: 'Content' },
    },
    words: {
      control: 'object',
      description: 'List of words to cycle through',
      table: { category: 'Content' },
    },
    interval: {
      control: 'number',
      description: 'Time between word cycles (ms)',
      table: { category: 'Behavior' },
    },
    duration: {
      control: 'number',
      description: 'Duration of the flip animation (s)',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof FlipWords>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing adaptive brand values.
 */
export const Basic: Story = {
  args: {
    content: 'We build {{ flipWord }} engineering systems.',
    words: ['adaptive', 'high-fidelity', 'resilient', 'future-proof'],
    interval: 2500,
    duration: 0.6,
  },
};

/**
 * High-performance cyber variant with neon glow and technical terminology.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    content: '// PROTOCOL_{{ flipWord }}_INITIATED',
    words: ['UPLINK', 'ENCLAVE', 'BUFFER', 'SYNC'],
    interval: 1500,
    duration: 0.4,
  },
  render: (args) => (
    <div className="p-20 bg-black rounded-[3rem] border border-cyan-500/20 text-white">
      <FlipWords {...args} />
    </div>
  ),
};

/**
 * Demonstrates the use of custom template tags.
 */
export const CustomTag: Story = {
  args: {
    tag: 'action',
    content: 'Azucena_AI: Please {{ action }} the telemetry buffer.',
    words: ['index', 'analyze', 'flush', 'optimize'],
    interval: 2000,
  },
};

/**
 * Large format implementation for hero sections.
 */
export const HeroTagline: Story = {
  args: {
    content: 'Exploring the future of {{ flipWord }} computing.',
    words: ['distributed', 'biometric', 'quantum', 'neural'],
    className: 'text-4xl md:text-6xl font-black tracking-tighter',
  },
};
