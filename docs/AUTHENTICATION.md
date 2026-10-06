# Authentication Specification

## Session Mechanism
Kairos uses HTTP-only cookie-based session management to ensure security against XSS vulnerabilities.

## Flow
1. **Signup**: Validates email uniqueness and hashes password with SHA-256 or bcrypt.
2. **Login**: Verifies credentials and generates a secure session token stored in an `httpOnly, secure, sameSite=lax` cookie.
3. **Session Verification**: The `lib/auth.ts` helper reads and validates session cookies on every protected API endpoint and server action.
4. **Logout**: Clears the session cookie with max-age 0.
