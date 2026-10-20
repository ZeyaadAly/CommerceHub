# CommerceHub local development

CH-P0-003 provides toolchain scaffolds only. The storefront and administration
pages are placeholders; the API exposes static `GET /health`. No database,
authentication, commerce workflow or external service is configured.

## Toolchain

Use Node.js 24.19.0 (the verified installed LTS runtime) and pnpm 11.28.6.
The root `packageManager` field pins pnpm; all direct dependencies are exact pins.
On Windows, use `.cmd` launchers if PowerShell blocks script launchers.

Install pnpm with your normal supported package-manager setup. For a local-only
installation, without changing global tools:

```powershell
npm.cmd install --prefix .tools --no-package-lock --no-save pnpm@11.28.6
$env:PATH = "$PWD\.tools\node_modules\.bin;$env:PATH"
pnpm.cmd --version
```

The native pnpm 12.14.0 executable was blocked by this machine's Device Guard.
The published JavaScript pnpm 11 line supports Node >=22.13 and works here.
Do not change device policy to run this project.

## Install and check

```sh
pnpm install
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm test
```

`pnpm test` uses Node's test runner and the TypeScript compiler API. Build first:
it checks emitted shared entrypoints as well as strict compiler rejection cases
and workspace dependency/import boundaries. `skipLibCheck` skips third-party
library declaration internals; strict checks remain enabled for project source.

Code quality tooling is provided by CH-P0-004: run `pnpm lint`, `pnpm format:check`,
and `pnpm test:quality`. `pnpm install` initializes the local pre-commit hook. See
[the code quality guide](docs/development/code-quality.md) for policy, fixes and
workspace commands. CI remains CH-P0-005.

## Run locally

No environment file is required for development defaults. The root `.env.example`
indexes safe app-scoped templates. See the [Docker-free setup and environment
ownership guide](docs/development/docker-free-setup.md) for configuration precedence,
optional template setup, security boundaries and Windows troubleshooting. Never put
database or provider credentials in frontend environments.

Run these in separate terminals, with pnpm available on PATH:

```sh
pnpm dev:storefront
pnpm dev:admin
pnpm dev:api
```

Or use `pnpm dev` for all three. Stop with Ctrl+C. Each listener binds to loopback.
With the three apps running, `pnpm test:smoke` checks their actual HTTP responses
and API unknown-route/unsupported-method cases.

| Application | URL                          | Production build startup                    |
| ----------- | ---------------------------- | ------------------------------------------- |
| Storefront  | http://localhost:3000/       | pnpm --filter @commercehub/storefront start |
| Admin       | http://localhost:3001/       | pnpm --filter @commercehub/admin start      |
| API         | http://localhost:3002/health | pnpm --filter @commercehub/api start        |

After startup, PowerShell HTTP probes are:

```powershell
Invoke-WebRequest http://localhost:3000/ -UseBasicParsing
Invoke-WebRequest http://localhost:3001/ -UseBasicParsing
Invoke-WebRequest http://localhost:3002/health -UseBasicParsing
```

The first two return placeholder HTML; health returns `{"status":"ok"}`.
Health is a scaffold liveness response, not dependency readiness or a completed
CH-P0-011 API contract. The API defaults to port 3002 in development/test;
an optional API-only `PORT` override is validated. `NODE_ENV=production` requires
an explicit port, without granting deployment authority.

## Workspace boundaries

```text
apps/storefront   Next.js App Router + React + Tailwind, port 3000
apps/admin        Next.js App Router + React + Tailwind, port 3001
apps/api          NestJS + Express, port 3002
packages/ui       Empty presentation package boundary
packages/types    Empty public compile-time contract boundary
packages/validation Empty browser-safe validation boundary
packages/api-client Empty typed transport boundary
```

No workspace currently depends on another workspace. Recursive pnpm commands
respect dependency order when approved workspace dependencies are introduced;
root builds run serially to bound local resource use. Packages emit ESM and type
declarations; Next.js apps use bundler resolution, and Nest uses CommonJS with
decorator metadata. All inherit `tsconfig.base.json` strictness. No Turbo is needed.

Types/validation must not depend on their consumers. Packages never import apps.
Frontend and shared code must not import Nest/Prisma/database internals. The
scaffold graph check covers literal imports, exports, require and dynamic imports;
computed imports fail the check. This is a foundation check, not the full future
architecture lint policy.

Version selection, official compatibility sources, verification results and
limitations are recorded in [CH-P0-003 evidence](docs/verification/CH-P0-003.md).
All eight planning documents and AGENTS instructions remain authoritative.

Integration retains the earlier architecture suite: `pnpm test` runs the seven existing
scaffold checks and the CH-P0-004 tooling/isolated-hook tests. `pnpm check:architecture` runs the original
three checks independently. Historical D: evidence is preserved separately; see
[finalization](docs/verification/CH-P0-003-integration.md).
