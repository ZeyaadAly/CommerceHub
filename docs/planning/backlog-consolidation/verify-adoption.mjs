// Offline checks of operative governance, separately from immutable history.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../../..');
const base = '8543df03c23423ff58d383dde0de2a5192725dbb';
const folder = 'docs/planning/backlog-consolidation/';
const marker = `<!-- LEGACY BASELINE: ${base} -->\n\n`;
const normalize = (text) => text.replace(/\r\n/g, '\n');
const read = (file) => normalize(readFileSync(path.join(root, file), 'utf8'));
const historical = (file) =>
  normalize(
    execFileSync('git', ['show', `${base}:${file}`], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    }),
  );
const json = (file) => JSON.parse(read(folder + file));
const adoption = json('adoption.json');
const stories = json('stories.json');
const milestones = json('milestones.json');
const inventory = json('inventory.json');

export function validateStatus(record, definitions, nodes) {
  assert.equal(record.state, 'ADOPTED');
  assert.equal(record.ownerApprovalDate, '2026-10-21');
  assert.equal(record.proposalPR, 21);
  assert.equal(record.proposalMerge, base);
  assert.equal(record.implementationAuthorized, false);
  assert.equal(record.managedRedisSpending, 'DEFERRED');
  assert.equal(record.dockerWslRequired, false);
  assert.equal(record.legacy006Status, 'BLOCKED');
  assert.deepEqual(
    record.parentStates.map(({ id }) => id),
    definitions.map(({ id }) => id),
  );
  for (const [index, parent] of record.parentStates.entries()) {
    assert.equal(parent.status, [0, 2].includes(index) ? 'IN PROGRESS' : 'NOT STARTED');
  }
  assert.deepEqual(
    record.milestoneStates.map(({ id, parent }) => ({ id, parent })),
    nodes.map(({ id, parent }) => ({ id, parent })),
  );
  for (const [index, state] of record.milestoneStates.entries()) {
    const done = ['F', 'C'].includes(state.id);
    const review = ['D', 'API'].includes(state.id);
    assert.equal(
      state.status,
      done
        ? 'DONE'
        : review
          ? 'REVIEW'
          : ['E_DB', 'E_QUEUE'].includes(state.id)
            ? 'BLOCKED'
            : 'NOT STARTED',
    );
    assert.equal(state.readiness, done || review ? 'SATISFIED' : 'BLOCKED');
    assert.equal(
      state.authorization,
      state.id === 'F'
        ? 'HISTORICAL ACCEPTED SCOPE'
        : state.id === 'C'
          ? 'AUTHORIZED: OWNER CH-01/C REQUEST 2026-10-21'
          : state.id === 'D'
            ? 'AUTHORIZED: OWNER CH-01/D PREPARATION 2026-10-21'
            : state.id === 'API'
              ? 'AUTHORIZED: OWNER CH-03/API REQUEST 2026-10-21'
              : 'NOT AUTHORIZED',
    );
    if (state.id === 'C') {
      assert.equal(state.evidence, 'docs/verification/CH-01-C.md');
      assert.match(read(state.evidence), /Status: DONE for the bounded/);
      assert.equal(state.acceptance.pr, 23);
      assert.equal(state.acceptance.merge, '5c31a735251eeb179ae3a8b174b49f8ac13004d6');
      assert.equal(state.acceptance.head, 'bded5b2b00029d2f894fa998df54a61c533e330d');
      assert.equal(state.acceptance.ciRun, 39574385677);
      assert.equal(state.acceptance.acceptedBy, 'ZeyaadAly');
    }
    if (review) {
      assert.equal(
        state.evidence,
        state.id === 'D'
          ? 'docs/architecture/decisions/decision-matrix.md'
          : 'docs/verification/CH-03-API.md',
      );
      assert.match(read(state.evidence), /Status: REVIEW/);
    }
    assert.deepEqual(
      state.unmetPrerequisites,
      nodes[index].depends.filter((id) => !['F', 'C'].includes(id)),
    );
  }
  assert.equal(record.firstRecommendedMilestone, 'T');
  assert.match(record.nextRecommendedTask, /preparation only/);
  assert.deepEqual(record.unchangedSpecialistGates, [
    'FIN-01',
    'FIN-02',
    'INV-01',
    'SEC-01',
    'PAY-01',
    'OPS-01',
    'LEG-01',
    'PAY-LIVE',
  ]);
  assert.deepEqual(record.ownershipMoves, {
    'CH-P0-031': 'CH-12',
    'CH-P0-032': 'CH-13',
    'CH-P0-041': 'CH-04',
    'CH-P0-042': 'CH-05',
    'CH-P0-044': 'CH-03',
  });
}
validateStatus(adoption, stories, milestones);
assert.deepEqual(adoption.acceptance006Status, inventory.acceptance006Status);
for (const file of ['stories.json', 'milestones.json', 'inventory.json']) {
  assert.equal(
    read(folder + file),
    historical(folder + file),
    `Approved definitions changed: ${file}`,
  );
}

