/**
 * DynamicBackground Component
 * Renders the dynamic background with smooth atmospheric transitions
 */

import type { CSSProperties, JSX } from "react";

interface DynamicBackgroundProps {
  backgroundStyle: CSSProperties;
}

export default function DynamicBackground({
  backgroundStyle,
}: DynamicBackgroundProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-0 transition-all duration-300 ease-out"
      style={backgroundStyle}
    />
  );
}
