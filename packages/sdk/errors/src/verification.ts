import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class VerificationError extends SdkError {
  override readonly code = ErrorCodes.Verification;
}