const canonical = [
  'docs/07-implementation-plan.md',
  'docs/08-epics-and-stories.md',
  ...[
    'story-tracker',
    'task-readiness',
    'requirements-traceability',
    'approval-register',
    'github-workflow',
    'agent-instructions-plan',
  ].map((name) => `docs/implementation/${name}.md`),
];
const proposal = ['README', 'backlog', 'mapping', 'coverage', 'schedule'].map(
  (name) => `${folder}${name}.md`,
);
const prefixes = new Map();
for (const file of [...canonical, ...proposal]) {
  const parts = read(file).split(marker);
  assert.equal(parts.length, 2, `Missing/duplicate history boundary: ${file}`);
  assert.equal(parts[1], historical(file), `Historical text changed: ${file}`);
  assert.match(parts[0], /ADOPTED/);
  prefixes.set(file, parts[0]);
}
for (const file of canonical.slice(0, 3)) {
  const rows = [
    ...prefixes.get(file).matchAll(/^\| (CH-\d{2}) +\| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm),
  ];
  assert.equal(rows.length, 21, file);
  rows.forEach((row, index) => {
    assert.equal(row[1], stories[index].id);
    assert.equal(row[2].trim(), stories[index].phase);
    assert.equal(row[3].trim(), adoption.parentStates[index].status);
    assert.equal(row[4].trim(), stories[index].name);
  });
}
const trace = prefixes.get('docs/implementation/requirements-traceability.md');
const traceRows = [...trace.matchAll(/^\| ((?:CH|NFR)-[A-Z0-9-]+) +\| ([^|]+) \| ([^|]+) \|/gm)];
assert.equal(traceRows.length, 78);
for (const requirement of inventory.requirements) {
  const rows = traceRows.filter((row) => row[1] === requirement.id);
  assert.equal(rows.length, 1, requirement.id);
  assert.equal(rows[0][2].trim(), requirement.phase);
  assert.deepEqual(rows[0][3].trim().split(', '), requirement.owners);
}

