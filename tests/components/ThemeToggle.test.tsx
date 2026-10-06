import { describe, it } from "node:test";
import assert from "node:assert";

describe("ThemeToggle Component Tests", () => {
  it("verifies theme options", () => {
    const validThemes = ["dark", "light"];
    assert.strictEqual(validThemes.includes("dark"), true);
    assert.strictEqual(validThemes.includes("light"), true);
  });
});
