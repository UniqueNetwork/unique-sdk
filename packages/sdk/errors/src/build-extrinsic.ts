import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BuildExtrinsicError extends SdkError {
  override readonly code = ErrorCodes.BuildExtrinsic;
}
