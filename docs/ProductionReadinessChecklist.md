# Production Readiness Checklist

> [!IMPORTANT]
> Developers must verify all checklist items and provide final sign-off before deploying any application to production.
>
> **Release Rule:** A production deployment is not "ready" simply because the app works. It is ready when security boundaries are enforced server-side, failures are observable, sensitive data is protected, recovery is possible, abuse is controlled, and the deployed application has been tested against real-world attack and failure surfaces.

---

# Part 1: Security, Architecture & Operational Readiness

## 1. Secrets, API Keys & Configuration

- **No secrets in source code:** API keys, database passwords, OAuth secrets, signing keys, private certificates, webhook secrets, encryption keys, and service credentials must never be hardcoded.
- **No secrets in client bundles:** Anything shipped to the browser must be assumed public.
- **No secrets in Git history:** Scan current files and commit history for leaked credentials.
- **Purge compromised Git secrets:** Removing a secret in a subsequent commit is not enough; immediately rotate and revoke the exposed credential.
- **Rotate previously exposed credentials:** Treat leaked secrets as compromised even if the repository was private.
- **Environment-based configuration:** Strictly separate development, staging, and production configurations.
- **Dedicated secret manager:** Use secret management solutions where appropriate; avoid turning `.env` files into an ad-hoc production secret store.
- **Separate production and development credentials:** Developer machines must not have direct access to production secrets.
- **Least privilege for credentials:** Each key or token must only have the permissions strictly required by its workload.
- **Secret rotation procedure:** Define and document a procedure to revoke and replace credentials without application downtime.
- **Audit server environment variables:** Remove unused legacy variables and obsolete credentials.
- **Check CI/CD logs:** Ensure secrets do not appear in build logs, error outputs, or test artifacts.
- **Check crash reports:** Verify that exception traces and serialized request payloads do not contain sensitive tokens or passwords.
- **Check container images:** Ensure secrets are never baked into Docker layers or image metadata.
- **Document public vs. secret variables:** Explicitly document public variables (e.g. `NEXT_PUBLIC_*` in Next.js) versus server-only private variables.

### Supabase-Specific

- **Publishable / Anon key usage:** Use the anon/publishable key only where client exposure is intended; this key is not a substitute for authorization.
- **Never expose the service-role key to the browser:** Elevated keys bypass Row Level Security (RLS) and must strictly remain on trusted server runtimes.
- **Treat RLS as the primary security boundary:** A public client key is acceptable only when database RLS policies are strictly enforced.
- **Audit Data API objects:** Ensure database views and tables exposed through the Data API do not have overly permissive default grants.

---

## 2. Authentication

- **Server-side enforcement:** Authentication must be verified on the server; never rely on client-side route guards alone.
- **Protected API routes:** Every protected API endpoint must independently verify the user's authentication.
- **Server Actions:** Every Server Action must authenticate the caller before executing logic.
- **Background jobs & Webhooks:** Verify authorization/signatures before processing asynchronous tasks.
- **Password hashing:** Use modern, password-specific hashing algorithms (Argon2id preferred; bcrypt/scrypt where appropriate). Plaintext or reversible encryption is strictly forbidden.
- **No passwords in logs:** Passwords and credential fields must be excluded or redacted from telemetry and logs.
- **Rate limiting on login:** Protect authentication endpoints against brute force and credential stuffing.
- **Bot and abuse protection:** Apply CAPTCHA or proof-of-work protections to high-risk public authentication flows.
- **Email verification:** Enforce email verification where required before granting full account privileges.
- **Secure password reset tokens:** Tokens must be cryptographically random, single-use, and short-lived.
- **Session invalidation on password change:** Changing a password or completing a reset must invalidate all other active sessions.
- **Session revocation:** Provide users and administrators with the ability to revoke active sessions.
- **MFA for privileged accounts:** Enforce Multi-Factor Authentication for administrative and elevated roles.
- **Re-authentication for sensitive actions:** Require fresh authentication before critical actions (changing email/password, billing info, role modifications).
- **User enumeration prevention:** Login and password reset responses should not leak whether an email address exists.
- **OAuth / OIDC security:** Strictly allowlist redirect URLs and enforce `state` and PKCE parameters.
- **Token expiration & rotation:** Ensure access tokens are short-lived and refresh tokens rotate on use.

