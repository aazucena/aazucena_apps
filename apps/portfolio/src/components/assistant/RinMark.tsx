import * as React from "react";

export function RinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="14" cy="14" r="13" fill="currentColor" fillOpacity="0.08" />
      <circle
        cx="14"
        cy="14"
        r="13"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <circle cx="10" cy="14" r="2" fill="currentColor" fillOpacity="0.85" />
      <circle cx="18" cy="14" r="2" fill="currentColor" fillOpacity="0.85" />
      <circle cx="10.8" cy="13.2" r="0.7" fill="white" fillOpacity="0.45" />
      <circle cx="18.8" cy="13.2" r="0.7" fill="white" fillOpacity="0.45" />
    </svg>
  );
}

export const RinAvatar = () => (
  <RinMark className="text-secondary h-7 w-7 shrink-0" />
);

export const rinAvatarIcon = <RinMark className="text-secondary h-4 w-4" />;
