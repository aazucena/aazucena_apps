import type { Meta, StoryObj } from '@storybook/react-vite';
import { RinCharacter } from '@aazucena/ui';
import { RIN_BEHAVIORS, RIN_EMOTIONS } from '@aazucena/constants';

/**
 * ## Engineering Standards
 * - **Pattern:** Rive character with two state machines: `EmotionSM` (face, 22 expressions) and `MovementSM` (body, 5 behaviors).
 * - **Inputs:** `currentEmotion` and `behavior` are written to the state machines as their index in `RIN_EMOTIONS` / `RIN_BEHAVIORS` from `@aazucena/constants`, so the .riv state order must match those lists.
 * - **Fallback:** Without `src`, Rin renders the static `RinMark` SVG, so the assistant works before the .riv is hosted.
 * - **Identity:** Rin is gender neutral; refer to Rin by name or as "they".
 */
const meta = {
  title: 'Components/AI/RinCharacter',
  component: RinCharacter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Rin, the portfolio's AI assistant. The animated character comes from a Rive file; the emotion and behavior controls drive its state machines.",
      },
    },
  },
  tags: ['autodocs', 'beta'],
  argTypes: {
    currentEmotion: {
      control: 'select',
      options: [...RIN_EMOTIONS],
      description: 'Facial expression (EmotionSM `emotion` input).',
      table: { category: 'State' },
    },
    behavior: {
      control: 'select',
      options: [...RIN_BEHAVIORS],
      description: 'Body behavior (MovementSM `behavior` input).',
      table: { category: 'State' },
    },
    src: {
      control: 'text',
      description: 'URL of the .riv file. Leave empty for the static mark.',
      table: { category: 'Asset' },
    },
    className: { control: 'text', table: { category: 'Styling' } },
  },
  args: {
    currentEmotion: 'idle',
    behavior: 'idle',
    className: 'h-40 w-40 text-cyan-500',
  },
} satisfies Meta<typeof RinCharacter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Static mark shown when no .riv is set. Emotion and behavior have no visible
 * effect here; they take effect once `src` points at the Rive file.
 */
export const Fallback: Story = {};

/**
 * Animated character. Reads the .riv URL from `STORYBOOK_RIN_CHARACTER_SRC`
 * (the same file as the portfolio's `PUBLIC_RIN_CHARACTER_SRC`); without it,
 * this story also shows the static mark.
 */
export const Animated: Story = {
  tags: ['no-visual'],
  args: {
    src: import.meta.env.STORYBOOK_RIN_CHARACTER_SRC || undefined,
    currentEmotion: 'happy',
    behavior: 'listening',
    className: 'h-64 w-64',
  },
};
