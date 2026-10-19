import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const audit = {
  advisories: {},
  metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 } },
};
const additional = {
  advisories: {
    1240992: {
      github_advisory_id: 'GHSA-vfj7-8cjw-p6xm',
      module_name: 'braces',
      severity: 'high',
      vulnerable_versions: '<=3.0.3',
      patched_versions: null,
      patched_versions_unpublished: true,
      findings: [
        {
          version: '3.0.3',
          paths: ['.>@next/eslint-plugin-next>fast-glob>micromatch>braces'],
          dev: true,
          optional: false,
          bundled: false,
        },
      ],
    },
    additional: {
      github_advisory_id: 'GHSA-abcd-efgh-ijkl',
      module_name: 'braces',
      severity: 'critical',
      vulnerable_versions: '<=3.0.3',
      patched_versions: null,
      patched_versions_unpublished: true,
      findings: [
        {
          version: '3.0.3',
          paths: ['.>@next/eslint-plugin-next>fast-glob>micromatch>braces'],
          dev: true,
          optional: false,
          bundled: false,
        },
      ],
    },
  },
  metadata: {
    vulnerabilities: {
      info: 0,
      low: 0,
      moderate: 0,
      high: 1,
      critical: 1,
    },
  },
};
const scenarios = [
  {
    name: 'additional critical advisory',
    audit: additional,
    status: 1,
    now: '2026-10-19T12:00:00Z',
    error: 'Additional high/critical advisory',
  },
  {
    name: 'expired exception',
    audit,
    status: 0,
    now: '2026-11-02T00:00:00Z',
    error: 'Approval not yet valid or expired',
  },
];
const results = scenarios.map((scenario) => {
  const code = `import { evaluateAudit, readEvidence } from './scripts/check-dependency-audit.mjs'; evaluateAudit(${JSON.stringify({ status: scenario.status, stdout: JSON.stringify(scenario.audit) })}, readEvidence(), new Date(${JSON.stringify(scenario.now)}));`;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', code], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes(scenario.error), result.stderr);
  console.log(`${scenario.name}: evaluator exit ${result.status}; ${scenario.error}`);
  return result;
});
// Propagate the actual evaluator rejection to the required job; no real clock/feed/policy is changed.
process.exitCode = results[0].status;
