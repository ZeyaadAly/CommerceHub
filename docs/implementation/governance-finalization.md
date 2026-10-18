# Governance finalization and integration evidence

Date: 2026-10-18 (Africa/Cairo). Authorized scope: human acceptance records, BA-16 directory convention, documentation/GitHub integration and a prepared CH-P0-003 prompt. No application implementation.

## Human acceptance and path resolution

The [approval register](approval-register.md) records explicit project-owner approval for CH-P0-001, CH-P0-002 and the ADR directory convention. Stories 001/002 are DONE for accepted documentation, while GitHub integration is independently PENDING. CH-P0-003 remains BLOCKED until verified predecessor merge evidence exists. All unrelated story states and all specialist gates remain unchanged.

BA-16 is resolved narrowly: operative paths in 04 §3/§18, 07 §6/Prompt B, root instructions and canonical README now use docs/architecture/decisions/. Existing docs/decisions/README.md is a legacy pointer with labeled historical evidence. Other old path mentions in immutable dated audit/review snapshots remain historical, superseded by explicit approval addenda. No actual ADR files existed, no identifiers/decisions were changed and no ADR was moved. All other BA findings remain subject to their prior review.

## Initial repository inspection

- Existing repository D:/E-commerce; branch main; latest/main/origin-main SHA 3c028018183f2fdd6c9e65328407ac785528522d after successful fetch; ahead/behind 0/0.
- No tracked modifications; exactly 20 untracked reviewed Markdown files, no ignored files; all pre-existing paths and content were inventoried before edits.
- Only main existed remotely; no existing integration branch or open PR. Collision check against fetched origin/main passed before branch creation.
- Origin remains https://github.com/ZeyaadAly/E-commerce.git. GitHub resolves it to ZeyaadAly/CommerceHub; branch API and git remote hashes match, verifying continuity. The remote URL was not rewritten.
- Canonical repository API reports push/maintain/admin permissions; actual operations still must satisfy connector/server permissions. main branch read reports protected=false, protection disabled, no required contexts; rulesets API returns empty. Detailed branch-protection API returns 403 “Resource not accessible by integration”; no setting was changed or bypassed.
- Initial default fetch failed because the sandbox could not write FETCH_HEAD; authorized elevated fetch succeeded. A sandboxed ls-remote could not connect; authorized elevated ls-remote succeeded. Existing ownership mismatch handled with command-scoped safe.directory only; no persistent/global Git configuration change.
- Created docs/CH-P0-001-002-governance-approval from verified origin/main; untracked documents preserved. No reset, clean, rebase, forced update or direct main push.

## Integration status

| Field | Observed state |
|---|---|
| Human acceptance 001/002 | APPROVED 2026-10-18, CommerceHub project owner |
| Governance branch | docs/CH-P0-001-002-governance-approval |
| Review baseline | 3c028018183f2fdd6c9e65328407ac785528522d |
| Governance commit | PENDING |
| Pull request / target | PENDING / main |
| Required checks/reviews | To inspect on actual PR; no fabricated review/check success |
| GitHub merge | PENDING |
| Merge SHA / origin-main content proof | PENDING |
| CH-P0-003 | BLOCKED by missing merged predecessor evidence; not executed |

This table must be updated from actual commit/PR/server evidence. The owner authorizes merge only when actual required checks and review policies are satisfied; never bypass protections or manufacture reviewer approval. The owner acceptance in this task is real human approval of the governance deliverables, not a GitHub review submission. The recommended future protected-main/CI setup remains CH-P0-005; no protection policy is altered here.

## Documentation and verification

Preserve eight BMAD sources and all earlier audit/review evidence. Only 04 and 07 receive authorized ADR-path alignment in the approved baselines. Root and governance records receive explicit approval addenda/current pointers. Add approval/integration registers, canonical README and the [prepared implementation prompt](prompts/CH-P0-003.md). Leave the legacy README as a pointer. The original 26 finding rows, 59 story IDs/dependencies and 59 functional/19 NFR mappings remain traceable; only 001/002 status changes are initially authorized, with 003 readiness conditional on merge proof.

Required executed checks before commit: inventory/readability, requirement/story/gate consistency, eight AGENTS, internal links, no runtime/config/schema files, whitespace, credential-pattern review, full staged diff and explicit staged path list. After staging inspect cached --check/--stat/--name-status; commit only reviewed scoped Markdown. Application tests/builds/install/migrations/deployment are NOT RUN and outside this task, since applications/toolchain do not exist. Record final observed results and repository/PR evidence below as they become available.

Pre-staging checks actually passed: 32 readable Markdown files, 165 internal relative links, every one of 59 functional and 19 NFR IDs mapped, 59 matching plan/backlog/tracker IDs with unchanged declared dependency/gate strings, DONE=2/BLOCKED=57, all 26 audit rows retained, eight AGENTS and guidance-only app/package directories. Operative ADR references in 04/07/root use the approved path; historical alternatives are labeled. Credential-pattern inspection found no access-token/private-key patterns; manual document review found no confidential values. Tracked source diff contains only the four authorized ADR-path/approval-line hunks in 04/07; original remaining six planning documents are untouched. Git warned about configured LF-to-CRLF conversion, not whitespace errors; no global line-ending setting was changed.

## Stop boundary

The CH-P0-003 prompt is prepared only. Do not execute it. After merged evidence is verified, readiness may become READY without closing unrelated specialist gates or unblocking unrelated stories. If integration is prevented by checks/review/permissions, leave the PR open and report precise evidence and next action instead of claiming success.

Staging verification passed: cached --check returned exit 0; --stat/--name-status showed exactly 26 scoped Markdown paths (24 additions, two authorized baseline edits), with 1062 insertions and four deletions at that inspection. Each complete staged blob was read with git show :path and compared to the reviewed working-file content; all matched. This evidence records the pre-commit snapshot, so the final count can increase when this evidence line is staged. No unrelated path was staged.
