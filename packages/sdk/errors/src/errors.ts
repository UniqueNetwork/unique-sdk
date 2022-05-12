import { ErrorCodes } from './codes';

export class SdkError extends Error {
  constructor(
    public readonly code: ErrorCodes,
    name: string,
    message?: string,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public readonly details?: any,
  ) {
    super(message);
    this.name = name;
  }
}
