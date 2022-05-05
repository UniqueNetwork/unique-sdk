import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class SubmitExtrinsicsError extends SdkError {
  constructor(message = SubmitExtrinsicsError.name) {
    super(ErrorCodes.SubmitExtrinsics, SubmitExtrinsicsError.name, message);
  }
}
