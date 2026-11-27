import { describe, expect, it } from "vitest";
import { categoryTone, seriesTone } from "./series-tone";

describe("seriesTone", () => {
  it("gives the same series colour for the same name", () => {
    expect(seriesTone("Portfolio Website")).toBe(
      seriesTone("Portfolio Website"),
    );
  });

  it("only returns series colours", () => {
    for (const name of [
      "a",
      "Gaming Timeline",
      "Conductor's Hand",
      "",
      "x".repeat(50),
    ]) {
      expect(seriesTone(name)).toMatch(/^var\(--series-[1-4]\)$/);
    }
  });
});

describe("categoryTone", () => {
  it("follows the category's old hue", () => {
    expect(categoryTone("analytics")).toBe("var(--series-2)");
    expect(categoryTone("tutoring")).toBe("var(--series-4)");
    expect(categoryTone("consulting")).toBe("var(--series-3)");
  });

  it("falls back to the signal colour and never to alert", () => {
    expect(categoryTone("devops")).toBe("var(--signal)");
    expect(categoryTone("unknown")).toBe("var(--signal)");
  });
});
