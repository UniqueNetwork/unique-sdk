import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BadPayloadError extends SdkError {
  constructor(message = BadPayloadError.name) {
    super(ErrorCodes.BadPayload, BadPayloadError.name, message);
  }
}
