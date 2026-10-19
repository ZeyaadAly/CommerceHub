# CommerceHub code quality

CH-P0-004 adds one root ESLint/Prettier policy and a local pre-commit hook across
all seven workspaces. It does not add application functionality, CI or cloud
configuration. Existing Node 24.19.0, pnpm 11.28.6, TypeScript 5.9.3, Next 16.4.2,
React 19.3.1, Nest 12.1.3 and Tailwind 4.3.3 remain pinned.

## Installed development tools

| Tool                      | Exact version   |
| ------------------------- | --------------- |
| ESLint / @eslint/js       | 9.39.5 / 9.39.5 |
| typescript-eslint         | 8.71.2          |
| @next/eslint-plugin-next  | 16.4.2          |
| eslint-plugin-react       | 7.37.5          |
| eslint-plugin-react-hooks | 7.1.1           |
| eslint-plugin-jsx-a11y    | 6.10.2          |
| eslint-config-prettier    | 10.1.8          |
| globals                   | 17.13.0         |
| Prettier                  | 3.9.10          |
| Husky                     | 9.1.7           |
| lint-staged               | 17.6.0          |

ESLint 10 is newer, but React 7.37.5 and jsx-a11y 6.10.2 declare ESLint peers only
through 9. ESLint 9.39.5 is therefore the latest compatible stable version; npm
marks it deprecated. Keep this visible and review an ESLint 10 migration when the
plugins declare compatible peers. Do not force an incompatible major. The pinned
TypeScript 5.9.3 satisfies typescript-eslint's >=4.8.4 <6.1 peer range.

The direct official Next plugin is used with explicit React/Hooks/a11y presets,
so the full Next shareable config and its unnecessary native import resolver are
not dependencies. The initial resolver build-script refusal was resolved by
removing that unused dependency, not granting additional build-script permissions.
There is no Tailwind Prettier plugin: simple placeholder utility strings do not
justify another formatter plugin. Application and existing compiler pins are unchanged.

## Commands

