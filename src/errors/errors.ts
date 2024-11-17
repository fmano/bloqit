export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly details?: string;

  constructor(message: string, statusCode: number, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends BaseError {
  constructor(target: string, details?: string) {
    super(`${target} not found`, 404, details);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 400, details);
  }
}
