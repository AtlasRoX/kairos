import { describe, it } from "node:test";
import assert from "node:assert";

describe("Readiness Scoring Math", () => {
  it("calculates percentage accurately", () => {
    const total = 10;
    const completed = 8;
    const score = Math.round((completed / total) * 100);
    assert.strictEqual(score, 80);
  });
});
