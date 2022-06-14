import { ErrorCodes } from './codes';

/* eslint-disable  @typescript-eslint/no-explicit-any */

// todo - add some method like static wrapError(error: unknown) ?
export class SdkError extends Error {
  static code: ErrorCodes;

  readonly code: ErrorCodes;

  constructor(
    message?: string,
    public details?: any,
    code?: ErrorCodes,
    name?: string,
  ) {
    super(message);

    this.name = name || this.constructor.name || SdkError.name;
    this.code = code || this.code || ErrorCodes.Other;
  }

  static wrapError(error: unknown, details?: any): SdkError {
    const message = error instanceof Error ? error.message : undefined;

    return new this(message, details, this.code, this.name);
  }
}