const nested = [
  'apps/api',
  'apps/admin',
  'apps/storefront',
  'packages/ui',
  'packages/types',
  'packages/validation',
  'packages/api-client',
].map((dir) => `${dir}/AGENTS.md`);
const protectedFiles = new Set([
  ...inventory.sources.map(({ path: file }) => file),
  ...nested,
  'docs/implementation/gate-register.md',
  'security/dependency-exceptions.json',
  '.github/workflows/ci.yml',
]);
for (const file of protectedFiles) {
  if (!canonical.includes(file) && file !== 'AGENTS.md') {
    if (file === 'docs/implementation/gate-register.md') {
      const [original, appendix, extra] = read(file).split('\n<!-- CH-01-D PREPARATION -->\n');
      assert.equal(original, historical(file), 'Original gate register changed');
      assert.equal(extra, undefined);
      assert.equal(
        appendix,
        '\nPreparation checkpoint 2026-10-21: [single decision matrix](../architecture/decisions/decision-matrix.md) and nine PROPOSED ADR packets are REVIEW deliverables. Every original gate row, accountable role and closure obligation above is unchanged. No named specialist sign-off, policy approval or service verification is recorded; all gates remain OPEN.\n',
      );
    } else if (file === 'docs/architecture/decisions/README.md') {
      const [original, appendix, extra] = read(file).split('\n<!-- CH-01-D INDEX -->\n');
      assert.equal(original, historical(file), 'Original ADR convention changed');
      assert.equal(extra, undefined);
      assert.equal(
        appendix,
        '\nCurrent CH-01/D preparation: [single decision matrix](decision-matrix.md) indexes nine PROPOSED records and the deferred original ADR identifiers. Preparation is REVIEW, not specialist approval. This appendix leaves the original convention and authority text above unchanged.\n',
      );
    } else {
      assert.equal(read(file), historical(file), `Unapproved policy/evidence change: ${file}`);
    }
  }
}

// Current API authorization permits only the explicit transport/shared-contract surface.
const acceptedMerge = '5c31a735251eeb179ae3a8b174b49f8ac13004d6';
const scope = [
  'apps',
  'packages',
  'scripts',
  'security',
  'infrastructure',
  '.github',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.base.json',
];
const apiStart = 'ffa113804b4c38237576e6fafaf637cb50779f01';
const allowedImplementation = new Set([
  'apps/api/.env.example',
  'apps/api/package.json',
  'apps/api/src/main.ts',
  'apps/api/src/health.controller.ts',
  'apps/api/src/application.ts',
  'apps/api/src/generate-openapi.ts',
  'apps/api/src/common/filters/http-error.filter.ts',
  'apps/api/src/common/pipes/schema-validation.pipe.ts',
  'apps/api/src/common/http/configure.ts',
  'apps/api/src/common/http/context.ts',
  'apps/api/src/common/http/response.ts',
  'apps/api/src/common/openapi/document.ts',
  'apps/api/test/transport.test.mjs',
  'packages/types/src/index.ts',
  'packages/validation/src/index.ts',
  'packages/types/README.md',
  'packages/validation/README.md',
  'scripts/contracts.test.mjs',
  'scripts/scaffold.test.mjs',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
]);
for (const args of [
  ['diff', '--name-only', apiStart, '--', ...scope],
  ['ls-files', '--others', '--exclude-standard', '--', ...scope],
]) {
  const files = execFileSync('git', args, { cwd: root, encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
  for (const file of files)
    assert.ok(allowedImplementation.has(file), 'Outside API authorization: ' + file);
}
execFileSync(
  'git',
  ['merge-base', '--is-ancestor', 'bded5b2b00029d2f894fa998df54a61c533e330d', acceptedMerge],
  { cwd: root },
);
const cReport = read('docs/verification/CH-01-C.md').split(
  `<!-- CH-01-C IMPLEMENTATION REPORT: ${acceptedMerge} -->\n\n`,
);
assert.equal(cReport.length, 2);
assert.equal(
  cReport[1],
  normalize(
    execFileSync('git', ['show', `${acceptedMerge}:docs/verification/CH-01-C.md`], {
      cwd: root,
      encoding: 'utf8',
    }),
  ),
);
const adrFolder = 'docs/architecture/decisions';
const adrFiles = readdirSync(path.join(root, adrFolder)).filter((file) => /^ADR-\d{3}-/.test(file));
assert.deepEqual(adrFiles.map((file) => file.slice(4, 7)).sort(), [
  '003',
  '004',
  '005',
  '006',
  '007',
  '008',
  '009',
  '010',
  '014',
]);
for (const file of adrFiles) {
  const text = read(`${adrFolder}/${file}`);
  assert.equal(
    text,
    normalize(
      execFileSync('git', ['show', `${apiStart}:${adrFolder}/${file}`], {
        cwd: root,
        encoding: 'utf8',
      }),
    ),
    'API changed proposed ADR',
  );
  assert.match(text, /^Status: PROPOSED/m);
  assert.match(text, /^Owner: .+NOT RECORDED/m);
  assert.match(text, /^Gate: .+OPEN/m);
  assert.match(text, /Approval date\/signature: NOT RECORDED/);
  for (const heading of [
    'Context and approved constraints',
    'Options and trade-offs',
    'Recommendation and owner decision',
    'Security and operational effects',
    'API and database effects',
    'Evidence, approval and reversal',
  ]) {
    assert.ok(text.includes(`## ${heading}`), `${file}: ${heading}`);
  }
}
const matrix = read(`${adrFolder}/decision-matrix.md`);
assert.equal(
  matrix,
  normalize(
    execFileSync('git', ['show', `${apiStart}:${adrFolder}/decision-matrix.md`], {
      cwd: root,
      encoding: 'utf8',
    }),
  ),
);
for (let id = 1; id <= 15; id++) assert.ok(matrix.includes(`ADR-${String(id).padStart(3, '0')}`));
assert.match(matrix, /Status: REVIEW/);
const instructions = read('AGENTS.md');
assert.match(instructions, /One authorized milestone at a time/);
assert.match(instructions, /planning\/backlog-consolidation\/adoption.json/);
for (const heading of [
  'Stack and ownership',
  'Gates and conflict handling',
  'Security and commerce invariants',
  'Quality and verification',
]) {
  const section = (text) => text.split(`## ${heading}\n`)[1].split('\n## ')[0];
  assert.equal(section(instructions), section(historical('AGENTS.md')), heading);
}

let links = 0;
const markdown = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '--', '*.md'],
  { cwd: root, encoding: 'utf8' },
)
  .trim()
  .split('\n');
