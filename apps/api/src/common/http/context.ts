import type { IncomingMessage } from 'node:http';

export interface HttpRequest extends IncomingMessage {
  transportId?: string;
  route?: { path?: unknown };
}

export interface HttpDiagnostic {
  event: 'http-response';
  requestId: string;
  status: number;
  method: string;
  route: string;
  durationMs: number;
}

export type DiagnosticSink = (event: HttpDiagnostic) => void;
export const writeDiagnostic: DiagnosticSink = (event) => console.error(JSON.stringify(event));
