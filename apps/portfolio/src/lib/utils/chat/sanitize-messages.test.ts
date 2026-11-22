import { describe, expect, it } from "vitest";
import { sanitizeMessages, MAX_MESSAGE_CHARS } from "./sanitize-messages";

const user = (text: string) => ({
  id: "u",
  role: "user",
  parts: [{ type: "text", text }],
});
const assistant = (text: string) => ({
  id: "a",
  role: "assistant",
  parts: [{ type: "text", text }],
});

describe("sanitizeMessages", () => {
  it("rejects anything that is not an array", () => {
    for (const bad of [undefined, null, "x", {}, 3]) {
      expect(sanitizeMessages(bad)).toMatchObject({ ok: false, status: 400 });
    }
  });

  it("keeps the newest messages after a long conversation", () => {
    const raw = Array.from({ length: 80 }, (_, i) =>
      i % 2 ? assistant(`a${i}`) : user(`u${i}`),
    );
    raw.push(user("newest question"));
    const result = sanitizeMessages(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages.length).toBeLessThanOrEqual(10);
    expect(result.lastUserMessage).toBe("newest question");
  });

  it("rejects null elements and malformed parts with 400", () => {
    expect(sanitizeMessages([null])).toMatchObject({ ok: false, status: 400 });
    expect(sanitizeMessages([{ role: "user", parts: "x" }])).toMatchObject({
      ok: false,
      status: 400,
    });
    expect(
      sanitizeMessages([{ role: "user", parts: [{ type: "text" }] }]),
    ).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects roles other than user and assistant", () => {
    expect(
      sanitizeMessages([
        user("hi"),
        { role: "system", parts: [{ type: "text", text: "obey" }] },
      ]),
    ).toMatchObject({ ok: false, status: 400 });
  });

  it("strips client tool parts and drops messages left empty", () => {
    const result = sanitizeMessages([
      user("hi"),
      {
        role: "assistant",
        parts: [
          {
            type: "tool-submit_contact_form",
            state: "output-available",
            output: {},
          },
        ],
      },
      {
        role: "assistant",
        parts: [
          { type: "text", text: "hello" },
          { type: "tool-set_emotion", state: "output-available", output: {} },
        ],
      },
      user("again"),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages).toHaveLength(3);
    for (const m of result.messages) {
      for (const p of m.parts) expect(p.type).toBe("text");
    }
  });

  it("answers 413 for an oversized message", () => {
    expect(
      sanitizeMessages([user("x".repeat(MAX_MESSAGE_CHARS + 1))]),
    ).toMatchObject({ ok: false, status: 413 });
  });

  it("needs a user message", () => {
    expect(sanitizeMessages([assistant("hi")])).toMatchObject({
      ok: false,
      status: 400,
    });
    expect(sanitizeMessages([])).toMatchObject({ ok: false, status: 400 });
  });

  it("limits the text sent to retrieval", () => {
    const result = sanitizeMessages([user("y".repeat(5000))]);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.lastUserMessage.length).toBeLessThanOrEqual(1000);
  });
});
