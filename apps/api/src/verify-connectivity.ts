import { execFileSync } from 'node:child_process';
import { X509Certificate } from 'node:crypto';
import { closeSync, lstatSync, openSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { authenticateOnly, cleanProcessEnvironment, validateTarget } from './connectivity';

export function consumeAttempt(file: string): void {
  closeSync(openSync(file, 'wx', 0o600));
}

// Explicit CLI only: main is never invoked by NestJS startup or CI tests.
async function main(): Promise<void> {
  let result = { status: 'BLOCKED', code: 'LOCAL_CUSTODY_OR_TARGET' };
  try {
    const root = path.resolve(__dirname, '../../..');
    if (
      process.argv.slice(2).join(' ') !== '--live-once' ||
      !cleanProcessEnvironment(process.env)
    ) {
      throw new Error('CONFIG');
    }
    const local = (name: string): string => {
      const relative = `apps/api/.env.connectivity-${name}`;
      execFileSync('git', ['check-ignore', '-q', '--', relative], { cwd: root, stdio: 'pipe' });
      const file = path.join(root, relative);
      const stat = lstatSync(file);
      if (
        !stat.isFile() ||
        stat.isSymbolicLink() ||
        stat.size > 65536 ||
        (process.platform !== 'win32' && (stat.mode & 0o077) !== 0)
      )
        throw new Error('CUSTODY');
      if (process.platform === 'win32') {
        // Conservative allowlist: current operator, SYSTEM and local Administrators only.
        // Never emit ACL contents or errors. No ACL is changed by the verifier.
        const script =
          `$ErrorActionPreference='Stop'; $a=Get-Acl -LiteralPath '${file.replace(/'/g, "''")}'; ` +
          `$sid=[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value; ` +
          `$allowed=@($sid,'S-1-5-18','S-1-5-32-544'); ` +
          `if($a.Access.Count -eq 0){exit 1}; ` +
          `foreach($r in $a.Access){if($r.AccessControlType -eq 'Allow' -and ` +
          `$r.IdentityReference.Translate([System.Security.Principal.SecurityIdentifier]).Value -notin $allowed){exit 1}}`;
        execFileSync(
          'powershell.exe',
          [
            '-NoProfile',
            '-NonInteractive',
            '-EncodedCommand',
            Buffer.from(script, 'utf16le').toString('base64'),
          ],
          { stdio: 'pipe', timeout: 5000 },
        );
      }
      return readFileSync(file, 'utf8');
    };
    const target: unknown = JSON.parse(local('target.json'));
    if (!validateTarget(target)) throw new Error('TARGET');
    const secret: unknown = JSON.parse(local('secret.json'));
    if (!secret || typeof secret !== 'object') throw new Error('CREDENTIALS');
    const credentials = secret as Record<string, unknown>;
    if (
      Object.keys(credentials).sort().join(',') !== 'password,user' ||
      credentials.user !== target.user ||
      typeof credentials.password !== 'string' ||
      !credentials.password ||
      credentials.password.length > 1024 ||
      credentials.password.includes('\0')
    ) {
      throw new Error('CREDENTIALS');
    }
    const ca = local('ca.pem');
    const certificate = new X509Certificate(ca);
    if (
      Date.parse(certificate.validFrom) > Date.now() ||
      Date.parse(certificate.validTo) <= Date.now()
    ) {
      throw new Error('CA');
    }
    // custodyReviewed records local custodian sign-off, not a cryptographic signature.
    // A persistent exclusive ledger consumes authorization BEFORE any DNS/socket creation.
    const ledger = 'apps/api/.env.connectivity-attempted';
    execFileSync('git', ['check-ignore', '-q', '--', ledger], { cwd: root, stdio: 'pipe' });
    consumeAttempt(path.join(root, ledger));
    result = await authenticateOnly({ ...target, password: credentials.password, ca });
  } catch {
    // No raw driver/filesystem/JSON exception, cause, URL, username or stack leaves the CLI.
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.status === 'PASS' ? 0 : 1;
}

if (require.main === module) {
  main().catch(() => {
    process.stderr.write('Connectivity verifier BLOCKED.\n');
    process.exitCode = 1;
  });
}
