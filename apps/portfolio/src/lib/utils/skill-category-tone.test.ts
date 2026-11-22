import { describe, expect, it } from "vitest";
import { groupSkillsByCategory } from "../../../../../packages/api/src/transformers/skills";
import { cmsTone } from "./cms-tone";

const skill = (variant?: string | null) =>
  ({
    id: 1,
    name: "TypeScript",
    category: { id: 1, name: "web", label: "Web", variant },
  }) as never;

describe("skill category variant", () => {
  it("keeps an empty variant empty so the page falls back by position", () => {
    for (const v of [undefined, null, ""]) {
      const [category] = groupSkillsByCategory([skill(v)]);
      expect(category!.gradient).toBeUndefined();
      expect(cmsTone(category!.gradient)).toBeNull();
    }
  });

  it("passes a set variant through", () => {
    const [category] = groupSkillsByCategory([skill("purple-pink")]);
    expect(category!.gradient).toBe("purple-pink");
    expect(cmsTone(category!.gradient)).toBe("var(--series-3)");
  });
});
