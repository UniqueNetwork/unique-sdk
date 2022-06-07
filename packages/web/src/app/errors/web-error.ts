import { WebErrorCodes } from './codes';

export class WebError extends Error {
  constructor(
    public readonly code: WebErrorCodes,
    name: string,
    message?: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = name;
  }
}
