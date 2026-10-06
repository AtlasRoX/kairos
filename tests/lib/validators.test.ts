import { describe, it } from "node:test";
import assert from "node:assert";
import { isValidEmail, isValidPassword, isValidProjectName } from "../../lib/validators";

describe("Validator Helper Suite", () => {
  it("validates correct and incorrect email addresses", () => {
    assert.strictEqual(isValidEmail("test@example.com"), true);
    assert.strictEqual(isValidEmail("invalid-email"), false);
  });

  it("checks password length", () => {
    assert.strictEqual(isValidPassword("securePass123"), true);
    assert.strictEqual(isValidPassword("short"), false);
  });

  it("checks project name length", () => {
    assert.strictEqual(isValidProjectName("Kairos System"), true);
    assert.strictEqual(isValidProjectName("x"), false);
  });
});
