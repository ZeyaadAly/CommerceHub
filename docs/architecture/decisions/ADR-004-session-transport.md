# ADR-004 — Opaque session lifecycle and cookie/CSRF transport

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Security + Backend/Frontend/Product; named individual/signature NOT RECORDED.
Gate: SEC-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-03 AUTH; CH-11 ACCOUNT and protected browser mutations. Sources: architecture §6, database §§4/16, API §§2/4/8.3, UX account/staff flows; BA-14.

Argon2id credentials, opaque revocable HttpOnly sessions, Secure production cookies, independent staff/customer audiences, expiry/rotation/revocation and CSRF/origin checks are established constraints. CommerceHub does not adopt Supabase Auth by discussing Supabase-hosted PostgreSQL.

## Options and trade-offs

A: same-origin reverse proxy: simpler browser origin model, but proxy trust and routing/cookie scope must be explicit. B: server BFF forwarding per request: hides upstream cookies, but adds session translation, cache isolation and CSRF responsibilities. C: approved API-origin host-only cookies: fewer proxy layers, but browser credentials, CORS, SameSite and deployment domains require a real browser proof. Idle-plus-absolute expiry vs shorter fixed sessions trades usability for replay exposure; no duration chosen.

## Recommendation and owner decision

Prepare an origin/cookie threat model and later separately authorized browser proof comparing A/B/C before choosing transport. Require customer/staff audience separation and rotation/revocation on sensitive events for every option. No blanket recommendation selects BFF without approved origins and operations evidence.

## Security and operational effects

Owner must specify cookie name/path/domain/SameSite, CSRF binding and Origin/Referer behavior, trusted proxy handling, session/token TTLs, reauthentication/rates and failure/non-enumeration rules. Logout/password reset/staff disable must invalidate server authority, not only browser state. Never expose session secrets to JS storage or logs.

## API and database effects

Resolve staff login/audience negotiation, invitation acceptance, display-name and verified email-change gaps under API-01 before their DTOs. Define digest/session expiry/revocation data mappings under DB reviews. Existing C credentials configuration and server entrypoint do not implement CSRF, cookies or forwarding and must not be relabeled complete auth.

## Evidence, approval and reversal

Security names an accountable reviewer and supplies the selected origin diagram, lifecycle/event table and denial matrix; later browser tests cover malicious origins, missing/replayed CSRF, rotation, fixation, revoked sessions, audience crossing and cache isolation. Reopen on origin/hosting/session changes; no PoC executed here.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).
