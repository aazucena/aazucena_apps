import { describe, expect, it } from "vitest";
import { cmsTone } from "./cms-tone";

describe("cmsTone", () => {
  it("maps cool hues to signal", () => {
    for (const v of ["blue", "cyan", "sky", "indigo", "blue-cyan"]) {
      expect(cmsTone(v)).toBe("var(--signal)");
    }
  });

  it("maps other hues to the series colours", () => {
    expect(cmsTone("emerald")).toBe("var(--series-2)");
    expect(cmsTone("emerald-teal")).toBe("var(--series-2)");
    expect(cmsTone("purple-indigo")).toBe("var(--series-3)");
    expect(cmsTone("pink-purple")).toBe("var(--series-3)");
    expect(cmsTone("amber-orange")).toBe("var(--series-4)");
  });

  it("is case and space tolerant", () => {
    expect(cmsTone("  Blue ")).toBe("var(--signal)");
  });

  it("never returns an alert colour and gives null for unknown or empty values", () => {
    for (const v of [
      "red",
      "rose",
      "orange-red",
      "",
      undefined,
      null,
      "banana",
    ]) {
      const out = cmsTone(v as string | undefined | null);
      expect(out === null || !/alert/.test(out)).toBe(true);
    }
    expect(cmsTone("constructor")).toBeNull();
    expect(cmsTone("__proto__")).toBeNull();
    expect(cmsTone("toString-x")).toBeNull();
    expect(cmsTone("red")).toBeNull();
    expect(cmsTone(undefined)).toBeNull();
    expect(cmsTone("banana")).toBeNull();
  });
});
