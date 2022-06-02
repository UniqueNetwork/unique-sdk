import { WebError } from './web-error';
import { WebErrorCodes } from './codes';

export class ImageUploadError extends WebError {
  constructor(code: WebErrorCodes, message: string = undefined) {
    super(code, ImageUploadError.name, message);
  }
}
