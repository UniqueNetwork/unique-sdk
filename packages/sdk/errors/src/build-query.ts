import { SdkError } from './errors';
import { ErrorCodes } from './codes';

export class BuildQueryError extends SdkError {
  constructor(details: any, message = BuildQueryError.name) {
    super(ErrorCodes.BuildQuery, BuildQueryError.name, message, details);
  }
}
