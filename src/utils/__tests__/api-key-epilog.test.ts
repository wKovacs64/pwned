import { describe, it, expect } from "vitest";
import { apiKeyEpilog } from "../api-key-epilog.js";

describe("util: apiKeyEpilog", () => {
  it("names a single plan", () => {
    expect(apiKeyEpilog("Pro")).toContain("from a Pro plan.");
  });

  it("names two plans", () => {
    expect(apiKeyEpilog("Pro", "High RPM")).toContain(
      "from a Pro or High RPM plan.",
    );
  });

  it("names three plans", () => {
    expect(apiKeyEpilog("Core", "Pro", "High RPM")).toContain(
      "from a Core, Pro, or High RPM plan.",
    );
  });
});
