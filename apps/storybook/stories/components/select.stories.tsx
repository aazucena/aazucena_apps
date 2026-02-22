import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  Badge,
} from '@aazucena/ui';
import { Globe, Database, Shield, Zap, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based accessible selection primitive for complex forms.
 * - **Accessibility:** Built-in focus management, keyboard navigation (Arrow keys), and compliant ARIA attributes.
 * - **UX:** Features smooth `fade-in` and `zoom-in` animations for the dropdown portal.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes with specialized `active` indicator styles.
 * - **Design:** Optimized for technical contexts like regional node selection, protocol phases, and security levels.
 */
const meta = {
  title: 'Components/Primitives/Select',
  component: Select,
  subcomponents: {
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
    SelectSeparator,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust dropdown component for selecting a single option from a list. Supports grouping, separators, and high-fidelity themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Select root doesn't have many props, most are on Trigger/Content
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for general data entry.
 */
export const Basic: Story = {
  render: () => (
    <Select defaultValue="us">
      <SelectTrigger className="w-[240px] rounded-xl border-zinc-200">
        <SelectValue placeholder="Select_Region" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        <SelectGroup>
          <SelectLabel className="text-[10px] font-black uppercase opacity-40">
            Primary_Sectors
          </SelectLabel>
          <SelectItem value="us">North_America_Core</SelectItem>
          <SelectItem value="eu">European_Union_Relay</SelectItem>
          <SelectItem value="as">Asia_Pacific_Edge</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel className="text-[10px] font-black uppercase opacity-40">
            Secondary_Nodes
          </SelectLabel>
          <SelectItem value="au">Australia_South</SelectItem>
          <SelectItem value="sa">South_America_East</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical context.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="p-12 bg-black border border-cyan-500/10 rounded-[3rem]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Zap className="size-4 text-cyan-500 animate-pulse" />
          <span className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em]">
            # PROTOCOL_OVERRIDE
          </span>
        </div>
        <Select defaultValue="v2">
          <SelectTrigger variant="cyber" className="w-[240px] font-mono italic">
            <SelectValue placeholder="EXECUTE_PHASE" />
          </SelectTrigger>
          <SelectContent variant="cyber" className="font-mono">
            <SelectItem value="v1" className="focus:bg-cyan-500/20 focus:text-cyan-400">
              PHASE_01_BOOT
            </SelectItem>
            <SelectItem value="v2" className="focus:bg-cyan-500/20 focus:text-cyan-400">
              PHASE_02_SYNC
            </SelectItem>
            <SelectItem value="v3" className="focus:bg-rose-500/20 text-rose-500">
              PHASE_03_BYPASS
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated backgrounds.
 */
export const GlassAtmospheric: Story = {
  render: () => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-sm" />
      <Select defaultValue="stratosphere">
        <SelectTrigger
          variant="glass"
          className="w-[240px] border-white/10 bg-white/5 text-white rounded-full px-6"
        >
          <SelectValue placeholder="Atmospheric_Layer" />
        </SelectTrigger>
        <SelectContent variant="glass" className="border-white/10 text-white">
          <SelectItem value="troposphere">Troposphere</SelectItem>
          <SelectItem value="stratosphere">Stratosphere</SelectItem>
          <SelectItem value="mesosphere">Mesosphere</SelectItem>
          <SelectItem value="exosphere">Exosphere</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * Demonstrates complex grouping with icons and semantic metadata.
 */
export const AdvancedComposition: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px] h-12 rounded-2xl">
        <div className="flex items-center gap-3">
          <Database size={16} className="text-primary" />
          <SelectValue placeholder="Select_Storage_Node" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-2xl p-2">
        <SelectGroup>
          <SelectLabel className="flex items-center gap-2 mb-2">
            <Shield size={12} className="opacity-40" />
            <span className="text-[10px] font-black uppercase opacity-40">Secured_Clusters</span>
          </SelectLabel>
          <SelectItem value="n1">
            <div className="flex items-center gap-3">
              <span className="font-bold">UNIT_0x7F42</span>
              <Badge variant="secondary" size="xs">
                NOMINAL
              </Badge>
            </div>
          </SelectItem>
          <SelectItem value="n2">
            <div className="flex items-center gap-3">
              <span className="font-bold">UNIT_0x1A2B</span>
              <Badge variant="secondary" size="xs">
                STABLE
              </Badge>
            </div>
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel className="flex items-center gap-2 mb-2">
            <Activity size={12} className="text-rose-500" />
            <span className="text-[10px] font-black uppercase text-rose-500/40">Critical_Path</span>
          </SelectLabel>
          <SelectItem value="n3" className="text-rose-500 focus:text-rose-500">
            <span className="font-bold">UNIT_0x9C8D</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
import { within, userEvent, expect } from '@storybook/test';

/**
 * Automated interaction test: open select dropdown, select an item, verify trigger updates.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px] rounded-xl">
        <SelectValue placeholder="Select a region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">North America</SelectItem>
        <SelectItem value="eu">Europe</SelectItem>
        <SelectItem value="as">Asia Pacific</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox');
    // Open dropdown
    await userEvent.click(trigger);
    // Content portals to body
    const option = await within(document.body).findByText('Europe');
    await expect(option).toBeVisible();
    // Select an option
    await userEvent.click(option);
    // Trigger should now show selected value
    await expect(canvas.getByRole('combobox')).toHaveTextContent('Europe');
  },
};
