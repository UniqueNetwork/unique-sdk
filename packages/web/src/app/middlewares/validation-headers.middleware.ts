/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-namespace */
import { NestMiddleware, UseFilters } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@unique-nft/sdk/errors';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
export class ValidationHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;
    if (!/application\/json/.test(headers['content-type'])) {
      throw new ValidationError({}, 'Invalid Content-type header');
    }

    next();
  }
}
