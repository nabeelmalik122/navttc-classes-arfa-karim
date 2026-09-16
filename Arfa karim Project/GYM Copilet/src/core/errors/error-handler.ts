import { AppError } from './AppError';

export interface NormalizedError {
  message: string;
  code: string;
  details?: unknown;
}

export function normalizeError(err: unknown): NormalizedError {
  if (AppError.isAppError(err)) {
    return {
      message: err.message,
      code: err.code,
      details: err.details,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      code: 'UNKNOWN_RUNTIME_ERROR',
      details: err.stack,
    };
  }

  return {
    message: typeof err === 'string' ? err : 'An unexpected failure occurred',
    code: 'UNKNOWN_ERROR',
    details: err,
  };
}
