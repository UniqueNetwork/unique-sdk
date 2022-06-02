/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-namespace */
import { NestMiddleware, UseFilters } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@unique-nft/sdk/errors';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
export class ContentTypeHeaderValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { 'content-type': contentType } = req.headers;
    if (!/application\/json/.test(contentType)) {
      throw new ValidationError({}, 'Invalid Content-type header');
    }

    next();
  }
}
