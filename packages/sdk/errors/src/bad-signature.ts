import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BadSignatureError extends SdkError {
  override readonly code = ErrorCodes.BadSignature;
}
