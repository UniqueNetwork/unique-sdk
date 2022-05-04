import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class InvalidTransactionError extends SdkError {
  constructor(message = InvalidTransactionError.name) {
    super(ErrorCodes.InvalidTransaction, InvalidTransactionError.name, message);
  }
}
