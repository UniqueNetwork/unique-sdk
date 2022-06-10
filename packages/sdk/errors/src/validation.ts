import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class ValidationError extends SdkError {
  override readonly code = ErrorCodes.Validation;
}
