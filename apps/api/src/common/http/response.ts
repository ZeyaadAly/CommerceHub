import type { ApiResponse, Parser } from '@commercehub/types';
import type { HttpRequest } from './context';

/** Explicit validated projection; health/collections/204 are not blindly wrapped. */
export function resourceResponse<T>(
  data: unknown,
  schema: Parser<ApiResponse<T>>,
  request: HttpRequest,
): ApiResponse<T> {
  return schema.parse({ data, meta: { requestId: request.transportId } });
}
