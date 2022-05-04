import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BadSignatureError extends SdkError {
  constructor(message = BadSignatureError.name) {
    super(ErrorCodes.BadSignature, BadSignatureError.name, message);
  }
}
