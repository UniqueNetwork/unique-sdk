import {ArgumentsHost, BadRequestException, Catch, HttpException, HttpStatus} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';
import {SdkError, SdkErrorCodes} from '@unique-nft/sdk';

@Catch(SdkError)
export class SdkExceptionsFilter extends BaseExceptionFilter {
  catch(exception: SdkError, host: ArgumentsHost) {
    const response: object = {
      errorCode: exception.code,
      values: exception.values
    };
    switch (exception.code) {
      case SdkErrorCodes.BAD_SIGNATURE:
        super.catch(new BadRequestException(response), host);
        break
      default:
        super.catch(new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR), host);
        break
    }
  }
}
