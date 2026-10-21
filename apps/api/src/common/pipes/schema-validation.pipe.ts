import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import type { ApiError } from '@commercehub/types';

type Details = NonNullable<ApiError['error']['details']>;

export class RequestValidationError extends UnprocessableEntityException {
  constructor(readonly details: Details) {
    super();
  }
}

/** Nest 12 schema metadata; no Zod diagnostics or attacker-controlled path names escape. */
@Injectable()
export class SchemaValidationPipe implements PipeTransform<unknown, Promise<unknown>> {
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    if (!['body', 'query', 'param'].includes(metadata.type)) return value;
    const schema = metadata.schema;
    if (!schema) throw new Error('Missing transport schema');
    const result = await schema['~standard'].validate(value);
    if (!result.issues) return result.value;
    const allowed = new Set<string>();
    if (metadata.data) allowed.add(metadata.data);
    // Public Zod object shape, not vendor internals. Records/dynamic keys get scope-only errors.
    if ('shape' in schema && typeof schema.shape === 'object' && schema.shape !== null) {
      for (const key of Object.keys(schema.shape)) allowed.add(key);
    }
    const fields = new Set<string>();
    for (const issue of result.issues.slice(0, 16)) {
      const first = issue.path?.[0];
      const key = typeof first === 'object' && first !== null ? first.key : first;
      fields.add(
        typeof key === 'string' && allowed.has(key) ? key : (metadata.data ?? metadata.type),
      );
      if (fields.size === 16) break;
    }
    throw new RequestValidationError(
      Array.from(fields, (field) => ({ field, code: 'VALIDATION_FAILED' })),
    );
  }
}
