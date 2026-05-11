import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { WordCloudData } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useWordCloud } from '../hooks/useWordCloud';

export interface WordCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  data: WordCloudData[];
  title?: string;
  description?: string;
  height?: number;
  minFontSize?: number;
  maxFontSize?: number;
  colorMap?: Record<string, string>;
  exportFileName?: string;
  onWordClick?: (word: WordCloudData) => void;
}

export const WordCloud = forwardRef<HTMLDivElement, WordCloudProps>(
  (
    {
      data,
      title = 'Word Frequency Analysis',
      description,
      height = 400,
      minFontSize = 12,
      maxFontSize = 60,
      colorMap = {},
      exportFileName = 'word-cloud',
      onWordClick,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useWordCloud(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      minFontSize,
      maxFontSize,
      colorMap,
      onWordClick,
    });

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          <ChartHeader>
            <div>
              <ChartTitle>{title}</ChartTitle>
              {description && <ChartDescription>{description}</ChartDescription>}
            </div>
            <ChartToolbar svgRef={svgRef} data={data} fileName={exportFileName} />
          </ChartHeader>

          <ChartContent>
            <svg
              ref={svgRef}
              width={width}
              height="100%"
              className="w-full h-full text-foreground"
            />
          </ChartContent>
        </div>
      </ChartContainer>
    );
  },
);

WordCloud.displayName = 'WordCloud';
