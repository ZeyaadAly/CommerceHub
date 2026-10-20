import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { checkServerIdentity, TLSSocket } from 'node:tls';
import { Client } from 'pg';

export type VerificationResult = { status: 'PASS' | 'BLOCKED'; code: string };

export interface TargetManifest {
  organizationId: string;
  projectRef: string;
  projectName: string;
  environment: string;
  mode: string;
  host: string;
  port: number;
  database: string;
  user: string;
  custodyReviewed: boolean;
}

// Nonsecret identity digest from the owner-designated project's management metadata.
const approvedIdentity = '76065843e783b98ffee98833b9b44986d89cd61c9d5f2eeb43012bd552c5d068';
const blocked = (code: string): VerificationResult => ({ status: 'BLOCKED', code });

export function validateTarget(value: unknown): value is TargetManifest {
  return validateManifest(value, approvedIdentity);
}

// Pure validation seam: only validateTarget supplies production CLI authority.
export function validateManifest(value: unknown, identityDigest: string): value is TargetManifest {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  if (
    Object.keys(t).sort().join(',') !==
    'custodyReviewed,database,environment,host,mode,organizationId,port,projectName,projectRef,user'
  )
    return false;
  if (typeof t.organizationId !== 'string' || typeof t.projectRef !== 'string') return false;
  const digest = createHash('sha256').update(`${t.organizationId}:${t.projectRef}`).digest('hex');
  return (
    digest === identityDigest &&
    t.projectName === 'commercehub' &&
    t.environment === 'persistent-development' &&
    t.mode === 'direct' &&
    t.host === `db.${t.projectRef}.supabase.co` &&
    t.port === 5432 &&
    t.database === 'postgres' &&
    typeof t.user === 'string' &&
    /^[a-z_][a-z0-9_]{0,62}$/.test(t.user) &&
    t.custodyReviewed === true
  );
}

export function cleanProcessEnvironment(env: NodeJS.ProcessEnv): boolean {
  return !Object.keys(env).some((key) =>
    /^(PG|DATABASE_URL$|DIRECT_URL$|SUPABASE_DB|NODE_OPTIONS$|NODE_DEBUG|NODE_EXTRA_CA_CERTS$|NODE_TLS_REJECT_UNAUTHORIZED$)/.test(
      key,
    ),
  );
}

export interface ProbeInput {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ca: string;
}

// Low-level transport seam for loopback protocol tests. The CLI must validateTarget first.
// No pool, ORM, query callback, application bootstrap or process-env configuration.
export async function authenticateOnly(
  input: ProbeInput,
  deadlineMs = 10000,
): Promise<VerificationResult> {
  if (
    !Number.isInteger(deadlineMs) ||
    deadlineMs < 50 ||
    deadlineMs > 10000 ||
    !input.password ||
    !input.ca ||
    !cleanProcessEnvironment(process.env)
  )
    return blocked('CONFIG');
  const client = new Client({
    host: input.host,
    port: input.port,
    database: input.database,
    user: input.user,
    password: input.password,
    connectionTimeoutMillis: deadlineMs,
    sslnegotiation: 'postgres',
    ssl: {
      ca: input.ca,
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
      ...(isIP(input.host) ? {} : { servername: input.host }),
      checkServerIdentity,
    },
    enableChannelBinding: true,
  });
  // These pinned-driver internals are reviewed and covered by wire tests. Permit only
  // startup user/database, password/SASL messages and Terminate; never query/extended/cancel.
  const connection = client.connection as typeof client.connection & {
    _send: (buffer: Buffer) => boolean;
  };
  Object.assign(client, {
    getStartupConf: () => ({ user: input.user, database: input.database }),
    query: () => {
      throw new Error('QUERY_FORBIDDEN');
    },
  });
  const send = connection._send.bind(connection);
  let responses = 0;
  connection._send = (buffer) => {
    if (buffer[0] !== 0x70) {
      connection.stream.destroy();
      throw new Error('PROTOCOL_FORBIDDEN');
    }
    responses++;
    return send(buffer);
  };
  return new Promise((resolve) => {
    let finished = false;
    let authenticated = false;
    let challenged = false;
    let sasl = false;
    let saslFinal = false;
    const finish = (result: VerificationResult) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      connection.stream.destroy();
      resolve(result);
    };
    const timer = setTimeout(() => finish(blocked('TIMEOUT')), deadlineMs);
    client.on('error', () => finish(blocked('CONNECTION')));
    connection.on('error', () => finish(blocked('CONNECTION')));
    for (const event of [
      'authenticationSASL',
      'authenticationCleartextPassword',
      'authenticationMD5Password',
    ]) {
      connection.once(event, () => {
        challenged = true;
      });
    }
    connection.once('authenticationSASL', () => {
      sasl = true;
    });
    connection.once('authenticationSASLFinal', () => {
      saslFinal = true;
    });
    connection.once('authenticationOk', () => {
      if (finished) return;
      if (
        !challenged ||
        responses < 1 ||
        (sasl && (!saslFinal || responses !== 2)) ||
        !(connection.stream instanceof TLSSocket) ||
        !connection.stream.authorized
      ) {
        finish(blocked('AUTHENTICATION_OR_TLS'));
        return;
      }
      authenticated = true;
      // end() writes Terminate directly, then closes; never wait for/query ReadyForQuery.
      client.end().then(
        () => finish({ status: 'PASS', code: 'AUTHENTICATED_AND_CLOSED' }),
        () => finish(blocked('CLEANUP')),
      );
    });
    connection.once('end', () => {
      if (!authenticated) finish(blocked('CONNECTION'));
    });
    // Callback avoids an unobserved pending connect promise when terminating at AuthOK.
    client.connect((error: Error | undefined) => {
      if (error && !authenticated) finish(blocked('CONNECTION'));
    });
  });
}