From repository root, with the pinned pnpm on PATH:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
pnpm test
```

`pnpm lint:fix` applies ESLint's available safe automatic fixes. `pnpm format`
formats the permitted source/configuration and current tooling documentation.
`pnpm test:quality` runs the tooling tests separately, including isolated Git
commit tests. `pnpm test` retains all seven earlier tests and includes those tests.
Build before running the export checks, as in CH-P0-003.

Every app/package has `lint` and `lint:fix`, using the same root config:

```sh
pnpm --filter @commercehub/storefront lint
pnpm --filter @commercehub/admin lint
pnpm --filter @commercehub/api lint
pnpm --filter @commercehub/ui lint
pnpm --filter @commercehub/types lint
pnpm --filter @commercehub/validation lint
pnpm --filter @commercehub/api-client lint
```

Root lint also includes root configuration and scaffold/tooling test scripts.
The shared packages currently contain real empty module exports; these are checked,
not replaced with no-op lint commands. No `next lint` command is used.

## Lint policy

`eslint.config.mjs` uses flat config. JS/config/test scripts receive recommended
JavaScript checks and Node globals. TS/TSX within apps and packages receive
recommended type-checked TypeScript rules, type-only imports, duplicate-import
checks, no explicit/unsafe any, unused-variable checks, unnecessary-assertion
checks and promise handling. A bare void expression cannot suppress a floating
promise: handle rejection, return or await it. Unused ESLint disable comments fail.
Strict TypeScript compiler settings remain unchanged.

Type information comes from projectService using each file's existing tsconfig,
scoped to the seven TS workspaces. There is no broad parser project glob or typed
linting of JS test/config scripts. This currently costs seconds, not a full Next
build, and it keeps editor and CLI project selection aligned. Reassess cost as
source grows; do not suppress typed errors by disabling important rules.

Next core-web-vitals, React, Hooks and supported JSX accessibility checks apply to
storefront/admin. React/Hooks/a11y also apply to future UI TSX only, not plain types,
validation or API-client modules. Browser-safe shared modules receive no Node
globals. API and Next configuration files have Node globals where appropriate.
Frontend/shared imports of Nest/Prisma/Supabase/PG backend internals are rejected;
existing architecture tests retain workspace-cycle and app-import checks.
These lint rules assist boundaries; they do not replace compiler, browser,
authorization or full accessibility verification.

Generated output, node_modules, .next, dist, coverage, stores/caches, generated
clients/schemas under generated directories, next-env declarations and temporary
verification/tool directories are excluded. Actual app/package source is not
blanket-ignored. New generated paths must be reviewed before adding exclusions.

## Formatting policy

Prettier owns layout; eslint-config-prettier disables conflicting stylistic rules.
Use semicolons, single quotes, trailing commas, two spaces, 100-column width and LF
line endings. Markdown prose wrapping is preserved. JSON retains JSON syntax.
.gitattributes fixes code/hook and current tooling-document line endings across
Windows/Linux without applying a new Markdown rule to historical governance.

.prettierignore excludes dependencies, generated files, caches, coverage, all env
files and the lockfile. pnpm alone maintains pnpm-lock.yaml. It also protects all
AGENTS files, eight BMAD baselines, implementation registers, historical evidence,
deployment/architecture documents and existing infrastructure/GitHub metadata.
No historical planning document was mass-formatted. New development Markdown and
the CH-P0-004 verification report are checked; other new documentation areas should
receive an explicit reviewed policy rather than silently rewriting old evidence.

## Pre-commit behavior and staging safety

`prepare: husky` runs automatically after installation. It sets repository-local
core.hooksPath to .husky/_ and generates ignored hook wrappers; global Git
configuration is untouched. The committed .husky/pre-commit contains only
`lint-staged`. Husky prepends node_modules/.bin, so no global ESLint, Prettier,
lint-staged or Husky installation is required.

lint-staged receives filenames from Git and passes them as arguments automatically.
For staged TS/TSX/JS/MJS/CJS it runs ESLint fixes then Prettier. For staged
JSON/Markdown/YAML/CSS it runs Prettier. Tool ignore policies exclude generated and
protected files even if those are staged. No full build or blanket git add runs
on commit. A remaining lint error aborts the commit; successful formatting fixes
are staged by lint-staged. Default backup and partial-staging protections remain
active. Do not use options that disable backups or unstaged-change hiding.

To format/check only the currently staged files without committing:

```sh
pnpm exec lint-staged
```

Review `git diff` and `git diff --cached` afterward. Prefer correcting lint errors
at their source: remove unused imports/variables, use import type, await or catch
promises, and route safe public contracts through the appropriate package. Do not
add suppression comments as a substitute for resolving an error.

## Windows and hook diagnostics

Use .cmd launchers where PowerShell blocks script launchers. The existing README
local pnpm installation still works; no execution-policy or Device Guard change
is required. Git for Windows provides the shell used by Husky; hooks use POSIX sh
and LF, and the tooling tests include a filename with spaces. Node 24 satisfies
lint-staged's >=22.22.1 runtime requirement. Existing Next Webpack/WASM build
behavior is unchanged. Native Linux execution of these new hooks is not claimed
unless separately verified; no WSL, container or cloud settings were installed.

For an installation problem, run `pnpm prepare`, then inspect
`git config --local --get core.hooksPath` and .husky/_/pre-commit. To diagnose a
failure without bypassing checks, run `pnpm exec lint-staged --debug` and the
reported `pnpm --filter <workspace> lint` command. Fix the errors and retry. Do not
use --no-verify or disable Husky to make a failing commit pass.

`pnpm test:quality` creates its own temporary Git repository under ignored
.verification, installs the real hook and proves failure/success, partial staging,
and unrelated-file preservation. Commits exist only inside that disposable fixture;
the directory/junction is verified and removed afterward. It never stages or commits
the CommerceHub task branch.

## Verification and later CI

See [CH-P0-004 evidence](../verification/CH-P0-004.md) for exact results and limits.
CH-P0-005 should consume frozen install, lint, formatting, typecheck, build and
actual tests after its separate readiness review. No workflow or branch protection
is created here. All specialist gates remain open; this story stops at REVIEW.

Official references checked before selecting versions:
[ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files),
[typed linting](https://typescript-eslint.io/getting-started/typed-linting/),
[direct Next plugin](https://nextjs.org/docs/app/api-reference/config/eslint),
[Prettier installation](https://prettier.io/docs/install),
[Prettier ignores](https://prettier.io/docs/ignore),
[Husky setup](https://typicode.github.io/husky/get-started.html),
[lint-staged](https://github.com/lint-staged/lint-staged).
Exact engine and peer ranges were inspected using npm view before installing.