markdown.push(`${folder}adoption-verification.md`);
for (const file of new Set(markdown)) {
  const content = read(file);
  for (const [, target] of content.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(https?:|#|mailto:)/.test(target)) continue;
    const local = decodeURIComponent(target.split('#')[0].replace(/^<|>$/g, ''));
    assert.ok(
      existsSync(path.resolve(root, path.dirname(file), local)),
      `Broken link: ${file} -> ${target}`,
    );
    links++;
  }
}

// Mutation checks ensure authority/status/dependency regressions fail closed.
for (const mutate of [
  (record) => {
    record.milestoneStates.find((state) => state.id === 'API').status = 'DONE';
  },
  (record) => {
    record.implementationAuthorized = true;
  },
  (record) => {
    record.parentStates[0].status = 'DONE';
  },
  (record) => {
    record.milestoneStates[1].unmetPrerequisites = ['E_DB'];
  },
  (record) => {
    record.unchangedSpecialistGates.pop();
  },
  (record) => {
    record.ownershipMoves['CH-P0-044'] = 'CH-13';
  },
  (record) => {
    record.milestoneStates[1].status = 'REVIEW';
  },
  (record) => {
    record.milestoneStates[2].authorization = 'AUTHORIZED';
  },
  (record) => {
    record.milestoneStates[2].status = 'DONE';
  },
  (record) => {
    record.milestoneStates[1].acceptance.merge = base;
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'API').authorization = 'AUTHORIZED';
  },
]) {
  const invalid = structuredClone(adoption);
  mutate(invalid);
  assert.throws(() => validateStatus(invalid, stories, milestones));
}
console.log(
  JSON.stringify(
    {
      adoption: 'PASS',
      operativeStories: 21,
      milestones: 48,
      unchangedHistoricalDocuments: prefixes.size,
      protectedSources: protectedFiles.size,
      repositoryLocalLinks: links,
      rejectedMutations: 11,
      proposedADRs: adrFiles.length,
      implementationAuthorized: false,
    },
    null,
    2,
  ),
);
