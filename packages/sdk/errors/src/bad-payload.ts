import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BadPayloadError extends SdkError {
  override readonly code = ErrorCodes.BadPayload;
}
