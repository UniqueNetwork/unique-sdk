/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-namespace */
import { NestMiddleware, UseFilters } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SdkSigner } from '@unique-nft/sdk/types';
import { createSignerByHeader } from '../utils/signers';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
export class SignerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (authorization) {
      req.signer = createSignerByHeader(authorization);
    }
    next();
  }
}

declare global {
  namespace Express {
    interface Request {
      signer?: SdkSigner;
    }
  }
}
