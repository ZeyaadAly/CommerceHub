import { z } from 'zod';

// Canonical wire schemas: API design §§1–3/12–13. No business policy defaults.
export const uuidSchema = z.uuid();
export const isoInstantSchema = z.iso.datetime();
export const apiMetaSchema = z.object({ requestId: z.string() });
// Existing unversioned infrastructure endpoint; deliberately not an API envelope.
export const healthResponseSchema = z.strictObject({ status: z.literal('ok') });
export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.object({ field: z.string(), code: z.string() })).optional(),
    retryable: z.boolean(),
  }),
  meta: apiMetaSchema,
});

export function createResponseSchema<T extends z.ZodType>(data: T) {
  return z.object({ data, meta: apiMetaSchema });
}

export function createPaginationSchemas(bounds: { maxPageSize: number; maxCursorLength: number }) {
  const maxPageSize = z.int().positive().parse(bounds.maxPageSize);
  const maxCursorLength = z.int().positive().parse(bounds.maxCursorLength);
  const pageSize = z.int().min(1).max(maxPageSize);
  const cursor = z.string().min(1).max(maxCursorLength);
  // No coercion of empty strings, booleans, arrays, hex or exponent notation.
  const queryPageSize = z.union([
    pageSize,
    z
      .string()
      .regex(/^[1-9]\d*$/)
      .transform(Number)
      .pipe(pageSize),
  ]);
  return {
    request: z.strictObject({ pageSize: queryPageSize.optional(), cursor: cursor.optional() }),
    page: z.object({ nextCursor: cursor.nullable(), hasMore: z.boolean(), pageSize }),
  };
}

export function createCollectionSchema<T extends z.ZodType>(
  item: T,
  bounds: { maxPageSize: number; maxCursorLength: number },
) {
  return z.object({
    data: z.array(item).max(bounds.maxPageSize),
    page: createPaginationSchemas(bounds).page,
    meta: apiMetaSchema,
  });
}

export function createQueryTextSchema(maxLength: number) {
  z.int().positive().parse(maxLength);
  return z
    .string()
    .refine((value) =>
      Array.from(value).every((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127),
    )
    .transform((value) => value.normalize('NFC').trim())
    .pipe(z.string().max(maxLength));
}

export function createSortSchema<const T extends readonly [string, ...string[]]>(values: T) {
  return z.enum(values);
}

export const noContentSchema = z.undefined();
// Keep raw input and Zod diagnostics out of shared errors (including custom messages).
export function validate<T>(
  schema: { parse(input: unknown): T },
  input: unknown,
): { success: true; data: T } | { success: false; error: 'INVALID_INPUT' } {
  try {
    return { success: true, data: schema.parse(input) };
  } catch {
    return { success: false, error: 'INVALID_INPUT' };
  }
}

export type Uuid = z.infer<typeof uuidSchema>;
export type IsoInstant = z.infer<typeof isoInstantSchema>;
export type ApiMeta = z.infer<typeof apiMetaSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiResponse<T> = z.infer<ReturnType<typeof createResponseSchema<z.ZodType<T>>>>;
export type PaginationRequest = z.infer<ReturnType<typeof createPaginationSchemas>['request']>;
export type PaginationResult = z.infer<ReturnType<typeof createPaginationSchemas>['page']>;
export type CollectionResponse<T> = z.infer<
  ReturnType<typeof createCollectionSchema<z.ZodType<T>>>
>;
export type QueryText = z.infer<ReturnType<typeof createQueryTextSchema>>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
