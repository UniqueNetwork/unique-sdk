/* eslint-disable max-classes-per-file */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  SdkError,
  BadSignatureError,
  BuildExtrinsicError,
  SubmitExtrinsicError,
  ValidationError,
  InvalidSignerError,
  BuildQueryError,
} from '@unique-nft/sdk/errors';
import { ImageUploadError } from '../errors/image-upload-error';
import { WebError } from '../errors/web-error';

const httpResponseErrorMap = new Map<
  string,
  { new (err: object): HttpException }
>();
httpResponseErrorMap.set(BadSignatureError.name, BadRequestException);
httpResponseErrorMap.set(BuildExtrinsicError.name, BadRequestException);
httpResponseErrorMap.set(SubmitExtrinsicError.name, BadRequestException);
httpResponseErrorMap.set(ValidationError.name, BadRequestException);
httpResponseErrorMap.set(InvalidSignerError.name, BadRequestException);
httpResponseErrorMap.set(BuildQueryError.name, BadRequestException);
httpResponseErrorMap.set(ImageUploadError.name, BadRequestException);

function createWebException(exception: SdkError | WebError) {
  const response = {
    ok: false,
    error: {
      code: exception.code,
      name: exception.name,
      message: exception.message,
      details: exception.details,
    },
  };
  if (httpResponseErrorMap.has(exception.constructor.name)) {
    const ErrorClass = httpResponseErrorMap.get(exception.constructor.name);
    return new ErrorClass(response);
  }

  return new InternalServerErrorException(response);
}

@Catch()
export class SdkExceptionsFilter extends BaseExceptionFilter {
  catch(exception: SdkError, host: ArgumentsHost) {
    super.catch(createWebException(exception), host);
  }
}

@Catch(WebError)
export class WebExceptionsFilter extends BaseExceptionFilter {
  catch(exception: WebError, host: ArgumentsHost) {
    super.catch(createWebException(exception), host);
  }
}
