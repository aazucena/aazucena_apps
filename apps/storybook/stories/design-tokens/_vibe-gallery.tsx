import * as React from 'react';
import { ThemeManager, vibes, toHex } from '@aazucena/design-system';

/** One line per vibe: what it recolors. Shape and density stay Avra's in every vibe. */
const NOTES: Record<string, string> = {
  default: 'Ink neutrals with signal cyan. The reference palette every other vibe recolors.',
  minimal: 'Near-monochrome, high contrast, with the fewest accents.',
  nature: 'Soft greens and ambers.',
  cyberpunk: 'Saturated magenta and cyan on deep ink.',
  hoyoverse: 'Warm ambers, inspired by game interfaces.',
  glass: 'Cool translucent tones; its panels use panel-glass.',
  'canada-day': 'Red and white.',
  autumn: 'Deep oranges and browns.',
  'northern-lights': 'Indigo with cyan and magenta accents.',
  valentines: 'Pinks and reds on soft whites.',
  halloween: 'Deep purples and vibrant orange.',
  'st-patricks': 'Emerald and lime greens with gold.',
  easter: 'Pastel lavender, mint and lemon.',
  christmas: 'Deep red and forest green with gold.',
  birthday: 'Multi-color confetti accents.',
  'new-years': 'Black and gold.',
  'lunar-new-year': 'Deep red and bright gold.',
};

const ROLES = [
  ['background', 'Background'],
  ['panel', 'Panel'],
  ['state', 'State'],
  ['rule', 'Rule'],
  ['foreground', 'Text'],
  ['signal', 'Signal'],
  ['success', 'Success'],
  ['warning', 'Warning'],
  ['alert', 'Alert'],
  ['series-1', 'Series 1'],
  ['series-2', 'Series 2'],
  ['series-3', 'Series 3'],
  ['series-4', 'Series 4'],
] as const;

type Mode = 'light' | 'dark';

function VibeRow({ id, mode }: { id: string; mode: Mode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const manager = new ThemeManager(el).apply(id, mode);
    const cs = getComputedStyle(el);
    setValues(
      Object.fromEntries(
        ROLES.map(([v]) => {
          const raw = cs.getPropertyValue(`--${v}`).trim();
          // color-mix() tints have no single hex; show them as written.
          return [v, raw.startsWith('color-mix') ? raw : toHex(raw).toLowerCase()];
        }),
      ),
    );
    return () => manager.destroy();
  }, [id, mode]);

  return (
    <div
      ref={ref}
      className="rounded-card border-rule border p-3"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="micro-label text-muted-foreground mb-2">{mode}</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
        {ROLES.map(([v, label]) => (
          <div key={v}>
            <div
              className="rounded-control border-rule h-8 border"
              style={{ background: `var(--${v})` }}
              aria-hidden
            />
            <div className="mt-1 text-[11px] leading-tight">{label}</div>
            <div className="text-muted-foreground font-mono text-[11px] leading-tight break-all">
              {values[v] ?? ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Every registered vibe, light and dark, with swatches read live from ThemeManager. */
export function VibeGallery() {
  const ids = Object.keys(vibes);
  return (
    <div className="sb-unstyled flex flex-col gap-8">
      {ids.map((id) => (
        <section key={id} aria-labelledby={`vibe-${id}`} className="flex flex-col gap-3">
          <div>
            <h3 id={`vibe-${id}`} className="text-foreground text-lg font-medium">
              {vibes[id]!.name}{' '}
              <code className="text-muted-foreground font-mono text-xs">{id}</code>
            </h3>
            <p className="text-muted-foreground text-sm">{NOTES[id] ?? ''}</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <VibeRow id={id} mode="light" />
            <VibeRow id={id} mode="dark" />
          </div>
        </section>
      ))}
    </div>
  );
}
