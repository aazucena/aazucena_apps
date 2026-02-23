'use client';

import * as React from 'react';

export interface UseNumberFieldOptions {
  controlledValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  scrubArea?: boolean;
  disabled?: boolean;
}

export interface UseNumberFieldReturn {
  internalValue: number;
  scrubRef: React.RefObject<HTMLDivElement | null>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
  handleWheel: (e: React.WheelEvent<HTMLInputElement>) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export function useNumberField({
  controlledValue,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  scrubArea = false,
  disabled = false,
}: UseNumberFieldOptions): UseNumberFieldReturn {
  const [internalValue, setInternalValue] = React.useState(controlledValue ?? 0);
  const scrubRef = React.useRef<HTMLDivElement>(null);
  const startValueRef = React.useRef(0);
  const startXRef = React.useRef(0);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const enforceMinMax = (num: number) => {
    let val = num;
    if (val < min) val = min;
    if (val > max) val = max;
    return val;
  };

  const handleValueChange = React.useCallback(
    (newValue: number) => {
      const clamped = enforceMinMax(newValue);
      setInternalValue(clamped);
      onChange?.(clamped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [min, max, onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      handleValueChange(num);
    } else if (e.target.value === '') {
      setInternalValue(0);
      onChange?.(0);
    }
  };

  const handleIncrement = () => handleValueChange(internalValue + step);
  const handleDecrement = () => handleValueChange(internalValue - step);

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    handleValueChange(internalValue + (e.deltaY < 0 ? step : -step));
  };

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (!scrubArea || disabled) return;
      e.preventDefault();
      startValueRef.current = internalValue;
      startXRef.current = e.clientX;

      const mouseMoveHandler = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startXRef.current;
        handleValueChange(startValueRef.current + Math.round(deltaX / 5) * step);
      };

      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [scrubArea, disabled, internalValue, step, handleValueChange],
  );

  return {
    internalValue,
    scrubRef,
    handleInputChange,
    handleIncrement,
    handleDecrement,
    handleWheel,
    handleMouseDown,
  };
}
