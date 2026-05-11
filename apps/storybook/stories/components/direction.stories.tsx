import type { Meta, StoryObj } from '@storybook/react-vite';
import { DirectionProvider } from '@aazucena/ui';
import { ArrowRight, ArrowLeft } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI primitive for managing text and element direction (LTR/RTL).
 * - **Context:** Essential for internationalization (i18n) and ensuring components respond correctly to reading flow.
 * - **UX:** Automatically affects components like `Carousel`, `Breadcrumb`, and `ArrowLink` if they consume the direction context.
 */
const meta = {
  title: 'Components/Primitives/Direction',
  component: DirectionProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Provides a reading direction context (LTR or RTL) to all nested components. Useful for localization and specific UI layout overrides.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
      description: 'The reading direction of the nested content',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard Left-to-Right direction.
 */
export const LeftToRight: Story = {
  args: {
    dir: 'ltr',
  },
  render: (args) => (
    <DirectionProvider {...args}>
      <div className="flex items-center gap-4 p-8 border rounded-2xl bg-muted/5">
        <span className="text-sm font-bold uppercase tracking-widest">Signal_Flow</span>
        <ArrowRight className="size-4 text-primary" />
      </div>
    </DirectionProvider>
  ),
};

/**
 * Right-to-Left direction, demonstrating how icons and text order should ideally respond.
 */
export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
  },
  render: (args) => (
    <DirectionProvider {...args}>
      <div className="flex items-center gap-4 p-8 border rounded-2xl bg-muted/5">
        <span className="text-sm font-bold uppercase tracking-widest">Signal_Flow</span>
        <ArrowLeft className="size-4 text-primary" />
      </div>
    </DirectionProvider>
  ),
};

/**
 * Demonstrates nested components responding to the direction context.
 */
export const ComponentResponse: Story = {
  args: {
    dir: 'rtl',
  },
  render: (args) => (
    <div className="space-y-8">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 text-center">
        RTL_CONTEXT_ACTIVE
      </p>
      <DirectionProvider {...args}>
        <div className="w-[400px] p-8 border rounded-[2rem] space-y-4">
          <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary" />
          </div>
          <p className="text-xs italic opacity-60">
            Notice how the progress bar and text alignment would naturally shift in a full RTL
            implementation.
          </p>
        </div>
      </DirectionProvider>
    </div>
  ),
};