---

## 3. Session & Cookie Security

- **`Secure` attribute:** All session cookies must be sent exclusively over HTTPS.
- **`HttpOnly` attribute:** Prevent JavaScript from reading authentication tokens to mitigate XSS-based token theft.
- **`SameSite` attribute:** Explicitly configure `SameSite=Lax` or `SameSite=Strict` for cookie-based authentication.
- **Scoped domain and path:** Restrict cookie domain and path to the narrowest possible scope.
- **Cookie prefixes:** Use `__Host-` or `__Secure-` prefixes for host-only cookies where applicable.
- **High-entropy session IDs:** Session identifiers must be cryptographically random and unpredictable.
- **Session expiration:** Enforce both absolute session timeouts and idle timeouts.
- **Session rotation on privilege change:** Re-issue session IDs when user privileges change to prevent session fixation.
- **Server-side logout:** Logout must invalidate the session record server-side.
- **No tokens in URLs:** Never pass session tokens or sensitive authentication material in URL query parameters.
- **No sensitive tokens in `localStorage`:** Avoid storing long-lived auth credentials in `localStorage` where XSS can extract them.
- **CSRF protection:** Implement anti-CSRF measures for cookie-authenticated state-changing requests.

---

## 4. Authorization, Row Level Security (RLS) & IDOR Prevention

