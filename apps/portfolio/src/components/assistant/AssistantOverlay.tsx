"use client";

import * as React from "react";
import { X } from "@aazucena/icons";
import { Button } from "@aazucena/ui";

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
      <p className="micro-label text-muted-foreground">{label}</p>
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
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
  }, []);
  return (
    <div
      role="dialog"
      aria-label={title}
      className="bg-panel absolute inset-0 z-10 flex flex-col overflow-y-auto"
    >
      {/* Header band */}
      <div className="border-rule flex items-center gap-4 border-b px-5 pt-5 pb-4">
        {icon}
        <div className="flex-1">
          <p className="text-base font-semibold">{title}</p>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground size-8"
          aria-label="Close"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-4 px-5 pt-3 pb-5 text-sm">{children}</div>

      {/* Footer */}
      {footer && <div className="border-rule border-t px-5 pb-5">{footer}</div>}
    </div>
  );
}
