// Offline planning-retention checks only. No app/service/credential/network access.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const folder = import.meta.dirname;
const root = path.resolve(folder, '../../..');
const read = (p) => readFileSync(path.resolve(root, p), 'utf8').replace(/\r\n/g, '\n');
const json = (name) => JSON.parse(readFileSync(path.join(folder, name), 'utf8'));
const sha = (s) => createHash('sha256').update(s).digest('hex');
const inventory = json('inventory.json');
const stories = json('stories.json');
const milestones = json('milestones.json');
const known = new Set(stories.map((s) => s.id));
const oldId = (n) => `CH-P${n <= 48 ? 0 : n <= 56 ? 1 : 2}-${String(n).padStart(3, '0')}`;
const ch = (n) => `CH-${String(n).padStart(2, '0')}`;
assert.equal(inventory.status, 'PROPOSED');
assert.equal(inventory.baseline, '107da8c70adc71cbbd861a430d7758a13f00e1df');
assert.equal(stories.length, 21);
assert.equal(known.size, 21);
assert.deepEqual(
  stories.map((s) => s.id),
  Array.from({ length: 21 }, (_, i) => ch(i + 1)),
);
const ownership = new Map();
for (const s of stories) {
  for (const field of [
    'id',
    'name',
    'objective',
    'scope',
    'originalStories',
    'requirementIds',
    'dependencies',
    'references',
    'gates',
    'acceptance',
    'tests',
    'deliverables',
    'definitionOfDone',
  ]) {
    assert.ok(s[field]?.length, `${s.id}: missing ${field}`);
  }
  assert.equal(s.status, 'PROPOSED / NOT AUTHORIZED');
  assert.equal(
    s.phase,
    Number(s.id.slice(3)) <= 15 ? 'P0' : Number(s.id.slice(3)) <= 20 ? 'P1' : 'P2',
  );
  for (const id of s.originalStories) {
    assert.ok(!ownership.has(id), `Duplicate owner for ${id}`);
    ownership.set(id, s.id);
    assert.equal(id.slice(3, 5), s.phase, `Phase changed for ${id}`);
  }
}
assert.equal(ownership.size, 59);
for (let i = 1; i <= 59; i++) assert.ok(ownership.has(oldId(i)), `Missing ${i}`);
const original = read('docs/08-epics-and-stories.md');
const matches = [...original.matchAll(/^#### (CH-P\d-\d{3}) — (.+)$/gm)];
assert.equal(matches.length, 59);
const tracker = read('docs/implementation/story-tracker.md');
let acceptanceCount = 0;
const edges = [];
for (const [i, m] of matches.entries()) {
  const s = inventory.originalStories[i];
  assert.equal(s.id, m[1]);
  const end = matches[i + 1]?.index ?? original.indexOf('\n## Execution and sequencing', m.index);
  const text = original.slice(m.index, end).trimEnd();
  assert.equal(s.verbatimSpecification, text, `${s.id}: source spec changed`);
  assert.equal(s.sha256, sha(text));
  const ac = text.match(/\*\*Acceptance criteria:\*\*\n([\s\S]*?)\n\n\*\*Verification:/)[1];
  assert.equal(s.acceptance, ac);
  acceptanceCount += [...ac.matchAll(/^\d\. /gm)].length;
  assert.equal(s.consolidated, ownership.get(s.id));
  const row = tracker.split('\n').find((l) => l.startsWith(`| ${s.id} |`));
  assert.equal(s.trackerRow, row, `${s.id}: evidence changed`);
  assert.equal(s.historicalStatus, row.split('|')[8].trim());
  assert.equal(s.gates, text.match(/\*\*Decision gates:\*\* `([^`]+)`/)[1]);
  const deps = text.match(/\*\*Dependencies:\*\* `([^`]+)`/)[1];
  assert.deepEqual(
    s.declaredDependencies,
    deps === 'none' ? [] : deps.split(',').map((v) => oldId(Number(v.trim()))),
  );
  for (const p of s.declaredDependencies)
    edges.push({
      from: p,
      to: s.id,
      fromParent: ownership.get(p),
      toParent: s.consolidated,
      disposition:
        'Original edge retained verbatim; applies until approved milestone repair in schedule.md. Grouping alone grants no exception.',
    });
}
assert.equal(acceptanceCount, 295);
assert.deepEqual(inventory.dependencyEdges, edges);
assert.equal(edges.length, 100);
assert.deepEqual(
  inventory.originalStories.filter((s) => s.historicalStatus === 'DONE').map((s) => s.id),
  Array.from({ length: 5 }, (_, i) => oldId(i + 1)),
);
assert.equal(inventory.originalStories.find((s) => s.id === oldId(6)).historicalStatus, 'BLOCKED');

const prd = read('docs/02-prd.md');
const fr = [...prd.matchAll(/^\*\*(CH-[A-Z]+(?:-[A-Z]+)?-\d{3}) \[(P\d)\].*$/gm)].map((m) => ({
  id: m[1],
  phase: m[2],
  verbatim: m[0],
}));
const nfr = prd.split('\n').filter((l) => /^\| NFR-/.test(l));
assert.equal(fr.length, 59);
assert.equal(nfr.length, 19);
assert.equal(inventory.requirements.length, 78);
const trace = read('docs/implementation/requirements-traceability.md');
for (const r of inventory.requirements) {
  assert.equal(
    r.verbatim,
    fr.find((f) => f.id === r.id)?.verbatim ?? nfr.find((l) => l.split('|')[1].trim() === r.id),
  );
  assert.equal(
    r.traceabilityRow,
    trace.split('\n').find((l) => l.startsWith(`| ${r.id} |`)),
  );
  assert.ok(r.owners.length);
  assert.ok(r.owners.every((id) => known.has(id)));
  assert.ok(
    r.owners.some((id) => stories.find((s) => s.id === id).phase === r.phase),
    `${r.id}: no same-phase owner`,
  );
  if (r.phase !== 'P0')
    assert.ok(
      r.owners.every((id) => stories.find((s) => s.id === id).phase === r.phase),
      `${r.id}: promoted`,
    );
}
for (const s of stories)
  assert.deepEqual(
    s.requirementIds,
    inventory.requirements.filter((r) => r.owners.includes(s.id)).map((r) => r.id),
  );
for (const s of inventory.originalStories)
  assert.deepEqual(
    s.relatedRequirementIds,
    inventory.requirements.filter((r) => r.traceabilityRow.includes(s.id)).map((r) => r.id),
  );
const supplemental = read('docs/implementation/CH-P0-006-container-free-decision.md')
  .split('\n')
  .filter((l) => /^\| AC-006-\d\d\s*\|/.test(l));
assert.equal(supplemental.length, 15);
assert.deepEqual(inventory.supplementaryAcceptance, supplemental);
assert.deepEqual(
  inventory.acceptance006Status,
  Object.fromEntries(
    Array.from({ length: 15 }, (_, i) => [
      `AC-006-${String(i + 1).padStart(2, '0')}`,
      [1, 2, 3, 10, 11, 13, 15].includes(i + 1) ? 'PASS' : 'BLOCKED',
    ]),
  ),
);
assert.deepEqual(
  inventory.gateRows,
  read('docs/implementation/gate-register.md')
    .split('\n')
    .filter((l) => l.startsWith('|') && !/^\|[- :|]+$/.test(l)),
);
const ba = read('docs/implementation/baseline-audit.md')
  .split('\n')
  .filter((l) => /^\| BA-\d\d \|/.test(l));
assert.equal(ba.length, 26);
assert.deepEqual(
  inventory.findings.map((f) => f.verbatim),
  ba,
);

let units = 0;
for (const s of inventory.sources) {
  const text = read(s.path),
    lines = text.split('\n');
  assert.equal(sha(text), s.sha256, `${s.path}: baseline/history changed`);
  assert.equal(lines.length, s.lineCount);
  let next = 1;
  for (const u of s.units) {
    assert.equal(u.startLine, next, `${s.path}: uncovered lines`);
    assert.ok(u.endLine >= u.startLine);
    assert.equal(u.sha256, sha(lines.slice(u.startLine - 1, u.endLine).join('\n')));
    assert.ok(u.owners.length && u.owners.every((id) => known.has(id)));
    next = u.endLine + 1;
    units++;
  }
  assert.equal(next, lines.length + 1);
}
const expectedFacts = [];
for (const source of inventory.sources.slice(0, 8))
  read(source.path)
    .split('\n')
    .forEach((line, i) => {
      if (line.startsWith('|') && !/^\|[- :|]+$/.test(line))
        expectedFacts.push([source.path, i + 1, line]);
    });
assert.deepEqual(
  inventory.tableFacts.map((f) => [f.source, f.line, f.verbatim]),
  expectedFacts,
);

const nodeIds = new Set(milestones.map((n) => n.id));
assert.equal(nodeIds.size, milestones.length);
const visiting = new Set(),
  visited = new Set();
function visit(id) {
  assert.ok(nodeIds.has(id), `Missing milestone ${id}`);
  assert.ok(!visiting.has(id), `Milestone cycle at ${id}`);
  if (visited.has(id)) return;
  visiting.add(id);
  const n = milestones.find((n) => n.id === id);
  assert.ok(known.has(n.parent));
  assert.ok(n.meaning && n.gates);
  for (const d of n.depends) visit(d);
  visiting.delete(id);
  visited.add(id);
}
for (const id of nodeIds) visit(id);
assert.deepEqual(new Set(milestones.map((n) => n.parent)), known);
for (const n of milestones)
  for (const d of n.depends) {
    const a = stories.find((s) => s.id === n.parent).phase;
    const b = stories.find((s) => s.id === milestones.find((m) => m.id === d).parent).phase;
    assert.ok(a >= b, `Later phase prerequisite: ${d} -> ${n.id}`);
  }
let links = 0;
for (const file of readdirSync(folder).filter((p) => p.endsWith('.md'))) {
  for (const m of readFileSync(path.join(folder, file), 'utf8').matchAll(/\]\(([^)]+)\)/g)) {
    const target = m[1].split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    assert.ok(existsSync(path.resolve(folder, target)), `${file}: broken ${target}`);
    links++;
  }
}
console.log(
  JSON.stringify(
    {
      result: 'PASS',
      parents: 21,
      originalStories: 59,
      functionalRequirements: 59,
      nonfunctionalRequirements: 19,
      originalAcceptanceClauses: acceptanceCount,
      refined006Criteria: 15,
      originalEdges: edges.length,
      BA: 26,
      unchangedSources: inventory.sources.length,
      sourceUnits: units,
      verbatimTableRows: expectedFacts.length,
      proposedMilestones: milestones.length,
      acyclic: true,
      localLinks: links,
      limits:
        'Structural text/phase/edge/gate/history retention and proposed DAG checks; not semantic policy approval, implementation tests or specialist acceptance.',
    },
    null,
    2,
  ),
);