- **Authentication vs. Authorization:** Verify both who the user is (authentication) and what they are allowed to do (authorization).
- **Server-side ownership verification:** Every request touching a specific resource must verify that the authenticated user owns or has permission to access it.
- **Prevent IDOR (Insecure Direct Object References):** Ensure users cannot manipulate URL IDs, UUIDs, or form parameters to access other users' data.
- **Tenant boundaries:** Multi-tenant systems must strictly enforce organization/tenant boundaries on every database query.
- **Server-side role checks:** Role evaluations (`admin`, `editor`, `member`) must occur in backend code and database policies, never trusting client assertions.
- **Privilege escalation prevention:** Ensure request payloads cannot overwrite protected fields (e.g. `is_admin`, `role`, `verified`, `owner_id`, `created_at`).
- **Mass assignment protection:** Whitelist incoming fields explicitly in schemas/DTOs.
- **RLS on all Supabase tables:** Enable Row Level Security on every single public table.
- **Independent RLS policy testing:** Test `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies separately for each role.
- **Service-role isolation:** Confine service-role client usage to administrative backend routines that cannot be manipulated by untrusted client input.
- **Safe error responses:** Authorization failures must return generic 403/404 responses without leaking resource existence or metadata.

---

## 5. Input Validation & Injection Protection

- **Server-side validation:** Validate all incoming data server-side; client validation is only a UX enhancement.
- **Schema-based validation:** Use schema validation libraries (e.g. Zod) for request bodies, query strings, and headers.
- **Type, length, and range checks:** Restrict numbers to valid bounds, strings to maximum lengths, and enumerations to allowed values.
- **Parameterized SQL queries:** Never concatenate untrusted strings into database queries; use parameterized ORMs or prepared statements.
- **SQL / NoSQL / Command injection:** Test and eliminate all vectors for query or command execution vulnerabilities.
- **Path traversal prevention:** Sanitize file paths and filenames; do not allow `../` or absolute path inputs.
- **Server-Side Request Forgery (SSRF) protection:**
  - Whitelist allowed outbound URL destinations.
  - Block requests to private/internal network ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, cloud metadata services `169.254.169.254`).
  - Enforce strict request timeouts and maximum response size limits.

---

## 6. XSS, HTML & Content Sanitization

- **Context-aware escaping:** Ensure framework-level auto-escaping is active for all dynamic output.
- **Audit raw HTML rendering:** Review every instance of `dangerouslySetInnerHTML` or equivalent raw HTML insertion.
- **Sanitize user-provided HTML:** Use robust sanitization libraries (e.g. DOMPurify) if user rich-text is required.
- **Sanitize Markdown:** Do not render raw Markdown as HTML without sanitizing the resulting markup.
- **Prevent injection into script/style tags:** Never interpolate untrusted variables directly into inline `<script>` or `<style>` blocks.
- **Content Security Policy (CSP):** Configure a restrictive CSP header to prevent unauthorized script execution and resource loading.

---

## 7. File Upload Security

- **Allowed file types:** Restrict uploads to an explicit whitelist of required MIME types and extensions.
- **Magic byte validation:** Validate file signatures (magic bytes) server-side rather than trusting the file extension alone.
- **File size limits:** Enforce strict maximum upload and request body size limits.
- **Image dimension validation:** Prevent decompression/archive bombs by limiting pixel dimensions.
- **Filename sanitization:** Generate random, unique filenames (e.g. UUIDs) rather than using user-submitted names.
- **Non-executable storage:** Store user uploads in dedicated storage buckets outside executable application paths.
- **Private bucket controls:** Store private documents in access-restricted buckets and serve them via short-lived signed URLs.
- **Malware scanning:** Scan uploaded files when the threat model requires it.
- **Rate limit uploads:** Apply strict rate limits to upload endpoints to prevent storage exhaustion attacks.

---

## 8. API Security & Rate Limiting

- **Endpoint-specific rate limits:** Apply specialized rate limits for sensitive operations (login, register, password reset, search, file uploads, AI endpoints).
- **Payload size limits:** Restrict request body sizes at the reverse proxy / server level.
- **Pagination limits:** Enforce maximum page sizes to prevent unbounded database queries.
- **Data minimization:** Return only fields required by the client; never dump entire database rows containing internal metadata or tokens.
- **Consistent error responses:** Avoid exposing raw stack traces, database schema errors, or internal hostnames in production responses.
- **Idempotency:** Implement idempotency keys for financial transactions and critical state-modifying operations to prevent duplicate execution on retry.

---

## 9. CORS, CSRF & Browser Headers

- **Explicit CORS configuration:** Restrict `Access-Control-Allow-Origin` to trusted origins; never use wildcard `*` with credentials.
- **HTTP Methods & Headers:** Whitelist only allowed methods (`GET`, `POST`, etc.) and headers.
- **CSRF defenses:** Implement SameSite cookies and CSRF tokens for state-modifying requests.
- **HSTS (Strict-Transport-Security):** Enforce `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- **Security Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` or `frame-ancestors 'none'`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (restrict unused browser APIs like camera, microphone, geolocation)
- **Cache-Control for sensitive data:** Ensure authenticated and sensitive endpoints return `Cache-Control: no-store, max-age=0`.

---

## 10. Database Integrity & Performance

- **Database constraints:** Enforce `NOT NULL`, `FOREIGN KEY`, `UNIQUE`, and `CHECK` constraints at the schema level.
- **Atomic transactions:** Wrap multi-step dependent mutations in database transactions.
- **Indexing strategy:** Add indexes for frequent query, filter, sort, and foreign-key join columns.
- **Query performance:** Monitor and optimize slow queries; eliminate N+1 query patterns.
- **Connection pooling:** Use connection poolers (e.g. Supabase Transaction Pooler / PgBouncer) to manage connection limits efficiently.
- **Migration & rollback plans:** Test schema migrations forward and backward before production execution.

---

## 11. Encryption & Data Protection

- **TLS / HTTPS:** Enforce TLS 1.2+ for all external and internal microservice communications.
- **Encryption at rest:** Verify that database storage, object storage, and backups are encrypted at rest.
- **Separation of keys:** Store encryption keys in dedicated key management vaults, separate from encrypted payloads.
- **Data retention policy:** Define retention timelines and automate secure deletion of expired personal data.
- **Log scrubbing:** Automatically sanitize logs to prevent recording sensitive PII, tokens, or payment data.

---

## 12. Logging, Monitoring & Observability

- **Structured logging:** Log events in JSON format with ISO timestamps, log levels, and request/trace IDs.
- **Audit logging:** Record all administrative actions, authentication attempts, permission changes, and sensitive data exports.
- **Error tracking:** Integrate real-time error tracking (e.g. Sentry) to capture unhandled exceptions and promise rejections.
- **Metrics monitoring:** Monitor API latency (p50, p95, p99), error rates (4xx, 5xx), database connection counts, and CPU/memory utilization.
- **Alerting thresholds:** Configure immediate alerts for error rate spikes, service outages, and repeated authentication failures.

---

## 13. Backup, Disaster Recovery & High Availability

- **Automated daily backups:** Verify that automated database and storage backups are active and verified.
- **Tested restoration procedure:** Perform a manual restoration drill to prove backups are functional.
- **Point-in-Time Recovery (PITR):** Enable PITR where business continuity requires it.
- **RTO & RPO definition:** Document Recovery Time Objective and Recovery Point Objective.
- **Disaster recovery runbook:** Document step-by-step procedures for complete environment recreation.

---

## 14. Frontend Production Quality & Build

- **Production build verification:** Test production builds (`pnpm build` / `npm run build`) with zero type errors or warnings.
- **Bundle size optimization:** Inspect bundle analysis to eliminate bloated, duplicate, or unused libraries.
- **Tree-shaking & Code splitting:** Verify dynamic imports for heavy components (charts, rich-text editors, modals).
- **Clean console:** Remove all `console.log`, debug banners, and development mocks from production bundles.
- **Source maps:** Do not publish unprotected public source maps that expose proprietary backend structure.

---

## 15. SEO, Social Sharing & Discoverability

- **Unique `<title>` and `<meta name="description">`:** Every public indexable page has meaningful, unique titles and descriptions.
- **Canonical URLs:** Self-referencing canonical tags on all indexable routes to prevent duplicate content indexing.
- **Open Graph & Twitter Cards:** Configured `og:title`, `og:description`, `og:image`, and Twitter card tags.
- **`robots.txt` and `sitemap.xml`:**
  - `robots.txt` allows search engines to crawl public content while disallowing admin/private routes.
  - `sitemap.xml` includes all canonical, indexable public URLs.
- **Favicon & Web App Icons:** Complete set of modern favicons (`favicon.ico`, `icon.png`, `apple-touch-icon.png`, `site.webmanifest`).
- **Semantic Headings:** Exactly one `<h1>` per page with a logical heading hierarchy (`<h2>`, `<h3>`).
- **Structured Data:** Valid JSON-LD schema (Organization, Article, Event, BreadcrumbList) matching page contents.

---

## 16. Accessibility (a11y) & UX Polish

- **Keyboard navigability:** All interactive components (menus, dialogs, buttons, forms) must be fully usable via keyboard (`Tab`, `Enter`, `Space`, `Esc`).
- **Visible focus states:** Clear, high-contrast focus rings on all focusable elements.
- **Accessible form controls:** Every input has an associated `<label>` or `aria-label`.
- **Color contrast:** Text meets WCAG 2.1 AA contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text).
- **Touch targets:** Minimum tap target size of 44×44px on mobile devices with `touch-manipulation`.
- **Screen reader announcements:** Dynamic state updates and errors are announced using `aria-live` or accessible error descriptions.
- **Reduced motion:** Respect `prefers-reduced-motion` media queries for animations and carousel transitions.

---

# Release Classification

### 🔴 P0 — Release Blockers (Must fix before launch)

- Authentication bypass or broken session management
- Authorization / IDOR / RLS bypass vulnerability
- Exposed secret keys (e.g. Supabase service-role key, database credentials)
- SQL injection, command injection, or stored XSS
- Critical data loss or database corruption risks
- Application crash on primary user journeys
- Broken backup or recovery infrastructure

### 🟡 P1 — High Priority (Fix before broad release)

- Inadequate rate limiting on sensitive endpoints
- Missing CSRF protection on state-changing operations
- Unsafe file upload validation
- Missing security headers (HSTS, CSP, X-Content-Type-Options)
- Excessive API data exposure (over-fetching internal columns)
- Missing audit logging for critical administrative actions
- Broken rollback or migration strategy

### 🟢 P2 — Production Quality Polish

- Minor SEO metadata refinements
- Structured data enhancements
- Secondary cache optimizations
- Accessibility enhancements
- Bundle size optimizations and micro-animations

---

## The Five Release-Blocking Questions

Before shipping to production, you must be able to answer **YES** to all five questions:

1. **Can an unauthenticated attacker access anything they shouldn't?** _(No unauthorized access)_
2. **Can an authenticated user view or modify another user's or tenant's private data?** _(No IDOR / cross-tenant leakage)_
3. **Can a standard user perform an administrative or elevated action?** _(Strict role separation)_
4. **If production fails at 3 AM, will we know immediately and can we recover?** _(Observability & backups)_
5. **If a credential or account is compromised, do we have a documented procedure to revoke it and contain damage?** _(Incident readiness)_

---

# Part 2: Visual & Functional Testing

## 1. Application-Wide Smoke Test

- Open the application in a fresh, incognito browser window.
- Verify that the app loads cleanly without blank screens, hydration errors, or visual flicker.
- Inspect the browser console to confirm zero uncaught JavaScript errors or network failures.
- Verify fonts, images, and SVG icons load with correct dimensions and no broken assets.
- Test browser navigation: Back, Forward, Hard Reload (`Ctrl+F5`), and opening links in new tabs.

## 2. Full Navigation Audit

- Test top navigation bar, footer links, dropdown menus, and mobile drawer menus.
- Verify that active route indicators update properly across navigation transitions.
- Verify that clicking unauthorized routes redirects unauthenticated users to login with return URLs.
- Verify external links use `rel="noopener noreferrer"` and open in appropriate contexts.

## 3. Route-by-Route Testing

- Test every public and protected route by direct URL entry.
- Test dynamic route parameters with valid IDs, non-existent IDs, and malformed strings.
- Verify that route-level loading skeletons, empty states, and 404/500 error boundaries render correctly.

## 4. Authentication Flow Journey

- Test user registration: validate field errors, duplicate email rejection, and success confirmations.
- Test login: verify invalid password rejection, loading indicators, and redirect to destination.
- Test logout: verify complete cache clearance and ensure back-button navigation does not expose protected data.
- Test password reset: verify token expiration, single-use enforcement, and session invalidation.

## 5. CRUD Operations Testing

- **Create:** Validate required fields, maximum lengths, duplicate prevention, and instant UI updates.
- **Read:** Verify list filtering, sorting, pagination, search queries, and empty states.
- **Update:** Verify form pre-population, validation, optimistic updates, and persistent state on reload.
- **Delete:** Verify confirmation modal, cancellation behavior, deletion execution, and UI removal.

## 6. Forms, Buttons & Interactive Elements

- Verify disabled states and loading spinners during asynchronous form submission.
- Prevent double-click duplicate form submissions.
- Test keyboard interactions: `Enter` to submit, `Esc` to close dialogs, `Tab` for focus progression.
- Verify that validation error messages clearly explain how to fix invalid inputs.

## 7. Multi-User & Tenant Data Isolation Test

- Log in as **User A**: create private records and notes.
- Log in as **User B** (separate incognito profile): verify User B cannot view, edit, or delete User A's data.
- Attempt manual URL parameter manipulation with User A's IDs while logged in as User B; verify `403 Forbidden` or `404 Not Found`.

## 8. Mobile & Responsive Real-Device Testing

- Test layout at 320px, 375px (iPhone SE), 390px (iPhone), 768px (iPad), and 1920px (Desktop).
- Verify that navigation switches to a responsive mobile drawer or bottom sheet.
- Test on-screen mobile keyboard behavior to ensure inputs are not obscured.
- Verify touch targets are at least 44×44px with comfortable spacing.

## 9. Dark Mode & Theme Consistency

- Test both light and dark modes across all views.
- Ensure all text, icons, card borders, and chart legends maintain high contrast in both themes.
- Verify that theme preference persists across page reloads and browser sessions.

## 10. Network Failure & Degradation Testing

- Simulate slow 3G / offline network conditions using browser DevTools.
- Verify that API timeouts and connection drops display graceful retry banners instead of crashing.
- Verify that long-running operations show clear progress and can be retried safely.

---

# Final Pre-Launch Sign-Off

- [ ] All P0 security blockers resolved and verified
- [ ] Row Level Security (RLS) active and tested on all database tables
- [ ] Production environment variables and secrets verified
- [ ] Automated database backups confirmed operational
- [ ] Error monitoring (e.g. Sentry) and health checks active
- [ ] Responsive UI verified across mobile, tablet, and desktop viewports
- [ ] Clean production build (`pnpm build`) with 0 type errors
- [ ] End-to-end user journeys tested from a fresh browser session
