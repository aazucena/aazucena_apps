import { describe, expect, it } from "vitest";
import {
  sanitizeMessages,
  MAX_MESSAGE_CHARS,
  MAX_REQUEST_CHARS,
  MAX_RETRIEVAL_CHARS,
} from "./sanitize-messages";

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
    expect(result.messages).toHaveLength(4);
    for (const m of result.messages) {
      for (const p of m.parts) expect(p.type).toBe("text");
    }
  });

  it("answers 413 only for an oversized newest user message", () => {
    expect(
      sanitizeMessages([user("x".repeat(MAX_MESSAGE_CHARS + 1))]),
    ).toMatchObject({ ok: false, status: 413 });
  });

  it("truncates an over-cap older user message instead of rejecting", () => {
    const result = sanitizeMessages([
      user("x".repeat(MAX_MESSAGE_CHARS + 500)),
      assistant("ok"),
      user("short"),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages[0]!.parts[0]!.text.length).toBe(MAX_MESSAGE_CHARS);
  });

  it("accepts an 8,200 char assistant reply followed by short user turns", () => {
    const long = assistant("r".repeat(8_200));
    const first = sanitizeMessages([user("q1"), long, user("q2")]);
    expect(first.ok).toBe(true);
    const second = sanitizeMessages([
      user("q1"),
      long,
      user("q2"),
      assistant("fine"),
      user("q3"),
    ]);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.lastUserMessage).toBe("q3");
    for (const m of second.messages)
      for (const p of m.parts)
        expect(p.text.length).toBeLessThanOrEqual(MAX_MESSAGE_CHARS);
  });

  it("skips blank text parts and drops the message they leave", () => {
    const result = sanitizeMessages([
      user("hi"),
      {
        role: "assistant",
        parts: [
          { type: "text", text: "  " },
          { type: "tool-set_emotion", state: "output-available", output: {} },
        ],
      },
      user("again"),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages.map((m) => m.role)).toEqual(["user", "user"]);
  });

  it("answers 400 when the last message is from the assistant", () => {
    expect(
      sanitizeMessages([user("hi"), assistant("prefilled")]),
    ).toMatchObject({ ok: false, status: 400 });
  });

  it("keeps a handled contact submission as plain text, never its data", () => {
    const result = sanitizeMessages([
      user("send it"),
      {
        role: "assistant",
        parts: [
          {
            type: "tool-submit_contact_form",
            state: "output-available",
            input: { email: "a@b.co", message: "secret" },
            output: { success: true },
          },
        ],
      },
      user("thanks"),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages.map((m) => m.role)).toEqual([
      "user",
      "assistant",
      "user",
    ]);
    expect(result.messages[1]!.parts[0]!.text).toBe(
      "(an earlier contact message was sent)",
    );
    expect(JSON.stringify(result.messages)).not.toContain("secret");
  });

  it("never leaves a split surrogate in the retrieval text", () => {
    const text = "a".repeat(MAX_RETRIEVAL_CHARS - 1) + "😀";
    const result = sanitizeMessages([user(text)]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(() => encodeURIComponent(result.lastUserMessage)).not.toThrow();
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

  it("counts all text parts of the newest message toward its limit", () => {
    const parts = Array.from({ length: 10 }, () => ({
      type: "text",
      text: "x".repeat(MAX_MESSAGE_CHARS - 1),
    }));
    expect(sanitizeMessages([{ role: "user", parts }])).toMatchObject({
      ok: false,
      status: 413,
    });
  });

  it("drops the oldest messages to fit the request cap and keeps the newest", () => {
    const size = MAX_MESSAGE_CHARS - 1;
    const raw = [
      user("oldest".padEnd(size, "o")),
      assistant("a".repeat(size)),
      user("b".repeat(size)),
      assistant("c".repeat(size)),
      user("d".repeat(size)),
      assistant("e".repeat(size)),
      user("newest".padEnd(size, "n")),
    ];
    const result = sanitizeMessages(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const total = result.messages.reduce(
      (n, m) => n + m.parts.reduce((k, p) => k + p.text.length, 0),
      0,
    );
    expect(total).toBeLessThanOrEqual(MAX_REQUEST_CHARS);
    expect(result.messages.length).toBeLessThan(raw.length);
    expect(result.lastUserMessage.startsWith("newest")).toBe(true);
    expect(result.messages[result.messages.length - 1]!.role).toBe("user");
  });

  it.each([
    ["output-error", { errorText: "503" }],
    ["input-streaming", { input: { name: "A" } }],
    ["input-available", {}],
    ["output-available", { output: { success: false } }],
    ["output-available", { output: null }],
  ])("never says a %s contact submission was sent", (state, extra) => {
    const result = sanitizeMessages([
      user("send it"),
      {
        role: "assistant",
        parts: [{ type: "tool-submit_contact_form", state, ...extra }],
      },
      user("try again"),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages[1]!.parts[0]!.text).toBe(
      "(an earlier contact submission did not complete; nothing was confirmed as sent)",
    );
  });

  it("cuts an older message with over 50 parts instead of rejecting it", () => {
    const parts = Array.from({ length: 120 }, (_, i) => ({
      type: "text",
      text: `part ${i}`,
    }));
    const result = sanitizeMessages([
      user("hi"),
      { role: "assistant", parts },
      user("next"),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages[1]!.parts).toHaveLength(50);
    expect(result.messages[1]!.parts[49]!.text).toBe("part 119");
  });

  it("answers 413 when a part follows a newest message already at the limit", () => {
    const parts = [
      { type: "text", text: "x".repeat(MAX_MESSAGE_CHARS) },
      { type: "text", text: "more" },
    ];
    expect(sanitizeMessages([{ role: "user", parts }])).toMatchObject({
      ok: false,
      status: 413,
    });
  });
});
