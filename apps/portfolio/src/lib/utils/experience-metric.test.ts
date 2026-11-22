import { describe, expect, it } from "vitest";
import { getTopMetric } from "./experience-metric";

const exp = (...titles: string[]) =>
  ({ achievements: titles.map((title) => ({ title })) }) as never;

describe("getTopMetric", () => {
  it("does not take punctuation as the outcome", () => {
    expect(getTopMetric(exp("Led migration, cut costs 40%"))).toEqual({
      value: "40%",
      label: "Led migration, cut costs",
    });
  });

  it("returns null when no achievement has a number", () => {
    expect(getTopMetric(exp("Led migration, shipped it."))).toBeNull();
    expect(getTopMetric(exp())).toBeNull();
  });

  it("keeps currency and unit suffixes", () => {
    expect(getTopMetric(exp("Saved $2M"))?.value).toBe("$2M");
    expect(getTopMetric(exp("Grew to 10k users"))?.value).toBe("10k");
  });
});
