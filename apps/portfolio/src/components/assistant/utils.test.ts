import { describe, expect, it } from "vitest";
import { vi } from "vitest";
import { getToolOutput, renderMarkdown, retryLast } from "./utils";

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

describe("renderMarkdown", () => {
  it("keeps ordinary markdown", () => {
    const html = renderMarkdown("**bold** and [site](https://example.com)");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain('href="https://example.com"');
  });

  it("escapes raw html blocks", () => {
    const html = renderMarkdown("<div onclick=x>hi</div>");
    expect(html).not.toContain("<div");
    expect(html).toContain("&lt;div");
  });

  it("escapes inline raw html", () => {
    const html = renderMarkdown("a <img/onerror=x src=y> b");
    expect(html).not.toContain("<img");
  });

  it("keeps allowed link targets", () => {
    for (const href of [
      "https://a.test/x",
      "http://a.test",
      "mailto:a@b.test",
      "/about",
      "#top",
      "page",
    ]) {
      expect(renderMarkdown(`[t](${href})`)).toContain(`href="${href}"`);
    }
  });

  it("drops other link schemes, including encoded and padded ones", () => {
    for (const href of [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      "&#106;avascript:alert(1)",
      "java&#x09;script:alert(1)",
      "%6Aavascript:alert(1)",
      "data:text/html,x",
      "vbscript:x",
    ]) {
      const html = renderMarkdown(`[t](<${href}>)`);
      expect(html).not.toMatch(/href="[^"]*(script|data:)/i);
      expect(html).not.toMatch(/href="&/i);
    }
  });

  it("drops disallowed image sources and escapes attributes", () => {
    expect(renderMarkdown("![a](javascript:x)")).not.toMatch(
      /src="[^"]*script/i,
    );
    const html = renderMarkdown(
      '![a"onerror="x](https://a.test/i.png "t\\"x")',
    );
    expect(html).not.toMatch(/\sonerror=/);
  });

  it("never emits raw html after tags that change how marked lexes text", () => {
    for (const tag of ["code", "pre", "kbd", "script", "KBD"]) {
      const inner = `a <${tag}><img/data-x src=y>`;
      for (const input of [
        inner,
        `[${inner}](https://a.test)`,
        `**${inner}**`,
        `- ${inner}`,
        `|h|\n|-|\n|${inner}|`,
        `> ${inner}`,
      ]) {
        const html = renderMarkdown(input);
        expect(html, input).not.toContain("<img");
        expect(html, input).toContain("&lt;img");
      }
    }
  });

  it("keeps query strings in links intact", () => {
    expect(renderMarkdown("[t](https://a.test/?a=1&b=2)")).toContain(
      'href="https://a.test/?a=1&amp;b=2"',
    );
  });
  it("never nests a link when an image sits inside one", () => {
    const html = renderMarkdown(
      "[![logo](https://a.test/l.png)](https://a.test)",
    );
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('<a href="https://a.test">logo</a>');
  });

  it("shows images from model output as links, never loading them", () => {
    const html = renderMarkdown("![chart](https://a.test/c.png)");
    expect(html).not.toContain("<img");
    expect(html).toContain('<a href="https://a.test/c.png">chart</a>');
    expect(renderMarkdown("![](https://a.test/c.png)")).toContain(
      ">https://a.test/c.png</a>",
    );
    expect(renderMarkdown("![x](javascript:alert(1))")).not.toMatch(/<a|<img/);
  });
});

describe("retryLast", () => {
  it("clears the error and does not regenerate an empty chat", async () => {
    const regenerate = vi.fn().mockRejectedValue(new Error("no messages"));
    const clearError = vi.fn();
    await expect(
      retryLast([], regenerate, clearError),
    ).resolves.toBeUndefined();
    expect(regenerate).not.toHaveBeenCalled();
    expect(clearError).toHaveBeenCalledOnce();
  });

  it("regenerates when there is a history", async () => {
    const regenerate = vi.fn().mockResolvedValue(undefined);
    const clearError = vi.fn();
    await retryLast([{ id: "1" }], regenerate, clearError);
    expect(regenerate).toHaveBeenCalledOnce();
    expect(clearError).not.toHaveBeenCalled();
  });

  it("never sends a delivered contact message again", async () => {
    const regenerate = vi.fn().mockResolvedValue(undefined);
    const clearError = vi.fn();
    const sent = {
      role: "assistant",
      parts: [
        {
          type: "tool-submit_contact_form",
          state: "output-available",
          output: { success: true },
        },
      ],
    };
    await retryLast([{ role: "user" }, sent], regenerate, clearError);
    expect(regenerate).not.toHaveBeenCalled();
    expect(clearError).toHaveBeenCalledOnce();
  });

  it("still retries a contact message that failed", async () => {
    const regenerate = vi.fn().mockResolvedValue(undefined);
    const failed = {
      role: "assistant",
      parts: [{ type: "tool-submit_contact_form", state: "output-error" }],
    };
    await retryLast([failed], regenerate, vi.fn());
    expect(regenerate).toHaveBeenCalledOnce();
  });

  it("never throws when regenerate rejects", async () => {
    const regenerate = vi.fn().mockRejectedValue(new Error("boom"));
    const clearError = vi.fn();
    await expect(
      retryLast([{ id: "1" }], regenerate, clearError),
    ).resolves.toBeUndefined();
    expect(clearError).toHaveBeenCalledOnce();
  });
});
