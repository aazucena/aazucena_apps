import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Beacon,
  BeaconGrid,
  BeaconHeader,
  BeaconLink,
} from '@aazucena/ui';
import { Github, Linkedin, Twitter, Discord } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout component for secondary navigation (Footers/Section dividers).
 * - **UX:** Features an animated "Navigation_Beacon" icon to draw focus to the link grid.
 * - **Variants:** Supports `default` and high-fidelity `cyber` styles.
 * - **Composition:** Composed of Header, Grid, and animated underline Links.
 */
const meta = {
  title: 'Components/Navigation/Beacon',
  component: Beacon,
  subcomponents: { BeaconHeader, BeaconGrid, BeaconLink } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A secondary navigation module typically used as a footer or section transition. Features a centered header with an animated icon and a grid of links.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'cyber'],
      description: 'The visual theme of the beacon',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Beacon>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard Beacon implementation, ideal for general footers.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[600px] p-12 bg-muted/5 rounded-3xl">
      <Beacon {...args}>
        <BeaconHeader>Connect_Network</BeaconHeader>
        <BeaconGrid>
          <BeaconLink href="#">GitHub</BeaconLink>
          <BeaconLink href="#">LinkedIn</BeaconLink>
          <BeaconLink href="#">Twitter</BeaconLink>
          <BeaconLink href="#">Discord</BeaconLink>
        </BeaconGrid>
      </Beacon>
    </div>
  ),
};

/**
 * High-performance cyber variant with mono typography and cyan accents.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-12 bg-black rounded-3xl border border-white/5">
      <Beacon {...args}>
        <BeaconHeader>UPLINK_CHANNELS:OPEN</BeaconHeader>
        <BeaconGrid>
          <BeaconLink variant="cyber" href="#">NODE_REPOS</BeaconLink>
          <BeaconLink variant="cyber" href="#">IDENT_AUTH</BeaconLink>
          <BeaconLink variant="cyber" href="#">SIGNAL_TRACE</BeaconLink>
        </BeaconGrid>
      </Beacon>
    </div>
  ),
};

/**
 * Demonstrates customization using custom icons in the header.
 */
export const CustomIcons: Story = {
  render: () => (
    <div className="w-[600px]">
      <Beacon>
        <BeaconHeader icon={<Github size={16} className="text-primary" />}>
          Source_Code
        </BeaconHeader>
        <BeaconGrid>
          <BeaconLink href="#">Repository</BeaconLink>
          <BeaconLink href="#">Commit_History</BeaconLink>
          <BeaconLink href="#">Issue_Tracker</BeaconLink>
        </BeaconGrid>
      </Beacon>
    </div>
  ),
};

/**
 * Large distribution of links showcasing the grid wrap behavior.
 */
export const SocialGrid: Story = {
  render: () => (
    <div className="w-[800px]">
      <Beacon>
        <BeaconHeader>Global_Presence</BeaconHeader>
        <BeaconGrid>
          <BeaconLink href="#"><div className="flex items-center gap-2"><Github size={12}/> Github</div></BeaconLink>
          <BeaconLink href="#"><div className="flex items-center gap-2"><Linkedin size={12}/> LinkedIn</div></BeaconLink>
          <BeaconLink href="#"><div className="flex items-center gap-2"><Twitter size={12}/> Twitter</div></BeaconLink>
          <BeaconLink href="#"><div className="flex items-center gap-2"><Discord size={12}/> Discord</div></BeaconLink>
        </BeaconGrid>
      </Beacon>
    </div>
  ),
};
