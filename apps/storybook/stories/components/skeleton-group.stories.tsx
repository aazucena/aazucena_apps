import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkeletonGroup, Skeleton } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Compound skeleton presets (card, table, list, profile) composing the `Skeleton` primitive.
 * - **UX:** Eliminates repetitive boilerplate when building loading states — pick a preset and go.
 * - **Aesthetics:** All presets pass `variant` through to individual Skeleton instances for consistent theming.
 * - **Override:** Pass `children` to override presets entirely for custom layouts.
 */
const meta = {
  title: 'Components/Feedback/SkeletonGroup',
  component: SkeletonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-built skeleton loading patterns (card, table, list, profile) that compose the Skeleton primitive. Pass children to override presets.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme',
      table: { category: 'Appearance' },
    },
    preset: {
      control: 'select',
      options: ['card', 'table', 'list', 'profile'],
      description: 'The skeleton layout preset',
      table: { category: 'Layout' },
    },
    rows: {
      control: 'number',
      description: 'Number of rows for table/list presets',
      table: { category: 'Layout' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SkeletonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Card preset — image placeholder, title, body lines, and button.
 */
export const Card: Story = {
  args: {
    preset: 'card',
  },
};

/**
 * Table preset with header and 5 data rows.
 */
export const Table: Story = {
  args: {
    preset: 'table',
    rows: 5,
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * List preset with avatar circles and text lines.
 */
export const List: Story = {
  args: {
    preset: 'list',
    rows: 4,
  },
};

/**
 * Profile preset with centered avatar and details.
 */
export const Profile: Story = {
  args: {
    preset: 'profile',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Glass variant over gradient background.
 */
export const Glass: Story = {
  args: {
    preset: 'card',
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 p-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon styling.
 */
export const Cyber: Story = {
  args: {
    preset: 'list',
    rows: 3,
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-[2rem] border border-cyan-500/10 bg-black p-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * Custom layout using children override — presets are ignored.
 */
export const CustomLayout: Story = {
  render: (args) => (
    <SkeletonGroup {...args}>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="col-span-2 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </SkeletonGroup>
  ),
};
