# CommerceHub CI and protected pull requests

CH-P0-005 implements PR validation only. Its implementation PR must remain unmerged for human review. No CI step deploys, accesses Supabase, migrates data or receives production credentials.

## Workflow contract

.github/workflows/ci.yml runs CommerceHub CI on every pull_request targeting main (no path filters) and workflow_dispatch. Dispatch is available from default-branch workflow registration only after future authorized integration. One unconditional ubuntu-latest job is named commercehub-quality. This is the intended required-check name; observed remote evidence belongs in the verification report. Runner images are maintained/mutable by GitHub, not an immutable OS snapshot; the log records the actual image. No Windows matrix is claimed.

Node is pinned through .node-version to 24.19.0; pnpm/action-setup installs exactly 11.28.6 and the workflow verifies both actual versions plus packageManager. Frozen installation never updates the lock. The job runs secret scan, frozen install, CI-policy/scanner tests, format:check, lint, typecheck, build, test, test:quality and audit --audit-level high. Builds precede tests because existing shared-export tests inspect actual dist files. Tests currently cover strict compiler rejection, package/import boundaries, inert exports, typed lint, isolated real hooks/staging safety, CI policy and synthetic scanner/range cases. There are no database, browser or commerce suites and no measured coverage claim.

Use pnpm install --frozen-lockfile, pnpm test:ci, pnpm scan:secrets, pnpm format:check, pnpm lint, pnpm typecheck, pnpm build, pnpm test, pnpm test:quality, pnpm audit --audit-level high locally. Windows may need pnpm.cmd. CI uses Linux executables, no workstation paths or forced Windows/WASM flags. Run pnpm prepare to repair local hooks; never disable hooks to pass a commit.

## Action provenance and caching

Full commit pins verified against official upstream release refs on 2026-10-19:

| Action             | Release | Immutable commit                         |
| ------------------ | ------- | ---------------------------------------- |
| actions/checkout   | v7.0.1  | 3d3c42e5aac5ba805825da76410c181273ba90b1 |
| actions/setup-node | v7.1.0  | 949feb2413d6458794dcd2491c4babbbce0c15c1 |
| pnpm/action-setup  | v6.1.0  | ea17c68df8912ef543352723c149a84f56e3d413 |

The pnpm annotated tag d9184bf108216479bc5a137cc391f4d7b14c870b was dereferenced to the commit above, not used as a commit pin. Official action.yml inputs/runtimes and pnpm v11 compatibility were reviewed. All three actions use Node 24 internally. Do not replace pins with floating tags; review release/commit correspondence and rerun policy tests when updating.

pnpm's supported action caches only its public dependency store using pnpm-lock.yaml. GitHub scopes PR caches to the PR merge ref, so untrusted PR writes cannot populate main's cache. Never cache node_modules, .next, dist, environment files, credentials or generated test output; frozen installation and all builds still run. Cache restore is an optimization, not evidence of correctness. Concurrency groups include workflow and PR number/ref, canceling obsolete same-PR runs without canceling unrelated workflows. Timeout is 20 minutes; failure propagates with no continue-on-error or success-only aggregator.

## Security boundary

Default GITHUB_TOKEN permissions are contents: read. Checkout does not persist credentials. No custom token, environment, production secrets, privileged event, deployment permission or write permission is supplied. Fork PR execution uses pull_request and GitHub's restricted fork token; never change it to pull_request_target/workflow_run to make an untrusted test run. First-contribution approval prompts must be handled by a maintainer reviewing code. Repository secret/variable name inventory was empty during preflight; no values were fetched. Recheck secret exposure if future workflow edits introduce secret references.

The bounded dependency-free Node secret scanner scans whole UTF-8 files changed between the validated PR base SHA and checked-out merge tree. Local/manual execution scans tracked and nonignored untracked files. Deletions are excluded; renames/additions/modifications are scanned. Binary files are counted/skipped, per-file/total size overflow fails closed. Signatures cover private-key headers, GitHub tokens, AWS access key IDs, live Stripe keys and Supabase secret-key prefixes. It logs filenames/rule IDs only, never matches or patches. Synthetic unit inputs are assembled rather than committed as credential strings. This is explicitly not entropy detection, all-provider detection, binary scanning, full historical leak scanning, or proof of no secrets. A real historical leak still requires revocation and incident handling. No allowlist suppresses findings; review false positives explicitly. Script version is pinned by the reviewed repository commit; Node is exact. yaml 2.9.1 is a direct dev-only parser for structural workflow validation; it was already present transitively, and no existing dependency version was upgraded.

The audit includes development, runtime and optional dependencies and fails for high/critical findings or registry errors. Threshold follows NFR-SEC-06's high/critical release boundary; lower findings remain visible. Never use --fix, ignore-advisory flags, production-only filtering or a relaxed threshold to hide a failure. Advisory results are network/time-dependent.

### Current dependency blocker and investigation

