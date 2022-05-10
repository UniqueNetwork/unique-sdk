import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BuildExtrinsicError extends SdkError {
  constructor(message = BuildExtrinsicError.name) {
    super(ErrorCodes.BuildExtrinsic, BuildExtrinsicError.name, message);
  }
}
