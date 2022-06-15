import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class SubmitExtrinsicError extends SdkError {
  override readonly code = ErrorCodes.SubmitExtrinsic;
}
