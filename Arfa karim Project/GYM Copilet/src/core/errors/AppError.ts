export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

export class AppError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly details?: unknown;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    severity: ErrorSeverity = 'error',
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'User is unauthenticated', details?: unknown) {
    super(message, 'AUTH_UNAUTHENTICATED', 'error', details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'User lacks sufficient role or permissions', details?: unknown) {
    super(message, 'AUTH_FORBIDDEN', 'warning', details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', details?: unknown) {
    super(`${resource} not found`, 'NOT_FOUND', 'warning', details);
    this.name = 'NotFoundError';
  }
}
