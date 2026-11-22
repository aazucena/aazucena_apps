import { describe, expect, it } from "vitest";
import {
  sanitizeMessages,
  MAX_MESSAGE_CHARS,
  MAX_REQUEST_CHARS,
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
    expect(result.messages).toHaveLength(3);
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
});
