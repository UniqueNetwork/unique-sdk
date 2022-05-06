import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class ValidationError extends SdkError {
  constructor(message = ValidationError.name, details?: any) {
    super(ErrorCodes.Validation, ValidationError.name, message, details);
  }
}
