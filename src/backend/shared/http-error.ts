export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly code = 'http_error',
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
