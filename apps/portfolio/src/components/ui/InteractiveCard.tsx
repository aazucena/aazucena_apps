import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  initialExpanded?: boolean;
}

export function InteractiveCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  initialExpanded = false,
}: InteractiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <Panel
      className={cn(
        "border-rule p-panel border transition-[border-color]",
        isExpanded ? "border-rule-strong" : "hover:border-rule-strong",
      )}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="focus-visible:outline-signal rounded-control flex w-full items-start gap-4 text-left focus-visible:outline-1 focus-visible:outline-offset-2"
      >
        <div
          className={cn(
            "border-rule bg-state text-signal rounded-control flex h-12 w-12 flex-shrink-0 items-center justify-center border",
            color,
          )}
        >
          <Icon size={24} />
        </div>
        <div className="flex-grow pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
          {subtitle && (
            <p className="micro-label text-signal mt-1">{subtitle}</p>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
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
  );
}
