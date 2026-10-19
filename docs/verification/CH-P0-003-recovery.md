# CH-P0-003 environment recovery and integration outcome

Date: 2026-10-18. **REMEDIATION BLOCKED; GitHub integration PENDING.**
The project owner explicitly APPROVED WITH ENVIRONMENT LIMITATION on this date;
see [approval register](../implementation/approval-register.md). This records human
acceptance, not a successful recovery or merge. Story remains REVIEW, not DONE.
Original failed builds and successful C: evidence remain in
[implementation evidence](CH-P0-003-original-implementation.md) and [acceptance](CH-P0-003-acceptance.md).

## Current preflight

Repository is a normal directory at D:/E-commerce, on the D: New Volume NTFS
filesystem (Get-Volume/Get-PSDrive host-level inspection). Branch is
chore/CH-P0-003-monorepo-foundation, no upstream. HEAD and freshly fetched origin/main
both equal 60d26b99dda4e7f06d47df4f5b7ab984fb103a21; main has not advanced.
Origin remains https://github.com/ZeyaadAly/E-commerce.git, the existing renamed
CommerceHub remote. GitHub search for the exact task head returned no PR; broader
003 search found only historical governance PRs #1/#2. No task PR was created.
Initial worktree: 44 expected untracked files and two modified tracking documents.
No conflicting/unrelated source edits were found. No branch switch or history edit.

## Measured storage and path classification

Initial D: free **12,562,432 bytes** (11.98 MiB); total 269,476,687,872 bytes.
C: free approximately 7.86 billion bytes. Final measured D: free after verification
and documentation updates: **12,517,376 bytes** (11.94 MiB); C: 7,827,845,120 bytes.
No cleanup was performed; small write/cache variation is not recovered capacity.
Source/config/docs logical size at initial inventory: 743,853
bytes. Entire repository normal-file logical size, including Git metadata but
excluding all reparse targets: 1,729,342 bytes. This is a logical-byte inventory,
not an exact NTFS allocation measurement; no large local consumer was hidden by
following links. Filesystem volume usage is independently measured above.

Inventory walked normal directories only and classified 24 reparse entries without
traversing them. Root and app node_modules are normal directories containing
pnpm-managed dependency junctions. Shared package node_modules are absent because
those packages currently have no declared dependencies. Empty .tools is ignored.

For the table, T is the existing task directory on C:
`C:/Users/20111/AppData/Local/Temp/CommerceHub-CH-P0-003-db595e2fe2dd46c6a02d5247b76f8976`.
Dependency totals exclude link traversal and may share physical hardlink storage;
do not sum them as unique physical disk allocation.

| Path | Type | Measured logical size | Safe to replace? | Reason |
|---|---|---|---|---|
| D: docs | Normal source directory | 619,366 bytes | No | Approved/governance evidence |
| D: .git | Normal metadata directory | 571,001 bytes | No | History/index/refs, protected |
| D: apps | Normal source/config plus caches, links excluded | 405,485 bytes | No as a directory | Includes user-maintained source |
| D: apps/*/*.tsbuildinfo | Generated compiler caches, normal files | 366,334 bytes combined | Yes, disposable | Too small to solve capacity; preserved |
| D: packages/*/dist | Normal generated directories | 88 bytes combined, eight files | Yes after exact inspection | No meaningful capacity gain; preserved |
| D: node_modules | Normal pnpm metadata/shims, links excluded | 31,569 bytes | Conditional, regeneration only | No unique source; retain until capacity is available |
| D: apps/{storefront,admin}/node_modules/next | pnpm-managed junctions | Link entry only on D: | Conditional unlink only | Targets T/virtual-store/next@16.4.2_.../node_modules/next; external-root resolution fails |
| D: other node_modules junctions | pnpm-managed internal links | 21 dependency links total | Preserve/regenerate together | Legitimate pnpm links, not universally broken |
| D: apps/storefront/.next | Generated output junction | Target T/build/storefront: 43,914,101 bytes on C: | Conditional unlink only | Task-created; deleting target cannot reclaim D: space |
| D: apps/admin/.next | Generated output junction | Target T/build/admin: 43,716,421 bytes on C: | Conditional unlink only | Same restriction |
| D: apps/api/dist | Generated output junction | Target T/build/api: 4,257 bytes on C: | Conditional unlink only | Same restriction |
| T/virtual-store | Normal external dependency tree, internal pnpm links | 391,612,448 bytes | No cleanup in this task | C: target must be preserved |
| T/store | Task-local content-addressable store | 403,385,420 bytes | No cleanup in this task | Removing C: data cannot free D: capacity |
| T/workspace/node_modules | Normal verification dependency tree | 391,634,690 bytes | Preserve | Source-equivalent comparison evidence |
| T/workspace/apps/{storefront,admin}/.next | Normal successful verification output | 46,624,599 / 46,611,616 bytes | Preserve | Historical C: success, not D: success |

Windows PowerShell's initial deep C: enumeration encountered long-path errors;
final dependency/output measurements used Node 24 lstat/readdir with no symlink
traversal and completed without those errors. No files were removed during either
inventory. The ranked D: inventory shows the repository is not the volume's large
consumer. Other projects/personal directories were not recursively inventoried or
offered for automatic deletion.

