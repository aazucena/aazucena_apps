'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import 'leaflet/dist/leaflet.css';

/**
 * Custom icon setup to use a div with Tailwind classes.
 * Leaflet v1.9.4+ and react-leaflet v5.0+ require careful handling of L.DivIcon.
 */
export const createCustomIcon = (iconHtml: string, className: string = ''): L.DivIcon => {
  return new L.DivIcon({
    html: iconHtml,
    className: cn('bg-transparent border-none', className),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

export const defaultMarkerIcon = createCustomIcon(
  `<div class="flex items-center justify-center bg-primary text-primary-foreground rounded-full size-6 shadow-md border-2 border-background">
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M12 12.9a2 2 0 1 0 0-3.8c0 1.2.7 3.8 0 3.8Z"/><path d="M19.07 13.93A10 10 0 1 1 12 2a10 10 0 0 1 7.07 11.93Z"/></svg>
   </div>`,
  'bg-transparent border-none'
);

const mapVariants = cva('w-full h-full rounded-lg overflow-hidden relative z-0', {
  variants: {
    variant: {
      default: 'border border-border shadow-md',
      glass: 'border-white/10 shadow-xl backdrop-blur-md',
      cyber: 'border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Using a more specific type for MapProps to avoid conflicting definitions
export interface MapProps extends 
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'center' | 'onViewportChanged'>, 
  VariantProps<typeof mapVariants> {
  center?: L.LatLngExpression;
  zoom?: number;
  scrollWheelZoom?: boolean;
  minZoom?: number;
  maxZoom?: number;
  tileLayerUrl?: string;
  attribution?: string;
  className?: string;
  children?: React.ReactNode;
  onViewportChanged?: (viewport: { center: L.LatLng; zoom: number }) => void;
  interactive?: boolean;
  containerProps?: Omit<React.ComponentPropsWithoutRef<typeof MapContainer>, 'center' | 'zoom' | 'children'>;
}

/**
 * Event listener component for react-leaflet v5
 */
const MapEvents = ({ onViewportChanged }: { onViewportChanged?: (viewport: { center: L.LatLng; zoom: number }) => void }) => {
  useMapEvents({
    moveend: (e) => {
      if (onViewportChanged) {
        onViewportChanged({ center: e.target.getCenter(), zoom: e.target.getZoom() });
      }
    },
    zoomend: (e) => {
      if (onViewportChanged) {
        onViewportChanged({ center: e.target.getCenter(), zoom: e.target.getZoom() });
      }
    },
  });
  return null;
};

/**
 * Interactive state manager for react-leaflet v5
 */
const MapContent = ({ interactive }: { interactive: boolean }) => {
  const map = useMap();
  React.useEffect(() => {
    if (!interactive) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      // @ts-ignore - Leaflet tap might not exist on all platforms
      if (map.tap) map.tap.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      // @ts-ignore
      if (map.tap) map.tap.enable();
    }
  }, [map, interactive]);
  return null;
};

const Map = React.forwardRef<HTMLDivElement, MapProps>(
  (
    {
      className,
      variant,
      center = [51.505, -0.09],
      zoom = 13,
      scrollWheelZoom = true,
      minZoom = 1,
      maxZoom = 19,
      tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      children,
      onViewportChanged,
      interactive = true,
      containerProps,
      ...props
    },
    ref,
  ) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return (
        <div
          ref={ref}
          className={cn(mapVariants({ variant }), 'w-full h-full bg-muted animate-pulse', className)}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(mapVariants({ variant }), 'w-full h-full', className)}
        {...props}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={scrollWheelZoom && interactive}
          minZoom={minZoom}
          maxZoom={maxZoom}
          className="w-full h-full"
          attributionControl={true}
          zoomControl={interactive}
          doubleClickZoom={interactive}
          dragging={interactive}
          keyboard={interactive}
          {...containerProps}
        >
          <TileLayer attribution={attribution} url={tileLayerUrl} />
          {children}
          {onViewportChanged && <MapEvents onViewportChanged={onViewportChanged} />}
          <MapContent interactive={interactive} />
        </MapContainer>
      </div>
    );
  },
);
Map.displayName = 'Map';

export { Map, mapVariants, Marker, Popup };
