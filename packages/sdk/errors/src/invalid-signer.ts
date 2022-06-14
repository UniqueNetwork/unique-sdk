import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class InvalidSignerError extends SdkError {
  override readonly code = ErrorCodes.InvalidSigner;
}
