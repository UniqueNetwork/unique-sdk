import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class InvalidSignerError extends SdkError {
  constructor(message = InvalidSignerError.name) {
    super(ErrorCodes.Validation, InvalidSignerError.name, message);
  }
}
