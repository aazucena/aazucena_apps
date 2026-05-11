# 🎨 D3_PATTERNS

**DEVELOPER_GUIDE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

D3.js integration patterns and best practices for React-based visualizations in @aazucena/visualizations.

---

## 📋 TABLE_OF_CONTENTS

- [⚛️ REACT_INTEGRATION](#️-react_integration)
- [📏 SCALE_PATTERNS](#-scale_patterns)
- [🎯 RESPONSIVE_DESIGN](#-responsive_design)
- [🎨 COLOR_SCHEMES](#-color_schemes)
- [💡 INTERACTIVE_PATTERNS](#-interactive_patterns)
- [⚡ PERFORMANCE_OPTIMIZATION](#-performance_optimization)
- [🌙 DARK_MODE_SUPPORT](#-dark_mode_support)
- [📦 EXPORT_PATTERNS](#-export_patterns)

---

## ⚛️ REACT_INTEGRATION

### Standard React + D3 Pattern

```tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export function Chart({ data, height = 400 }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // 1. Handle responsive width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Render D3 visualization
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // ... D3 rendering logic

    // 3. Cleanup tooltips/events
    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [data, width, height]);

  return (
    <div ref={containerRef} className="w-full relative">
      <svg ref={svgRef} width={width} height={height} className="w-full" />
    </div>
  );
}
```

**Key Principles:**

- ✅ **useRef for SVG** - Direct DOM access for D3
- ✅ **useEffect for rendering** - React lifecycle integration
- ✅ **Clear on re-render** - `svg.selectAll('*').remove()`
- ✅ **Cleanup function** - Remove tooltips/listeners
- ✅ **Dependency array** - Re-render when data/dimensions change

---

### Generic TypeScript Pattern

```tsx
import type { GenericHeatmapCell } from '@aazucena/types';

export interface HeatmapProps<T extends GenericHeatmapCell = GenericHeatmapCell> {
  data: T[];
  colorMap?: Record<string, string>;
  onCellClick?: (cell: T) => void;
}

export function Heatmap<T extends GenericHeatmapCell>({
  data,
  colorMap = {},
  onCellClick,
}: HeatmapProps<T>) {
  // Implementation
}
```

**Benefits:**

- ✅ **Type safety** - Generic constraint on data
- ✅ **Flexibility** - Extend base types for custom fields
- ✅ **IntelliSense** - Auto-completion for data properties
- ✅ **Reusability** - One component, multiple data shapes

---

## 📏 SCALE_PATTERNS

### Linear Scale (Continuous Data)

```typescript
import * as d3 from 'd3';

// Numeric value → position
const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value) || 100])
  .range([0, width]);

// Usage
const barWidth = xScale(dataPoint.value);
```

**Use Cases:**

- Bar chart widths
- Line chart Y-axis
- Scatter plot positions

---

### Time Scale (Date Data)

```typescript
const xScale = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
  .range([0, width]);

// Format axis
const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%b %d'));

svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);
```

**Use Cases:**

- Time-series charts
- Timeline visualizations
- StreamGraphs

---

### Ordinal Scale (Categorical Data)

```typescript
const xScale = d3
  .scaleBand()
  .domain(data.map((d) => d.label))
  .range([0, width])
  .padding(0.1);

// Usage
svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d) => xScale(d.label)!)
  .attr('width', xScale.bandwidth());
```

**Use Cases:**

- Bar charts (categorical axis)
- Heatmap axes
- Grouped visualizations

---

### Color Scale

```typescript
// Sequential scale (light to dark)
const colorScale = d3
  .scaleLinear<string>()
  .domain([0, d3.max(data, (d) => d.value) || 10])
  .range(['#f1f5f9', '#3b82f6']);

// Categorical scale (D3 color schemes)
const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

// Quantize scale (buckets)
const colorScale = d3
  .scaleQuantize<string>()
  .domain([0, 100])
  .range(['#22c55e', '#fbbf24', '#ef4444']); // green → yellow → red
```

**D3 Color Schemes:**

- `d3.schemeTableau10` - 10 distinct colors
- `d3.schemeCategory10` - Classic 10 colors
- `d3.schemeSet3` - 12 pastel colors
- `d3.interpolateBlues` - Sequential blue scale

---

## 🎯 RESPONSIVE_DESIGN

### Container-Based Width

```tsx
const containerRef = useRef<HTMLDivElement>(null);
const [width, setWidth] = useState(0);

useEffect(() => {
  const handleResize = () => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**Benefits:**

- ✅ Adapts to parent container
- ✅ Works with CSS Grid/Flexbox
- ✅ Mobile-friendly

---

### ResizeObserver (Advanced)

```tsx
useEffect(() => {
  if (!containerRef.current) return;

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setWidth(entry.contentRect.width);
    }
  });

  resizeObserver.observe(containerRef.current);

  return () => resizeObserver.disconnect();
}, []);
```

**Benefits:**

- ✅ More accurate than window resize
- ✅ Detects container size changes (not just window)
- ✅ Better performance (no polling)

---

### Margin Convention

```typescript
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

// Use innerWidth/innerHeight for scales
const xScale = d3.scaleLinear().range([0, innerWidth]);
const yScale = d3.scaleLinear().range([innerHeight, 0]);
```

**Benefits:**

- ✅ Space for axes and labels
- ✅ Standard D3 pattern
- ✅ Clean coordinate system

---

## 🎨 COLOR_SCHEMES

### Custom Color Maps

```tsx
interface ChartProps {
  colorMap?: Record<string, string>;
  baseColor?: string;
}

// Usage
const fillColor = (d: DataPoint) => (d.category ? colorMap[d.category] || baseColor : baseColor);

svg.selectAll('rect').data(data).enter().append('rect').attr('fill', fillColor);
```

**Pattern:**

1. Try `colorMap[category]` first (explicit mapping)
2. Fallback to `baseColor` (default)
3. Final fallback to D3 color scheme

---

### Dark Mode Colors

```typescript
// Tailwind CSS integration
<svg className="text-foreground bg-accent/5" />

// D3 color extraction from CSS variables
const foregroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--foreground');

const accentColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--accent');
```

**Theme-Aware Scales:**

```typescript
const isDark = document.documentElement.classList.contains('dark');

const colorScale = d3
  .scaleLinear<string>()
  .domain([0, max])
  .range(
    isDark
      ? ['#1e293b', '#3b82f6'] // Dark mode: slate → blue
      : ['#f1f5f9', '#3b82f6'], // Light mode: lighter slate → blue
  );
```

---

## 💡 INTERACTIVE_PATTERNS

### Tooltips

```typescript
// 1. Create tooltip container
const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'viz-tooltip')
  .style('position', 'absolute')
  .style('visibility', 'hidden')
  .style('background', 'rgba(0,0,0,0.8)')
  .style('color', 'white')
  .style('padding', '8px')
  .style('border-radius', '4px')
  .style('pointer-events', 'none');

// 2. Attach to elements
svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .on('mouseover', (event, d) => {
    tooltip
      .style('visibility', 'visible')
      .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`);
  })
  .on('mousemove', (event) => {
    tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
  })
  .on('mouseout', () => {
    tooltip.style('visibility', 'hidden');
  });

// 3. Cleanup
return () => {
  d3.selectAll('.viz-tooltip').remove();
};
```

---

### Click Handlers (React Callbacks)

```tsx
interface ChartProps {
  onBarClick?: (bar: DataPoint) => void;
}

// D3 rendering
svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .style('cursor', onBarClick ? 'pointer' : 'default')
  .on('click', (event, d) => {
    if (onBarClick) {
      onBarClick(d);
    }
  });
```

**Benefits:**

- ✅ Type-safe callbacks
- ✅ Integrates with React state
- ✅ Optional interactivity

---

### Hover Effects

```typescript
svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('fill', baseColor)
  .attr('opacity', 0.8)
  .on('mouseover', function () {
    d3.select(this).transition().duration(200).attr('opacity', 1).attr('transform', 'scale(1.05)');
  })
  .on('mouseout', function () {
    d3.select(this).transition().duration(200).attr('opacity', 0.8).attr('transform', 'scale(1)');
  });
```

---

## ⚡ PERFORMANCE_OPTIMIZATION

### Efficient Data Binding

```typescript
// ✅ GOOD - Join pattern (enter/update/exit)
const bars = svg.selectAll('rect').data(data);

bars
  .enter()
  .append('rect')
  .merge(bars) // Combine enter + update
  .attr('x', (d, i) => i * barWidth)
  .attr('y', (d) => yScale(d.value))
  .attr('width', barWidth - 2)
  .attr('height', (d) => height - yScale(d.value));

bars.exit().remove();

// ❌ BAD - Remove and re-create on every update
svg.selectAll('rect').remove();
svg.selectAll('rect').data(data).enter().append('rect');
```

---

### Memoization (React.useMemo)

```tsx
const processedData = useMemo(() => {
  return data
    .filter((d) => d.value > threshold)
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Top 50
}, [data, threshold]);

useEffect(() => {
  // Render with processedData
}, [processedData, width, height]);
```

**Benefits:**

- ✅ Avoid re-processing on every render
- ✅ Reduce expensive computations
- ✅ Better React reconciliation

---

### Debouncing Resize Events

```tsx
import { debounce } from 'lodash';

useEffect(() => {
  const handleResize = debounce(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  }, 100); // Wait 100ms after last resize

  handleResize();
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    handleResize.cancel();
  };
}, []);
```

---

### Virtual Scrolling (Large Datasets)

```typescript
// For 10k+ points, only render visible range
const visibleData = useMemo(() => {
  const start = Math.floor(scrollTop / itemHeight);
  const end = start + Math.ceil(viewportHeight / itemHeight);
  return data.slice(start, end);
}, [data, scrollTop, viewportHeight]);
```

---

## 🌙 DARK_MODE_SUPPORT

### Tailwind CSS Classes

```tsx
<svg ref={svgRef} className="w-full text-foreground bg-accent/5 rounded-2xl transition-colors" />
```

**Key Classes:**

- `text-foreground` - Adapts to light/dark text color
- `bg-accent/5` - Subtle background (5% opacity)
- `transition-colors` - Smooth theme transitions

---

### CSS Variable Integration

```typescript
// Extract theme colors from CSS
const getThemeColor = (varName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

const foreground = getThemeColor('--foreground');
const accent = getThemeColor('--accent');
const primary = getThemeColor('--primary');

// Use in D3 scales
const colorScale = d3.scaleLinear<string>().range(['var(--accent)', 'var(--primary)']);
```

---

### Theme Detection

```typescript
const [isDark, setIsDark] = useState(false);

useEffect(() => {
  const checkTheme = () => {
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  checkTheme();

  const observer = new MutationObserver(checkTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => observer.disconnect();
}, []);
```

---

## 📦 EXPORT_PATTERNS

### SVG Export

```typescript
const exportSVG = (svgElement: SVGSVGElement, filename: string) => {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  link.click();

  URL.revokeObjectURL(url);
};
```

---

### PNG Export

```typescript
const exportPNG = (svgElement: SVGSVGElement, filename: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      link.click();

      URL.revokeObjectURL(url);
    });
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
};
```

---

### ExportControls Component

```tsx
import { Download, FileImage } from '@aazucena/icons';

interface ExportControlsProps {
  svgRef: RefObject<SVGSVGElement>;
  fileName: string;
}

export function ExportControls({ svgRef, fileName }: ExportControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportSVG(svgRef.current!, fileName)}
        className="p-2 bg-accent hover:bg-accent/80 rounded"
        title="Export as SVG"
      >
        <FileImage size={16} />
      </button>
      <button
        onClick={() => exportPNG(svgRef.current!, fileName)}
        className="p-2 bg-accent hover:bg-accent/80 rounded"
        title="Export as PNG"
      >
        <Download size={16} />
      </button>
    </div>
  );
}
```

**Usage:**

```tsx
<div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
  <ExportControls svgRef={svgRef} fileName="my-chart" />
</div>
```

---

## 🎯 BEST_PRACTICES

### 1. Cleanup D3 Elements

```typescript
useEffect(() => {
  // D3 rendering

  return () => {
    d3.selectAll('.viz-tooltip').remove();
    d3.selectAll('.viz-overlay').remove();
  };
}, [data]);
```

---

### 2. Handle Empty Data

```typescript
useEffect(() => {
  if (!svgRef.current || width === 0 || !data.length) return;

  // Render chart
}, [data, width]);
```

---

### 3. Type Safety with D3

```typescript
// ✅ GOOD - Type assertions
const extent = d3.extent(data, (d) => d.value) as [number, number];

// ✅ GOOD - Null checks
const max = d3.max(data, (d) => d.value) || 100;
```

---

### 4. Avoid Memory Leaks

```typescript
useEffect(() => {
  // Add event listeners
  const handleClick = () => {};
  window.addEventListener('click', handleClick);

  // MUST remove in cleanup
  return () => {
    window.removeEventListener('click', handleClick);
  };
}, []);
```

---

### 5. Use D3 Transitions

```typescript
svg
  .selectAll('rect')
  .data(data)
  .join('rect')
  .transition() // Smooth animation
  .duration(500)
  .attr('x', (d, i) => i * barWidth)
  .attr('y', (d) => yScale(d.value));
```

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Lines:** ~500

**INTELLIGENCE_THEME** • **D3_MASTERY** 🎨
