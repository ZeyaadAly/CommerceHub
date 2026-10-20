# Docker-free Windows setup and environment ownership

CH-P0-006 limited preparation only. The [owner decision](../implementation/CH-P0-006-container-free-decision.md)
removes mandatory Docker Desktop, WSL 2 and Compose. Node runs the three scaffold
applications; no database, cache, worker or cloud account is needed for these steps.
This guide does not authorize deployment or service provisioning.

## Install and start

Use the existing pinned **Node 24.19.0**, **pnpm 11.28.6** and lockfile. Check
`node --version` and `pnpm.cmd --version`. Use the repository's documented compatible
toolchain; do not upgrade dependencies or install global workarounds. The local
checkout path can differ between contributors; run commands from its root.

```powershell
pnpm.cmd install --frozen-lockfile
```

No environment file is needed for development defaults. Optional setup, only when
the destination does not already exist (never overwrite a contributor's file):

```powershell
if (!(Test-Path apps/api/.env)) { Copy-Item apps/api/.env.example apps/api/.env }
if (!(Test-Path apps/storefront/.env.local)) { Copy-Item apps/storefront/.env.example apps/storefront/.env.local }
if (!(Test-Path apps/admin/.env.local)) { Copy-Item apps/admin/.env.example apps/admin/.env.local }
```

The frontend templates contain comments only. The API template contains nonsecret
local port/mode examples, not credentials. This task does not create contributor
environment files. Restart after editing configuration, including API `.env`.

Run each application in a separate PowerShell terminal at the repository root:

```powershell
pnpm.cmd dev:storefront
pnpm.cmd dev:admin
pnpm.cmd dev:api
```

Or use `pnpm.cmd dev` for all three. Stop task-owned processes with Ctrl+C.

| Application | Loopback URL                 | Expected result                      | Built startup after `pnpm.cmd build`              |
| ----------- | ---------------------------- | ------------------------------------ | ------------------------------------------------- |
| Storefront  | http://127.0.0.1:3000/       | 200, storefront placeholder HTML     | `pnpm.cmd --filter @commercehub/storefront start` |
| Admin       | http://127.0.0.1:3001/       | 200, administration placeholder HTML | `pnpm.cmd --filter @commercehub/admin start`      |
| API         | http://127.0.0.1:3002/health | 200, `{"status":"ok"}`               | `pnpm.cmd --filter @commercehub/api start`        |

All bind to `127.0.0.1`; no configurable external bind address is added. The health
response is process liveness only, not dependency readiness. Unknown API routes
and `POST /health` remain 404. No CORS, cookie/session transport or auth policy is added.

```powershell
Invoke-WebRequest http://127.0.0.1:3000/ -UseBasicParsing
Invoke-WebRequest http://127.0.0.1:3001/ -UseBasicParsing
Invoke-RestMethod http://127.0.0.1:3002/health
pnpm.cmd test:smoke
```

The existing smoke command expects the three default ports. For an optional API
port override, set `$env:PORT = '31002'` only in the API terminal, run
`pnpm.cmd dev:api`, and probe that port explicitly. Remove the override with
`Remove-Item Env:PORT` afterward. Do not run the default-port smoke command against
an overridden port and report success.

## Actual consumers and precedence

Application source inventory before this phase found **no environment-variable
consumers**. Ports were hardcoded in package scripts/API main. This phase adds
only `PORT` and `NODE_ENV` reads in API-owned `src/config.ts`, called before Nest
initialization. No shared configuration library, public URL contract or dependency
is introduced. No existing variable name is renamed.

| Variable/category                   | Consumer and classification                                                             | Required/default and precedence                                                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                              | API only; backend-only, nonsecret development/runtime setting                           | Optional in development/test, default 3002. Required in production. Explicit value must be canonical decimal integer 1-65535; empty/whitespace/zero values fail. |
| `NODE_ENV`                          | API config and Node/framework runtime; nonsecret mode                                   | API accepts development/test/production; absent means development. No blank/unknown mode fallback. Next sets its own mode; leave it out of frontend templates.   |
| Public frontend configuration       | None currently consumed                                                                 | No `NEXT_PUBLIC_` setting or public API URL is required. Invalid public URL validation is NOT APPLICABLE until a real consumer is approved.                      |
| Application secrets                 | None currently consumed                                                                 | Do not add database/cache/session/payment variables to enable unimplemented features.                                                                            |
| Test-only application configuration | None beyond `NODE_ENV=test` and isolated test port overrides                            | Tests use synthetic markers and temporary files; no service credentials.                                                                                         |
| `SCAN_BASE`                         | `scripts/secret-scan.mjs`; nonsecret tooling input                                      | Optional full commit SHA; absent scans tracked and unignored files. CI supplies the PR base SHA. Invalid SHA fails closed.                                       |
| `NEXT_TELEMETRY_DISABLED`           | Next tooling; nonsecret opt-out                                                         | Existing CI sets `1`; optional locally. Not an application or secret contract.                                                                                   |
| `PATH`, `ComSpec`                   | Existing hook test process environment and audit command launcher; nonsecret OS tooling | Process environment; audit uses `cmd.exe` if Windows `ComSpec` is absent. Never log the inherited environment.                                                   |
| Synthetic test marker keys          | Configuration/redaction and bundle verification harness only                            | Fake values, never required at application startup, not published contracts.                                                                                     |

Packages `ui`, `types`, `validation` and `api-client` are still inert and read no
environment variables. Infrastructure contains documentation only. Shell/runtime
variables used internally by Node, pnpm, Next, Git and Husky are tool controls, not
new CommerceHub application configuration.

API package scripts run from `apps/api` and use the pinned Node's native
`--env-file-if-exists=.env` support (also forwarded by tsx watch). Priority is
inherited process environment, then `apps/api/.env`, then validated development/test
defaults. No root `.env`, `.env.local`, production-specific file or automatic service
fallback is loaded by API code. Node may print a missing optional-file notice.
Only a configuration field name is reported for invalid values; errors never echo
supplied values. A port collision exits startup with a generic failure; fix the
conflict rather than expecting automatic retry on another port.

Next owns its existing per-application file loading: `process.env`,
`.env.$NODE_ENV.local`, `.env.local` (except test), `.env.$NODE_ENV`, `.env`, in that
order. The package CLI's explicit port and host remain authoritative; `PORT` in a
frontend env file does not override these commands. The root example is an index
and is never a second application configuration contract.

Official references: [Node 24.19.0 native env-file options](https://nodejs.org/download/release/v24.19.0/docs/api/cli.html#--env-filefile),
[Next environment load order and public inlining](https://nextjs.org/docs/app/guides/environment-variables).
Pins remain unchanged; [003 toolchain evidence](../verification/CH-P0-003.md)
records compatibility selection.

## Secret boundaries and deferred integrations

All actual `.env`/`.env.*` files are ignored; `.env.example` remains visible in
each app and at root. Inspect with `git check-ignore --no-index` before creating
local settings. Never commit credentials, paste them into logs, add them to
`next.config` `env`, or prefix them `NEXT_PUBLIC_`: those values can enter browser
bundles. Neither browser nor Next.js server may hold DB/cache/provider credentials.
Only API and future trusted workers may receive separately approved backend secrets.

No production endpoint or credential is needed for build/tests/startup. The scanner
is a bounded signature check, not proof that arbitrary secrets cannot leak. Review
diffs, templates, logs and client output as well. Configuration tests use synthetic
values to verify error redaction. Keep the protected `commercehub-quality` workflow,
scanner and existing advisory exception unchanged (review 2026-10-26; expiry
2026-11-02T00:00:00Z; no automatic renewal).

PostgreSQL/Prisma, Redis/BullMQ and real isolated integration tests remain required
by the architecture when their owning modules exist. They are deliberately absent
here: no client, schema, migration, worker or connection probe is installed or run.
Connection/auth/TLS/unavailable-service tests remain BLOCKED without approved
isolated resources and future integrations. Liveness cannot discharge them.

Before later service work, obtain explicit owner approval for target identity,
disposability, roles/ACLs, verified TLS, Redis/BullMQ capability compatibility,
cost/lifecycle and scoped teardown. Native Windows PostgreSQL or reviewed hosted
isolation are options, not selections. CI may later use reviewed isolated Linux
service containers without requiring workstation Docker; it currently has none.
Do not reset shared or production data, flush shared caches or presume an existing
project is disposable. Migrations remain later CH-P0-010 work. All specialist gates,
including OPS-01 for shared infrastructure, remain OPEN.

## Windows troubleshooting and verification

- If PowerShell blocks `.ps1` launchers, use `pnpm.cmd`; do not disable execution
  policy globally. If pnpm is not on PATH, use an existing compatible local install
  in the current terminal. On the verified checkout, `.tools/node_modules/.bin`
  contains pnpm 11.28.6; this path is optional local tooling, not committed setup.
- An engine-strict failure means the active Node/pnpm does not match the pins.
  Check executable resolution with `Get-Command node,pnpm.cmd`; do not bypass engines.
- For occupied ports, inspect `Get-NetTCPConnection -LocalPort 3000,3001,3002`
  where available. Stop only your own listener or use the API port override;
  never kill an unknown process. CLI-bound Next ports remain fixed.
- Invalid API `PORT`/`NODE_ENV` fails before Nest starts. Check field format and
  shell precedence without printing values; empty is invalid, absent is optional
  only in development/test. tsx watch may wait for edits after a failed child;
  use built startup for a direct exit-code check.
- If `.env` edits appear ignored, inspect the API shell override and app working
  directory, then restart. Frontends have no application settings to consume yet.
- If startup reports missing build output, run `pnpm.cmd build`. If disk, file
  permissions or child-process restrictions prevent checks, record the actual
  failure. Do not change the lockfile or weaken security checks to make it green.

Run `pnpm.cmd format:check`, `lint`, `typecheck`, `build`, `test`, `test:quality`,
`test:ci`, `audit:ci`, `scan:secrets`, then `git diff --check` (each pnpm command
uses the same `pnpm.cmd` prefix). Build before tests: existing shared-package export
tests and the new configuration tests load compiled artifacts. With all three
listeners running, run `pnpm.cmd test:smoke`. [Limited-phase evidence](../verification/CH-P0-006-limited.md)
distinguishes observed application checks from deferred real-service acceptance.
