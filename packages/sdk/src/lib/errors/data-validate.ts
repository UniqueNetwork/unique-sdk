import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class DataValidateError extends SdkError {
  constructor(message = DataValidateError.name) {
    super(ErrorCodes.DataValidate, DataValidateError.name, message);
  }
}
