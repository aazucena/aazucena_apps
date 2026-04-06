import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import type { GenericNetworkData, BaseNode, BaseLink } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
  ChartFooter,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useSankeyDiagram } from '../hooks/useSankeyDiagram';

export interface SankeyDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericNetworkData<BaseNode, BaseLink<string>>;
  title?: string;
  description?: string;
  visibleGroups?: Set<string> | null;
  groupKey?: string;
  colorMap?: Record<string, string>;
  legend?: Array<{ label: string; color: string }>;
  height?: number;
  exportFileName?: string;
  onNodeClick?: (node: any) => void;
  /** Suppress the ChartHeader — recovers ~120px of canvas height */
  hideHeader?: boolean;
}

export const SankeyDiagram = forwardRef<HTMLDivElement, SankeyDiagramProps>(
  (
    {
      data,
      title = 'Flow Analysis',
      description,
      visibleGroups,
      groupKey = 'type',
      colorMap = {},
      legend = [],
      height = 600,
      exportFileName = 'data-flow',
      onNodeClick,
      hideHeader = false,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    const filteredData = useMemo(() => {
      if (!visibleGroups) return data;

      const visibleNodes = data.nodes.filter((n) => {
        const groupValue = String(n[groupKey as keyof BaseNode] || '');
        return visibleGroups.has(groupValue);
      });

      const nodeIds = new Set(visibleNodes.map((n) => n.id));
      const visibleLinks = data.links.filter(
        (l) => nodeIds.has(String(l.source)) && nodeIds.has(String(l.target)),
      );

      return { nodes: visibleNodes, links: visibleLinks };
    }, [data, visibleGroups, groupKey]);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useSankeyDiagram(svgRef, filteredData, {
      width,
      height: hideHeader ? height - 40 : height - 120, // Adjusted for header/footer
      groupKey,
      colorMap,
      onNodeClick,
    });

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          {!hideHeader && (
            <ChartHeader>
              <div>
                <ChartTitle>{title}</ChartTitle>
                {description && <ChartDescription>{description}</ChartDescription>}
              </div>
              <ChartToolbar svgRef={svgRef} data={filteredData.links} fileName={exportFileName} />
            </ChartHeader>
          )}

          <ChartContent>
            <svg
              ref={svgRef}
              width={width}
              height="100%"
              className="w-full h-full text-foreground"
            />
          </ChartContent>

          {legend.length > 0 && (
            <ChartFooter>
              <div className="flex flex-wrap gap-6">
                {legend.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </ChartFooter>
          )}
        </div>
      </ChartContainer>
    );
  },
);

SankeyDiagram.displayName = 'SankeyDiagram';
