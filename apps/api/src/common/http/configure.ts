import {
  HttpException,
  NotFoundException,
  RequestMethod,
  UnsupportedMediaTypeException,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { ApiConfigurationError } from '../../config';
import { HttpErrorFilter } from '../filters/http-error.filter';
import { SchemaValidationPipe } from '../pipes/schema-validation.pipe';
import type { DiagnosticSink, HttpRequest } from './context';
import { writeDiagnostic } from './context';

export function readBodyLimit(env: NodeJS.ProcessEnv): number {
  const value = env.API_BODY_LIMIT_BYTES;
  if (value === undefined) return 100 * 1024;
  if (
    !/^[1-9]\d*$/.test(value) ||
    !Number.isSafeInteger(Number(value)) ||
    Number(value) > 1024 * 1024
  ) {
    throw new ApiConfigurationError('Invalid API configuration: API_BODY_LIMIT_BYTES.');
  }
  return Number(value);
}

export function configureTransport(
  app: NestExpressApplication,
  bodyLimitBytes: number,
  diagnostic: DiagnosticSink = writeDiagnostic,
): void {
  if (!Number.isSafeInteger(bodyLimitBytes) || bodyLimitBytes < 1 || bodyLimitBytes > 1024 * 1024) {
    throw new ApiConfigurationError('Invalid API configuration: API_BODY_LIMIT_BYTES.');
  }
  app.set('query parser', 'simple');
  app.set('trust proxy', false);
  app.disable('x-powered-by');
  app.setGlobalPrefix('api', { exclude: [{ path: 'health', method: RequestMethod.ALL }] });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  const errors = new HttpErrorFilter(app.get(HttpAdapterHost));
  app.use((request: HttpRequest, response: ServerResponse, next: () => void) => {
    const start = performance.now();
    const requestId = randomUUID();
    request.transportId = requestId;
    response.setHeader('X-Request-ID', requestId);
    response.setHeader('Cache-Control', 'no-store');
    response.once('finish', () => {
      const method =
        request.method &&
        ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(request.method)
          ? request.method
          : 'OTHER';
      try {
        diagnostic({
          event: 'http-response',
          requestId,
          status: response.statusCode,
          method,
          route: typeof request.route?.path === 'string' ? request.route.path : 'unmatched',
          durationMs: Math.round(performance.now() - start),
        });
      } catch {
        /* A diagnostic sink must not change the response or emit raw errors. */
      }
    });
    next();
  });
  // Nest's prefix-scoped not-found handler does not cover unrelated root URLs.
  // Reject these explicitly through the same boundary without echoing any URL.
  app.use((request: HttpRequest, response: ServerResponse, next: () => void) => {
    const pathname = request.url?.split('?')[0];
    const health = pathname === '/health' || pathname === '/health/';
    if (
      request.method === 'OPTIONS' ||
      (health && !['GET', 'HEAD'].includes(request.method ?? '')) ||
      (!health && pathname !== '/api' && !pathname?.startsWith('/api/'))
    ) {
      errors.respond(new NotFoundException(), request, response);
      return;
    }
    next();
  });
  // Signal unsupported media to Nest's exception layer after bounded parsers.
  app.useBodyParser('json', { limit: bodyLimitBytes, strict: true, inflate: false });
  app.use(
    (
      error: unknown,
      request: HttpRequest,
      response: ServerResponse,
      _next: (error?: unknown) => void,
    ) => {
      // Express recognizes error middleware by its four-argument arity.
      void _next;
      const statuses: Readonly<Record<string, number>> = {
        'entity.too.large': 413,
        'encoding.unsupported': 415,
        'charset.unsupported': 415,
        'entity.parse.failed': 400,
        'request.aborted': 400,
        'request.size.invalid': 400,
      };
      const type =
        typeof error === 'object' && error !== null && 'type' in error ? error.type : undefined;
      const status = typeof type === 'string' ? statuses[type] : undefined;
      errors.respond(status ? new HttpException('', status) : error, request, response);
    },
  );
  app.use((request: HttpRequest, _response: ServerResponse, next: (error?: unknown) => void) => {
    const length = request.headers['content-length'];
    const hasBody =
      request.headers['transfer-encoding'] !== undefined ||
      (length !== undefined && length !== '0');
    const contentType = request.headers['content-type']?.split(';')[0]?.trim().toLowerCase();
    if (hasBody && contentType !== 'application/json') {
      next(new UnsupportedMediaTypeException());
      return;
    }
    next();
  });
  app.useGlobalPipes(new SchemaValidationPipe());
  app.useGlobalFilters(errors);
}
