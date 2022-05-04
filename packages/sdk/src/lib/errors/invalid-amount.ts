import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class InvalidAmountError extends SdkError {
  constructor(amount: any, message = InvalidAmountError.name) {
    super(ErrorCodes.InvalidAmount, InvalidAmountError.name, message);
    this.setValues({ amount });
  }
}
