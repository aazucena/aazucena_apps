import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "aa-inline-flex aa-items-center aa-justify-center aa-gap-2 aa-whitespace-nowrap aa-rounded-md aa-text-sm aa-font-medium aa-transition-colors focus-visible:aa-outline-none focus-visible:aa-ring-1 focus-visible:aa-ring-ring disabled:aa-pointer-events-none disabled:aa-opacity-50 [&_svg]:aa-pointer-events-none [&_svg]:aa-size-4 [&_svg]:aa-shrink-0",
  {
    variants: {
      variant: {
        default:
          "aa-bg-primary aa-text-primary-foreground aa-shadow hover:aa-bg-primary/90",
        destructive:
          "aa-bg-destructive aa-text-destructive-foreground aa-shadow-sm hover:aa-bg-destructive/90",
        outline:
          "aa-border aa-border-input aa-bg-background aa-shadow-sm hover:aa-bg-accent hover:aa-text-accent-foreground",
        secondary:
          "aa-bg-secondary aa-text-secondary-foreground aa-shadow-sm hover:aa-bg-secondary/80",
        ghost: "hover:aa-bg-accent hover:aa-text-accent-foreground",
        link: "aa-text-primary aa-underline-offset-4 hover:aa-underline",
      },
      size: {
        default: "aa-h-9 aa-px-4 aa-py-2",
        sm: "aa-h-8 aa-rounded-md aa-px-3 aa-text-xs",
        lg: "aa-h-10 aa-rounded-md aa-px-8",
        icon: "aa-h-9 aa-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
