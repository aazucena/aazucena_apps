import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ThemeManager, vibes } from '@aazucena/design-system';
import { Badge, Button, Panel } from '@aazucena/ui';

/**
 * Every registered vibe rendered through `ThemeManager` on the instrument components.
 * Vibes that predate the instrument roles inherit panel/rule/signal from the default vibe,
 * so this matrix is where a seasonal palette that clashes with the new shapes shows up.
 * The play function checks text contrast on each vibe's card surface (WCAG AA).
 */
const meta = {
  title: 'Design Tokens/Vibes Matrix',
  parameters: { layout: 'fullscreen' },
  tags: ['interaction-test'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const VIBE_IDS = Object.keys(vibes);

function VibeRow({ id, mode }: { id: string; mode: 'light' | 'dark' }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const manager = new ThemeManager(ref.current).apply(id, mode);
    return () => manager.destroy();
  }, [id, mode]);
  return (
    <div
      ref={ref}
      data-vibe-row={id}
      className={`${mode === 'dark' ? 'dark' : ''} flex items-center gap-4 bg-background p-4 text-foreground`}
    >
      <span className="micro-label w-36 shrink-0 text-muted-foreground">{id}</span>
      <Panel label="TRAFFIC // 30D" status="live" className="w-64">
        <span className="font-mono text-sm" data-probe="foreground">
          12,480 sessions
        </span>
        <span className="font-mono text-xs text-muted-foreground" data-probe="muted">
          30 days
        </span>
      </Panel>
      <Button>Action</Button>
      <Button variant="outline">Outline</Button>
      <Badge variant="success">OK</Badge>
      <Badge variant="destructive">▲ Alert</Badge>
    </div>
  );
}

/** Resolve any CSS color (hex, oklch, color-mix) to sRGB by painting one pixel. */
function toRgb(color: string, under = '#000'): [number, number, number] {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = under;
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!];
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const lum = ([r, g, b]: [number, number, number]) => {
    const f = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const checkRows = async (canvasElement: HTMLElement) => {
  await new Promise((r) => setTimeout(r, 300));
  const failures: string[] = [];
  for (const row of canvasElement.querySelectorAll<HTMLElement>('[data-vibe-row]')) {
    const css = getComputedStyle(row);
    const bg = toRgb(css.getPropertyValue('--background').trim() || '#fff', '#fff');
    const card = toRgb(css.getPropertyValue('--card').trim(), `rgb(${bg.join(',')})`);
    const fg = toRgb(css.getPropertyValue('--foreground').trim());
    const muted = toRgb(css.getPropertyValue('--muted-foreground').trim());
    const fgRatio = contrast(fg, card);
    const mutedRatio = contrast(muted, card);
    if (fgRatio < 4.5) failures.push(`${row.dataset.vibeRow}: foreground ${fgRatio.toFixed(2)}`);
    if (mutedRatio < 4.5) failures.push(`${row.dataset.vibeRow}: muted ${mutedRatio.toFixed(2)}`);
  }
  await expect(failures).toEqual([]);
};

export const Light: Story = {
  render: () => (
    <div className="flex flex-col">
      {VIBE_IDS.map((id) => (
        <VibeRow key={id} id={id} mode="light" />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => checkRows(canvasElement),
};

export const Dark: Story = {
  render: () => (
    <div className="flex flex-col">
      {VIBE_IDS.map((id) => (
        <VibeRow key={id} id={id} mode="dark" />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => checkRows(canvasElement),
};
