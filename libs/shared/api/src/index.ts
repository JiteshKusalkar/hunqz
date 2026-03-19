export type QueryPrimitive = string | number | boolean;
export type QueryParams = Record<
  string,
  QueryPrimitive | null | undefined | ReadonlyArray<QueryPrimitive>
>;

export interface JsonRequestOptions<TBody = unknown>
  extends Omit<RequestInit, 'body' | 'method' | 'headers' | 'signal'> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  baseUrl?: string;
  query?: QueryParams;
  body?: TBody;
  headers?: HeadersInit;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export type ApiErrorCode = 'NETWORK' | 'HTTP' | 'PARSE' | 'ABORT' | 'UNKNOWN';
type ApiErrorInput = {
  code: ApiErrorCode;
  message: string;
  status?: number;
  statusText?: string;
  details?: unknown;
  cause?: unknown;
  url?: string;
  method?: string;
};

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly details?: unknown;
  public readonly cause?: unknown;
  public readonly url?: string;
  public readonly method?: string;
  constructor(input: ApiErrorInput) {
    super(input.message);
    this.name = 'ApiError';
    this.code = input.code;
    this.status = input.status;
    this.statusText = input.statusText;
    this.details = input.details;
    this.cause = input.cause;
    this.url = input.url;
    this.method = input.method;
  }
}

export async function requestJson<TResponse, TBody = unknown>(
  path: string,
  options: JsonRequestOptions<TBody> = {},
): Promise<TResponse> {
  const { baseUrl, method = 'GET', body, headers, query, timeoutMs, signal, ...rest } = options;
  const url = buildUrl(path, baseUrl, query);
  const { signal: requestSignal, cleanup } = createRequestSignal(signal, timeoutMs);
  try {
    const response = await fetch(url, {
      ...rest,
      method,
      headers: buildHeaders(headers, body),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: requestSignal,
    });
    if (!response.ok) throw await toHttpError(response, url, method);
    if (response.status === 204) return undefined as TResponse;
    try {
      return (await response.json()) as TResponse;
    } catch (error) {
      throw new ApiError({
        code: 'PARSE',
        message: 'Failed to parse JSON response',
        status: response.status,
        statusText: response.statusText,
        cause: error,
        url,
        method,
      });
    }
  } catch (error) {
    throw normalizeError(error, url, method);
  } finally {
    cleanup();
  }
}

export const getJson = <TResponse>(
  path: string,
  options: Omit<JsonRequestOptions<never>, 'method' | 'body'> = {},
) => requestJson<TResponse>(path, { ...options, method: 'GET' });

function buildUrl(path: string, baseUrl?: string, query?: QueryParams): string {
  const resolved = baseUrl ? new URL(path, baseUrl).toString() : path;
  if (!query) return resolved;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue;
    if (Array.isArray(value)) value.forEach((item) => params.append(key, String(item)));
    else params.set(key, String(value));
  }
  const suffix = params.toString();
  return suffix ? `${resolved}${resolved.includes('?') ? '&' : '?'}${suffix}` : resolved;
}

function buildHeaders(headers: HeadersInit | undefined, body: unknown): Headers {
  const next = new Headers(headers);
  if (body !== undefined && !next.has('content-type')) next.set('content-type', 'application/json');
  if (!next.has('accept')) next.set('accept', 'application/json');
  return next;
}

function createRequestSignal(
  signal?: AbortSignal,
  timeoutMs?: number,
): { signal?: AbortSignal; cleanup: () => void } {
  if (timeoutMs !== undefined && (!Number.isFinite(timeoutMs) || timeoutMs <= 0)) {
    throw new ApiError({ code: 'UNKNOWN', message: 'timeoutMs must be a positive number' });
  }
  if (!signal && timeoutMs === undefined) return { cleanup: () => undefined };
  const controller = new AbortController();
  const cleanup: Array<() => void> = [];
  if (signal) {
    const onAbort = () => controller.abort(signal.reason);
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener('abort', onAbort, { once: true });
    cleanup.push(() => signal.removeEventListener('abort', onAbort));
  }
  if (timeoutMs !== undefined) {
    const timer = setTimeout(() => controller.abort('Request timeout'), timeoutMs);
    cleanup.push(() => clearTimeout(timer));
  }
  return { signal: controller.signal, cleanup: () => cleanup.forEach((fn) => fn()) };
}

async function toHttpError(response: Response, url: string, method: string): Promise<ApiError> {
  let details: unknown;
  try {
    details = (response.headers.get('content-type') || '').includes('application/json')
      ? await response.json()
      : await response.text();
  } catch {
    details = undefined;
  }
  return new ApiError({
    code: 'HTTP',
    message: `HTTP ${response.status} ${response.statusText}`.trim(),
    status: response.status,
    statusText: response.statusText,
    details,
    url,
    method,
  });
}

function normalizeError(error: unknown, url: string, method: string): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError({
      code: 'ABORT',
      message: 'The request was aborted',
      cause: error,
      url,
      method,
    });
  }
  if (error instanceof Error) {
    return new ApiError({
      code: 'NETWORK',
      message: error.message || 'Request failed',
      cause: error,
      url,
      method,
    });
  }
  return new ApiError({ code: 'UNKNOWN', message: 'Request failed', cause: error, url, method });
}
