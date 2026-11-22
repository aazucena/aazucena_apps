import { describe, expect, it, vi } from "vitest";

vi.mock("astro:env/server", () => ({ getSecret: () => undefined }));

vi.mock("~/lib/utils/chat/context", () => ({
  fetchChatContext: async () => ({ systemPrompt: "" }),
  fetchRagContext: async () => "",
}));
vi.mock("~/lib/utils/chat/tools", () => ({ createChatTools: () => ({}) }));
vi.mock("~/lib/utils/chat/sanitize-messages", async () => ({
  ...(await import("../../lib/utils/chat/sanitize-messages")),
}));

import { POST } from "./chat";

const call = (body: string) =>
  POST({
    request: new Request("http://localhost/api/chat", {
      method: "POST",
      body,
    }),
  } as never);

describe("POST /api/chat body validation", () => {
  it("answers 400 for a JSON body that is not an object", async () => {
    for (const body of ["null", "3", '"x"', "[]x", "not json"]) {
      const res = await call(body);
      expect(res.status).toBe(400);
    }
  });

  it("answers 400 for an array body without messages", async () => {
    const res = await call("[]");
    expect(res.status).toBe(400);
  });
});
