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
    // Figma component set in the Avra Design System file (addon-designs Design tab)
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=5-21',
    },
    docs: {
      description: {
        component:
          'A robust dropdown component for selecting a single option from a list. Supports grouping, separators, and high-fidelity themes.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
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
      <SelectTrigger aria-label="Region" className="w-[240px] rounded-card border-rule">
        <SelectValue placeholder="Select_Region" />
      </SelectTrigger>
      <SelectContent className="rounded-card">
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
 * Cyber variant: signal rule and Fira Code labels.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="p-12 bg-background border border-signal/10 rounded-card">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Zap className="size-4 text-signal animate-pulse" />
          <span className="font-mono text-[10px] text-signal uppercase tracking-[0.3em]">
            # PROTOCOL_OVERRIDE
          </span>
        </div>
        <Select defaultValue="v2">
          <SelectTrigger
            aria-label="Protocol phase"
            variant="cyber"
            className="w-[240px] font-mono italic"
          >
            <SelectValue placeholder="EXECUTE_PHASE" />
          </SelectTrigger>
          <SelectContent variant="cyber" className="font-mono">
            <SelectItem value="v1" className="focus:bg-signal/20 focus:text-signal">
              PHASE_01_BOOT
            </SelectItem>
            <SelectItem value="v2" className="focus:bg-signal/20 focus:text-signal">
              PHASE_02_SYNC
            </SelectItem>
            <SelectItem value="v3" className="focus:bg-alert/20 text-alert">
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
    <div className="p-40 rounded-card relative overflow-hidden flex items-center justify-center">
      <Select defaultValue="stratosphere">
        <SelectTrigger
          aria-label="Atmospheric layer"
          variant="glass"
          className="w-[240px] border-rule bg-state text-foreground rounded-control px-6"
        >
          <SelectValue placeholder="Atmospheric_Layer" />
        </SelectTrigger>
        <SelectContent variant="glass" className="border-rule text-foreground">
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
      <SelectTrigger aria-label="Storage node" className="w-[280px] h-12 rounded-card">
        <div className="flex items-center gap-3">
          <Database size={16} className="text-primary" />
          <SelectValue placeholder="Select_Storage_Node" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-card p-2">
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
            <Activity size={12} className="text-alert" />
            <span className="text-[10px] font-black uppercase text-alert/40">Critical_Path</span>
          </SelectLabel>
          <SelectItem value="n3" className="text-alert focus:text-alert">
            <span className="font-bold">UNIT_0x9C8D</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
import { within, userEvent, expect, waitFor } from 'storybook/test';

/**
 * Automated interaction test: open select dropdown, select an item, verify trigger updates.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Select>
      <SelectTrigger aria-label="Region" className="w-[240px] rounded-card">
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
    // Content portals to body — wait for entry animation to complete
    const option = await within(document.body).findByText('Europe');
    await waitFor(() => expect(option).toBeVisible(), { timeout: 2000 });
    // Items sit inside a 4px menu, so they use the control radius too
    const item = option.closest('[role="option"]') as HTMLElement;
    await expect(getComputedStyle(item).borderTopLeftRadius).toBe('4px');
    // Select an option
    await userEvent.click(option);
    // Trigger should now show selected value. findByRole waits out the exit
    // animation, during which Radix still aria-hides everything but the content.
    await expect(await canvas.findByRole('combobox')).toHaveTextContent('Europe');
  },
};

/**
 * Keyboard focus on the trigger shows a 1px signal outline; 4px control radius.
 */
export const FocusVisible: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="na">North America</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }: any) => {
    const trigger = within(canvasElement).getByRole('combobox');
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    const style = getComputedStyle(trigger);
    await expect(style.outlineStyle).not.toBe('none');
    await expect(style.borderTopLeftRadius).toBe('4px');
  },
};
