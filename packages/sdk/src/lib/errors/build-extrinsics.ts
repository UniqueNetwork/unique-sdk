import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BuildExtrinsicsError extends SdkError {
  constructor(message = BuildExtrinsicsError.name) {
    super(ErrorCodes.BuildExtrinsics, BuildExtrinsicsError.name, message);
  }
}
