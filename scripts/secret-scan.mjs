import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Deliberately bounded signatures, not a claim to detect every kind of secret.
const signatures = [
  ['private-key', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,})\b/],
  ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['stripe-live-key', /\b[rs]k_live_[A-Za-z0-9]{20,}\b/],
  ['supabase-secret-key', /\bsb_secret_[A-Za-z0-9_-]{20,}\b/],
];

export function detectSecrets(text) {
  return signatures.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
}

export function scanRepository({ root, base, head = 'HEAD' }) {
  const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 16 * 1024 * 1024 });
  if (base && !/^[a-f0-9]{40}$/.test(base)) throw new Error('SCAN_BASE must be a full commit SHA');
  if (head !== 'HEAD' && !/^[a-f0-9]{40}$/.test(head)) throw new Error('Invalid head SHA');
  const names = git(
    ...(base
      ? ['diff', '--no-ext-diff', '--name-only', '-z', '--diff-filter=ACMR', base, head, '--']
      : ['ls-files', '-z', '--cached', '--others', '--exclude-standard']),
  )
    .toString('utf8')
    .split('\0')
    .filter(Boolean);
  const findings = [];
  let total = 0;
  let binary = 0;
  for (const file of new Set(names)) {
    const content = base ? git('show', `${head}:${file}`) : readFileSync(path.join(root, file));
    total += content.length;
    if (content.length > 2 * 1024 * 1024 || total > 16 * 1024 * 1024) {
      throw new Error('Scan size limit exceeded; review scanner scope explicitly');
    }
    if (content.includes(0)) {
      binary++;
      continue;
    }
    for (const rule of detectSecrets(content.toString('utf8'))) findings.push({ file, rule });
  }
  return { files: new Set(names).size, binary, findings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = scanRepository({
      root: path.resolve(import.meta.dirname, '..'),
      base: process.env.SCAN_BASE || undefined,
    });
    // Never emit matched content, tokens, patches or GitHub annotations with values.
    console.log(JSON.stringify(result));
    if (result.findings.length) process.exitCode = 1;
  } catch {
    console.error('Secret scan failed; inspect range, file availability and size limits locally.');
    process.exitCode = 1;
  }
}
