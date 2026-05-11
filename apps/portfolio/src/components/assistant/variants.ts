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
  "bg-background relative flex flex-col overflow-hidden",
  {
    variants: {
      mode: {
        floating:
          "h-[480px] max-h-[60vh] w-80 rounded-2xl border border-border shadow-2xl transition-all duration-300",
        offcanvas: "h-full w-full sm:w-88 border-r border-border shadow-2xl",
        fullscreen: "h-full w-full",
      },
    },
  },
);
