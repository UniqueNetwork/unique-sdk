import { ErrorCodes } from './codes';

export class SdkError extends Error {
  constructor(
    public readonly code: ErrorCodes,
    name: string,
    message?: string,
  ) {
    super(message);
    this.name = name;
  }
}
