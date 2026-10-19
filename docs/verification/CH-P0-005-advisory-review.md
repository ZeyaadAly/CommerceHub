# CH-P0-005 advisory remediation decision

Status: **APPROVED FOR TEMPORARY EXCEPTION**. Owner: **ZeyaadAly**. Approval: 2026-10-19. Expiry: **2026-11-02T00:00:00Z**.
The owner explicitly approved only GHSA-vfj7-8cjw-p6xm / braces@3.0.3 / the exact root development chain below. This is temporary risk acceptance, not remediation or story acceptance.

## Approved implementation decision - 2026-10-19

The new owner instruction supersedes the proposal-only authority in the historical investigation below. Machine policy: security/dependency-exceptions.json. Gate: scripts/check-dependency-audit.mjs; tests: scripts/dependency-audit.test.mjs. Full pnpm high/critical audit remains authoritative; raw exit 1 is retained and reported. No dependency versions or lockfile changed.

Approval dates are date-only. The conservative UTC interval starts 2026-10-19T00:00:00Z and ends exclusively 2026-11-02T00:00:00Z, at most fourteen days; no precise signing instant is invented. Reassess on 2026-10-26 and before expiry; owner ZeyaadAly must record that review. No automatic renewal or scheduled workflow. Every gate execution validates the real current clock; tests alone inject a synthetic clock.

Exact policy identity, all manifest/lock production roots, optional dependencies, peer-qualified snapshots and every ancestry reaching braces are checked. Missing evidence, changed identity/path/version/patch status, duplicate records, extra high/critical findings, schema/count inconsistencies, network/runner errors and expiry fail closed. Bounded post-build frontend runtime trace/path and API emitted-import inspection is mandatory. These local artifacts do not attest deployed Vercel runtime files or arbitrary renamed bundled code. No deployed-artifact attestation is claimed. Residual CI availability risk persists from PR-executable tooling.

Remove the exception after a supported fix/replacement is reviewed, exposure changes, approval conditions fail or expiry arrives. A changed dependency requires review, not editing this policy to broaden it. All unrelated gates remain OPEN; PR #8 remains unmerged and CH-P0-005 remains REVIEW.

## Historical investigation (preserved; proposal statements below predate approval)

## Authority and baseline

The owner's Security Advisory Remediation Review authorizes investigation, risk assessment and a proposal only. No dependency version, lockfile, audit exception/threshold, branch protection, deployment or application behavior may change without a separate owner decision. No commit/push/PR edit is performed for this review.

