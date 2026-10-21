// One canonical schema owner; these exports erase completely from JavaScript.
export type {
  ApiMeta,
  ApiError,
  ApiResponse,
  CollectionResponse,
  PaginationRequest,
  PaginationResult,
  Uuid,
  IsoInstant,
  QueryText,
} from '@commercehub/validation';

export type SortValue<T extends string> = T;
export type WithId<T, TId extends string = string> = T & { id: TId };
export type WithTimestamps<T> = T & { createdAt: string; updatedAt: string };
/** Structural parser implemented by Zod or an endpoint adapter. */
export interface Parser<T> {
  parse(input: unknown): T;
}
export type QueryValue = string | number | boolean | null | undefined;
export type Query = Readonly<Record<string, QueryValue>>;
