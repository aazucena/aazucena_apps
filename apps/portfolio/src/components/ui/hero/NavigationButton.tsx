/**
 * NavigationButton Component
 * Split button with dropdown for section navigation
 * Used in HeroSection for primary CTA
 */

import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconRenderer } from '~/components/blocks/IconRenderer';
import type { IconComponent } from '~/types/icons';
import { usePortfolio } from '~/contexts/animations';

export interface NavigationDropdownOption {
  label: string;
  index: number;
  icon?: IconComponent;
}

export interface NavigationButtonProps {
  options: NavigationDropdownOption[];
  onNavigateClick?: (index: number) => void;
  children?: React.ReactNode;
  dropdown?: boolean;
}

export function NavigationButton({
  dropdown = true,
  options,
  onNavigateClick,
  children
}: NavigationButtonProps): JSX.Element {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLDivElement>(null);

  const { navigateToSection } = usePortfolio();

  const handleToggleDropdown = () => {
    const newState = !showDropdown;

    // Calculate position immediately when opening
    if (newState && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const style = {
        position: 'fixed' as const,
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      };
      setDropdownStyle(style);
    }

    setShowDropdown(newState);
  };

  const onNavigate = (sectionIndex: number) => {
    onNavigateClick?.(sectionIndex);
    navigateToSection(sectionIndex);
    setShowDropdown(false);
  };

  // Guard against empty options array
  if (!options || options.length === 0) {
    return <></>;
  }

  const firstOptionIndex = options[0]!.index;
  const otherOptions = options.slice(1);

  // Auto-enable dropdown if there are multiple options, unless explicitly disabled
  const shouldShowDropdown = dropdown !== false && otherOptions.length > 0;
  const hasDropdownItems = shouldShowDropdown;

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (!showDropdown || !buttonRef.current) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const style = {
          position: 'fixed' as const,
          top: `${rect.bottom + 8}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
        };
        setDropdownStyle(style);
      }
    };

    // Update on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showDropdown]);

  return (
    <div ref={buttonRef} className="relative w-full sm:w-auto">
      <div className="flex w-full sm:w-auto">
        {/* Main Button */}
        <button
          onClick={() => onNavigate(firstOptionIndex)}
          className={`flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 ${hasDropdownItems ? 'rounded-l-lg' : 'rounded-lg'}`}
          aria-label="Get started"
        >
          {children ?? 'Get Started'}
        </button>

        {/* Dropdown Trigger - only show if dropdown prop is true AND there are items */}
        {hasDropdownItems && (
          <button
            onClick={handleToggleDropdown}
            className="flex-shrink-0 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-r-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 border-l border-white/20"
            aria-label="Show navigation options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Backdrop to close dropdown - Rendered via Portal */}
      {hasDropdownItems && showDropdown && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[60]"
          onClick={() => setShowDropdown(false)}
        />,
        document.body
      )}

      {/* Dropdown Menu - Rendered via Portal to bypass overflow issues */}
      {hasDropdownItems && showDropdown && typeof document !== 'undefined' && (() => {
        const dropdownElement = (
          <div
            style={dropdownStyle}
            className="bg-gray-900 rounded-lg shadow-2xl border border-cyan-400/30 overflow-y-auto max-h-[216px] z-[500] scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-gray-800 sm:min-w-[280px]"
          >
            {otherOptions.map((option) => {
              return (
                <button
                  key={option.index}
                  onClick={() => onNavigate(option.index)}
                  className="w-full px-6 py-3 text-left text-white hover:bg-cyan-500/20 transition-colors duration-200 flex items-center gap-3 border-b border-white/10 last:border-b-0"
                >
                  <IconRenderer icon={option.icon} className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        );
        return createPortal(dropdownElement, document.body);
      })()}
    </div>
  );
}
