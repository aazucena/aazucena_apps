import { describe, expect, it } from "vitest";
import { getToolOutput } from "./utils";

describe("getToolOutput", () => {
  it("returns the output of a finished tool call (AI SDK 7 output-available)", () => {
    const part = {
      type: "tool-set_emotion",
      state: "output-available",
      output: { emotion: "happy" },
    };
    expect(
      getToolOutput<{ emotion: string }>(part, "set_emotion")?.emotion,
    ).toBe("happy");
  });

  it("ignores a tool call that is still streaming its input", () => {
    const part = { type: "tool-set_emotion", state: "input-streaming" };
    expect(getToolOutput(part, "set_emotion")).toBeUndefined();
  });

  it("ignores a different tool", () => {
    const part = {
      type: "tool-submit_contact_form",
      state: "output-available",
      output: { success: true },
    };
    expect(getToolOutput(part, "set_emotion")).toBeUndefined();
  });
});
