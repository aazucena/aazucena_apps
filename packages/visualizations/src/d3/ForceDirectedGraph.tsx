import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { GenericNetworkData, BaseNode, BaseLink } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useForceDirectedGraph } from '../hooks/useForceDirectedGraph';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, step = 1, onChange }: SliderRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

export interface ForceDirectedGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericNetworkData<BaseNode, BaseLink<string>>;
  title?: string;
  description?: string;
  groupKey?: string;
  colorMap?: Record<string, string>;
  height?: number;
  exportFileName?: string;
  onNodeClick?: (node: any) => void;
  /** Suppress the ChartHeader — recovers ~80px of canvas height */
  hideHeader?: boolean;
  /** Render a gear icon + expandable physics sliders overlay */
  showPhysicsControls?: boolean;
  chargeStrength?: number;
  linkDistance?: number;
  collisionRadius?: number;
  /** When set, dims nodes whose id is NOT in this Set */
  highlightIds?: Set<string> | null;
}

const DEFAULTS = { chargeStrength: -400, linkDistance: 120, collisionRadius: 12 };

export const ForceDirectedGraph = forwardRef<HTMLDivElement, ForceDirectedGraphProps>(
  (
    {
      data,
      title = 'Network Analysis',
      description,
      groupKey = 'group',
      colorMap = {},
      height = 600,
      exportFileName = 'network-graph',
      onNodeClick,
      hideHeader = false,
      showPhysicsControls = false,
      chargeStrength: chargeStrengthProp,
      linkDistance: linkDistanceProp,
      collisionRadius: collisionRadiusProp,
      highlightIds,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    // Internal physics state — when showPhysicsControls, sliders update these
    const [chargeStrength, setChargeStrength] = useState(
      chargeStrengthProp ?? DEFAULTS.chargeStrength,
    );
    const [linkDistance, setLinkDistance] = useState(linkDistanceProp ?? DEFAULTS.linkDistance);
    const [collisionRadius, setCollisionRadius] = useState(
      collisionRadiusProp ?? DEFAULTS.collisionRadius,
    );
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const svgHeight = hideHeader ? height : height - 80;

    useForceDirectedGraph(svgRef, data, {
      width,
      height: svgHeight,
      groupKey,
      colorMap,
      onNodeClick,
      chargeStrength,
      linkDistance,
      collisionRadius,
      highlightIds,
    });

    // Derive category legend from unique groupKey values
    const legendEntries = React.useMemo(() => {
      const seen = new Set<string>();
      const entries: { label: string; color: string }[] = [];
      const defaultColors = (label: string) => {
        // Deterministic color from schemeTableau10
        const palette = [
          '#4e79a7',
          '#f28e2b',
          '#e15759',
          '#76b7b2',
          '#59a14f',
          '#edc948',
          '#b07aa1',
          '#ff9da7',
          '#9c755f',
          '#bab0ac',
        ];
        const all = data.nodes.map((n) => String(n[groupKey as keyof BaseNode] || ''));
        const unique = [...new Set(all)];
        const idx = unique.indexOf(label);
        return palette[idx % palette.length] ?? '#94a3b8';
      };
      for (const node of data.nodes) {
        const group = String(node[groupKey as keyof BaseNode] || '');
        if (!group || seen.has(group)) continue;
        seen.add(group);
        entries.push({ label: group, color: colorMap[group] || defaultColors(group) });
      }
      return entries;
    }, [data.nodes, groupKey, colorMap]);

    const header = !hideHeader && (
      <ChartHeader>
        <div>
          <ChartTitle>{title}</ChartTitle>
          {description && <ChartDescription>{description}</ChartDescription>}
        </div>
        <ChartToolbar svgRef={svgRef} data={data.nodes} fileName={exportFileName} />
      </ChartHeader>
    );

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          {header}

          <ChartContent className="relative p-0">
            <svg
              ref={svgRef}
              width={width}
              height="100%"
              className="w-full h-full text-foreground transition-colors cursor-move"
            />

            {showPhysicsControls && (
              <>
                <button
                  onClick={() => setShowControls((v) => !v)}
                  title="Physics controls"
                  className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-base shadow-md transition hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={
                      showControls ? 'rotate-90 transition-transform' : 'transition-transform'
                    }
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>

                {showControls && (
                  <div className="absolute top-14 left-3 z-10 w-56 rounded-xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
                    <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Physics
                    </p>
                    <div className="flex flex-col gap-3">
                      <SliderRow
                        label="Repulsion"
                        value={chargeStrength}
                        min={-1000}
                        max={-50}
                        step={50}
                        onChange={setChargeStrength}
                      />
                      <SliderRow
                        label="Link Distance"
                        value={linkDistance}
                        min={30}
                        max={300}
                        step={10}
                        onChange={setLinkDistance}
                      />
                      <SliderRow
                        label="Spacing"
                        value={collisionRadius}
                        min={5}
                        max={60}
                        onChange={setCollisionRadius}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setChargeStrength(DEFAULTS.chargeStrength);
                        setLinkDistance(DEFAULTS.linkDistance);
                        setCollisionRadius(DEFAULTS.collisionRadius);
                      }}
                      className="mt-3 w-full rounded-lg bg-gray-100 py-1.5 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Reset Defaults
                    </button>
                  </div>
                )}
              </>
            )}
          </ChartContent>

          {/* Category legend */}
          {legendEntries.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 px-4 pt-3 pb-1">
              {legendEntries.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ChartContainer>
    );
  },
);

ForceDirectedGraph.displayName = 'ForceDirectedGraph';
