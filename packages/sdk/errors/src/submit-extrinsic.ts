import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class SubmitExtrinsicError extends SdkError {
  constructor(message = SubmitExtrinsicError.name) {
    super(ErrorCodes.SubmitExtrinsic, SubmitExtrinsicError.name, message);
  }
}
