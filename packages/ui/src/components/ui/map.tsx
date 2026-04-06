'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';

// Type-only re-export — erased at runtime, never triggers leaflet module evaluation
export type { MapProps } from './map.impl';

// mapVariants is duplicated here (cva + strings only, zero side effects) to
// avoid importing from map.impl which would pull in leaflet at module load time.
export const mapVariants = cva('w-full h-full rounded-lg overflow-hidden relative z-0', {
  variants: {
    variant: {
      default: 'border border-border shadow-md',
      glass: 'border-white/10 shadow-xl backdrop-blur-md',
      cyber: 'border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

// Deferred import — react-leaflet/leaflet call window at module evaluation time.
// React.lazy defers loading until this component is rendered, which only happens
// on the client after hydration. Safe to barrel-export.
const LazyMap = React.lazy(() => import('./map.impl').then((m) => ({ default: m.Map })));

export const Marker = React.lazy(() => import('./map.impl').then((m) => ({ default: m.Marker })));

export const Popup = React.lazy(() => import('./map.impl').then((m) => ({ default: m.Popup })));

type MapVariant = 'default' | 'glass' | 'cyber';

export const Map = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof LazyMap> & { variant?: MapVariant }
>((props, ref) => (
  <React.Suspense
    fallback={
      <div className={`${mapVariants({ variant: props.variant })} bg-muted animate-pulse`} />
    }
  >
    <LazyMap ref={ref as never} {...props} />
  </React.Suspense>
));
Map.displayName = 'Map';

// createCustomIcon, DefaultMarkerIcon, Marker, Popup — import directly from
// './map.impl' at call sites; they depend on leaflet and cannot be re-exported here.
