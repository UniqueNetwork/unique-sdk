import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  SdkError,
  BadSignatureError,
  BuildExtrinsicError,
  SubmitExtrinsicError,
} from '@unique-nft/sdk';

const httpResponseErrorMap = new Map<
  string,
  { new (err: object): HttpException }
>();
httpResponseErrorMap.set(BadSignatureError.name, BadRequestException);
httpResponseErrorMap.set(BuildExtrinsicError.name, BadRequestException);
httpResponseErrorMap.set(SubmitExtrinsicError.name, BadRequestException);

@Catch(SdkError)
export class SdkExceptionsFilter extends BaseExceptionFilter {
  catch(exception: SdkError, host: ArgumentsHost) {
    if (httpResponseErrorMap.has(exception.constructor.name)) {
      const ErrorClass = httpResponseErrorMap.get(exception.constructor.name);
      const httpError = new ErrorClass({
        ok: false,
        error: {
          code: exception.code,
          name: exception.name,
          message: exception.message,
        },
      });
      super.catch(httpError, host);
    } else {
      super.catch(
        new HttpException(exception, HttpStatus.INTERNAL_SERVER_ERROR),
        host,
      );
    }
  }
}
