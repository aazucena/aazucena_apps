import { cva } from "class-variance-authority";

export const outerVariants = cva("fixed z-[100]", {
  variants: {
    mode: {
      floating: "bottom-8 left-8 flex flex-col items-start gap-3",
      offcanvas: "left-0 top-0 h-screen",
      fullscreen: "inset-0",
    },
  },
});

export const innerVariants = cva(
  "bg-panel text-foreground border-rule rounded-card relative flex flex-col overflow-hidden border motion-safe:transition-[width,height,max-height,border-radius] motion-safe:duration-(--motion-base)",
  {
    variants: {
      mode: {
        floating: "h-[480px] max-h-[60vh] w-80",
        offcanvas: "h-full w-full rounded-none border-y-0 border-l-0 sm:w-88",
        fullscreen: "h-full w-full rounded-none border-0",
      },
    },
  },
);
