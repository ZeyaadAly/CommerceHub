# Vercel frontend setup - CommerceHub

Prepared 2026-10-19 for CH-P0-003 finalization. **Preparation only: no Vercel
project, deployment, domain or secret has been created or changed.** Scaffold
integration is [PR #4](https://github.com/ZeyaadAly/CommerceHub/pull/4), merged at
`111a2ce752e9f8aa18ef970bfc972f3b39e8b50f`. See
[finalization evidence](../verification/CH-P0-003-integration.md).

## 1. Deployment overview and current readiness

Use two independent Next.js Vercel projects from the same GitHub repository.
The API is a separate NestJS process and is excluded from these projects.
The pages are static placeholders; no database, API URL, authentication or
commerce workflow is needed. This is not CH-P0-048 staging/release approval.

Both application manifests, strict compilation, independent Windows builds and
HTTP responses are verified. **Clean Linux builds and the pinned pnpm 11 release
on Vercel are NOT VERIFIED.** Docker is unavailable and WSL is not installed on
the current workstation. No external build environment or CI workflow was
provisioned. Deployment remains conditional on those checks and separate owner
authorization, even though CH-P0-003 itself is accepted and merged.

## 2. Project settings to review before execution

| Setting | Storefront | Administration |
|---|---|---|
| Planned project name | commercehub-storefront | commercehub-admin |
| Git provider / repository | GitHub / ZeyaadAly/CommerceHub | GitHub / ZeyaadAly/CommerceHub |
| Production branch | main | main |
| Framework preset | Next.js | Next.js |
| Root Directory | apps/storefront | apps/admin |
| Node.js version | 24.x | 24.x |
| Include source files outside Root Directory in Build Step | Enabled; verify in settings | Enabled; verify in settings |
| Candidate Install Command | corepack pnpm install --frozen-lockfile | corepack pnpm install --frozen-lockfile |
| Candidate Build Command | corepack pnpm run build | corepack pnpm run build |
| Output Directory | Framework default (.next); no override | Framework default (.next); no override |
| Application environment variables | None | None |
| Candidate platform build variable | ENABLE_EXPERIMENTAL_COREPACK=1 | ENABLE_EXPERIMENTAL_COREPACK=1 |

These are reviewable future settings, not applied configuration. No vercel.json
is needed for the present preparation. Root Directory is a project setting, not
a rootDirectory property in vercel.json. Never import the repository root as one
frontend project or select apps/api. Do not run root-wide pnpm build for either
frontend deployment: each build starts from its own selected application directory.

Vercel documents separate projects and root directories for monorepos, root
lockfile detection and uniquely named workspace packages. The outside-root source
option permits access to repository-level configuration and shared sources.
[Monorepos](https://vercel.com/docs/monorepos),
[shared source settings](https://vercel.com/docs/monorepos/monorepo-faq).

## 3. GitHub connection and automatic deployment behavior

Only after separate authorization, select the intended Vercel team and import
ZeyaadAly/CommerceHub twice using the roots above. Confirm account permissions,
plan/resource cost and the exact reviewed main SHA before proceeding. Import can
trigger an initial deployment; do not treat creating/linking projects as read-only.
No GitHub App permission or repository webhook was changed in this task.

Future connected non-main branches normally generate previews; main is the
production branch. Use separate preview and production settings and verify the
built commit before any promotion. GitHub Actions quality CI remains CH-P0-005;
Vercel deployment status is not a substitute for its future required checks.
Review preview visibility/protection before exposing the administration project.
[Deployment environments](https://vercel.com/docs/deployments/environments).

## 4. pnpm, lockfile and Node compatibility checkpoint

The repository pins pnpm 11.28.6 in root package.json and one root pnpm-lock.yaml.
All seven workspaces have unique names; currently none has inter-workspace
runtime dependencies. Root TypeScript/SWC development dependencies must be
installed. Do not use --prod for the build install. If safe shared dependencies
are added later, declare workspace:* explicitly and review their build order.

Vercel's published package-manager table currently lists pnpm versions 6-10; it
does not establish pnpm 11 support. Its build docs separately describe enabling
Corepack and using root packageManager. Thus the settings above are a candidate
Corepack path, **not a claim of verified pnpm 11 cloud support**. Before deployment,
confirm that path in a separately authorized clean Linux/Vercel build. Log
node --version and corepack pnpm --version, requiring Node 24 and pnpm 11.28.6.
If unavailable or incompatible, stop; propose a reviewed minimal installer/config
change. Do not silently downgrade pnpm, regenerate the lockfile with another
major, upgrade TypeScript/frameworks, or bypass frozen-install failures.
[Package managers](https://vercel.com/docs/package-managers),
[Corepack configuration](https://vercel.com/docs/builds/configure-a-build#corepack).

Node 24.x is available on Vercel; the platform selects its managed patch release,
not the workstation's exact 24.19.0. Verify it satisfies root engines
>=24.19.0 <25. The .node-version file records local verification, not a promise
that Vercel will supply that exact patch.
[Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## 5. Linux build verification and Windows distinction

On a separately authorized disposable Linux environment with Node 24 and pinned
pnpm 11.28.6, check out the reviewed merged SHA and use a normal local virtual
store. Run from repository root:

```sh
pnpm --version
pnpm install --frozen-lockfile
pnpm typecheck
pnpm --filter @commercehub/storefront build
pnpm --filter @commercehub/admin build
pnpm build
pnpm test
```

Also verify the candidate install/build commands from each application's own
Root Directory, with repository-level files available. Capture exit codes and
build logs, then start each built frontend and check its HTTP response. This
matrix has not run on Linux in this task; do not label it PASS.

Current app build scripts use next build --webpack, a supported cross-platform
Next compiler choice. Reusing the tested script does not force WASM on Linux.
Vercel settings must not copy .tools paths, .cmd launchers, Windows cache/store
locations, drive letters, SWC test flags, or environment variables forcing WASM.
Allow the normal Linux SWC binding to load and confirm its actual behavior in the
clean build. Turbopack migration is a separate reviewed change; not necessary
for preparing these Next.js projects. Do not change the accepted local toolchain.
[Build configuration](https://vercel.com/docs/builds/configure-a-build).

## 6. Environment variables and security boundary

There are **no application environment variables or credentials required** for
these static scaffolds. ENABLE_EXPERIMENTAL_COREPACK is only the proposed Vercel
build-tool toggle; it has not been configured. Do not set NODE_ENV manually.
Future public API base URLs must wait for an approved deployed API and SEC-01
transport/origin decisions; the present pages perform no fetches.

Never add PostgreSQL URLs, Supabase service-role/secret keys, session secrets,
payment credentials or internal service credentials to either frontend project,
even in server-only Next configuration. NEXT_PUBLIC_ values are browser-visible.
The owner identifies Supabase project uktducdwfzakyoolysvt, eu-central-1; no project
or database was inspected or modified here. Only the future NestJS API and trusted
backend services may access business tables, after their authorized database story
and applicable DB/security/financial gates. No Prisma schema or migration exists.

## 7. Domains, authentication and future cookies

Use generated project URLs for an initially authorized preview. No domain was
searched, purchased, assigned or changed. Any custom storefront/admin/API domains
require a reviewed DNS/ownership plan and separate execution approval.
Do not choose a parent-domain cookie, cross-origin credential forwarding, proxy,
CORS allowlist, BFF or CSRF origin policy here. SEC-01 remains OPEN. The current
admin page is a public placeholder, not an authenticated staff portal; do not
present its deployment as protected administration. No real users/data are approved.

## 8. Health and smoke checklist after an authorized deployment

- Verify exact project, environment, commit SHA and build-tool versions in logs.
- Verify frontend GET / returns HTTP 200 and the correct placeholder title.
- Check CSS and script responses, browser console and absence of page errors.
- Check main/h1, lang=en and no horizontal overflow at 360/768/1440px.
- Verify neither frontend requests a database, API, authentication or payment URL.
- Check arbitrary unknown frontend path behavior (Next not-found); no invented APIs.
- Review public assets/build configuration for secrets before publishing URLs.
- Do not probe an invented cloud /health: only the local standalone API has that
  route. Deploying NestJS or workers is outside this preparation.

## 9. Troubleshooting and rollback

| Symptom | Inspect / permitted next proposal |
|---|---|
| Wrong pnpm version or lockfile failure | Corepack availability, root packageManager and lockfile; stop before dependency changes |
| Missing tsconfig or workspace package | Selected root, outside-root setting, root configuration and declared dependencies |
| next not found | App package manifest, complete install including dev dependencies and framework/root selection |
| Native SWC load failure on Linux | Build image/architecture, installed platform optional dependency and actual logs; do not copy Windows policy workarounds |
| Build runs API/all apps | App root and app-local build command; do not use root-wide build command in project settings |
| Blank/unstyled page | Verify Tailwind PostCSS plugin, emitted assets and browser network errors |
| Unexpected API or secret requirement | Stop: current scaffold requires neither; inspect unexpected code/config drift |

No deployment exists to roll back. After a future separately authorized release,
record the last verified production deployment per project. A future rollback can
use the project's Deployments dashboard to restore a known-good deployment where
supported, then verify its SHA, routes and assets. Roll back the two projects
independently; do not imply atomic multi-project rollback. If rebuilding is needed,
use a reviewed Git revert PR and the standard deployment process, never force
push/history rewriting. Recheck environment configuration separately and never use
a frontend rollback to attempt database rollback.
[Instant rollback](https://vercel.com/docs/instant-rollback).

## 10. Exact remaining approvals and execution order

1. Review this preparation and authorize the clean Linux/hosting compatibility
   proof; it is presently NOT RUN and pnpm 11 on Vercel is not established by the
   published default-support table.
2. Confirm team/project ownership, permissions, plan and resource costs. Obtain
   explicit authorization for project creation/import and the initial deployment.
3. Review any public sandbox exposure against OPS-01/LEG-01 and the applicable
   staging/release scope. This document does not waive those gates or start 048.
4. Confirm Corepack/pnpm/Node settings and run the authorized compatibility proof;
   resolve failures through reviewed minimal changes without changing business scope.
5. Authorize preview execution and perform the smoke checklist. Production branch,
   public access/protection, domain assignment and production activation need an
   explicit go/no-go for the intended environment.
6. Keep SEC-01, financial/payment/inventory gates and future API/database/provider
   work separate. CH-P0-004 may become READY after accepted 003 merge; it is not
   started by this document. No ESLint/Prettier/hooks/CI tooling is added.
