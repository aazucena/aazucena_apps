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
    // Measure the surface the instrument components actually render (Panel = --panel)
    const panel = toRgb(css.getPropertyValue('--panel').trim(), `rgb(${bg.join(',')})`);
    const pairs: Array<[string, string, number]> = [
      ['foreground', '--foreground', 4.5],
      ['muted', '--muted-foreground', 4.5],
      ['signal', '--signal', 4.5],
      ['alert', '--alert', 4.5],
    ];
    for (const [label, token, min] of pairs) {
      const ratio = contrast(toRgb(css.getPropertyValue(token).trim()), panel);
      if (ratio < min) failures.push(`${row.dataset.vibeRow}: ${label} ${ratio.toFixed(2)}`);
    }
    // Hover/focus rows must show on raised surfaces
    if (css.getPropertyValue('--state').trim() === css.getPropertyValue('--panel-raised').trim())
      failures.push(`${row.dataset.vibeRow}: state equals panel-raised`);
    // Vibes re-color the instrument language but keep its shape
    for (const [token, want] of [
      ['--radius-card', '6px'],
      ['--radius-badge', '4px'],
      ['--radius-button', '4px'],
    ]) {
      const got = css.getPropertyValue(token!).trim();
      if (got !== want) failures.push(`${row.dataset.vibeRow}: ${token} ${got}`);
    }
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

/**
 * Regression (final review C1): one manager reused across vibe and mode switches must not
 * leave the previous vibe's instrument tokens inline on the element.
 */
export const SwitchingVibes: Story = {
  render: () => <div data-switch-probe className="dark bg-background p-4" />,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<HTMLElement>('[data-switch-probe]')!;
    const manager = new ThemeManager(el);
    manager.apply('default', 'light');
    manager.apply('autumn', 'dark');
    await expect(el.style.getPropertyValue('--panel')).toBe('');
    await expect(getComputedStyle(el).getPropertyValue('--panel').trim().toLowerCase()).toBe(
      '#13232b',
    );
    manager.destroy();
  },
};
