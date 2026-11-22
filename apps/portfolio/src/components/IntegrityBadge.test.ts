import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const health = vi.hoisted(() => ({ status: "OPERATIONAL" }));

vi.mock("@aazucena/hooks", () => ({
  useSystemStatus: () => ({ status: health.status, baseUrl: "" }),
}));
vi.mock("@aazucena/context", () => ({
  TelemetryProvider: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("@aazucena/ui", () => ({
  Badge: ({ children }: { children: ReactNode }) => children,
}));

import { IntegrityBadge } from "./IntegrityBadge";

const render = (status: string) => {
  health.status = status;
  return renderToStaticMarkup(createElement(IntegrityBadge));
};

describe("IntegrityBadge", () => {
  it("shows a known status", () => {
    expect(render("OPERATIONAL")).toContain("System: Nominal");
  });

  it("shows No Signal while the health route reports maintenance", () => {
    expect(render("MAINTENANCE")).toContain("System: No Signal");
  });

  it.each(["SOMETHING_NEW", "constructor"])(
    "falls back to the unknown status for %s",
    (status) => {
      expect(render(status)).toContain("System: Offline");
    },
  );
});
