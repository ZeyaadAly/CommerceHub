import { Catch, HttpException } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { HttpAdapterHost } from '@nestjs/core';
import type { ApiError } from '@commercehub/types';
import { apiErrorSchema } from '@commercehub/validation';
import { randomUUID } from 'node:crypto';
import type { ServerResponse } from 'node:http';
import type { HttpRequest } from '../http/context';
import { RequestValidationError } from '../pipes/schema-validation.pipe';

// Technical baseline codes only. Business exceptions need reviewed domain adapters later.
export const errorResponses: Readonly<Record<number, { code: string; message: string }>> = {
  400: { code: 'MALFORMED_JSON', message: 'The request could not be parsed.' },
  401: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' },
  403: { code: 'PERMISSION_DENIED', message: 'The request is not permitted.' },
  404: { code: 'RESOURCE_NOT_FOUND', message: 'The resource was not found.' },
  413: { code: 'VALIDATION_FAILED', message: 'The request exceeds the configured body limit.' },
  415: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'The request media type is not supported.' },
  422: { code: 'VALIDATION_FAILED', message: 'The request failed validation.' },
  429: { code: 'RATE_LIMITED', message: 'The request cannot be processed at this time.' },
  500: { code: 'INTERNAL_ERROR', message: 'The request could not be completed.' },
  503: { code: 'SERVICE_UNAVAILABLE', message: 'The service is unavailable.' },
};

@Catch()
export class HttpErrorFilter implements ExceptionFilter<unknown> {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<HttpRequest>();
    const response = context.getResponse<ServerResponse>();
    this.respond(exception, request, response);
  }

  respond(exception: unknown, request: HttpRequest, response: ServerResponse): void {
    if (response.headersSent) {
      response.end();
      return;
    }
    const candidate = exception instanceof HttpException ? exception.getStatus() : 500;
    const mapping = errorResponses[candidate];
    const status = mapping ? candidate : 500;
    const selected = mapping ?? errorResponses[500];
    if (!selected) throw new Error('Missing internal error contract');
    const requestId = request.transportId ?? randomUUID();
    const body: ApiError = apiErrorSchema.parse({
      error: {
        code: selected.code,
        message: selected.message,
        retryable: false,
        ...(exception instanceof RequestValidationError ? { details: exception.details } : {}),
      },
      meta: { requestId },
    });
    response.setHeader('X-Request-ID', requestId);
    response.setHeader('Cache-Control', 'no-store');
    this.adapterHost.httpAdapter.reply(response, body, status);
  }
}
