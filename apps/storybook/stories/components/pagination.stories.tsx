import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationDots,
  PaginationDot,
} from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Layout suite for multi-page navigation and sequential content browsing.
 * - **UX:** Features smooth state transitions for active pages and hover-triggered expansion for dots.
 * - **Aesthetics:** Supports high-fidelity `glass` and `cyber` themes, including specialized "pill" active states for dots.
 * - **Accessibility:** Uses `role="navigation"`, `aria-current="page"`, and built-in screen reader labels for arrows.
 */
const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  subcomponents: {
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationDots,
    PaginationDot,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive suite for page-based navigation. Includes standard linked numbers and high-fidelity scrolling dots with tooltips.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for lists, archives, or search results.
 */
export const Basic: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * High-performance dot navigation, ideal for full-page scroll sections or carousels.
 */
export const ProgressDots: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const sections = [
      'Introduction',
      'Core_Inference',
      'Trajectory_Map',
      'Node_Distribution',
      'Security_Logs',
    ];

    return (
      <div className="flex flex-col items-center gap-8 p-12 border rounded-[2rem] bg-muted/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
          SECTION_NAVIGATION
        </h3>
        <PaginationDots variant="default">
          {sections.map((name, i) => (
            <PaginationDot
              key={i}
              isActive={current === i}
              onClick={() => setCurrent(i)}
              tooltip={name}
              tooltipSide="top"
            />
          ))}
        </PaginationDots>
        <p className="font-mono text-xs text-primary uppercase">
          CURRENT_PHASE: {sections[current]}
        </p>
      </div>
    );
  },
};

/**
 * High-performance cyber variant with neon glow and "fixed" side positioning.
 */
export const CyberVertical: Story = {
  render: () => (
    <div className="h-[400px] w-[600px] bg-black border border-cyan-500/10 rounded-2xl relative overflow-hidden flex items-center justify-center">
      <div className="text-center font-mono text-cyan-500/20 text-4xl font-black italic select-none uppercase">
        UPLINK_TERMINAL
      </div>
      <PaginationDots variant="cyber" position="fixed-right" className="absolute">
        <PaginationDot variant="cyber" isActive tooltip="CORE_LAYER" />
        <PaginationDot variant="cyber" tooltip="ENCLAVE_SYNC" />
        <PaginationDot variant="cyber" tooltip="BUFFER_TRACE" />
        <PaginationDot variant="cyber" tooltip="SIGNAL_AUTH" />
      </PaginationDots>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric layers.
 */
export const GlassFloating: Story = {
  render: () => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem] flex flex-col items-center gap-8">
      <PaginationDots variant="glass" className="bg-white/5 border-white/10 px-4 py-3 shadow-2xl">
        <PaginationDot variant="glass" tooltip="Page 1" />
        <PaginationDot variant="glass" isActive tooltip="Page 2" />
        <PaginationDot variant="glass" tooltip="Page 3" />
        <PaginationDot variant="glass" tooltip="Page 4" />
      </PaginationDots>
      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
        Atmospheric_Control
      </span>
    </div>
  ),
};
