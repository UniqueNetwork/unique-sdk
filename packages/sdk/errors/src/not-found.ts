import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class NotFoundError extends SdkError {
  override readonly code = ErrorCodes.NotFound;
}
