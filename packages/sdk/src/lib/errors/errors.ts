import { ErrorCodes } from './codes';

export class SdkError extends Error {
  private values?: Record<string, any>;

  constructor(
    public readonly code: ErrorCodes,
    name: string,
    message?: string,
  ) {
    super(message);
    this.name = name;
  }

  protected setValues(values: Record<string, any>) {
    this.values = values;
  }

  public getValues() {
    return this.values;
  }
}
