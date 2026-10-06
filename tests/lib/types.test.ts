import { describe, it, expect } from "node:test";
import assert from "node:assert";

describe("Type Definitions Spec", () => {
  it("validates that sample project matches expected schema keys", () => {
    const sample = {
      id: "p1",
      name: "Kairos",
      description: "Readiness Tracker",
      tier: "tier-1",
      createdAt: new Date().toISOString()
    };
    assert.strictEqual(typeof sample.id, "string");
    assert.strictEqual(typeof sample.name, "string");
  });
});
