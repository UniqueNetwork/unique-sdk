import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class VerificationFailedError extends SdkError {
  override readonly code = ErrorCodes.VerificationFailed;
}
