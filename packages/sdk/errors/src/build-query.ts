import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BuildQueryError extends SdkError {
  override readonly code = ErrorCodes.BuildQuery;
}
