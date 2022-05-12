import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class ValidationError extends SdkError {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(details: any, message = ValidationError.name) {
    super(ErrorCodes.Validation, ValidationError.name, message, details);
  }
}
