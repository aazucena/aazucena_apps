/**
 * AskMeAbout.tsx
 * A personal context component prompting interview questions.
 * Designed to look like a direct message or tip from the candidate.
 */

import { Panel } from "@aazucena/ui";
import type { JSX } from "react";

interface AskMeAboutProps {
  topics: string[];
}

export function AskMeAbout({ topics }: AskMeAboutProps): JSX.Element | null {
  if (!topics || topics.length === 0) return null;

  return (
    <Panel label="ASK ME ABOUT" className="print:break-inside-avoid">
      <p className="text-muted-foreground mb-2 text-sm leading-relaxed">
        Want to dive deeper? I'd love to chat about these specific challenges I
        tackled in this role:
      </p>
      <ul className="space-y-2">
        {topics.map((topic, index) => (
          <li
            key={index}
            className="text-foreground flex items-start gap-2 text-sm font-medium"
          >
            <span className="text-signal" aria-hidden="true">
              ●
            </span>
            {topic}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
