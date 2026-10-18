# CommerceHub

CH-P0-003 establishes the local workspace only: two independent Next.js applications,
a NestJS static health endpoint, and four empty shared-package boundaries. Commerce,
authentication, database access and deployment are not implemented.

## Requirements and installation

Use Node.js **24.22.0** (the Node 24 LTS line, pinned in `.node-version`) and
pnpm **12.14.0** (pinned in `packageManager`). Enable/install that pnpm version using
your normal local tool manager; this repository does not install global tools.

```sh
node --version
pnpm --version
pnpm install
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm test
```

The first install resolves the committed exact direct dependencies; frozen installs
must preserve `pnpm-lock.yaml`. All seven workspaces inherit strict TypeScript,
unchecked-index checking and exact optional-property types. Third-party declaration
checking is skipped; first-party source remains strictly checked.

## Development and independent startup

Run each command in its own terminal, or use `pnpm dev` to start all three:

| Application | Development | Built application | Local URL |
|---|---|---|---|
| Storefront | `pnpm dev:storefront` | `pnpm --filter @commercehub/storefront start` | http://localhost:3000 |
| Admin | `pnpm dev:admin` | `pnpm --filter @commercehub/admin start` | http://localhost:3001 |
| API | `pnpm dev:api` | `pnpm --filter @commercehub/api start` | http://localhost:3002/health |

Next.js uses its default supported Turbopack build/dev mode. `agentRules: false`
prevents the framework from modifying the repository's approved AGENTS files.
Next.js development includes normal refresh support. API `dev` compiles once
then starts Node; restart it after editing TypeScript. A full API watch/tooling setup
is outside this minimal bootstrap. Run `pnpm build` before the built-app commands.
All servers bind to loopback. Stop your own foreground servers with Ctrl+C.

If port 3000 is occupied, run
`pnpm --filter @commercehub/storefront dev --port 3100` (or `start --port 3100`
after building). Verification used http://127.0.0.1:3100 because an unrelated
application occupied 3000; that application's process was left untouched.

The API returns `{"status":"ok"}` from `/health`; it needs no database, Redis or
other application. The frontends are static Server Components with no API requests,
external fonts, credentials or client state. Their placeholder pages are deliberately
not indexed. No environment file is needed; `.env.example` documents safe optional
process configuration. PORT overrides apply to the API process, not Next's fixed
script ports. Never add real credentials to examples.

## Workspace boundaries

```text
apps/storefront       Next.js App Router / React / Tailwind, port 3000
apps/admin            Separate Next.js App Router / React / Tailwind, port 3001
apps/api              NestJS bootstrap and static health, port 3002
packages/ui           Empty presentation export; primitives/tokens belong to 034
packages/types        Empty public-type export; contracts belong to 007
packages/validation   Empty validation export; no business schemas yet
packages/api-client   Empty transport export; no API calls or session logic yet
scripts               Scaffold architecture/strict-config checks
infrastructure        Documentation only; no services provisioned
docs                  Preserved BMAD, governance and verification evidence
```

Builds emit shared `.js`/`.d.ts` exports under each package's ignored `dist` directory.
No app currently needs a shared runtime dependency. Future apps may consume safe
shared packages using `workspace:*`; packages must not import apps or create cycles.
Neither Next.js server nor browser code may access Prisma/PostgreSQL or backend
internals. Empty packages avoid inventing disputed domain contracts ahead of 007.

## Checks and scope limits

`pnpm typecheck` generates Next route declarations then checks all seven workspaces.
`pnpm build` builds packages/apps in workspace order. `pnpm test` (also
`pnpm check:architecture`) uses Node's test runner and the TypeScript parser to check
the real dependency graph, inherited strict settings, built export targets, source
import boundaries and absence of placeholder API calls. Run build before tests.
These are scaffold checks, not payment/auth/database or browser E2E suites.

Linting, formatting policy and hooks belong to CH-P0-004. There are intentionally
no `lint`, `format` or `format:check` scripts yet; do not report those checks passing.
CI/branch protection is 005; environment/service setup is 006; contract behavior is
007; full API middleware/OpenAPI is 011. No no-op success scripts are provided.

Read all applicable `AGENTS.md` files before edits. See the
[implementation evidence](docs/verification/CH-P0-003.md) for actual commands/results,
[gate register](docs/implementation/gate-register.md) for open specialist decisions,
and [story tracker](docs/implementation/story-tracker.md) for status. This story's
work must remain uncommitted pending human review.

## Verified version sources

Versions were checked on 2026-10-18 against official documentation and package
registry metadata, not inferred from old scaffold defaults:

- [Node release status](https://nodejs.org/en/about/previous-releases) and
  [Node 24.22.0 downloads/checksums](https://nodejs.org/dist/v24.22.0/).
- [Next installation requirements](https://nextjs.org/docs/app/getting-started/installation),
  [Next 16.4.2 metadata](https://registry.npmjs.org/next/16.4.2) and
  [React 19.3.1 metadata](https://registry.npmjs.org/react/19.3.1).
- [Nest 12 compatibility](https://docs.nestjs.com/migration-guide) and
  [Nest 12.1.3 metadata](https://registry.npmjs.org/@nestjs/core/12.1.3).
- [pnpm compatibility](https://pnpm.io/installation) and
  [pnpm 12.14.0 metadata](https://registry.npmjs.org/pnpm/12.14.0).
- [TypeScript 6.0.3 metadata](https://registry.npmjs.org/typescript/6.0.3): stable
  TypeScript 6 is deliberately retained for the Nest 12 documented compiler line,
  rather than blindly adopting the newer TypeScript 7 registry tag.
- [Tailwind Next integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs),
  [Tailwind 4.3.3 metadata](https://registry.npmjs.org/tailwindcss/4.3.3).
- [Prisma requirements](https://www.prisma.io/docs/orm/reference/system-requirements):
  Node 24 LTS aligns with its documented requirements. Prisma is not installed or
  configured in this story; its exact future version still requires review.

## Low-disk verification environment

The execution host's D: drive was almost full. Task-local portable tools, dependency
storage and generated build caches may therefore live in a unique C: temporary
directory. An initial cross-drive virtual-store/junction approach passed install
and typechecking but was incompatible with Next's filesystem resolution. Build and
HTTP verification therefore use a hash-matched, source-only temporary workspace
copy on C:, with normal in-workspace dependency/build locations and no copied Git
repository. These are documented verification-host workarounds, not committed
absolute paths or project requirements. D: must have sufficient free space before
normal in-place installation/build can be used on this host. On other machines use
the normal commands above. Consult the evidence before changing existing ignored
links; never delete their targets or unrelated local files blindly.