Branch chore/CH-P0-005-ci-and-branch-protection, HEAD 419993d289d315bfcde165556b31a0c3f1ba838c. Initial working tree/index clean. [PR #8](https://github.com/ZeyaadAly/CommerceHub/pull/8) independently read OPEN, merged=false, same head. CH-P0-005 remains REVIEW with blocked acceptance. Read root/app instructions, CI/evidence, tracker, approval/gate records; all specialist gates remain OPEN. Approved BMAD baselines and all AGENTS remain unchanged. This is a proposal in verification governance, not an approved ADR or global BA-17/22 closure.

Lock SHA256 before review: 70EFE7EA3540AC226A5B1FDE3C30064D7984F86064DE769862933EAADA676539.

## Exact finding and provenance

**GHSA-vfj7-8cjw-p6xm / CVE-2026-93687**, high, CWE-674 uncontrolled recursion/stack-exhaustion denial of service. Audit ID 1240992 is the current numeric scanner identifier; exception identity must use the stable GHSA, not only that number.

Exact installed chain:

```text
commercehub@0.0.0 (root devDependencies)
  @next/eslint-plugin-next@16.4.2
    fast-glob@3.3.1
      micromatch@4.0.8
        braces@3.0.3
```

Full audit finding: version 3.0.3; dev=true, optional=false, bundled=false; sole reported path .>@next/eslint-plugin-next>fast-glob>micromatch>braces. Full audit metadata: high=1, critical/moderate/low/info=0. pnpm why braces -r reports one installed version and only this root development chain. Workspace production dependency listing reports no braces in any of eight root/workspace projects. Production-only audit returns zero findings; this is a separate diagnostic, not a replacement for the full CI audit.

## Production graph and actual local artifact inspection

Inspected existing production-build outputs rather than assuming that dev classification establishes safety:

| Surface            | Inspection                                                                                                         | Result                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Admin              | .next/server and .next/static, 65 files; five .nft.json traces, 1,214 references, 745 unique existing traced files | No affected package/chain path, named artifact, or affected package path embedded in bundle text                              |
| Storefront         | Same scope/counts, separate build                                                                                  | Same negative findings                                                                                                        |
| API                | All three apps/api/dist files; emitted imports and production graph                                                | No braces/micromatch/fast-glob/Next ESLint reference; API imports Nest/reflect-metadata only                                  |
| Trace completeness | Resolve every trace reference relative to its trace file                                                           | Zero missing references for both frontends                                                                                    |
| Broad text check   | braces, micromatch, fast-glob, plugin name, rangeLimit, expandBrace, MAX_LENGTH                                    | Only generic MAX_LENGTH hits in Next cache constants; inspected context identifies NEXT_CACHE_TAG_MAX_LENGTH, not braces code |
| Standalone output  | .next/standalone                                                                                                   | Absent; not falsely claimed inspected                                                                                         |

Retained local build IDs: admin iXfYjN899jCXaF3jmeaoN; storefront yqMZuKfFY-mEHMZasdftt. No builds were rerun and no generated output was modified in this investigation. Bundles/traces and production graph support **no observed application runtime exposure in the examined build**, not a formal universal proof of absence. Generic text search cannot establish binary provenance by itself. Vercel's actual deployed runtime filesystem/SBOM was NOT fetched; deployed-artifact attestation is NOT VERIFIED. Builds installing root development tools do not imply those tools are included in the traced runtime closure. Conversely, a future host copying all root node_modules would have the package on disk even if not invoked: that is increased exposure and must revoke/review any proposed exception.

## Call-site and exploitability assessment

Installed plugin dist/utils/get-root-dirs.js imports fast-glob and calls globSync(rootDir.replace(backslashes, '/'), {onlyDirectories:true}); no-html-link-for-pages uses getRootDirs. The project ESLint config supplies only two absolute paths derived from import.meta.dirname: apps/storefront and apps/admin. No request, query, upload or environment input supplies these patterns. fast-glob's brace expansion defaults on; it invokes micromatch.braces, which skips the braces function for patterns without paired braces. Merely having braces loaded is distinct from invoking its vulnerable parser/walkers.

A bounded, local four-file ESLint probe wrapped module loads/globSync and the braces main export in a disposable process. Results: zero lint errors, eight glob calls, exactly the two configured roots, no braces in their patterns, braces module loaded once, main function invoked zero times. No deeply nested pattern, denial-of-service payload or shared infrastructure test was executed. The probe observes the normal current path only; it is not a proof that all future inputs are safe and does not instrument every exported method.

| Context                 | Current input control and assessment                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal development lint | Patterns come from reviewed config and checkout path. No public attacker input observed. Local checkout/config changes can increase risk; dev-only does not mean harmless.                                                                                                                                                                                                                                                                                                                     |
| Untrusted PR CI         | Contributors can modify executable config/source and thus supply malicious patterns or arbitrary code. A tool-process/job availability failure and resource consumption remain plausible. Read-only token, no production secrets, ephemeral hosted runner, 20-minute timeout and PR-scoped concurrency limit blast radius; they do not eliminate DoS or make the dependency fixed. A hostile PR can already execute a loop directly, but that does not justify silently ignoring this finding. |
| SSR/frontend server     | No affected import or traced dependency found; current placeholder requests are not converted to glob patterns. No observed route from HTTP input to braces in the examined build.                                                                                                                                                                                                                                                                                                             |
| Nest API                | Health-only controller and bootstrap have no glob processing or affected import. No observed HTTP path to the package.                                                                                                                                                                                                                                                                                                                                                                         |
| Production runtime      | No affected dependency in the production graph/inspected output. External deployed closure is not attested; future dynamic glob features/full-toolchain runtime packaging require reassessment.                                                                                                                                                                                                                                                                                                |

## Official advisory and upstream position

[Reviewed GitHub advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): affects <=3.0.3; patched versions None. [Upstream issue #70](https://github.com/micromatch/braces/issues/70) remains open with eight comments, updated 2026-10-05. The maintainer disputes the threat model and points to maxLength/input control, while the advisory still classifies the issue high. Both facts are recorded; neither assertion is treated as an accepted CommerceHub risk decision.

Installed braces parse.js enforces maxLength with an internal 10,000-character cap, but that alone is not proof against all recursive/regex resource exhaustion. No threshold modification or exploit reproduction was attempted. npm metadata today: braces latest 3.0.3; micromatch latest 4.0.8 still requires braces ^3.0.3; fast-glob latest 3.3.3 still requires micromatch ^4.0.8; Next ESLint latest 16.4.2 still pins fast-glob 3.3.1. No compatible published fix was identified.

## Options reviewed in the requested order

| Option                           | Compatibility/security                                                                                                                                                                                                                                                                                                                 | Complexity and required proof                                                                                                                                              | Disposition                                                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A. Supported patched release     | Preferred real remediation if available; currently none in the exact chain. Updating fast-glob alone does not remove the advisory.                                                                                                                                                                                                     | Low/medium once published: review upstream fix, manifest/lock diff, full audit, lint-rule fixtures, builds/tests and runtime closure.                                      | Not currently available. Do not guess or downgrade versions.                                                                                                                                                       |
| B. Compatible replacement        | No verified supported drop-in replacement found for the official Next plugin's full rule set. A fast-glob/glob-engine fork or source patch could retain API shape but is not automatically compatible.                                                                                                                                 | Medium/high: own patch/fork provenance, upstream API/semantics, filesystem/monorepo tests, all Next rule behavior, malicious-input safety and independent security review. | Do not apply in this review. A source patch is not interchangeable with an upstream supported release.                                                                                                             |
| C. Remove the chain              | Removing the official plugin loses Next-specific rules (e.g. async client components, next/script, document/head and link constraints); React/TS/Hooks/a11y do not replace them. Disabling one rule leaves the installed dependency/audit finding. Vendoring every required Next rule plus a safe resolver would be a maintained fork. | High if preserving coverage; require equivalent normal/error fixtures for every enabled Next rule, upstream drift tracking and security/compatibility review.              | Simple removal is incompatible with approved lint coverage. No safe minimal removal identified.                                                                                                                    |
| D. Narrow time-limited exception | Preserves exact versions and lint coverage while explicitly accepting residual development/CI availability risk. It does not fix/remediate braces or prove public-runtime safety forever.                                                                                                                                              | Medium: approved owner/expiry, exact graph/exposure checks, full audit reporting and fail-closed policy tests below.                                                       | **Recommended for owner consideration only**, conditional on documented constraints and willingness to accept residual CI risk. Otherwise retain the blocked full audit and wait for A or a reviewed B/C proposal. |

Official [Next ESLint reference](https://nextjs.org/docs/app/api-reference/config/eslint) confirms the plugin's distinct Next rules and rootDir path/glob capability. The project already uses the direct official plugin instead of the larger shareable config; removing the latter is not another available fix.

## D: proposed exception contract - NOT ACTIVE

- Status PROPOSED; approval timestamp, approved policy commit and actual expiry are unset. Proposed accountable owner: **ZeyaadAly (CommerceHub project owner)**, to explicitly accept responsibility and residual risk. No owner signature/approval is inferred.
- Identity: exactly GHSA-vfj7-8cjw-p6xm, braces@3.0.3, high severity, the sole exact development finding/path above, and exactly plugin16.4.2/fast-glob3.3.1/micromatch4.0.8/braces3.0.3 in the resolved lock graph. No wildcard advisory/package/path or global severity exception.
- Proposed lifetime: **14 days from the recorded approval timestamp, in UTC**, never more than 30 days; reject malformed/future approval timestamps or expiry beyond approval+14 days. If approved 2026-10-19T12:00:00Z, expiry would be 2026-11-02T12:00:00Z. That is an example, not actual approval. At now >= expiry, fail closed; no automatic renewal.
- Reassessment: owner schedules approval+7-day review and pre-expiry review, plus checks at every PR CI invocation. Recheck official advisory, upstream issue/package releases, full audit, production closure and glob-input call sites. No reminder, scheduled workflow or external message was created by this proposal. Approval must include the actual review dates/reminder responsibility; missed scheduled review suspends the proposed exception.
- Always execute the **full** pnpm audit --audit-level high --json and preserve original exit code/report. Report the high finding visibly as TEMPORARILY ACCEPTED RISK, NOT REMEDIATED, with owner/expiry and original counts. Never use production-only filtering, a lower threshold, blanket ignore flags or shell success masking.
- A future approved evaluator may convert only this verified exact policy match into an allowed risk outcome. It must fail for **every other high/critical finding**, additional matching paths/findings, critical escalation, changed package/version/chain/dev classification, incomplete/malformed report, unsupported schema, registry/tool errors, missing approval/owner, invalid clock/expiry or unavailable exposure evidence. Nonzero audit exit alone is never evidence of the allowed case.
- Increased exposure revokes the policy: any production graph/trace/import inclusion, dynamic/untrusted brace-pattern input in a maintained call site, full development-toolchain runtime packaging or changed dependency identity requires another decision. Fresh CI builds and closure/input verification are required before the exception can be relied on. A self-editable PR policy is not tamper-proof; owner review of workflow/policy changes and eventual main protection remain necessary.
- Supported patch availability triggers owner review and disables renewal. Review the scoped update/removal diff; remove the exact exception/evaluator record once full audit is clean, rerun positive/negative policy tests and CI, then record closure. An exception is not a vulnerability fix even if its workflow result is allowed.

No exception code, JSON allowlist, dependency change or workflow threshold change has been implemented.

## Reproducible verification design

Current evidence can be repeated without installation or state mutation:

```powershell
pnpm.cmd why braces -r
pnpm.cmd list braces --prod -r --depth Infinity --json
pnpm.cmd audit --audit-level high --json
pnpm.cmd audit --prod --audit-level high --json
Get-FileHash pnpm-lock.yaml -Algorithm SHA256
```

The production-only audit is diagnostic only. Parse all .next/**/*.nft.json files, resolve each files entry against its trace directory, and check resolved paths for braces, micromatch, fast-glob and eslint-plugin-next (including next/dist/compiled variants). Inspect .next/server and .next/static files for package paths and implementation identifiers; review generic hits in context, not as automatic package matches. Inspect API emitted imports and full production graph. Record build IDs, file/reference/missing counts and clean source revision. Rebuild and repeat on the exact Linux candidate after any separately authorized fix/exception implementation; do not claim today's local outputs attest a deployed filesystem.

The bounded lint probe can be repeated in a fresh local Node process by wrapping Module._load, observing fast-glob.globSync patterns and counting invocation of the braces main export, then linting only the two apps' page/layout files with the existing ESLint API. Assert the two root paths, no braces in them and no public-input transformation. Do not generate deep/recursive patterns. Temporary probe/results are under ignored .verification; no tracked application/tool file was edited.

Future exception-evaluator tests, **DESIGN ONLY / NOT RUN**:

| Fixture                                                                                       | Required result                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Unmodified full audit captured today, raw command                                             | Exit 1 and visible high finding (observed)                                            |
| Exact sole advisory/graph, approved unexpired policy and verified bounded exposure            | Proposed evaluator allowed-risk outcome only; original high finding remains displayed |
| Add unrelated high or critical advisory                                                       | Fail, even when the allowed GHSA also matches                                         |
| Change GHSA/package/version/path/count, dev=false, bundled runtime or severity=critical       | Fail                                                                                  |
| Expired at boundary, missing owner/approval, date >14 days, future timestamp or missed review | Fail                                                                                  |
| Invalid JSON, missing fields/schema, registry timeout/non-audit failure                       | Fail closed                                                                           |
| Production graph/trace/import hit, changed roots/dynamic input or missing artifact proof      | Fail and require owner reassessment                                                   |
| Supported fix reviewed/installed and full audit clean                                         | Remove obsolete exception and pass unfiltered audit; no lingering accepted-risk entry |

Use sanitized audit JSON and benign path/clock fixtures; no real credentials or DoS payload is required. Tests must verify exit codes, original finding visibility, exception removal and no changes to credentials/application source. No evaluator tests or green CI result are claimed in this review.

## Commands and actual outcomes

| Command/inspection                                 | Actual result                                                                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Git branch/HEAD/status                             | Correct branch, 419993d..., initial tree clean; PR8 open/unmerged                                                        |
| pnpm why braces -r                                 | Exit 0, one exact root development chain                                                                                 |
| pnpm list braces --prod -r --depth Infinity --json | Exit 0, no braces across root/seven workspaces                                                                           |
| pnpm audit --audit-level high --json               | Exit 1, one high finding, no patched_versions                                                                            |
| pnpm audit --prod --audit-level high --json        | Exit 0, zero advisories; 185 production/optional dependency entries                                                      |
| Artifact/trace analysis                            | Exit 0, counts above; zero missing trace references, no affected chain paths; broad generic cache-constant hits reviewed |
| Four-file bounded ESLint probe                     | Exit 0, zero errors; eight fixed-root calls, braces loaded once/main calls zero                                          |
| Official npm metadata and issue/comments API       | Read successfully; current versions/maintainer position recorded above                                                   |
| Build/install/runtime/DoS tests                    | NOT RUN; existing output inspected, no install or shared-infrastructure payload                                          |

## Decision requested and outstanding acceptance

Owner must separately decide whether to authorize implementing D with its exact match/exposure/expiry safeguards, retain the blocking audit pending an upstream patch, or request a separately reviewed B/C engineering proposal. **Approval of this document must not be inferred from the review request.** Dependency versions, CI allowlists, thresholds and branch rules remain unchanged until a new explicit authorization.

CH-P0-005 remains REVIEW: fully green CI, effective required-check protection, failed-PR merge blocking and full green recovery remain blocked/unverified. Earlier Linux quality/negative-test evidence is preserved in [implementation verification](CH-P0-005.md). PR8 stays OPEN and UNMERGED. No next story, infrastructure/data operation, specialist gate closure, commit or push is performed here.
