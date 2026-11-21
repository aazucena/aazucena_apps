/**
 * Skill Details Modal Component
 * Displays detailed information about a specific skill when clicked in the network graph
 * (ui Dialog: focus trap, Escape, labelled by the skill name).
 */

import type { SkillDetails } from "@aazucena/types";
import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@aazucena/ui";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillDetails: SkillDetails | null;
}

export function DetailsModal({
  isOpen,
  onClose,
  skillDetails,
}: DetailsModalProps) {
  return (
    <Dialog
      open={isOpen && !!skillDetails}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent size="lg" className="overflow-hidden p-0">
        {skillDetails && (
          <>
            <div className="border-rule flex items-center gap-4 border-b p-6">
              <div className="border-rule bg-state text-signal rounded-control flex h-14 w-14 shrink-0 items-center justify-center border font-mono text-2xl">
                {skillDetails.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-foreground mb-1 text-2xl font-semibold">
                  {skillDetails.name}
                </DialogTitle>
                <DialogDescription asChild>
                  <div>
                    <Badge variant="outline">{skillDetails.category}</Badge>
                  </div>
                </DialogDescription>
              </div>
            </div>

            <DialogBody className="max-h-[60vh] overflow-y-auto p-6">
              <dl className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Years used", String(skillDetails.yearsUsed.length)],
                  ["Projects", String(skillDetails.totalProjects)],
                  ["First used", String(skillDetails.firstUsed.getFullYear())],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-rule bg-state rounded-card border p-4"
                  >
                    <dt className="micro-label text-muted-foreground mb-1">
                      {label}
                    </dt>
                    <dd className="text-foreground font-mono text-2xl">
                      {value}
                    </dd>
                  </div>
                ))}
                <div className="border-rule bg-state rounded-card border p-4">
                  <dt className="micro-label text-muted-foreground mb-1">
                    Proficiency
                  </dt>
                  <dd className="mt-1">
                    <Badge
                      variant={
                        skillDetails.proficiencyLevel === "Expert"
                          ? "cyber"
                          : skillDetails.proficiencyLevel === "Advanced"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {skillDetails.proficiencyLevel}
                    </Badge>
                  </dd>
                </div>
              </dl>

              <div className="space-y-6">
                <section>
                  <h3 className="micro-label text-muted-foreground mb-3">
                    Experience timeline
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {skillDetails.yearsUsed.map((year) => (
                      <li
                        key={year}
                        className="border-rule bg-state text-signal rounded-control border px-3 py-1 font-mono text-sm"
                      >
                        {year}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="micro-label text-muted-foreground mb-3">
                    Related skills
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {skillDetails.relatedSkills.map((skill) => (
                      <li key={skill}>
                        <Badge variant="secondary">{skill}</Badge>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </DialogBody>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close details</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
