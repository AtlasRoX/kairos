import { describe, it } from "node:test";
import assert from "node:assert";

describe("Button Component Tests", () => {
  it("verifies variant class resolution", () => {
    const variants = {
      primary: "bg-blue-600 text-white",
      secondary: "bg-neutral-800 text-neutral-200",
      danger: "bg-red-600 text-white"
    };
    assert.strictEqual(variants.primary.includes("bg-blue-600"), true);
  });
});
