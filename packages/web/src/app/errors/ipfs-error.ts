import { WebError } from './web-error';
import { WebErrorCodes } from './codes';

export class IpfsError extends WebError {
  constructor(code: WebErrorCodes, message: string = undefined) {
    super(code, IpfsError.name, message);
  }
}
