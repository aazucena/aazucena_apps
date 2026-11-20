import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, meta, actions }: PageHeaderProps) {
  return (
    <div className="flex min-h-[54px] flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-light tracking-tight">{title}</h1>
        {meta && <div className="micro-label text-muted-foreground">{meta}</div>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
