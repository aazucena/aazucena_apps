import { useId, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ChevronDown } from "@aazucena/icons";
import { Panel } from "@aazucena/ui";
import { cn } from "@aazucena/utils";

interface InteractiveCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: any;
  /** Extra classes for the icon plate (token classes only) */
  color?: string;
  /** Optional CMS tone (CSS colour) for the icon */
  tone?: string;
  initialExpanded?: boolean;
}

export function InteractiveCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  tone,
  initialExpanded = false,
}: InteractiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const bodyId = useId();

  return (
    <MotionConfig reducedMotion="user">
      <Panel
        className={cn(
          "group linked-card border-rule p-panel border transition-[border-color]",
          isExpanded ? "border-rule-strong" : "hover:border-rule-strong",
        )}
      >
        <h3>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            // the body only exists while it is open
            aria-controls={isExpanded ? bodyId : undefined}
            className="focus-visible:outline-signal rounded-control flex w-full items-start gap-4 text-left focus-visible:outline-1 focus-visible:outline-offset-2"
          >
            <span
              className={cn(
                "hover-grow border-rule bg-state text-signal rounded-control flex h-12 w-12 flex-shrink-0 items-center justify-center border",
                color,
              )}
              style={tone ? { color: tone } : undefined}
              aria-hidden="true"
            >
              <Icon size={24} />
            </span>
            <span className="block flex-grow pt-1">
              <span className="flex items-center justify-between">
                <span className="text-foreground text-lg font-semibold">
                  {title}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`text-muted-foreground motion-safe:transition-transform motion-safe:duration-300 ${isExpanded ? "rotate-180" : ""}`}
                />
              </span>
              {subtitle && (
                <span className="micro-label text-signal mt-1 block">
                  {subtitle}
                </span>
              )}
            </span>
          </button>
        </h3>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={bodyId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-rule text-muted-foreground mt-4 border-t pt-4 text-sm leading-relaxed">
                {description}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>
    </MotionConfig>
  );
}
