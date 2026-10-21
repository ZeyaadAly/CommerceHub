// Offline checks of operative governance, separately from immutable history.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
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
    assert.equal(parent.status, index === 0 ? 'IN PROGRESS' : 'NOT STARTED');
  }
  assert.deepEqual(
    record.milestoneStates.map(({ id, parent }) => ({ id, parent })),
    nodes.map(({ id, parent }) => ({ id, parent })),
  );
  for (const [index, state] of record.milestoneStates.entries()) {
    const done = state.id === 'F';
    const ready = ['C', 'D'].includes(state.id);
    assert.equal(
      state.status,
      done ? 'DONE' : ['E_DB', 'E_QUEUE'].includes(state.id) ? 'BLOCKED' : 'NOT STARTED',
    );
    assert.equal(
      state.readiness,
      done ? 'SATISFIED' : ready ? 'READY FOR AUTHORIZATION' : 'BLOCKED',
    );
    assert.equal(state.authorization, done ? 'HISTORICAL ACCEPTED SCOPE' : 'NOT AUTHORIZED');
    assert.deepEqual(
      state.unmetPrerequisites,
      nodes[index].depends.filter((id) => id !== 'F'),
    );
  }
  assert.equal(record.firstRecommendedMilestone, 'C');
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
    assert.equal(read(file), historical(file), `Unapproved policy/evidence change: ${file}`);
  }
}
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
const markdown = execFileSync('git', ['ls-files', '*.md'], { cwd: root, encoding: 'utf8' })
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
      rejectedMutations: 5,
      implementationAuthorized: false,
    },
    null,
    2,
  ),
);
