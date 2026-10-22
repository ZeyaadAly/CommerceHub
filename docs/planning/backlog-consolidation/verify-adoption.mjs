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

const expectedOwnerDecisions = [
  {
    id: 'M-01',
    option: 'shared',
    date: '2026-10-22',
    by: 'ZeyaadAly',
    status: 'OWNER DIRECTION APPROVED / TECHNICAL MAPPING PENDING',
    scope:
      'Shared users identity, explicit staff membership, separate storefront/admin audiences only.',
    notApproved:
      'Email normalization, final field/constraint mapping, token/session lifecycle, permission identifiers/delegation and Security/Backend/Data sign-offs NOT APPROVED.',
    specialistReview: 'PENDING',
    evidence: 'docs/implementation/approval-register.md',
    packet: 'docs/architecture/decisions/CH-02-M-specialist-review.md',
  },
  {
    id: 'M-02',
    option: 'normalized',
    date: '2026-10-22',
    by: 'ZeyaadAly',
    status: 'OWNER DIRECTION APPROVED / CONSTRAINT REVIEW PENDING',
    scope: 'Normalized relational catalog tables and applicable database-enforced integrity only.',
    notApproved:
      'Final field/constraint/index/composite/SQL-only mapping and specialist sign-offs NOT APPROVED; no service-only integrity substitute.',
    specialistReview: 'PENDING',
    evidence: 'docs/implementation/approval-register.md',
    packet: 'docs/architecture/decisions/CH-02-M-specialist-review.md',
  },
  {
    id: 'M-03',
    option: 'review',
    date: '2026-10-22',
    by: 'ZeyaadAly',
    status: 'OWNER REQUESTED FINANCIAL REVIEW / POLICY PENDING',
    scope: 'Financial review requested; no precision, scale, range or zero-price selection.',
    notApproved:
      'All monetary column implementation and financial policy NOT APPROVED, including illustrative NUMERIC(19,4).',
    specialistReview: 'PENDING',
    evidence: 'docs/implementation/approval-register.md',
    packet: 'docs/architecture/decisions/CH-02-M-specialist-review.md',
  },
  {
    id: 'M-04',
    option: 'split',
    date: '2026-10-22',
    by: 'ZeyaadAly',
    status: 'OWNER DIRECTION APPROVED / DETAILED OWNERSHIP REVIEW PENDING',
    scope:
      'M offline identity/catalog contracts; DB reviewed baseline application; A early durable audit; PERSIST order/payment/idempotency/outbox coordination only; graph unchanged.',
    notApproved:
      'Detailed table/FK/order/SQL-only contribution mapping, state enums, retention and specialist sign-offs NOT APPROVED.',
    specialistReview: 'PENDING',
    evidence: 'docs/implementation/approval-register.md',
    packet: 'docs/architecture/decisions/CH-02-M-specialist-review.md',
  },
];

