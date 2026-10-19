# CH-P0-004 final approval and integration

Date: 2026-10-19. Human acceptance: APPROVED, subject to final integration conditions.
Implementation story status: REVIEW; merge is not yet claimed.

## Authority and baseline

The project owner's Final Approval, GitHub Integration & CH-P0-005 Readiness instruction authorizes reviewed task commits, branch push, PR and policy-compliant merge, followed by a documentation-only tracking PR. It does not authorize CI implementation, protection/ruleset changes, database operations, deployment settings or subsequent stories.

Initial branch: chore/CH-P0-004-code-quality-tooling. Initial HEAD and freshly fetched origin/main: ae21727644e33cd1ac7415f7bf2df909038a7ca9. PR #5 independently re-read as MERGED. Initial index empty; inventory matches the preceding implementation report.

## Source and line-ending review

Reviewed the shared ESLint flat config, Prettier policy/ignores, Husky hook, lint-staged config, all manifests/tsconfigs, root strict config, existing source/test formatting, new quality tests, documentation and dependency lock changes. Twelve exact root dev additions retain existing framework/compiler pins; lock peer snapshots changed to account for newly present optional Babel/color peers. No business behavior or strict compiler option changed. Existing lifecycle allowBuilds policy is unchanged.

All 18 suspicious paths below were compared as raw bytes with git show HEAD:path. Every comparison was exactly equal, including generated declarations. No file restoration, content deletion or blanket normalization is needed. A non-destructive index stat refresh returned needs-update diagnostics; path-specific re-adding then refreshed only these verified identical blobs. All 18 disappeared from status and the index stayed empty. No content was restored or discarded; none will enter the committed diff.

Excluded byte-identical paths:

```text
apps/admin/app/page.tsx
apps/admin/next-env.d.ts
apps/admin/next.config.ts
apps/admin/postcss.config.mjs
apps/api/src/app.module.ts
apps/api/src/health.controller.ts
apps/api/src/main.ts
apps/api/tsconfig.json
apps/storefront/app/page.tsx
apps/storefront/next-env.d.ts
apps/storefront/next.config.ts
apps/storefront/postcss.config.mjs
packages/api-client/src/index.ts
packages/types/src/index.ts
packages/ui/src/index.ts
packages/validation/src/index.ts
pnpm-workspace.yaml
tsconfig.base.json
```

Retained intentional formatting: both layouts/CSS, JSON tsconfig layout and existing scaffold/workspace/smoke test layout. Manifest scripts, root tools/lock and tooling evidence are meaningful scoped changes. All eight BMAD sources and eight AGENTS instructions remain unchanged.

core.autocrlf=true; core.eol is unset; no .editorconfig exists. Index blobs already use LF. New .gitattributes scopes LF to code/hooks and selected tooling docs, with no historical governance Markdown rule. Future added code is normalized intentionally; future governance renormalization is outside this approval. The readiness Markdown checkout warning reflects existing autocrlf behavior and does not alter lint/hook execution.

## Final candidate verification

| Check                    | Exact command                                                                                                                                                                                                                                                                             | Exit / outcome                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Frozen install           | pnpm install --frozen-lockfile                                                                                                                                                                                                                                                            | 0; lock SHA256 unchanged: 7C8F005CE33D6C32D35D9C122A7289D662431B5282A9F9735758E573938F1447                |
| Root lint                | pnpm lint                                                                                                                                                                                                                                                                                 | 0                                                                                                         |
| Formatting               | pnpm format:check                                                                                                                                                                                                                                                                         | 0, including clean check after negative fixture cleanup                                                   |
| Strict compilation       | pnpm typecheck                                                                                                                                                                                                                                                                            | 0, seven workspaces                                                                                       |
| Build                    | pnpm build                                                                                                                                                                                                                                                                                | 0, seven workspaces, existing SWC fallback warnings                                                       |
| Workspace lint           | pnpm --filter @commercehub/storefront lint; pnpm --filter @commercehub/admin lint; pnpm --filter @commercehub/api lint; pnpm --filter @commercehub/ui lint; pnpm --filter @commercehub/types lint; pnpm --filter @commercehub/validation lint; pnpm --filter @commercehub/api-client lint | Each 0                                                                                                    |
| Focused tooling          | pnpm test:quality                                                                                                                                                                                                                                                                         | 0, three passed; isolated actual hook block/pass, filenames with spaces, partial staging, unrelated edits |
| Root negative lint       | pnpm lint with exclusive temporary unused-variable fixture                                                                                                                                                                                                                                | Expected 1, no-unused-vars                                                                                |
| Root negative formatting | pnpm format:check with unformatted valid fixture                                                                                                                                                                                                                                          | Expected 1; fixture removed in finally                                                                    |
| Complete suite           | pnpm test                                                                                                                                                                                                                                                                                 | 0, ten passed; zero failed/skipped                                                                        |
| Diff whitespace          | git diff --check                                                                                                                                                                                                                                                                          | 0; autocrlf warning only                                                                                  |
| Runtime                  | pnpm test:smoke                                                                                                                                                                                                                                                                           | NOT RUN in this finalization pass: no behavior changes; earlier actual HTTP evidence retained             |
| Native Linux hook        | No Linux environment provisioned                                                                                                                                                                                                                                                          | NOT VERIFIED                                                                                              |

The existing 18 source ASTs match HEAD after formatter-only syntax normalization; all 16 manifest/tsconfig value comparisons retain existing dependencies/compiler configuration (except authorized scripts and new root dev tools). Existing lockfile package resolutions and direct specifiers are unchanged: 225 existing package entries retained; 271 tooling-related entries added. Fifty-three local links resolve. Generated next-env declarations were restored to exact HEAD bytes only after verifying the known typegen route-path rewrite. No other content was restored.

Final intended candidate: 26 modified tracked files plus ten new files (the original nine and this integration report). Full original inventory is in the historical implementation report. The additional tracked modification is the approval register. No excluded byte-identical file is staged. All fixtures are removed.

pnpm.cmd is the actual Windows launcher used with the pinned local pnpm on PATH; abbreviated commands above refer to that launcher. Prior [implementation evidence](CH-P0-004.md) remains a historical implementation-turn snapshot.

## GitHub policy and integration

Preflight public branch API: main protected=false, protection.enabled=false, required status contexts empty; rulesets list empty. Authenticated reads using the existing Git credential then confirmed: branch protection HTTP 404 "Branch not protected"; rulesets HTTP 200 empty; effective main rules HTTP 200 empty. All three merge methods are enabled, including squash. Credentials were never printed or persisted in evidence. PR checks, reviews and current head will be inspected before any merge. No policy setting was changed.

## Limits and next-story boundary

ESLint 9 warning and existing Windows SWC/Webpack/WASM fallback remain documented. Native Linux execution of the new hook is NOT VERIFIED. CH-P0-005 requires verified 003 and 004 merges, a reviewed BA-17 readiness refinement, precise positive/negative CI scope and separate execution authorization. No GitHub Actions, CI tooling or branch rules are implemented here. All specialist gates remain OPEN. No Supabase, migration, Vercel configuration or manual deployment operations are performed.
