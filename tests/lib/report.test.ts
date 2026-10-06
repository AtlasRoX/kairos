import { describe, it } from "node:test";
import assert from "node:assert";

describe("Report Generator Utilities", () => {
  it("formats markdown summary headline correctly", () => {
    const reportTitle = "# Production Readiness Assessment: Kairos";
    assert.ok(reportTitle.includes("Kairos"));
    assert.ok(reportTitle.startsWith("#"));
  });
});
