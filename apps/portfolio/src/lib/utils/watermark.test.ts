import { describe, expect, it } from "vitest";
import { watermarkEmWidth, WATERMARK_TRACKING } from "./watermark";

describe("watermarkEmWidth", () => {
  it("never goes below half an em, so an empty word still has a size", () => {
    expect(watermarkEmWidth("")).toBe(0.5);
  });

  it("grows with the word and ignores case", () => {
    expect(watermarkEmWidth("Aldrin")).toBeGreaterThan(watermarkEmWidth("Al"));
    expect(watermarkEmWidth("aldrin")).toBe(watermarkEmWidth("ALDRIN"));
  });

  it("sums advances plus tracking for a known word", () => {
    expect(watermarkEmWidth("AI")).toBeCloseTo(
      0.601 + 0.292 + 2 * WATERMARK_TRACKING,
      5,
    );
  });

  it("counts a glyph outside the table as wide (0.9em)", () => {
    expect(watermarkEmWidth("é")).toBeCloseTo(0.9 + WATERMARK_TRACKING, 5);
    expect(watermarkEmWidth("中文")).toBeCloseTo(
      2 * (0.9 + WATERMARK_TRACKING),
      5,
    );
  });

  it("handles a long word without losing the sum", () => {
    const long = "W".repeat(40);
    expect(watermarkEmWidth(long)).toBeGreaterThan(30);
  });
});
