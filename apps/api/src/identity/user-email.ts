export interface CanonicalUserEmail {
  readonly email: string;
  readonly emailNormalized: string;
}

const asciiLower = (value: string): string =>
  value.replace(/[A-Z]/g, (letter) => letter.toLowerCase());

/** CH-02/M-ID-1 syntax/identity only. Does not prove mailbox ownership. */
export function normalizeUserEmail(input: unknown): CanonicalUserEmail {
  if (
    typeof input !== 'string' ||
    input.length === 0 ||
    input.length > 254 ||
    /[^\x21-\x7e]/.test(input)
  ) {
    throw new TypeError('Invalid user email');
  }
  const parts = input.split('@');
  const [local, domain] = parts;
  if (
    parts.length !== 2 ||
    !local ||
    local.length > 64 ||
    !domain ||
    !/^[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)*$/.test(local)
  ) {
    throw new TypeError('Invalid user email');
  }
  for (const label of domain.split('.')) {
    if (
      label.length === 0 ||
      label.length > 63 ||
      !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)
    ) {
      throw new TypeError('Invalid user email');
    }
  }
  return {
    email: `${local}@${asciiLower(domain)}`,
    emailNormalized: asciiLower(input),
  };
}
