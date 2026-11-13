import * as React from 'react';
import { toHex } from '@aazucena/design-system';

export interface SwatchToken {
  /** CSS custom property name without the leading dashes, e.g. `panel`. */
  token: string;
  label: string;
  use?: string;
}

/**
 * Swatches for live CSS custom properties. Values are read from the docs
 * container after the toolbar's vibe and mode apply, and re-read when they change.
 */
export function TokenSwatches({ tokens }: { tokens: SwatchToken[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const cs = getComputedStyle(el);
      setValues(
        Object.fromEntries(
          tokens.map(({ token }) => {
            const raw = cs.getPropertyValue(`--${token}`).trim();
            return [token, raw.startsWith('color-mix') ? raw : toHex(raw).toLowerCase()];
          }),
        ),
      );
    };
    read();
    // The docs container re-applies the vibe on toolbar changes; watch for it.
    const observer = new MutationObserver(read);
    const docs = document.getElementById('storybook-docs');
    if (docs) observer.observe(docs, { attributes: true, attributeFilter: ['style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [tokens]);

  return (
    <div
      ref={ref}
      className="sb-unstyled my-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3"
    >
      {tokens.map(({ token, label, use }) => (
        <div key={token} className="rounded-card border-rule bg-panel border p-2">
          <div
            className="rounded-control border-rule h-10 border"
            style={{ background: `var(--${token})` }}
            aria-hidden
          />
          <div className="text-foreground mt-2 text-sm font-medium">{label}</div>
          <div className="text-muted-foreground font-mono text-sm break-all">--{token}</div>
          <div className="text-muted-foreground font-mono text-sm break-all">
            {values[token] ?? ''}
          </div>
          {use ? <div className="text-muted-foreground mt-1 text-sm">{use}</div> : null}
        </div>
      ))}
    </div>
  );
}
