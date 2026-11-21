import { ChevronDown } from "@aazucena/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Panel,
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
    <ul className="divide-rule divide-y">
      {items.map((item, j) => (
        <li
          key={j}
          className="text-foreground flex items-start gap-3 py-2 text-sm leading-relaxed first:pt-0 last:pb-0"
        >
          <span className="flex-1">
            {item.scope && (
              <span className="bg-state border-rule text-muted-foreground rounded-control mr-2 inline-block border px-1.5 py-0.5 font-mono text-[10px] uppercase">
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
      <Panel data-toc-exclude label={sole.group.toUpperCase()}>
        <ItemList items={sole.items} />
      </Panel>
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
            <span className="text-foreground text-sm font-semibold">
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
