import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class InvalidArgumentsError extends SdkError {
  constructor(args: Record<string, any>, message = InvalidArgumentsError.name) {
    super(ErrorCodes.InvalidArguments, InvalidArgumentsError.name, message);
    this.setValues(args);
  }
}
