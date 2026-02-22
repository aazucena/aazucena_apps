import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@aazucena/ui';

const sampleTS = `const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
  return name.toUpperCase();
};

greet('World');`;

const sampleJSX = `export default function App() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`;

const sampleCSS = `@layer base {
  :root {
    --primary: 220 90% 56%;
    --background: 0 0% 100%;
  }
  .dark {
    --primary: 220 90% 66%;
    --background: 0 0% 4%;
  }
}`;

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Syntax-highlighted code display with optional line numbers, line highlights, and clipboard copy.
 * - **UX:** One-click copy to clipboard with visual confirmation feedback. File name header provides instant context.
 * - **Design:** Shiki-powered highlighting with auto theme selection per variant (github-dark for default/glass, nord for cyber).
 */
const meta = {
  title: 'Components/Data Display/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A styled code display block with Shiki syntax highlighting, line numbers, file name header, and copy-to-clipboard. Ideal for documentation, tutorials, and technical content.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: "'default'" },
      },
    },
    code: {
      control: 'text',
      description: 'The source code string to display',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    language: {
      control: 'text',
      description: 'Language identifier for syntax highlighting and header label',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: "'typescript'" },
      },
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Toggle line number gutter visibility',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    highlightLines: {
      control: 'object',
      description: 'Array of 1-indexed line numbers to highlight',
      table: {
        category: 'Behavior',
        type: { summary: 'number[]' },
        defaultValue: { summary: '[]' },
      },
    },
    fileName: {
      control: 'text',
      description: 'Optional file name shown in the header bar',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    copyable: {
      control: 'boolean',
      description: 'Show copy-to-clipboard button in header',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    theme: {
      control: 'text',
      description: 'Shiki theme override (defaults based on variant)',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[520px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard code block with TypeScript highlighting, line numbers, and copy button.
 */
export const Basic: Story = {
  args: {
    code: sampleTS,
    language: 'typescript',
    fileName: 'utils.ts',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a vivid gradient background for frosted-glass UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    fileName: 'helpers.ts',
  },
};

/**
 * Cyber variant styled as a terminal output with nord theme and neon accents.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    fileName: 'EXEC_MODULE.ts',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

// --- ADVANCED ---

/**
 * Key lines highlighted to draw attention to important logic.
 */
export const HighlightedLines: Story = {
  args: {
    ...Basic.args,
    highlightLines: [2, 3],
    fileName: 'greet.ts',
  },
};

/**
 * Clean display without the line number gutter for minimal presentations.
 */
export const NoLineNumbers: Story = {
  args: {
    ...Basic.args,
    showLineNumbers: false,
  },
};

/**
 * Multi-language showcase demonstrating JSX and CSS code blocks side by side.
 */
export const MultiLanguage: Story = {
  args: {
    code: sampleJSX,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <CodeBlock code={sampleJSX} language="tsx" fileName="App.tsx" />
      <CodeBlock code={sampleCSS} language="css" fileName="globals.css" />
    </div>
  ),
};
