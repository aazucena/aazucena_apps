"use client";

import * as React from "react";

export interface AssistantOverlayProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AssistantOverlaySection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export function AssistantOverlay({
  icon,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: AssistantOverlayProps) {
  return (
    <div className="bg-background absolute inset-0 z-10 flex flex-col overflow-y-auto">
      {/* Header band */}
      <div className="from-secondary/10 to-primary/5 flex items-center gap-4 bg-gradient-to-r px-5 pt-5 pb-4">
        {icon}
        <div className="flex-1">
          <p className="text-base font-semibold">{title}</p>
          <p className="text-muted-foreground text-[11px]">{subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-4 px-5 pt-3 pb-5 text-sm">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-border/50 border-t px-5 pb-5">{footer}</div>
      )}
    </div>
  );
}