Dependencies plus successful two-frontend output measure approximately 485 MB of
logical data, before workspace overhead, future dev caches, install staging and
rollback headroom. A practical recovery target is **at least 3 GiB free on D:**,
not a guaranteed minimum. Approximately another 2.99 GiB must be made available.
Even deleting every normal repository file (forbidden) would recover under 2 MB
of logical data. Approved disposable caches total only 366,422 bytes. Therefore
automatic project-local cleanup cannot safely achieve the target. No pointless
cleanup or unlink operation was performed; all D: links and all C: targets remain.

## Actual failure and configuration

Repeated D: build exits 1: both Next frontends fail to find next/package.json from
their app directories under filesystem root D:/E-commerce. Their next junctions
resolve to T/virtual-store on C:. The immediate error is Turbopack external-root
resolution, not ENOSPC. Disk shortage prevents replacing this workaround with a
normal local virtual store/output layout. Both conditions must be addressed.

Current installed .modules.yaml records the T/store/v11 and T/virtual-store
locations. Targeted pnpm config get storeDir/virtualStoreDir returns undefined
without CLI overrides: these external paths were install-time choices, not
permanent machine-wide settings. No global config or environment was modified.
The frozen retry intentionally specified the existing paths to avoid reorganizing
dependencies while capacity is inadequate. No lockfile change occurred.

Official [pnpm linker/virtual-store guidance](https://pnpm.io/settings/node-modules)
supports the normal isolated node_modules/.pnpm arrangement; pnpm links are not
themselves defects. [Next root-directory documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory)
explains its filesystem boundary. No arbitrary C: turbopack.root, experimental
mode or preserve-symlinks workaround was introduced.

Additional configuration follow-up: pnpm 12's
[settings reference](https://pnpm.io/settings) reads non-registry settings from
pnpm-workspace.yaml/global config rather than .npmrc. Existing engine-strict and
save-exact lines in .npmrc should be reconciled to supported camelCase workspace
settings when configuration recovery can proceed. This does not explain the
Turbopack failure: project engines are still checked independently and all
installed direct versions remain exact pins. No configuration change is made in
this blocked recovery stage, and this observation does not approve later tooling.

## Current verification (real D: repository)

Pinned portable Node 24.22.0 and pnpm 12.14.0. Log is task-local
T/recovery-d-checks.log, outside Git. Checks below ran sequentially.

| Check | Result | Evidence |
|---|---|---|
| Frozen install with existing explicit store/virtual-store paths | PASS | Exit 0, lockfile unchanged |
| Strict TypeScript | PASS | Exit 0, all seven workspaces |
| Tests / architecture checks | PASS | Exit 0, three meaningful scaffold tests |
| Normal pnpm build | FAIL | Exit 1, both Next apps external-root package resolution |
| D: storefront HTTP 3100 | NOT RUN this turn | No successful D: frontend build; historical C: HTTP PASS retained |
| D: admin HTTP 3001 | NOT RUN this turn | Same restriction |
| D: API HTTP 3002 | NOT RUN this turn | Recovery stopped; historical independent health PASS retained |
| Lint/format | NOT RUN | Intentionally absent until 004; nothing installed |
| Git safety | PASS | Fetch/current-main check, no staging, diff check and protected-file checks |

No business/domain module, DB/Prisma/schema/migration, authentication, payments,
queue, infrastructure, secret or deployment was added. All eight BMAD documents
and all eight AGENTS remain unchanged against HEAD. All specialist gates remain
OPEN; no audit policy was silently adopted. Historical C: build/HTTP success is
not counted as a current in-place D: PASS.

## Owner action and integration stop

1. Owner must provide at least 3 GiB free on D: by a personally selected storage
   action or volume-capacity increase. Keep CommerceHub on D:. No personal-file,
   other-project, Docker, recycle-bin or system cleanup is authorized here.
2. Reinspect each exact generated/dependency link and target; preserve source,
   credentials, Git and C: targets. Once capacity is sufficient, unlink only
   verified junction entries using a Windows directory-link operation that does
   not traverse the target. Regenerate pnpm dependencies with a normal local
   virtual store and ordinary local output directories, pinned lockfile unchanged.
3. Reconcile the noted pnpm 12 project settings; rerun frozen install, typecheck,
   build, tests and independent HTTP on D:. A content store on C: is not itself
   forbidden; the virtual store/runtime resolution layout must work locally.
4. Only after satisfactory recovery/scope checks, inspect and explicitly stage
   source/evidence files, commit, push and create the reviewed task PR. Require
   actual checks/reviews/policies; no bypass. No commit or PR was attempted now.

CH-P0-004 is **BLOCKED**: 003 approved but not merged, scaffold not on remote main,
and normal D: development remains unreliable. 07 registry and 08 define shared
lint/format policy, scripts per workspace and a failing lint/format fixture.
Later authorized 004 scope should cover ESLint/Prettier conventions, TypeScript
rules, hooks and appropriate staged-file checks, with BA-22 AC refinement. BA-17
concerns subsequent CI depending on those scripts; it does not authorize CI now.
No specialist gate directly blocks that narrow tooling slice, but predecessor and
environment prerequisites remain unmet. No later story was started or readied.

Human approval is recorded in approval-register, tracker and readiness. 003 stays
REVIEW with integration PENDING. Initial 44 untracked source/evidence files are
preserved; this recovery report is one additional untracked file. No git add,
commit, push, merge, rebase, reset, clean, repository move or deletion occurred.
