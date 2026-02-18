import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownRenderer } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Content utility for rendering string-based Markdown from CMS fields.
 * - **Security:** Uses `dangerouslySetInnerHTML` after parsing via `marked`. Ensure content is sanitized if coming from untrusted sources (currently trusted CMS only).
 * - **Aesthetics:** Custom `marked` renderer overrides default HTML with design-system aligned Tailwind classes.
 * - **UX:** Features scroll-margin offsets for headings to support internal page linking.
 */
const meta = {
  title: 'Components/Content/MarkdownRenderer',
  component: MarkdownRenderer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A robust Markdown parser and renderer. Automatically styles standard Markdown syntax (headings, lists, code, quotes) to match the project design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Raw markdown string to be parsed',
      table: { category: 'Content' }
    }
  },
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

const complexMarkdown = `
# Project_Intelligence_V4
Exploring the **neural-adaptive** landscape of modern interfaces.

## Core_Capabilities
- **High-Fidelity Telemetry**
- **Decentralized Node Sync**
- **Ambient Glass Surfacing**

> "The future of computing is not in the hardware, but in the seamless ingestion of human intent."

### Technical_Implementation
You can initialize the buffer using the following sequence:

\`\`\`bash
pnpm ingest --node US_EAST_01 --secure
\`\`\`

You may also use \`inline_code_signals\` for quick references. 

---

[View the full documentation](https://aazucena.com/docs)
`;

// --- STORIES ---

/**
 * Standard implementation showcasing all supported Markdown elements.
 */
export const Basic: Story = {
  args: {
    content: complexMarkdown,
  },
  render: (args) => (
    <div className="w-[700px] p-12 border rounded-[3rem] bg-card shadow-2xl">
      <MarkdownRenderer {...args} />
    </div>
  ),
};

/**
 * Demonstrates the rendering of technical documentation snippets.
 */
export const TechnicalDocs: Story = {
  args: {
    content: `
### NODE_REBOOT_SEQUENCE
1. Flush the primary buffer using \`pnpm flush\`.
2. Re-verify the security enclave keys.
3. Establish a new uplink handshake.

**WARNING:** Aborting during step 2 may cause packet fragmentation.
    `,
  },
  render: (args) => (
    <div className="w-[500px] p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
      <MarkdownRenderer {...args} />
    </div>
  ),
};

/**
 * High-performance cyber variant styling applied to markdown content.
 */
export const CyberAesthetic: Story = {
  args: {
    content: `
# // SYSTEM_OVERRIDE
- [x] AUTH_VERIFIED
- [ ] BUFFER_SYNC_COMPLETE

\`\`\`json
{
  "node": "0x7F42",
  "status": "OPERATIONAL"
}
\`\`\`
    `,
  },
  render: (args) => (
    <div className="w-[600px] p-12 bg-black border border-cyan-500/20 rounded-xl text-white">
      <MarkdownRenderer {...args} className="font-mono text-cyan-500/80" />
    </div>
  ),
};