GHSA-vfj7-8cjw-p6xm (CVE-2026-93687), high: braces@3.0.3 through @next/eslint-plugin-next@16.4.2 > fast-glob@3.3.1 > micromatch@4.0.8. Audit exits 1. Official advisory says no patched release; npm latest braces is 3.0.3, micromatch 4.0.8, and latest Next ESLint plugin remains 16.4.2. fast-glob 3.3.3 still uses vulnerable micromatch/braces; upgrading it is not a remediation. Upstream issue 70 remains open. Owner authorized investigation only, requiring review before version changes. No available compatible published version fix was found. A vendored source patch or glob-library replacement would need a separately reviewed security/compatibility proposal; neither is applied. The current audit remains failing with no exception. Full remote green/recovery and protection activation are blocked by this finding.

## Main protection procedure

Preflight: public owner repository, administrator capability, only owner collaborator, main unprotected, no rulesets/effective rules, Actions enabled. No account subscription/plan field was exposed by these reads; do not invent a plan. Public repository protection capability must be confirmed by effective API/settings when applying. No independent reviewer currently exists; do not require an impossible approval count. Recommend a trusted collaborator, then a separately approved one-review policy. Do not fabricate owner self-approval.

After a fully green real run and owner resolution of the audit blocker:

1. Repository > Settings > Rules > Rulesets > New branch ruleset; target main, active enforcement. Alternatively use Settings > Branches > Add branch protection rule for exact main.
2. Require a pull request; require the exact observed commercehub-quality check from GitHub Actions, conversation resolution, block force pushes/deletions and enforce against administrators. Select up-to-date checks if the maintainer accepts the update requirement. Do not require a never-observed check or enable paths/skips that evade it.
3. Leave bypass actors empty; no broad bypass grants. Direct pushes must be denied by required PR/check policy, including administrators. Classic restrictions can be unavailable for personal repositories: verify actual behavior rather than claiming a selectable setting exists.
4. With only the owner, use zero required approving reviews while preserving PRs/checks; add an independent-review requirement only after an eligible reviewer exists or explicit owner acceptance of the operational restriction.
5. Re-read protection, rulesets/effective main rules and actual PR check metadata. Negative isolated PR must show failed required check and BLOCKED merge state; recovered same PR must show green required check and restored normal eligibility. Do not attempt an actual merge, disable policy, or use administrator bypass to test it.

Current activation is deferred: the required first fully green remote run cannot be established while the unresolved audit fails. A failed check on an unprotected branch is NOT verified merge blocking. No main settings are claimed changed. Owner UI steps above are a proposed procedure, not evidence. Do not merge the task or verification PRs under this authorization.

## Remote verification and troubleshooting

See [CH-P0-005 evidence](../verification/CH-P0-005.md) for actual PR heads, run URLs, step outcomes, policy observations, negative cases and missing proof. Temporary negative fixtures may be generated only on the isolated runner after formatting to exercise real lint without bypassing local hooks; semantic type errors can be committed normally because lint does not replace tsc. Close temporary PRs without merge and delete only their verified task-owned branches after evidence capture.

If setup fails, compare actual versions/packageManager/action pin and official engine support; do not downgrade. Frozen failures require reviewing manifest/lock consistency, not regeneration in CI. Native failures require platform/architecture evidence, not copied Windows overrides. ESLint 9 deprecation is documented; do not force an incompatible major. Cache failure should be diagnosed against supported action behavior and scoped keys, not hidden with skipped installation. Missing checks require inspecting event, base, head, fork approval and workflow syntax; workflow_dispatch registration may be unavailable until a later approved default-branch merge. Missing protection permissions/features must be reported with exact API/UI evidence, never bypassed. Security findings require scoped owner review, not suppression.

Official references: [pnpm action](https://github.com/pnpm/action-setup), [setup-node](https://github.com/actions/setup-node), [checkout](https://github.com/actions/checkout), [GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use), [cache scoping](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching), [advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [upstream issue](https://github.com/micromatch/braces/issues/70).

## Approved temporary exception (2026-10-19 supersedes blocker above)

Run pnpm audit:ci after pnpm build. It executes the complete pnpm audit --audit-level high --json and reports the raw exit. Only the exact owner-approved policy in security/dependency-exceptions.json may cover its expected exit 1; all other high/critical findings, command/schema/exposure errors and expiry fail closed. pnpm test and pnpm test:ci include deterministic policy/runner tests. No package upgrades or broad ignores.

The gate requires all workspace manifests, the unchanged lock graph, frontend build IDs/server/static paths/runtime traces and emitted API output. Local artifacts are not deployed-runtime attestation. The exact development chain and production isolation must remain intact. Owner ZeyaadAly reassesses on 2026-10-26 and before exclusive UTC expiry 2026-11-02T00:00:00Z; no auto-renewal or scheduled task. Raw pnpm audit --audit-level high still intentionally exits 1. See the approved advisory decision and final verification record for actual remote/protection outcomes.

## Active main protection - verified 2026-10-19

Classic main protection is active: PRs required; zero independent approvals for the sole owner; stale approvals dismissed; strict current-base commercehub-quality required from observed GitHub Actions app 15368; resolved conversations; admins enforced; no configured bypass; no force pushes/deletion. Rulesets endpoints are empty because this is classic protection. The successful PR check registered before default-branch integration, without a merge workaround. Owner settings access permits policy maintenance; no permanent bypass. Failed lint/type/security checks were observed BLOCKED via REST and GraphQL, without a merge attempt. See verification evidence for exact run/head IDs and recovery.
