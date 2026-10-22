/** CH-02/M-CAT-1 identity only; no publication or hierarchy operations. */
export function normalizeCategorySlug(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0 || input.length > 150) {
    throw new TypeError('Invalid category slug');
  }
  // ASCII conversion only. No Unicode case folding or other transformations.
  const canonical = input.replace(/[A-Z]/g, (letter) => letter.toLowerCase());
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(canonical) || /[^a-z0-9-]/.test(canonical)) {
    throw new TypeError('Invalid category slug');
  }
  return canonical;
}
