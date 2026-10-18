# CommerceHub GitHub workflow — proposed

Governance integration update (2026-10-18): task deliverables 001/002 and ADR directory convention were explicitly human-approved; canonical ADR location is `docs/architecture/decisions/`. The owner authorizes the named governance branch, commit, PR and merge only when actual repository checks/review policies permit. GitHub resolves the existing E-commerce remote URL to ZeyaadAly/CommerceHub; matching main SHA verifies repository continuity. Initial main protection/ruleset reads reported protected=false and no rulesets; the detailed protection endpoint returned connector 403. No protection setting was changed. See [governance finalization](governance-finalization.md) for observed integration state; earlier no-write/unknown-remote statements below are the CH-P0-001 snapshot, not claims about this later authorized operation.

Date: 2026-10-18. Source: [07 §§6/9/10/14](../07-implementation-plan.md). This file recommends controls; it does not configure GitHub.

## Observed repository

Working directory `D:\E-commerce`; existing repository, current branch `main`, initial working tree clean. Origin fetch/push: `https://github.com/ZeyaadAly/E-commerce.git`. Latest local commit: `3c02801` (subject: Refactor code structure for improved readability and maintainability). Tracked files: the eight planning documents only. No local CI/template/CODEOWNERS or application files were present. Remote availability, remote branches, open PRs, GitHub rulesets, collaborators and CI status were not checked and are UNKNOWN.

Executed requested read-only commands: `git status --short`, `git branch --show-current`, `git remote -v`. Each initially failed with dubious ownership: repository owner SID ends `1001`, executing user SID ends `1012`. Retried each using `git -c safe.directory=D:/E-commerce <command>`; outputs were empty status, `main`, and the origin above. This trusts only this explicit repository for each read; no persistent or global Git configuration was changed. Also inspected `git ls-files` and `git log -1 --format='%h %s'` using that same command-scoped option.

After this task the expected change is seven untracked Markdown files under `docs/implementation/`. Source files stay unchanged. No init, checkout, commit, push, fetch, merge, remote change, reset, rebase or history rewrite was performed. Work was delivered on the existing branch because branch mutation was unnecessary for this audit; the proposed branch workflow starts only on a later authorized task.

## Branches, commits and reviews

Use short-lived `docs/CH-P0-001-baseline-audit`, `chore/CH-P0-002-agent-guidance`, `feat/CH-P0-<id>-description` or `fix/<story-id>-description` branches from reviewed main. One reviewable concern per PR; approved subtasks retain parent ID. Do not create another repository for 002. Commit only when authorized, with subjects such as `docs(CH-P0-001): add baseline audit and traceability`; inspect staged diff and exclude secrets/generated junk. Never force-push main or rewrite shared history. Squash merge is a recommendation subject to repository-owner choice and authorization, not an action taken here.

PR body: problem/result; story and requirement IDs; related audit/gate IDs and decision evidence; contracts/data/UI changed; exact checks and results or NOT RUN reason; screenshots for UI; migration/compatibility/rollback where relevant; risks and outstanding approvals. Link local evidence to the eventual PR/commit without inventing URLs. Financial/security/data owners review affected boundaries; at least one independent human approval for normal work and relevant specialist approvals for gated changes. Re-review changes after approval. Red checks or unresolved required acceptance keep work in REVIEW/BLOCKED.

## CI and protected main recommendation

For documentation now, check local links, requirement/story inventories, release/dependency consistency, gate status and documentation-only diff. No package manager or app test command exists yet. Do not invent green app CI.

After 003/004/005: frozen lockfile install with pinned supported toolchain; format/lint/typecheck; unit tests; OpenAPI lint/diff and typed-client contracts; disposable PostgreSQL migration/constraint/concurrency and security integration tests; builds; browser critical-path/a11y/responsive/fetch-isolation suites when available; dependency and secret scanning. Gate critical auth/money/stock coverage against an explicitly approved target. Staging tests and restore results are separately recorded evidence; do not report a job as run merely because YAML exists. Resolve BA-17 before wiring required checks.

Repository owner should protect `main` through a branch rule/ruleset: PR required, independent approval, dismiss stale approvals, required named CI checks, resolved conversations, block force pushes/deletion, restrict direct pushes/bypass, require current compatible base. Add CODEOWNERS for API/data/security and app scopes during a later authorized task. Validate with a deliberately failing safe PR and clean PR after CI exists. Exact check names and GitHub feature availability must be confirmed then; protection is not presently verified.

GitHub Actions should use least-privilege tokens, reviewed/pinned actions, no production secrets for fork PRs or untrusted code, concurrency cancellation for superseded checks, isolated synthetic fixtures and redacted artifacts. Deploy staging only through authorized release work; production promotion and migrations require explicit approval and gates. Migration role is separate from runtime, one controlled migration job, backward-compatible expand/contract, backups/restore and rollback evidence. Never roll back finance by deleting history.

No GitHub API writes, issues, PRs, repository settings or protection rules were created in CH-P0-001.
