import * as React from "react"
import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative w-full", className)} {...props} />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative pb-8 md:pb-12 last:pb-0 group", className)}
    {...props}
  />
))
TimelineItem.displayName = "TimelineItem"

const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "primary" | "success" | "warning" | "danger"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-white/40 dark:to-white/20 shadow-lg",
    primary: "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50",
    success: "bg-gradient-to-br from-green-400 to-primary-500 shadow-lg shadow-green-400/50",
    warning: "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50",
    danger: "bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-400/50",
  }

  return (
    <div className="absolute left-0 top-8 -translate-y-1/2 flex items-center justify-center z-10">
      <div
        ref={ref}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="h-3 w-3 rounded-full bg-white/80" />
      </div>
    </div>
  )
})
TimelineDot.displayName = "TimelineDot"

const TimelineLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-[11px] top-8 h-full w-0.5 bg-gradient-to-b from-cyan-400/50 via-cyan-400/30 to-transparent",
      className
    )}
    {...props}
  />
))
TimelineLine.displayName = "TimelineLine"

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-12 md:ml-16", className)}
    {...props}
  />
))
TimelineContent.displayName = "TimelineContent"

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 mb-3", className)}
    {...props}
  />
))
TimelineHeader.displayName = "TimelineHeader"

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold text-white", className)}
    {...props}
  />
))
TimelineTitle.displayName = "TimelineTitle"

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
))
TimelineDescription.displayName = "TimelineDescription"

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineLine,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
}
