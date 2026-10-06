/**
 * Data and Input Validation Helpers
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}

export function isValidProjectName(name: string): boolean {
  return typeof name === "string" && name.trim().length >= 3 && name.trim().length <= 100;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}