export function validateStatus(record, definitions, nodes) {
  assert.deepEqual(
    record.ownerDecisionRecords,
    expectedOwnerDecisions,
    'Owner direction cannot stand in for specialist approval',
  );
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
    assert.equal(parent.status, [0, 2, 9].includes(index) ? 'IN PROGRESS' : 'NOT STARTED');
  }
  assert.deepEqual(
    record.milestoneStates.map(({ id, parent }) => ({ id, parent })),
    nodes.map(({ id, parent }) => ({ id, parent })),
  );
  for (const [index, state] of record.milestoneStates.entries()) {
    const done = ['F', 'C', 'D', 'API'].includes(state.id);
    const review = state.id === 'T';
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
              : state.id === 'T'
                ? 'AUTHORIZED: OWNER CH-10/T IMPLEMENTATION 2026-10-21'
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
    if (state.id === 'D') {
      assert.equal(state.evidence, 'docs/architecture/decisions/decision-matrix.md');
      assert.deepEqual(state.acceptance, {
        pr: 24,
        merge: 'ffa113804b4c38237576e6fafaf637cb50779f01',
        head: '7c2bffeb4c9dfcfaf5e427372a1c5ec1783e9ac8',
        ciRun: 39580624120,
        ciJob: 119157028654,
        acceptedBy: 'ZeyaadAly',
        basis:
          'Owner merge plus explicitly authorized evidence-based bounded preparation acceptance; no specialist policy approval.',
      });
      assert.match(
        read(state.evidence).split('<!-- CH-01-D PREPARATION REPORT:')[0],
        /D is DONE for bounded CH-P0-008 preparation only/,
      );
    }
    if (state.id === 'API') {
      assert.equal(state.evidence, 'docs/verification/CH-03-API.md');
      assert.match(read(state.evidence), /Status: DONE for the bounded transport/);
      assert.deepEqual(state.acceptance, {
        pr: 25,
        merge: 'b6b19a66fc28729b12cf0a03539ac83723eeb24d',
        head: '55a0874ab08c46c280244e9c0e96fca0ca4e811b',
        ciRun: 39598354103,
        ciJob: 119216220179,
        acceptedBy: 'ZeyaadAly',
        basis:
          'Owner merge plus explicitly authorized evidence-based bounded acceptance reconciliation; no specialist gate closure.',
      });
    }
    if (state.id === 'T') {
      assert.equal(state.evidence, 'docs/verification/CH-10-T.md');
      assert.equal(state.preparationStatus, 'APPROVED FOR BOUNDED IMPLEMENTATION');
      assert.deepEqual(state.approval, {
        decisions: ['D1', 'D2', 'D3', 'D4'],
        by: 'ZeyaadAly',
        date: '2026-10-21',
        scope:
          'Shared tokens, presentation primitives, representative responsive test compositions, accessibility/testing only; no feature-page UX or specialist gate closure.',
      });
      assert.match(read(state.evidence), /Status: REVIEW/);
    }
    if (review) {
      assert.equal(
        state.evidence,
        state.id === 'D'
          ? 'docs/architecture/decisions/decision-matrix.md'
          : 'docs/verification/CH-10-T.md',
      );
      assert.match(read(state.evidence), /Status: REVIEW/);
    }
    assert.deepEqual(
      state.unmetPrerequisites,
      nodes[index].depends.filter((id) => !['F', 'C', 'D', 'API'].includes(id)),
    );
  }
  assert.equal(record.firstRecommendedMilestone, 'M');
  assert.match(record.nextRecommendedTask, /no independently implementation-ready/);
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
    } else if (file === '.github/workflows/ci.yml') {
      const insertion = '      - name: Existing and tooling tests\n        run: pnpm test\n';
      const extra =
        '      - name: Install Chromium for presentation tests\n        run: pnpm --filter @commercehub/ui exec playwright install --with-deps chromium\n      - name: Browser interaction, accessibility and responsive checks\n        run: pnpm test:ui:browser\n      - name: Both application styles consume the shared theme\n        run: pnpm test:ui:apps\n';
      assert.equal(
        read(file),
        historical(file).replace(insertion, insertion + extra),
        'Original required CI weakened or unrelated change',
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

// T implementation scope is explicit; backend, feature routes and infrastructure stay frozen.
const acceptedMerge = '5c31a735251eeb179ae3a8b174b49f8ac13004d6';
const apiStart = 'ffa113804b4c38237576e6fafaf637cb50779f01';
const readinessStart = 'b6b19a66fc28729b12cf0a03539ac83723eeb24d';
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
const implementationStart = 'e96b7c410b6183edb6bf9bde1c002df4a9c4a9b8';
const allowed = new Set([
  'package.json',
  'pnpm-lock.yaml',
  '.github/workflows/ci.yml',
  'scripts/ci.test.mjs',
  'scripts/scaffold.test.mjs',
  'apps/admin/package.json',
  'apps/storefront/package.json',
  'apps/admin/app/globals.css',
  'apps/storefront/app/globals.css',
  'apps/admin/app/page.tsx',
  'apps/storefront/app/page.tsx',
  'packages/ui/package.json',
  'packages/ui/tsconfig.json',
  'packages/ui/README.md',
  'packages/ui/src/index.ts',
]);
for (const args of [
  ['diff', '--name-only', implementationStart, '--', ...scope],
  ['ls-files', '--others', '--exclude-standard', '--', ...scope],
]) {
  const files = execFileSync('git', args, { cwd: root, encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
  for (const file of files)
    assert.ok(
      allowed.has(file) || /^packages\/ui\/(?:src\/(?:components|styles|lib)|test)\//.test(file),
      'Outside T scope: ' + file,
    );
}
const handoffParts = read('docs/design/CH-10-T-handoff.md').split(
  '<!-- CH-10-T READINESS REPORT: e96b7c410b6183edb6bf9bde1c002df4a9c4a9b8 -->\n\n',
);
assert.equal(handoffParts.length, 2);
assert.equal(
  handoffParts[1],
  normalize(
    execFileSync('git', ['show', implementationStart + ':docs/design/CH-10-T-handoff.md'], {
      cwd: root,
      encoding: 'utf8',
    }),
  ),
);
assert.match(handoffParts[0], /D1–D4 APPROVED/);
assert.equal(
  read('docs/verification/CH-03-API.md'),
  normalize(
    execFileSync('git', ['show', implementationStart + ':docs/verification/CH-03-API.md'], {
      cwd: root,
      encoding: 'utf8',
    }),
  ),
  'Accepted API evidence changed',
);
const apiReport = read('docs/verification/CH-03-API.md').split(
  '<!-- CH-03-API IMPLEMENTATION REPORT: b6b19a66fc28729b12cf0a03539ac83723eeb24d -->\n\n',
);
assert.equal(apiReport.length, 2);
assert.equal(
  apiReport[1],
  normalize(
    execFileSync('git', ['show', readinessStart + ':docs/verification/CH-03-API.md'], {
      cwd: root,
      encoding: 'utf8',
    }),
  ),
  'Original API REVIEW report changed',
);
execFileSync(
  'git',
  ['merge-base', '--is-ancestor', '55a0874ab08c46c280244e9c0e96fca0ca4e811b', readinessStart],
  { cwd: root },
);
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
const matrixParts = read(`${adrFolder}/decision-matrix.md`).split(
  '<!-- CH-01-D PREPARATION REPORT: ffa113804b4c38237576e6fafaf637cb50779f01 -->\n\n',
);
assert.equal(matrixParts.length, 2);
const [readiness, matrix] = matrixParts;
assert.match(readiness, /M NOT STARTED \/ BLOCKED \/ NOT AUTHORIZED/);
assert.match(readiness, /Nine ADR policies remain PROPOSED\/unsigned/);
for (const id of ['M-01', 'M-02', 'M-03', 'M-04', 'X-01', 'X-02'])
  assert.ok(readiness.includes(id));
assert.match(readiness, /Specialist review for every decision is PENDING/);
const approvalRegister = read('docs/implementation/approval-register.md').split(marker)[0];
const specialistPacket = read('docs/architecture/decisions/CH-02-M-specialist-review.md');
for (const decision of expectedOwnerDecisions) {
  assert.ok(readiness.includes(decision.status));
  assert.ok(approvalRegister.includes(decision.status));
  assert.ok(approvalRegister.includes(decision.scope));
  assert.ok(approvalRegister.includes(decision.notApproved));
  assert.ok(approvalRegister.includes('`' + decision.option + '`'));
}
assert.match(approvalRegister, /2026-10-22/);
assert.match(approvalRegister, /ZeyaadAly/);
assert.match(approvalRegister, /technical sign-off PENDING/);
assert.match(
  specialistPacket,
  /Named specialist reviewer\/signature\/date for each packet: \*\*PENDING \/ NOT RECORDED/,
);
assert.match(specialistPacket, /No Prisma models, SQL, migrations or database tests executed/);
assert.match(specialistPacket, /RECOMMENDATION ONLY/);
assert.match(readiness, /Conditional next Codex prompt/);
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
// PR #24 was squash-merged: exact tree equality proves integrated head content.
assert.equal(
  execFileSync('git', ['rev-parse', '7c2bffeb4c9dfcfaf5e427372a1c5ec1783e9ac8^{tree}'], {
    cwd: root,
    encoding: 'utf8',
  }),
  execFileSync('git', ['rev-parse', 'ffa113804b4c38237576e6fafaf637cb50779f01^{tree}'], {
    cwd: root,
    encoding: 'utf8',
  }),
);
// This reconciliation changes no application, dependency or infrastructure bytes.
assert.equal(
  execFileSync('git', ['diff', '8865e51524363161122d20e75f5dac9946e20175', '--', ...scope], {
    cwd: root,
    encoding: 'utf8',
  }),
  '',
);
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
    record.ownerDecisionRecords[0].option = 'separate';
  },
  (record) => {
    record.ownerDecisionRecords[1].status = 'APPROVED';
  },
  (record) => {
    record.ownerDecisionRecords[2].specialistReview = 'APPROVED';
  },
  (record) => {
    record.ownerDecisionRecords[2].scope = 'NUMERIC(19,4) approved';
  },
  (record) => {
    record.ownerDecisionRecords[3].date = '2026-10-21';
  },
  (record) => {
    record.ownerDecisionRecords[3].by = 'specialist';
  },
  (record) => {
    record.ownerDecisionRecords[0].notApproved = '';
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'D').acceptance.head = base;
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'D').acceptance.acceptedBy = 'unknown';
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'M').unmetPrerequisites = ['D'];
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'M').readiness = 'READY FOR AUTHORIZATION';
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'M').authorization = 'AUTHORIZED';
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'T').approval.decisions.pop();
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'T').authorization = 'AUTHORIZED';
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'T').status = 'DONE';
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'T').readiness = 'BLOCKED';
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'API').acceptance.head = base;
  },
  (record) => {
    record.milestoneStates.find((state) => state.id === 'API').status = 'REVIEW';
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
    record.milestoneStates[2].status = 'REVIEW';
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
      rejectedMutations: 28,
      proposedADRs: adrFiles.length,
      implementationAuthorized: false,
    },
    null,
    2,
  ),
);
