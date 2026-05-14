import { ChevronDown } from "@aazucena/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@aazucena/ui";

export type ParsedItem = { scope: string | null; text: string };
export type ChangelogSection = { group: string; items: ParsedItem[] };
export type ChangelogEntry = {
  label: string;
  date: string | null;
  isPhase: boolean;
  sections: ChangelogSection[];
};

interface Props {
  sections: ChangelogSection[];
}

function ItemList({ items }: { items: ParsedItem[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, j) => (
        <li
          key={j}
          className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
        >
          <span
            className="mt-0.5 shrink-0 text-gray-300 dark:text-gray-700"
            aria-hidden="true"
          >
            —
          </span>
          <span className="flex-1">
            {item.scope && (
              <span className="mr-2 inline-block rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gray-500 md:text-xs dark:bg-gray-800 dark:text-gray-400">
                {item.scope}
              </span>
            )}
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ChangelogSections({ sections }: Props) {
  if (sections.length === 1) {
    const [sole] = sections;
    if (!sole) return null;
    return (
      <div
        data-toc-exclude
        className="border-border bg-card/50 overflow-hidden rounded-xl border p-4"
      >
        <p className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
          {sole.group}
        </p>
        <ItemList items={sole.items} />
      </div>
    );
  }

  return (
    <Accordion data-toc-exclude type="multiple" variant="card">
      {sections.map((section, i) => (
        <AccordionItem
          key={section.group + i}
          value={`section-${i}`}
          variant="card"
        >
          <AccordionTrigger
            variant="default"
            icon={ChevronDown}
            iconAnimation="rotate"
          >
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {section.group}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ItemList items={section.items} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
